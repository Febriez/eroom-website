import {Timestamp} from 'firebase/firestore'

// 대화
export interface Conversation {
    id: string
    participants: string[]              // uid 배열 (2명)
    blockedBy?: string[]               // 차단한 사용자 uid 배열
    participantInfo?: {
        [uid: string]: {
            username: string
            displayName: string
            avatarUrl?: string
            level?: number
        }
    }
    lastMessage?: {
        content: string
        senderId: string
        timestamp: Timestamp
        type: 'text' | 'image' | 'system'
    }
    unreadCount: {
        [uid: string]: number
    }
    createdAt: Timestamp
    updatedAt: Timestamp
}

// 메시지
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
    reactions: MessageReaction[]
    blockedFor?: string[]              // 이 메시지를 볼 수 없는 사용자 uid 배열
    createdAt: Timestamp
}

// 메시지 반응
export interface MessageReaction {
    userId: string
    emoji: string
    timestamp: Timestamp
}