// lib/types/firestore.schema.ts

// 사용자 프로필
import {GamePreferences, NotificationSettings, PrivacySettings} from "@/lib/firebase/types/index";
import {Timestamp} from "firebase/firestore";

export interface UserSchema {
    // 식별자
    id: string              // 문서 ID
    uid: string             // Firebase Auth UID
    username: string        // 고유 사용자명 (@username)

    // 기본 정보
    email: string
    displayName: string
    bio?: string
    avatarUrl?: string

    // 게임 정보
    level: number
    points: number
    credits: number

    // 통계
    stats: {
        mapsCompleted: number
        mapsCreated: number
        totalPlayTime: number    // 초 단위
        winRate: number          // 0-100
        avgClearTime: number     // 초 단위
    }

    // 소셜
    social: {
        followers: string[]      // uid 배열
        following: string[]      // uid 배열
        friends: string[]        // uid 배열
        blocked: string[]        // uid 배열
        friendCount: number
    }

    // 설정
    settings: {
        privacy: PrivacySettings
        preferences: GamePreferences
        notifications: NotificationSettings
    }

    // 메타데이터
    createdAt: Timestamp
    updatedAt: Timestamp
    lastLoginAt: Timestamp
    usernameChangedAt?: Timestamp
}

// 게임 맵
export interface MapSchema {
    id: string
    name: string
    description: string
    difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
    theme: string
    tags: string[]

    creator: {
        uid: string
        username: string
        displayName: string
    }

    stats: {
        playCount: number
        likeCount: number
        avgRating: number
        avgClearTime: number
        completionRate: number
    }

    metadata: {
        isAIGenerated: boolean
        isFeatured: boolean
        status: 'draft' | 'published' | 'archived'
    }

    createdAt: Timestamp
    updatedAt: Timestamp
}

// 대화
export interface ConversationSchema {
    id: string
    participants: string[]              // uid 배열 (2명)

    lastMessage?: {
        content: string
        senderId: string
        timestamp: Timestamp
        type: 'text' | 'image' | 'system'
    }

    unreadCount: {
        [uid: string]: number
    }

    typing: {
        [uid: string]: boolean
    }

    createdAt: Timestamp
    updatedAt: Timestamp
}

// 알림
export interface NotificationSchema {
    id: string
    recipientId: string

    type: 'friend_request' | 'message' | 'game_invite' | 'system'
    title: string
    body: string

    data?: {
        senderId?: string
        senderName?: string
        requestId?: string
        gameId?: string
    }

    read: boolean
    createdAt: Timestamp
}