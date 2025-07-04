// lib/firebase/types/room.types.ts

import {Timestamp} from 'firebase/firestore'

// 실제 Firestore Room 컬렉션 구조
export interface Room {
    // 기본 식별자
    id: string                          // Firestore 문서 ID
    RoomId: string                      // 게임 내부 UUID

    // 기본 정보
    RoomTitle: string
    RoomDescription: string
    CreatorId: string

    // 게임 설정
    Difficulty: 'Easy' | 'Normal' | 'Hard'
    Theme: string
    Keywords: string[]                  // 태그/키워드

    // 미디어
    Thumbnail: string                   // URL (빈 문자열 가능)
    RoomPrefabUrl: string              // URL (빈 문자열 가능)

    // 통계 (랭킹/프로필용)
    PlayCount: number
    LikeCount: number
    CommentAuthorIds: string[]         // 댓글 작성자 ID들

    // 메타데이터
    Version: number
    CreatedDate: Timestamp
    LastUpdated: Timestamp
}

// UI 표시용 카드 인터페이스
export interface RoomCard {
    id: string
    title: string
    description: string
    thumbnail?: string
    difficulty: string
    theme: string
    tags: string[]
    creator: {
        id: string
        username: string
    }
    stats: {
        playCount: number
        likeCount: number
        commentCount: number
    }
    createdAt: Timestamp
}

// Room 필터링 옵션
export interface RoomFilters {
    difficulty?: 'easy' | 'normal' | 'hard'
    theme?: string
    sortBy?: 'popular' | 'liked' | 'recent'
    limit?: number
    keywords?: string[]
}

// Room을 RoomCard로 변환
export function roomToCard(room: Room): RoomCard {
    return {
        id: room.id,
        title: room.RoomTitle,
        description: room.RoomDescription,
        thumbnail: room.Thumbnail || undefined,
        difficulty: room.Difficulty.toLowerCase(),
        theme: room.Theme,
        tags: room.Keywords || [],
        creator: {
            id: room.CreatorId,
            username: room.CreatorId // 실제로는 User 컬렉션에서 조회 필요
        },
        stats: {
            playCount: room.PlayCount || 0,
            likeCount: room.LikeCount || 0,
            commentCount: room.CommentAuthorIds?.length || 0
        },
        createdAt: room.CreatedDate
    }
}

// Room 생성 시 사용할 입력 타입
export interface CreateRoomData {
    RoomTitle: string
    RoomDescription: string
    CreatorId: string
    Difficulty: 'Easy' | 'Normal' | 'Hard'
    Theme: string
    Keywords?: string[]
    Thumbnail?: string
    RoomPrefabUrl?: string
}

// Room 업데이트 시 사용할 타입
export interface UpdateRoomData {
    RoomTitle?: string
    RoomDescription?: string
    Difficulty?: 'Easy' | 'Normal' | 'Hard'
    Theme?: string
    Keywords?: string[]
    Thumbnail?: string
    RoomPrefabUrl?: string
    Version?: number
}

// Room 통계 업데이트 타입
export interface UpdateRoomStats {
    PlayCount?: number
    LikeCount?: number
    CommentAuthorIds?: string[]
}