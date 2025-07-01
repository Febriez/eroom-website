// lib/firebase/types/game-map-card.types.ts

import {Timestamp} from 'firebase/firestore'

// 카드 디스플레이용 경량 타입
export interface GameMapCard {
    id: string
    name: string
    description: string
    thumbnail?: string
    difficulty: string
    theme: string
    tags: string[]
    creator: {
        uid: string
        username: string
    }
    stats: {
        playCount: number
        likeCount: number
        dislikeCount?: number
        avgRating?: number
        avgClearTime?: number
        completionRate?: number
        comments?: number
    }
    metadata?: {
        status?: string
        isAIGenerated?: boolean
        isFeatured?: boolean
        isOfficial?: boolean
        version?: string
    }
    createdAt: Timestamp
    updatedAt?: Timestamp
}

// Room을 GameMapCard로 변환
export function roomToGameMapCard(room: any): GameMapCard {
    return {
        id: room.id,
        name: room.RoomTitle,
        description: room.RoomDescription,
        thumbnail: room.Thumbnail || undefined,
        difficulty: room.Difficulty.toLowerCase(),
        theme: room.Theme,
        tags: room.Keywords || [],
        creator: {
            uid: room.CreatorId,
            username: room.CreatorId // 실제로는 사용자 정보 조회 필요
        },
        stats: {
            playCount: room.PlayCount || 0,
            likeCount: room.LikeCount || 0
        },
        createdAt: room.CreatedDate
    }
}