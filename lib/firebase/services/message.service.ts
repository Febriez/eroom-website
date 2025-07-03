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
     * 대화 생성 또는 가져오기 (차단 확인 추가)
     */
    static async createOrGetConversation(participant1Id: string, participant2Id: string): Promise<string> {
        // 차단 상태 확인
        const [user1, user2] = await Promise.all([
            UserService.getUserById(participant1Id),
            UserService.getUserById(participant2Id)
        ])

        if (!user1 || !user2) {
            throw new Error('One or both users not found')
        }

        // 차단 확인
        if (user1.social.blocked?.includes(participant2Id) || user2.social.blocked?.includes(participant1Id)) {
            throw new Error('Cannot create conversation with blocked user')
        }

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
            blockedBy: [],  // 차단 배열 초기화
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return conversationRef.id
    }

    /**
     * 메시지 전송 (차단 확인 추가)
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
        // 대화 정보 가져오기
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        const conversationSnap = await getDoc(conversationRef)

        if (!conversationSnap.exists()) {
            throw new Error('Conversation not found')
        }

        const conversationData = conversationSnap.data() as Conversation
        const otherParticipantId = conversationData.participants.find((p: string) => p !== sender.uid)

        if (!otherParticipantId) {
            throw new Error('Other participant not found')
        }

        // 차단 상태 확인
        if (conversationData.blockedBy?.includes(sender.uid)) {
            // 차단한 사람이 메시지를 보내려고 하는 경우
            throw new Error('You have blocked this user')
        }

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

        // 차단 상태가 아닌 경우에만 상대방에게 알림
        if (!conversationData.blockedBy?.includes(otherParticipantId)) {
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
                category: 'message' as const,
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
        } else {
            // 차단된 경우 lastMessage만 업데이트 (차단한 사람은 볼 수 없음)
            batch.update(conversationRef, {
                updatedAt: serverTimestamp()
            })
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
     * 사용자의 모든 대화 가져오기 (차단된 대화 제외)
     */
    static async getUserConversations(userId: string): Promise<Conversation[]> {
        const user = await UserService.getUserById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        const q = query(
            collection(db, COLLECTIONS.CONVERSATIONS),
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const conversations: Conversation[] = []

        for (const doc of querySnapshot.docs) {
            const data = doc.data() as Conversation
            const otherParticipantId = data.participants.find(p => p !== userId)

            // 내가 차단한 사용자의 대화는 제외
            if (otherParticipantId && !user.social.blocked?.includes(otherParticipantId)) {
                conversations.push({
                    ...doc.data(),
                    id: doc.id  // id를 나중에 설정하여 덮어쓰기
                } as Conversation)
            }
        }

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
     * 실시간 대화 리스너 (차단된 대화 제외)
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

        return onSnapshot(q, async (snapshot) => {
            const user = await UserService.getUserById(userId)
            if (!user) return

            const conversations = snapshot.docs
                .map(doc => ({
                    ...doc.data(),
                    id: doc.id  // id를 나중에 설정하여 덮어쓰기
                } as Conversation))
                .filter(conv => {
                    const otherParticipantId = conv.participants.find(p => p !== userId)
                    // 내가 차단한 사용자의 대화는 제외
                    return otherParticipantId && !user.social.blocked?.includes(otherParticipantId)
                })

            callback(conversations)
        })
    }
}