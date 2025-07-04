import {Timestamp} from 'firebase/firestore'

// 게임 난이도
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'extreme'

// 플레이 기록
export interface PlayRecord {
    id: string
    playerId: string
    playerName: string
    roomId: string
    roomName: string
    startTime: Timestamp
    endTime?: Timestamp
    clearTime?: number          // 초 단위
    completed: boolean
    score: number
    hintsUsed: number
    createdAt: Timestamp
}

// 리더보드 엔트리
export interface LeaderboardEntry {
    id: string
    player: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
    }
    type: 'global' | 'room' | 'weekly' | 'monthly'
    roomId?: string
    score: number
    clearTime?: number          // 초 단위
    rank: number
    period?: string             // 주간/월간 (예: "2025-W1", "2025-01")
    createdAt: Timestamp
}

// 업적
export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    category: 'play' | 'create' | 'social' | 'special'
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    requirements: {
        type: string
        value: number
    }
    rewards?: {
        credits?: number
        exp?: number
        items?: string[]
    }
}

// 사용자 업적
export interface UserAchievement {
    userId: string
    achievementId: string
    unlockedAt: Timestamp
    progress: number            // 0-100
    completed: boolean
}