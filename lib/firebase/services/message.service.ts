import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
    writeBatch
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import {UserService} from './user.service'

export interface Conversation {
    id: string
    participants: string[]
    participantInfo: Record<string, {
        username: string
        displayName: string
        avatarUrl: string
        level: number
    }>
    unreadCount: Record<string, number>
    blockedBy: string[]
    lastMessage?: {
        content: string
        senderId: string
        timestamp: any
        type: string
    }
    createdAt: any
    updatedAt?: any
}

export interface Message {
    id: string
    conversationId: string
    sender: {
        uid: string
        username: string
        displayName: string
    }
    content: string
    type: 'text' | 'image' | 'system'
    readBy: string[]
    reactions: any[]
    createdAt: any
}

export class MessageService extends BaseService {
    /**
     * 대화 생성 또는 가져오기 (차단 확인 추가)
     */
    static async createOrGetConversation(participant1Id: string, participant2Id: string): Promise<string> {
        const [user1, user2] = await Promise.all([
            UserService.getUserById(participant1Id),
            UserService.getUserById(participant2Id)
        ])
        if (!user1 || !user2) throw new Error('One or both users not found')
        if (
            user1.social.blocked?.includes(participant2Id) ||
            user2.social.blocked?.includes(participant1Id)
        ) {
            throw new Error('Cannot create conversation with blocked user')
        }

        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', participant1Id)
        )
        const snapshot = await getDocs(q)
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data() as Conversation
            if (data.participants.includes(participant2Id)) {
                return docSnap.id
            }
        }

        const conversationRef = await addDoc(
            collection(db, COLLECTIONS.CONVERSATIONS),
            {
                participants: [participant1Id, participant2Id],
                participantInfo: {
                    [participant1Id]: {
                        username: user1.username,
                        displayName: user1.displayName,
                        avatarUrl: user1.avatarUrl,
                        level: user1.level || 1
                    },
                    [participant2Id]: {
                        username: user2.username,
                        displayName: user2.displayName,
                        avatarUrl: user2.avatarUrl,
                        level: user2.level || 1
                    }
                },
                unreadCount: {
                    [participant1Id]: 0,
                    [participant2Id]: 0
                },
                blockedBy: [],
                createdAt: serverTimestamp()
            }
        )
        return conversationRef.id
    }

    /**
     * 메시지 전송 (차단/알림 로직 반영)
     */
    static async sendMessage(
        conversationId: string,
        sender: { uid: string; username: string; displayName: string },
        content: string,
        type: 'text' | 'image' | 'system' = 'text'
    ): Promise<string> {
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        const snap = await getDoc(conversationRef)
        if (!snap.exists()) throw new Error('Conversation not found')
        const data = snap.data() as Conversation

        const otherId = data.participants.find(p => p !== sender.uid)
        if (!otherId) throw new Error('Other participant not found')

        const batch = writeBatch(db)

        // 1) 메시지 저장
        const messageRef = doc(collection(db, COLLECTIONS.MESSAGES))
        batch.set(messageRef, {
            conversationId,
            sender,
            content,
            type,
            readBy: [sender.uid],
            reactions: [],
            createdAt: serverTimestamp()
        })

        // 2) 알림 참조 생성
        const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS))

        // 3) 차단 여부 체크
        const hasBlockedOther = data.blockedBy?.includes(sender.uid)
        const hasBeenBlockedByOther = data.blockedBy?.includes(otherId)

        if (!hasBeenBlockedByOther && !hasBlockedOther) {
            // 서로 차단하지 않았으면
            batch.update(conversationRef, {
                lastMessage: {
                    content,
                    senderId: sender.uid,
                    timestamp: serverTimestamp(),
                    type
                },
                [`unreadCount.${otherId}`]:
                    (data.unreadCount?.[otherId] || 0) + 1,
                updatedAt: serverTimestamp()
            })
            batch.set(notificationRef, {
                recipientId: otherId,
                type: 'message',
                category: 'message',
                title: `${sender.displayName}님의 메시지`,
                body:
                    content.length > 50
                        ? content.slice(0, 50) + '…'
                        : content,
                data: {conversationId, senderId: sender.uid, senderName: sender.displayName},
                read: false,
                createdAt: serverTimestamp()
            })
        } else {
            // 차단 관계면 updatedAt만 갱신
            batch.update(conversationRef, {updatedAt: serverTimestamp()})
        }

        await batch.commit()
        return messageRef.id
    }

    /**
     * 대화 목록 구독 (차단된 상대 대화 제외)
     */
    static subscribeToConversations(
        userId: string,
        callback: (convs: Conversation[]) => void
    ) {
        const convQuery = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        )
        return onSnapshot(convQuery, async snap => {
            const user = await UserService.getUserById(userId)
            const convs = snap.docs
                .map(d => ({...(d.data() as Conversation), id: d.id}))
                .filter(c => {
                    const other = c.participants.find(p => p !== userId)!
                    return !user!.social.blocked?.includes(other)
                })
            callback(convs)
        })
    }

    /**
     * 개별 대화 메시지 구독
     */
    static subscribeToMessages(
        conversationId: string,
        callback: (msgs: Message[]) => void
    ) {
        const msgQuery = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc')
        )
        return onSnapshot(msgQuery, snap => {
            const msgs = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Message, 'id'>)
            }))
            callback(msgs)
        })
    }

    /**
     * 모든 메시지를 읽음 처리하고, 대화의 unreadCount를 0으로 초기화합니다.
     */
    static async markMessagesAsRead(
        conversationId: string,
        readerId: string
    ): Promise<void> {
        // 1) 해당 대화의 메시지 전부 조회
        const msgsQuery = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId)
        )
        const snap = await getDocs(msgsQuery)

        const batch = writeBatch(db)
        let anyUpdated = false

        // 2) 아직 읽지 않은 메시지마다 readBy 필드에 readerId 추가
        snap.docs.forEach(docSnap => {
            const m = docSnap.data() as Message
            if (!m.readBy.includes(readerId)) {
                const msgRef = doc(db, COLLECTIONS.MESSAGES, docSnap.id)
                batch.update(msgRef, {
                    readBy: arrayUnion(readerId)
                })
                anyUpdated = true
            }
        })

        // 3) 읽음 처리된 메시지가 하나라도 있으면 conversation.unreadCount 초기화
        if (anyUpdated) {
            const convRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
            batch.update(convRef, {
                [`unreadCount.${readerId}`]: 0,
                updatedAt: serverTimestamp()
            })
        }

        // 4) 일괄 커밋
        await batch.commit()
    }
}
