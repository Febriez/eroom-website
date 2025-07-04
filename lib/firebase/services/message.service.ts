import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
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
    participantInfo: Record<
        string,
        {
            username: string
            displayName: string
            avatarUrl: string
            level: number
        }
    >
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
    static async createOrGetConversation(
        participant1Id: string,
        participant2Id: string
    ): Promise<string> {
        const [user1, user2] = await Promise.all([
            UserService.getUserById(participant1Id),
            UserService.getUserById(participant2Id)
        ])
        if (!user1 || !user2) {
            throw new Error('One or both users not found')
        }

        // 서로가 차단한 상태면 대화 생성 불가
        if (
            user1.social.blockedUsers?.includes(participant2Id) ||
            user2.social.blockedUsers?.includes(participant1Id)
        ) {
            throw new Error('Cannot create conversation with blocked user')
        }

        // 기존 대화 검색
        const convQuery = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', participant1Id)
        )
        const snapshot = await getDocs(convQuery)
        for (const docSnap of snapshot.docs) {
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
                        username: user1.username || user1.displayName,
                        displayName: user1.displayName,
                        avatarUrl: user1.avatarUrl || '',
                        level: user1.level || 1
                    },
                    [participant2Id]: {
                        username: user2.username || user2.displayName,
                        displayName: user2.displayName,
                        avatarUrl: user2.avatarUrl || '',
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

        const otherId = data.participants.find((p) => p !== sender.uid)
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

        // 2) 알림 문서 참조
        const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS))

        // 3) 차단 여부 체크
        const hasBlockedOther = data.blockedBy?.includes(sender.uid)
        const hasBeenBlockedByOther = data.blockedBy?.includes(otherId)

        if (!hasBeenBlockedByOther && !hasBlockedOther) {
            // 서로 차단하지 않았으면 lastMessage, unreadCount, 알림 생성
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
                data: {
                    conversationId,
                    senderId: sender.uid,
                    senderName: sender.displayName
                },
                read: false,
                createdAt: serverTimestamp()
            })
        } else {
            // 차단 관계이면 updatedAt만 갱신
            batch.update(conversationRef, {
                updatedAt: serverTimestamp()
            })
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
        return onSnapshot(convQuery, async (snap) => {
            const user = await UserService.getUserById(userId)
            const convs = snap.docs
                .map((d) => ({...(d.data() as Conversation), id: d.id}))
                .filter((c) => {
                    const other = c.participants.find((p) => p !== userId)!
                    return !user?.social.blockedUsers?.includes(other)
                })
            callback(convs)
        })
    }

    /**
     * 대화 메시지 구독 (오름차순 조회)
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
        return onSnapshot(msgQuery, (snap) => {
            const msgs = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Message, 'id'>)
            }))
            callback(msgs)
        })
    }

    /**
     * 모든 메시지를 읽음 처리하고 unreadCount 초기화
     */
    static async markMessagesAsRead(
        conversationId: string,
        readerId: string
    ): Promise<void> {
        const msgsQuery = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId)
        )
        const snap = await getDocs(msgsQuery)

        const batch = writeBatch(db)
        let anyUpdated = false

        snap.docs.forEach((docSnap) => {
            const m = docSnap.data() as Message
            if (!m.readBy.includes(readerId)) {
                const msgRef = doc(db, COLLECTIONS.MESSAGES, docSnap.id)
                batch.update(msgRef, {
                    readBy: arrayUnion(readerId)
                })
                anyUpdated = true
            }
        })

        if (anyUpdated) {
            const convRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
            batch.update(convRef, {
                [`unreadCount.${readerId}`]: 0,
                updatedAt: serverTimestamp()
            })
        }

        await batch.commit()
    }

    /**
     * 대화 상대 차단 처리
     */
    static async blockUserInConversation(
        conversationId: string,
        blockerId: string,
        blockedId: string
    ): Promise<void> {
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)

        await updateDoc(conversationRef, {
            blockedBy: arrayUnion(blockerId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 대화 상대 차단 해제
     */
    static async unblockUserInConversation(
        conversationId: string,
        unblockerId: string,
        unblockedId: string
    ): Promise<void> {
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)

        await updateDoc(conversationRef, {
            blockedBy: arrayRemove(unblockerId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 대화 삭제 (개인적으로)
     */
    static async deleteConversationForUser(
        conversationId: string,
        userId: string
    ): Promise<void> {
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)

        await updateDoc(conversationRef, {
            [`deletedBy.${userId}`]: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 메시지 검색
     */
    static async searchMessages(
        conversationId: string,
        searchTerm: string,
        limit: number = 20
    ): Promise<Message[]> {
        const messagesQuery = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(messagesQuery)
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Message[]

        // 클라이언트에서 텍스트 검색 (Firestore의 제한으로 인해)
        return messages
            .filter(msg =>
                msg.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, limit)
    }

    /**
     * 읽지 않은 메시지 개수 가져오기
     */
    static async getUnreadMessageCount(userId: string): Promise<number> {
        const conversationsQuery = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId)
        )

        const snapshot = await getDocs(conversationsQuery)
        let totalUnread = 0

        snapshot.docs.forEach(doc => {
            const data = doc.data() as Conversation
            totalUnread += data.unreadCount?.[userId] || 0
        })

        return totalUnread
    }

    /**
     * 메시지 전달
     */
    static async forwardMessage(
        messageId: string,
        fromConversationId: string,
        toConversationId: string,
        forwarderId: string
    ): Promise<string> {
        const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
        const messageSnap = await getDoc(messageRef)

        if (!messageSnap.exists()) {
            throw new Error('Message not found')
        }

        const originalMessage = messageSnap.data() as Message
        const forwarder = await UserService.getUserById(forwarderId)

        if (!forwarder) {
            throw new Error('Forwarder not found')
        }

        return await this.sendMessage(
            toConversationId,
            {
                uid: forwarderId,
                username: forwarder.username || forwarder.displayName,
                displayName: forwarder.displayName
            },
            `[전달된 메시지] ${originalMessage.content}`,
            'text'
        )
    }
}