import {Timestamp} from 'firebase/firestore'

// 친구 요청
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

// 차단 관계
export interface BlockRelation {
    id: string
    blockerId: string       // 차단한 사용자
    blockedId: string       // 차단당한 사용자
    createdAt: Timestamp
}

// 팔로우 관계
export interface FollowRelation {
    id: string
    followerId: string      // 팔로우하는 사용자
    followingId: string     // 팔로우받는 사용자
    createdAt: Timestamp
}