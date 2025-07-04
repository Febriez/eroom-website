import {Timestamp} from 'firebase/firestore'

// 시스템 설정
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
        aiRooms: boolean
        userRooms: boolean
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

// 시스템 통계
export interface SystemStats {
    totalUsers: number
    activeUsers: number         // 최근 30일
    totalRooms: number
    totalPlays: number
    dailyActiveUsers: number
    monthlyActiveUsers: number
    updatedAt: Timestamp
}

// 시스템 로그
export interface SystemLog {
    id: string
    type: 'error' | 'warning' | 'info' | 'audit'
    category: 'auth' | 'game' | 'payment' | 'admin' | 'system'
    message: string
    userId?: string
    metadata?: any
    createdAt: Timestamp
}