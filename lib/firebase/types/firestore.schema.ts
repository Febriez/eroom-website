// lib/firebase/types/firestore.schema.ts

// 사용자 프로필
import {GamePreferences, NotificationSettings, PrivacySettings} from "@/lib/firebase/types/index";
import {Timestamp} from "firebase/firestore";
import {ItemDefinition, ItemPurchase, UserInventory, UserItem} from './item.types';

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

    // 인벤토리 (User 문서에 직접 저장)
    inventory: {
        items: {
            [itemId: string]: {
                quantity: number
                purchasedAt: Timestamp
                lastUsedAt?: Timestamp
                expiresAt?: Timestamp  // 부스터의 경우
                isActive?: boolean     // 부스터의 경우
            }
        }
        activeBoosts: string[]  // 활성화된 부스터 아이템 ID
        activeThemes: string[]  // 활성화된 테마 아이템 ID
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

// ConversationSchema에 차단 관련 필드 추가
export interface ConversationSchema {
    id: string
    participants: string[]              // uid 배열 (2명)

    // 차단된 상태 추가
    blockedBy?: string[]               // 차단한 사용자 uid 배열

    lastMessage?: {
        content: string
        senderId: string
        timestamp: Timestamp
        type: 'text' | 'image' | 'system'
    }

    unreadCount: {
        [uid: string]: number
    }

    createdAt: Timestamp
    updatedAt: Timestamp
}

// Message 스키마에 차단 확인용 필드 추가
export interface MessageSchema {
    id: string
    conversationId: string
    sender: {
        uid: string
        username: string
        displayName: string
    }
    content: string
    type: 'text' | 'image' | 'system'
    readBy: string[]
    reactions: any[]

    // 차단된 메시지인지 표시 (선택적)
    blockedFor?: string[]              // 이 메시지를 볼 수 없는 사용자 uid 배열

    createdAt: Timestamp
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

// ==================== 아이템 관련 스키마 ====================

// 아이템 정의 (Store 컬렉션)
export interface ItemDefinitionSchema extends ItemDefinition {
    // ItemDefinition 타입을 그대로 사용
    // Store 컬렉션에 저장되는 아이템 정의
}

// 사용자 아이템 (User 서브컬렉션)
export interface UserItemSchema extends UserItem {
    // UserItem 타입을 그대로 사용
    // users/{userId}/inventory 서브컬렉션에 저장
}

// 사용자 인벤토리 메타데이터 (User 서브컬렉션)
export interface UserInventorySchema extends UserInventory {
    // UserInventory 타입을 그대로 사용
    // users/{userId}/metadata/inventory 문서에 저장
}

// 구매 내역 (Purchases 컬렉션)
export interface PurchaseSchema extends ItemPurchase {
    // ItemPurchase 타입을 그대로 사용
    // Purchase 컬렉션에 저장
}
