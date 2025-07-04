import {Timestamp} from 'firebase/firestore'

// 사용자 역할
export type UserRole = 'user' | 'admin' | 'moderator'

// 사용자 통계
export interface UserStats {
    totalPlays: number           // mapsCompleted -> totalPlays
    successRate: number          // winRate -> successRate (%)
    fastestTime: number          // avgClearTime -> fastestTime
    averageTime: number          // 새로 추가
    hintsUsed: number           // 새로 추가
    perfectClears: number       // 새로 추가
    achievements: number        // achievements.length -> number
    createdRooms: number        // mapsCreated -> createdRooms
}

// 소셜 정보
export interface UserSocial {
    followers: string[]
    following: string[]
    friends: string[]
    friendCount: number
    blockedUsers: string[]      // blocked -> blockedUsers
    blockedBy: string[]         // 새로 추가
}

// 설정 - 개인정보
export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private'
    showOnlineStatus: boolean
    allowFriendRequests: boolean
    allowMessages: boolean
}

// 설정 - 알림
export interface NotificationSettings {
    browser: boolean
    email: boolean
    friendRequests: boolean
    messages: boolean
    achievements: boolean
}

// 설정 - 게임
export interface GamePreferences {
    soundEnabled: boolean
    musicVolume: number
    effectsVolume: number
    mouseSensitivity: number
    language: 'ko' | 'en'
    theme: 'dark' | 'light' | 'auto'
}

// 사용자 설정
export interface UserSettings {
    theme: 'light' | 'dark' | 'auto'
    notifications: NotificationSettings
    privacy: PrivacySettings
}

// 사용자 인벤토리 아이템
export interface InventoryItem {
    quantity: number
    purchasedAt: Timestamp
    itemName?: string
    category?: string
    isActive?: boolean
    activatedAt?: Timestamp
    expiresAt?: Timestamp
    duration?: string
    lastUsedAt?: Timestamp
}

// 사용자 인벤토리
export interface UserInventory {
    items: {
        [itemId: string]: InventoryItem
    }
    activeBoosts: string[]
    activeThemes: string[]
}

// 메인 User 타입
export interface User {
    // 기본 정보
    uid: string
    email: string
    displayName: string
    username?: string
    avatarUrl?: string
    bio?: string

    // 소셜 정보
    social: UserSocial

    // 게임 정보
    level: number
    exp: number
    points: number
    credits: number

    // 통계
    stats: UserStats

    // 인벤토리
    inventory?: UserInventory

    // 설정
    settings?: UserSettings

    // 시스템 정보
    role: UserRole
    status: 'active' | 'suspended' | 'banned'
    canChangeUsername?: boolean
    usernameChangedAt?: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
    lastLoginAt?: Timestamp
}