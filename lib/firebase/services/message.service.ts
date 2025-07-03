import {
    addDoc,
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
        // 유저 정보 및 차단 상태 확인
        const [user1, user2] = await Promise.all([
            UserService.getUserById(participant1Id),
            UserService.getUserById(participant2Id)
        ])

        if (!user1 || !user2) {
            throw new Error('One or both users not found')
        }

        // 서로가 차단한 관계면 대화 생성 불가
        if (
            user1.social.blocked?.includes(participant2Id) ||
            user2.social.blocked?.includes(participant1Id)
        ) {
            throw new Error('Cannot create conversation with blocked user')
        }

        // 기존 대화 탐색
        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', participant1Id)
        )
        const querySnapshot = await getDocs(q)
        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data() as Conversation
            if (data.participants.includes(participant2Id)) {
                return docSnap.id
            }
        }

        // 새 대화 생성
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
        sender: {
            uid: string
            username: string
            displayName: string
        },
        content: string,
        type: 'text' | 'image' | 'system' = 'text'
    ): Promise<string> {
        // 대화 정보 조회
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        const conversationSnap = await getDoc(conversationRef)
        if (!conversationSnap.exists()) {
            throw new Error('Conversation not found')
        }
        const conversationData = conversationSnap.data() as Conversation

        // 상대 참가자 ID
        const otherParticipantId = conversationData.participants.find(p => p !== sender.uid)
        if (!otherParticipantId) {
            throw new Error('Other participant not found')
        }

        const batch = writeBatch(db)

        // 1) 메시지 문서 생성
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

        // 2) 알림 문서 참조 생성
        const notificationRef = doc(
            collection(db, COLLECTIONS.NOTIFICATIONS)
        )

        // 3) 차단 상태 확인
        const hasBlockedOther = conversationData.blockedBy?.includes(sender.uid)
        const hasBeenBlockedByOther = conversationData.blockedBy?.includes(otherParticipantId)

        if (!hasBeenBlockedByOther && !hasBlockedOther) {
            // • 서로 차단하지 않은 경우에만 대화 메타·알림 업데이트
            batch.update(conversationRef, {
                lastMessage: {
                    content,
                    senderId: sender.uid,
                    timestamp: serverTimestamp(),
                    type
                },
                [`unreadCount.${otherParticipantId}`]:
                    (conversationData.unreadCount?.[otherParticipantId] || 0) + 1,
                updatedAt: serverTimestamp()
            })
            batch.set(notificationRef, {
                recipientId: otherParticipantId,
                type: 'message',
                category: 'message',
                title: `${sender.displayName}님의 메시지`,
                body:
                    content.length > 50
                        ? content.slice(0, 50) + '…'
                        : content,
                data: {
                    conversationId,
                    senderId: sender.uid,
                    senderName: sender.displayName
                },
                read: false,
                createdAt: serverTimestamp()
            })
        } else {
            // • 상대가 나를 차단했거나 내가 상대를 차단한 경우,
            //   알림·unreadCount를 만들지 않고 updatedAt만 갱신
            batch.update(conversationRef, {
                updatedAt: serverTimestamp()
            })
        }

        // 4) 커밋 및 메시지 ID 반환
        await batch.commit()
        return messageRef.id
    }

    /**
     * 대화 목록 구독 (차단한 사용자의 대화 제외)
     */
    static subscribeToConversations(
        userId: string,
        callback: (conversations: Conversation[]) => void
    ) {
        const convQuery = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        )
        return onSnapshot(convQuery, async snapshot => {
            // 유저 정보 가져와서 차단 목록 확인
            const user = await UserService.getUserById(userId)
            const conversations = snapshot.docs
                .map(doc => ({...(doc.data() as Conversation), id: doc.id}))
                .filter(conv => {
                    const other = conv.participants.find(p => p !== userId)
                    // 내가 차단한 상대의 대화는 아예 제외
                    return other && !user!.social.blocked?.includes(other)
                })
            callback(conversations)
        })
    }

    /**
     * 개별 대화 메시지 구독
     */
    static subscribeToMessages(
        conversationId: string,
        callback: (messages: Message[]) => void
    ) {
        const msgQuery = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc')
        )
        return onSnapshot(msgQuery, snapshot => {
            const messages: Message[] = snapshot.docs.map(doc => ({
                ...(doc.data() as Omit<Message, 'id'>),
                id: doc.id
            }))
            callback(messages)
        })
    }
}
