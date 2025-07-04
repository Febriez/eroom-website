import {Timestamp} from 'firebase/firestore'

// 알림 타입
export type NotificationType =
    | 'friend_request'
    | 'friend_request_accepted'
    | 'message'
    | 'game_invite'
    | 'system'
    | 'achievement'
    | 'follow'

// 알림 카테고리
export type NotificationCategory = 'all' | 'message' | 'friend' | 'follow' | 'system'

// 알림
export interface Notification {
    id: string
    recipientId: string
    type: NotificationType
    category: NotificationCategory
    title: string
    body: string
    data?: {
        senderId?: string
        senderName?: string
        senderAvatar?: string
        requestId?: string
        gameId?: string
        roomId?: string
        achievementId?: string
        conversationId?: string
    }
    read: boolean
    createdAt: Timestamp
}

// 알림 타입별 카테고리 매핑
export function getNotificationCategory(type: NotificationType): NotificationCategory {
    switch (type) {
        case 'message':
            return 'message'
        case 'friend_request':
        case 'friend_request_accepted':
            return 'friend'
        case 'follow':
            return 'follow'
        case 'system':
        case 'game_invite':
        case 'achievement':
        default:
            return 'system'
    }
}