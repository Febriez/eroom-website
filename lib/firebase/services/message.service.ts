// lib/firebase/services/message.service.ts
import {
    addDoc,
    collection,
    doc,
    getDoc,
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
import type {Conversation, Message} from '@/lib/firebase/types'

export class MessageService extends BaseService {
    /**
     * 대화 생성 또는 가져오기
     */
    static async createOrGetConversation(participant1Id: string, participant2Id: string): Promise<string> {
        // 이미 존재하는 대화 찾기
        const existingConversations = await this.queryDocuments<Conversation>(
            COLLECTIONS.CONVERSATIONS,
            [
                where('participants', 'array-contains', participant1Id)
            ]
        )

        const existingConversation = existingConversations.find(conv =>
            conv.participants.includes(participant2Id)
        )

        if (existingConversation) {
            return existingConversation.id
        }

        // 새 대화 생성
        const conversationRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
            participants: [participant1Id, participant2Id],
            participantInfo: {}, // 실제로는 유저 정보를 가져와서 채워야 함
            unreadCount: {
                [participant1Id]: 0,
                [participant2Id]: 0
            },
            typing: {
                [participant1Id]: false,
                [participant2Id]: false
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
            const conversationData = conversationSnap.data()
            const otherParticipantId = conversationData.participants.find((p: string) => p !== sender.uid)

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
        }

        await batch.commit()
        return messageRef.id
    }

    /**
     * 대화의 메시지 가져오기
     */
    static async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
        return this.queryDocuments<Message>(
            COLLECTIONS.MESSAGES,
            [
                where('conversationId', '==', conversationId),
                orderBy('createdAt', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 메시지 읽음 처리
     */
    static async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
        const batch = writeBatch(db)

        // 읽지 않은 메시지들 찾기
        const unreadMessages = await this.queryDocuments<Message>(
            COLLECTIONS.MESSAGES,
            [
                where('conversationId', '==', conversationId),
                where('readBy', 'not-in', [[userId]])
            ]
        )

        // 각 메시지 읽음 처리
        unreadMessages.forEach(message => {
            const messageRef = doc(db, COLLECTIONS.MESSAGES, message.id)
            batch.update(messageRef, {
                readBy: [...(message.readBy || []), userId]
            })
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
        return this.queryDocuments<Conversation>(
            COLLECTIONS.CONVERSATIONS,
            [
                where('participants', 'array-contains', userId),
                orderBy('updatedAt', 'desc')
            ]
        )
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

    /**
     * 타이핑 상태 업데이트
     */
    static async updateTypingStatus(
        conversationId: string,
        userId: string,
        isTyping: boolean
    ): Promise<void> {
        const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
        await updateDoc(conversationRef, {
            [`typing.${userId}`]: isTyping
        })
    }
}