// 컬렉션 이름
import {Timestamp} from "firebase/firestore";

export type CollectionName =
    | 'users'
    | 'rooms'
    | 'conversations'
    | 'messages'
    | 'notifications'
    | 'friendRequests'
    | 'playRecords'
    | 'leaderboard'
    | 'reports'
    | 'store'
    | 'purchases'
    | 'guides'
    | 'system'

// 페이지네이션 파라미터
export interface PaginationParams {
    limit?: number
    startAfter?: any
    orderBy?: string
    direction?: 'asc' | 'desc'
}

// API 응답
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// 신고
export interface Report {
    id: string
    reporter: {
        uid: string
        username: string
    }
    target: {
        type: 'user' | 'room' | 'comment'
        id: string
        name?: string
    }
    reason: 'spam' | 'harassment' | 'inappropriate' | 'cheating' | 'bug' | 'other'
    description: string
    evidence?: string[]
    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
    resolution?: string
    moderator?: string
    createdAt: Timestamp
    resolvedAt?: Timestamp
}

// 검증 규칙
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
    roomName: {
        minLength: 3
        maxLength: 50
    }
    message: {
        maxLength: 1000
    }
}

// 검증 규칙 상수
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
    roomName: {
        minLength: 3,
        maxLength: 50
    },
    message: {
        maxLength: 1000
    }
}