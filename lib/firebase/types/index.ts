// lib/firebase/types/index.ts
import {Timestamp} from 'firebase/firestore'

// ==================== 기본 타입 ====================

export type UserRole = 'user' | 'admin' | 'moderator'
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'extreme'
export type RoomStatus = 'draft' | 'published' | 'archived'
export type NotificationType =
    'friend_request'
    | 'friend_request_accepted'
    | 'message'
    | 'game_invite'
    | 'system'
    | 'achievement'
    | 'follow'

// ==================== 사용자 관련 ====================

export interface User {
    // 식별자
    id: string                    // Firestore 문서 ID
    uid: string                   // Firebase Auth UID
    username: string              // 고유 사용자명 (@username)

    // 기본 정보
    email: string
    displayName: string           // 표시 이름
    bio?: string                  // 자기소개
    avatarUrl?: string           // 프로필 이미지

    // 게임 정보
    level: number
    points: number
    credits: number

    // 통계
    stats: UserStats

    // 소셜
    social: UserSocial

    // 설정
    settings: UserSettings

    // 메타데이터
    role: UserRole
    createdAt: Timestamp
    updatedAt: Timestamp
    lastLoginAt: Timestamp
    usernameChangedAt?: Timestamp
    canChangeUsername: boolean
}

export interface UserStats {
    mapsCompleted: number
    mapsCreated: number
    totalPlayTime: number         // 초 단위
    winRate: number              // 0-100
    avgClearTime: number         // 초 단위
    achievements: string[]       // 달성한 업적 ID
}

export interface UserSocial {
    followers: string[]          // uid 배열
    following: string[]          // uid 배열
    friends: string[]           // uid 배열
    blocked: string[]           // uid 배열
    friendCount: number
}

export interface UserSettings {
    privacy: PrivacySettings
    preferences: GamePreferences
    notifications: NotificationSettings
}

export interface PrivacySettings {
    showProfile: boolean
    showStats: boolean
    showFriends: boolean
    showActivity: boolean
    allowMessages: boolean
    allowFriendRequests: boolean
}

export interface GamePreferences {
    soundEnabled: boolean
    musicVolume: number         // 0-1
    effectsVolume: number       // 0-1
    mouseSensitivity: number    // 0.1-2
    language: 'ko' | 'en'
    theme: 'dark' | 'light' | 'auto'
}

export interface NotificationSettings {
    friendRequests: boolean
    messages: boolean
    gameInvites: boolean
    achievements: boolean
    updates: boolean
    marketing: boolean
    browserNotifications?: boolean  // 브라우저 푸시 알림
}

// ==================== 게임 관련 ====================

export interface GameRoom {
    id: string
    name: string
    description: string
    difficulty: GameDifficulty
    theme: string
    tags: string[]
    thumbnail?: string

    // 제작자 정보
    creator: {
        uid: string
        username: string
        displayName: string
    }

    // 통계
    stats: RoomStats

    // 메타데이터
    metadata: RoomMetadata

    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface RoomStats {
    playCount: number
    likeCount: number
    dislikeCount: number
    avgRating: number           // 1-5
    avgClearTime: number        // 초 단위
    completionRate: number      // 0-100
    comments: number
}

export interface RoomMetadata {
    isAIGenerated: boolean
    isFeatured: boolean
    isOfficial: boolean
    status: RoomStatus
    version: string
}

export interface PlayRecord {
    id: string
    playerId: string
    playerName: string
    roomId: string              // mapId → roomId로 변경
    roomName: string            // mapName → roomName으로 변경

    startTime: Timestamp
    endTime?: Timestamp
    clearTime?: number          // 초 단위

    completed: boolean
    score: number
    hintsUsed: number

    createdAt: Timestamp
}

// ==================== 소셜 관련 ====================

export interface FriendRequest {
    id: string
    from: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
    }
    to: {
        uid: string
        username: string
        displayName: string
    }

    message?: string
    status: 'pending' | 'accepted' | 'rejected'

    createdAt: Timestamp
    respondedAt?: Timestamp
}

export interface Conversation {
    id: string
    participants: string[]       // uid 배열 (2명)

    // 참가자 정보 캐시
    participantInfo: {
        [uid: string]: {
            username: string
            displayName: string
            avatarUrl?: string
        }
    }

    // 마지막 메시지
    lastMessage?: {
        content: string
        senderId: string
        timestamp: Timestamp
        type: 'text' | 'image' | 'system'
    }

    // 읽지 않은 메시지 수
    unreadCount: {
        [uid: string]: number
    }

    // 타이핑 상태
    typing: {
        [uid: string]: boolean
    }

    createdAt: Timestamp
    updatedAt: Timestamp
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

    readBy: string[]           // uid 배열
    reactions?: MessageReaction[]

    createdAt: Timestamp
    editedAt?: Timestamp
    deletedAt?: Timestamp
}

export interface MessageReaction {
    userId: string
    emoji: string
    timestamp: Timestamp
}

// lib/firebase/types/index.ts의 Notification 타입 수정

export type NotificationCategory = 'all' | 'message' | 'friend' | 'follow' | 'system'

export interface Notification {
    id: string
    recipientId: string

    type: NotificationType
    category: NotificationCategory  // 새로 추가
    title: string
    body: string

    // 타입별 추가 데이터
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

// 알림 타입별 카테고리 매핑 헬퍼
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

// ==================== 리더보드 ====================

export interface LeaderboardEntry {
    id: string

    player: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
    }

    type: 'global' | 'room' | 'weekly' | 'monthly'  // map → room으로 변경
    roomId?: string              // mapId → roomId로 변경

    score: number
    clearTime?: number          // 초 단위
    rank: number

    period?: string             // 주간/월간 (예: "2025-W1", "2025-01")
    createdAt: Timestamp
}

// ==================== 리포트/신고 ====================

export interface Report {
    id: string

    reporter: {
        uid: string
        username: string
    }

    target: {
        type: 'user' | 'room' | 'comment'  // map → room으로 변경
        id: string
        name?: string
    }

    reason: 'spam' | 'harassment' | 'inappropriate' | 'cheating' | 'bug' | 'other'
    description: string
    evidence?: string[]         // 스크린샷 URL 등

    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
    resolution?: string
    moderator?: string

    createdAt: Timestamp
    resolvedAt?: Timestamp
}

// ==================== 시스템 ====================

export interface SystemSettings {
    maintenance: {
        enabled: boolean
        message?: string
        endTime?: Timestamp
    }

    features: {
        messaging: boolean
        friendSystem: boolean
        leaderboard: boolean
        aiRooms: boolean        // aiMaps → aiRooms로 변경
        userRooms: boolean      // userMaps → userRooms로 변경
    }

    announcement?: {
        id: string
        type: 'info' | 'warning' | 'success'
        title: string
        message: string
        link?: string
        dismissible: boolean
        expiresAt?: Timestamp
    }

    version: string
    updatedAt: Timestamp
}

// ==================== 스토어 ====================

export interface StoreItem {
    id: string
    name: string
    description: string
    category: 'theme' | 'skin' | 'tool' | 'bundle'

    price: {
        credits: number
        originalCredits?: number  // 할인 전 가격
        discount?: number        // 할인율 (0-100)
    }

    images: string[]
    featured: boolean

    metadata: {
        rarity?: 'common' | 'rare' | 'epic' | 'legendary'
        limitedTime?: boolean
        expiresAt?: Timestamp
        stock?: number           // 한정 수량
    }

    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface Purchase {
    id: string
    userId: string

    item: {
        id: string
        name: string
        category: string
        price: number
    }

    payment: {
        method: 'credits' | 'real_money'
        amount: number
        currency?: string        // real_money인 경우
    }

    status: 'pending' | 'completed' | 'failed' | 'refunded'

    createdAt: Timestamp
    completedAt?: Timestamp
}

// ==================== 헬퍼 타입 ====================

export type CollectionName =
    | 'users'
    | 'rooms'              // maps → rooms로 변경
    | 'conversations'
    | 'messages'
    | 'notifications'
    | 'friendRequests'
    | 'playRecords'
    | 'leaderboard'
    | 'reports'
    | 'store'
    | 'purchases'
    | 'system'

export interface PaginationParams {
    limit?: number
    startAfter?: any
    orderBy?: string
    direction?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// ==================== 폼 검증 ====================

export interface ValidationRules {
    username: {
        minLength: 3
        maxLength: 20
        pattern: RegExp
        reserved: string[]
    }

    password: {
        minLength: 8
        maxLength: 128
        requireUppercase: boolean
        requireLowercase: boolean
        requireNumber: boolean
        requireSpecial: boolean
    }

    bio: {
        maxLength: 200
    }

    roomName: {              // mapName → roomName으로 변경
        minLength: 3
        maxLength: 50
    }

    message: {
        maxLength: 1000
    }
}

// Export 상수
export const VALIDATION_RULES: ValidationRules = {
    username: {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        reserved: ['admin', 'moderator', 'system', 'eroom', 'bangtalboyband']
    },
    password: {
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: false
    },
    bio: {
        maxLength: 200
    },
    roomName: {              // mapName → roomName으로 변경
        minLength: 3,
        maxLength: 50
    },
    message: {
        maxLength: 1000
    }
}