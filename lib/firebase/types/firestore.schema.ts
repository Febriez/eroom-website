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

// 실제 Room 스키마 (Firestore 구조 기반)
export interface RoomSchema {
    // 기본 식별자
    id: string                          // Firestore 문서 ID
    RoomId: string                      // 게임 내부 UUID

    // 기본 정보
    RoomTitle: string
    RoomDescription: string
    CreatorId: string

    // 게임 설정
    Difficulty: 'Easy' | 'Normal' | 'Hard' | 'Extreme'
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

    // Objects 배열은 클라이언트용이므로 제외
}

// Room을 카드 형태로 표시하기 위한 인터페이스
export interface RoomCardDisplay {
    id: string
    title: string
    description: string
    thumbnail?: string
    difficulty: string
    theme: string
    tags: string[]
    creator: {
        id: string
        username: string  // 실제로는 사용자 정보 조회 필요
    }
    stats: {
        playCount: number
        likeCount: number
        commentCount: number
    }
    createdAt: Timestamp
}

// Room을 RoomCardDisplay로 변환하는 함수
export function roomToCardDisplay(room: RoomSchema): RoomCardDisplay {
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
            username: room.CreatorId // 실제로는 사용자 정보 조회 필요
        },
        stats: {
            playCount: room.PlayCount || 0,
            likeCount: room.LikeCount || 0,
            commentCount: room.CommentAuthorIds?.length || 0
        },
        createdAt: room.CreatedDate
    }
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