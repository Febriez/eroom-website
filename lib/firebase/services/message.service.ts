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
import type {Conversation, Message} from '@/lib/firebase/types'

export class MessageService extends BaseService {
    /**
     * 대화 생성 또는 가져오기
     */
    static async createOrGetConversation(participant1Id: string, participant2Id: string): Promise<string> {
        // 이미 존재하는 대화 찾기
        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', participant1Id)
        )

        const querySnapshot = await getDocs(q)

        // 기존 대화 찾기
        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data()
            if (data.participants && data.participants.includes(participant2Id)) {
                return docSnapshot.id
            }
        }

        // 참가자 정보 가져오기
        const [user1, user2] = await Promise.all([
            UserService.getUserById(participant1Id),
            UserService.getUserById(participant2Id)
        ])

        if (!user1 || !user2) {
            throw new Error('One or both users not found')
        }

        // 새 대화 생성 (typing 필드 제거)
        const conversationRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
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
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return conversationRef.id
    }

    /**
     * 메시지 전송
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
        const batch = writeBatch(db)

        // 메시지 추가
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

        // 대화 업데이트
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        const conversationSnap = await getDoc(conversationRef)

        if (conversationSnap.exists()) {
            const conversationData = conversationSnap.data() as Conversation
            const otherParticipantId = conversationData.participants.find((p: string) => p !== sender.uid)

            if (otherParticipantId) {
                // 대화 정보 업데이트
                batch.update(conversationRef, {
                    lastMessage: {
                        content,
                        senderId: sender.uid,
                        timestamp: serverTimestamp(),
                        type
                    },
                    [`unreadCount.${otherParticipantId}`]: (conversationData.unreadCount?.[otherParticipantId] || 0) + 1,
                    updatedAt: serverTimestamp()
                })

                // 알림 생성
                const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS))
                batch.set(notificationRef, {
                    recipientId: otherParticipantId,
                    type: 'message' as const,
                    title: `${sender.displayName}님의 메시지`,
                    body: content.length > 50 ? content.substring(0, 50) + '...' : content,
                    data: {
                        senderId: sender.uid,
                        senderName: sender.displayName,
                        conversationId: conversationId
                    },
                    read: false,
                    createdAt: serverTimestamp()
                })
            }
        }

        await batch.commit()
        return messageRef.id
    }

    /**
     * 대화의 메시지 가져오기
     */
    static async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
        const q = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const messages: Message[] = []

        querySnapshot.forEach((doc) => {
            messages.push({
                id: doc.id,
                ...doc.data()
            } as Message)
        })

        return messages.slice(0, limit)
    }

    /**
     * 메시지 읽음 처리
     */
    static async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
        const batch = writeBatch(db)

        // 읽지 않은 메시지들 찾기
        const q = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            where('sender.uid', '!=', userId)
        )

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((docSnapshot) => {
            const message = docSnapshot.data()
            if (!message.readBy?.includes(userId)) {
                batch.update(doc(db, COLLECTIONS.MESSAGES, docSnapshot.id), {
                    readBy: [...(message.readBy || []), userId]
                })
            }
        })

        // 대화의 unreadCount 초기화
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        batch.update(conversationRef, {
            [`unreadCount.${userId}`]: 0
        })

        await batch.commit()
    }

    /**
     * 사용자의 모든 대화 가져오기
     */
    static async getUserConversations(userId: string): Promise<Conversation[]> {
        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const conversations: Conversation[] = []

        querySnapshot.forEach((doc) => {
            conversations.push({
                id: doc.id,
                ...doc.data()
            } as Conversation)
        })

        return conversations
    }

    /**
     * 실시간 메시지 리스너
     */
    static subscribeToMessages(
        conversationId: string,
        callback: (messages: Message[]) => void
    ): () => void {
        const q = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'desc')
        )

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message))
            callback(messages)
        })
    }

    /**
     * 실시간 대화 리스너
     */
    static subscribeToConversations(
        userId: string,
        callback: (conversations: Conversation[]) => void
    ): () => void {
        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        )

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Conversation))
            callback(conversations)
        })
    }
}