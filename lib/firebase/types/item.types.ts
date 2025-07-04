import {Timestamp} from 'firebase/firestore'

// 아이템 기본 정보
export interface ItemDefinition {
    id: string
    name: string
    description: string
    category: 'themes' | 'boosts' | 'tools' | 'bundles' | 'special'
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

    // 가격 정보
    price: number
    originalPrice?: number
    discount?: number

    // 아이템 특성
    features?: string[]
    duration?: string // 부스터의 경우 지속시간
    quantity?: number // 도구의 경우 개수

    // 메타데이터
    iconName: string // Lucide 아이콘 이름
    iconBg: string // Tailwind gradient class
    popular?: boolean
    limitedTime?: boolean

    // 시스템 정보
    active: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
}

// 사용자가 보유한 아이템 인스턴스
export interface UserItem {
    id: string // 고유 인스턴스 ID
    itemId: string // ItemDefinition의 ID 참조
    userId: string

    // 보유 정보
    quantity: number // 보유 수량

    // 부스터의 경우 활성화 정보
    activatedAt?: Timestamp
    expiresAt?: Timestamp
    isActive?: boolean

    // 구매 정보
    purchasedAt: Timestamp
    purchasePrice: number
    transactionId: string // Purchase 문서 ID 참조
}

// 사용자 인벤토리 (서브컬렉션으로 관리)
export interface UserInventory {
    userId: string
    items: {
        [itemId: string]: {
            quantity: number
            instances: string[] // UserItem 문서 ID 배열
        }
    }

    // 활성화된 부스터/테마
    activeBoosts: string[] // UserItem ID 배열
    activeThemes: string[] // UserItem ID 배열

    updatedAt: Timestamp
}

// 구매 트랜잭션
export interface ItemPurchase {
    id: string
    userId: string

    // 구매 아이템 정보
    items: Array<{
        itemId: string
        itemName: string
        category: string
        quantity: number
        unitPrice: number
        totalPrice: number
    }>

    // 결제 정보
    totalAmount: number
    creditsBefore: number
    creditsAfter: number

    // 상태
    status: 'pending' | 'completed' | 'failed' | 'refunded'

    // 메타데이터
    createdAt: Timestamp
    completedAt?: Timestamp
    failureReason?: string
}

// 아이템 효과 (부스터용)
export interface ItemEffect {
    type: 'exp_boost' | 'credit_boost' | 'hint_boost' | 'time_boost'
    value: number // 배율 또는 추가값
    duration?: number // 초 단위
}

// 아이템 통계
export interface ItemStats {
    itemId: string
    totalSold: number
    totalRevenue: number
    lastPurchased?: Timestamp
    popularityScore: number
}