import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {Conversation, Message} from '@/lib/firebase/types'
import {addDoc, collection, doc, increment, orderBy, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {db} from "@/lib/firebase/config";
import {SocialService} from "@/lib/firebase/services/social.service";


export class MessageService extends BaseService {
    static async createConversation(
        participant1: { uid: string; username: string; displayName: string; avatarUrl?: string },
        participant2: { uid: string; username: string; displayName: string; avatarUrl?: string }
    ): Promise<string> {
        // 이미 대화가 있는지 확인
        const existing = await this.queryDocuments<Conversation>(
            COLLECTIONS.CONVERSATIONS,
            [
                where('participants', 'array-contains', participant1.uid)
            ]
        )

        const existingConversation = existing.find(conv =>
            conv.participants.includes(participant2.uid)
        )

        if (existingConversation) {
            return existingConversation.id
        }

        // 새 대화 생성
        const conversationRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
            participants: [participant1.uid, participant2.uid],
            participantInfo: {
                [participant1.uid]: {
                    username: participant1.username,
                    displayName: participant1.displayName,
                    avatarUrl: participant1.avatarUrl
                },
                [participant2.uid]: {
                    username: participant2.username,
                    displayName: participant2.displayName,
                    avatarUrl: participant2.avatarUrl
                }
            },
            unreadCount: {
                [participant1.uid]: 0,
                [participant2.uid]: 0
            },
            typing: {
                [participant1.uid]: false,
                [participant2.uid]: false
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return conversationRef.id
    }

    static async sendMessage(
        conversationId: string,
        sender: { uid: string; username: string; displayName: string },
        content: string,
        type: 'text' | 'image' = 'text'
    ): Promise<void> {
        const conversation = await this.getDocument<Conversation>(
            COLLECTIONS.CONVERSATIONS,
            conversationId
        )

        if (!conversation) {
            throw new Error('Conversation not found')
        }

        const recipientId = conversation.participants.find(p => p !== sender.uid)
        if (!recipientId) {
            throw new Error('Recipient not found')
        }

        // 메시지 생성
        await addDoc(collection(db, COLLECTIONS.MESSAGES), {
            conversationId,
            sender,
            content,
            type,
            readBy: [sender.uid],
            createdAt: serverTimestamp()
        })

        // 대화 업데이트
        await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
            lastMessage: {
                content,
                senderId: sender.uid,
                timestamp: serverTimestamp(),
                type
            },
            [`unreadCount.${recipientId}`]: increment(1),
            updatedAt: serverTimestamp()
        })

        // 알림 생성
        await SocialService.createNotification({
            recipientId,
            type: 'message',
            title: '새 메시지',
            body: `${sender.displayName}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
            data: {
                conversationId,
                senderId: sender.uid,
                senderName: sender.displayName
            }
        })
    }

    static subscribeToMessages(
        conversationId: string,
        callback: (messages: Message[]) => void
    ) {
        return this.subscribeToQuery<Message>(
            COLLECTIONS.MESSAGES,
            [
                where('conversationId', '==', conversationId),
                orderBy('createdAt', 'asc')
            ],
            callback
        )
    }

    static async markMessagesAsRead(
        conversationId: string,
        userId: string
    ): Promise<void> {
        // 대화의 unreadCount를 0으로 리셋
        await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
            [`unreadCount.${userId}`]: 0
        })
    }
}