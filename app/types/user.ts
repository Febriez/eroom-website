// 사용자 프로필 관련 타입 정의
export interface UserProfile {
    docId: string
    uid: string
    userId: string
    email: string
    nickname: string
    bio: string
    level: number
    points: number
    completedMaps: number
    createdMaps: number
    totalPlayTime: string
    winRate: string
    avgClearTime: string
    friendsCount: number
    createdAt: string
    followers?: string[]
    following?: string[]
    friends?: string[]
    blocked?: string[]
    userIdChangedAt?: any
    canChangeUserId?: boolean

    // 게임 데이터 필드
    Credits?: number
    Username?: string
    RegistrationDate?: any
    LastLoginDate?: any
    TotalPlayTime?: number
    LikedRooms?: string[]
    Preferences?: {
        SoundEnabled: boolean
        MusicVolume: number
        EffectsVolume: number
        MouseSensitivity: number
        Language: string
    }
}
