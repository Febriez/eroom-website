// lib/firebase/services/item.service.ts

import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {ItemDefinition, ItemPurchase} from '@/lib/firebase/types/item.types'
import type {User} from '@/lib/firebase/types'

export class ItemService extends BaseService {
    /**
     * 모든 활성 아이템 가져오기
     */
    static async getActiveItems(): Promise<ItemDefinition[]> {
        return this.queryDocuments<ItemDefinition>(
            COLLECTIONS.STORE,
            [where('active', '==', true)]
        )
    }

    /**
     * 아이템 ID로 정보 가져오기
     */
    static async getItemById(itemId: string): Promise<ItemDefinition | null> {
        return this.getDocument<ItemDefinition>(COLLECTIONS.STORE, itemId)
    }

    /**
     * 사용자 인벤토리 가져오기
     */
    static async getUserInventory(userId: string): Promise<{ [itemId: string]: any }> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            return {}
        }

        const userData = userDoc.data() as User

        // inventory가 없는 경우 초기화
        if (!userData.inventory) {
            await updateDoc(userRef, {
                inventory: {
                    items: {},
                    activeBoosts: [],
                    activeThemes: []
                }
            })
            return {}
        }

        return userData.inventory.items || {}
    }

    /**
     * 특정 아이템의 사용자 보유 수량 확인
     */
    static async getUserItemQuantity(userId: string, itemId: string): Promise<number> {
        const user = await this.getDocument<User>(COLLECTIONS.USERS, userId)
        return user?.inventory?.items?.[itemId]?.quantity || 0
    }

    /**
     * 아이템 구매 처리 (트랜잭션)
     */
    static async purchaseItems(
        userId: string,
        items: Array<{
            item: ItemDefinition,
            quantity: number
        }>
    ): Promise<ItemPurchase> {
        const purchaseRef = doc(collection(db, COLLECTIONS.PURCHASES))
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        // 총 금액 계산
        const totalAmount = items.reduce((sum, {item, quantity}) =>
            sum + (item.price * quantity), 0
        )

        const purchase = await runTransaction(db, async (transaction) => {
            // 1. 사용자 정보 조회
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const currentCredits = userData.credits || 0

            // 2. 크레딧 확인
            if (currentCredits < totalAmount) {
                throw new Error('크레딧이 부족합니다')
            }

            // 3. 구매 문서 생성
            const purchaseData: ItemPurchase = {
                id: purchaseRef.id,
                userId,
                items: items.map(({item, quantity}) => ({
                    itemId: item.id,
                    itemName: item.name,
                    category: item.category,
                    quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * quantity
                })),
                totalAmount,
                creditsBefore: currentCredits,
                creditsAfter: currentCredits - totalAmount,
                status: 'completed',
                createdAt: serverTimestamp() as Timestamp,
                completedAt: serverTimestamp() as Timestamp
            }

            // 4. 구매 문서 저장
            transaction.set(purchaseRef, purchaseData)

            // 5. 크레딧 차감 및 인벤토리 업데이트
            const inventoryUpdates: any = {}

            // inventory 필드가 없는 경우 초기화
            if (!userData.inventory) {
                userData.inventory = {
                    items: {},
                    activeBoosts: [],
                    activeThemes: []
                }
            }

            for (const {item, quantity} of items) {
                const itemKey = `inventory.items.${item.id}`

                if (['themes', 'bundles', 'special'].includes(item.category)) {
                    // 단일 구매 아이템
                    inventoryUpdates[itemKey] = {
                        quantity: 1,
                        purchasedAt: serverTimestamp(),
                        itemName: item.name,
                        category: item.category
                    }
                } else if (item.category === 'boosts') {
                    // 부스터 아이템
                    inventoryUpdates[itemKey] = {
                        quantity: 1,
                        purchasedAt: serverTimestamp(),
                        itemName: item.name,
                        category: item.category,
                        isActive: false,
                        duration: item.duration
                    }
                } else if (item.category === 'tools') {
                    // 도구 아이템 (수량 누적)
                    const currentQuantity = userData.inventory?.items?.[item.id]?.quantity || 0
                    inventoryUpdates[itemKey] = {
                        quantity: currentQuantity + quantity,
                        purchasedAt: serverTimestamp(),
                        itemName: item.name,
                        category: item.category
                    }
                }
            }

            transaction.update(userRef, {
                credits: currentCredits - totalAmount,
                updatedAt: serverTimestamp(),
                // inventory가 없는 경우 초기화
                ...(userData.inventory ? {} : {
                    inventory: {
                        items: {},
                        activeBoosts: [],
                        activeThemes: []
                    }
                }),
                ...inventoryUpdates
            })

            return purchaseData
        })

        return purchase
    }

    /**
     * 부스터 활성화
     */
    static async activateBooster(userId: string, itemId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const userItem = userData.inventory?.items?.[itemId]

            if (!userItem) {
                throw new Error('아이템을 찾을 수 없습니다')
            }

            const itemDef = await this.getItemById(itemId)

            if (!itemDef) {
                throw new Error('아이템 정의를 찾을 수 없습니다')
            }

            if (itemDef.category !== 'boosts') {
                throw new Error('부스터 아이템이 아닙니다')
            }

            if (userItem.isActive) {
                throw new Error('이미 활성화된 부스터입니다')
            }

            // 지속시간 계산
            const duration = this.parseDuration(itemDef.duration || '7일')
            const now = Timestamp.now()
            const expiresAt = new Timestamp(
                now.seconds + duration,
                now.nanoseconds
            )

            // 부스터 활성화
            transaction.update(userRef, {
                [`inventory.items.${itemId}.isActive`]: true,
                [`inventory.items.${itemId}.activatedAt`]: serverTimestamp(),
                [`inventory.items.${itemId}.expiresAt`]: expiresAt,
                'inventory.activeBoosts': arrayUnion(itemId),
                updatedAt: serverTimestamp()
            })
        })
    }

    /**
     * 도구 아이템 사용
     */
    static async consumeToolItem(userId: string, itemId: string, quantity: number = 1): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const userItem = userData.inventory?.items?.[itemId]

            if (!userItem) {
                throw new Error('아이템을 찾을 수 없습니다')
            }

            if (userItem.quantity < quantity) {
                throw new Error('아이템 수량이 부족합니다')
            }

            const newQuantity = userItem.quantity - quantity

            if (newQuantity === 0) {
                // 아이템 삭제
                transaction.update(userRef, {
                    [`inventory.items.${itemId}`]: null,
                    updatedAt: serverTimestamp()
                })
            } else {
                // 수량 감소
                transaction.update(userRef, {
                    [`inventory.items.${itemId}.quantity`]: newQuantity,
                    [`inventory.items.${itemId}.lastUsedAt`]: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            }
        })
    }

    /**
     * 만료된 부스터 정리
     */
    static async cleanupExpiredBoosters(userId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const now = Timestamp.now()

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) return

            const userData = userDoc.data() as User
            const inventory = userData.inventory?.items || {}
            const activeBoosts = userData.inventory?.activeBoosts || []

            const updates: any = {}
            const expiredBoosts: string[] = []

            // 만료된 부스터 확인
            for (const itemId of activeBoosts) {
                const item = inventory[itemId]
                if (item?.expiresAt && item.expiresAt.seconds <= now.seconds) {
                    updates[`inventory.items.${itemId}.isActive`] = false
                    expiredBoosts.push(itemId)
                }
            }

            if (expiredBoosts.length > 0) {
                // 활성 부스터 목록에서 제거
                const newActiveBoosts = activeBoosts.filter(id => !expiredBoosts.includes(id))
                updates['inventory.activeBoosts'] = newActiveBoosts
                updates.updatedAt = serverTimestamp()

                transaction.update(userRef, updates)
            }
        })
    }

    /**
     * 활성 부스터 가져오기
     */
    static async getActiveBoosts(userId: string): Promise<any[]> {
        const user = await this.getDocument<User>(COLLECTIONS.USERS, userId)
        if (!user?.inventory) return []

        const now = Timestamp.now()
        const activeBoosts = []

        for (const itemId of (user.inventory.activeBoosts || [])) {
            const item = user.inventory.items[itemId]
            if (item?.isActive && item.expiresAt && item.expiresAt.seconds > now.seconds) {
                activeBoosts.push({
                    itemId,
                    ...item
                })
            }
        }

        return activeBoosts
    }

    /**
     * 지속시간 문자열을 초로 변환
     */
    private static parseDuration(duration: string): number {
        const match = duration.match(/(\d+)(일|시간|분)/)
        if (!match) return 0

        const value = parseInt(match[1])
        const unit = match[2]

        switch (unit) {
            case '일':
                return value * 24 * 60 * 60
            case '시간':
                return value * 60 * 60
            case '분':
                return value * 60
            default:
                return 0
        }
    }

    /**
     * 사용자가 아이템을 보유하고 있는지 확인
     */
    static async hasItem(userId: string, itemId: string): Promise<boolean> {
        const quantity = await this.getUserItemQuantity(userId, itemId)
        return quantity > 0
    }

    /**
     * 여러 아이템의 보유 여부 확인
     */
    static async hasItems(userId: string, itemIds: string[]): Promise<{ [itemId: string]: boolean }> {
        const inventory = await this.getUserInventory(userId)
        const result: { [itemId: string]: boolean } = {}

        itemIds.forEach(itemId => {
            result[itemId] = inventory[itemId]?.quantity > 0
        })

        return result
    }

    /**
     * 초기 아이템 데이터
     */
    private static getInitialItems(): Omit<ItemDefinition, 'id' | 'createdAt' | 'updatedAt'>[] {
        return [
            // 테마 아이템
            {
                name: '다크 네온 테마',
                description: '사이버펑크 스타일의 네온 테마로 프로필을 꾸며보세요',
                category: 'themes',
                rarity: 'rare',
                price: 500,
                iconName: 'Palette',
                iconBg: 'from-purple-500 to-pink-500',
                features: ['프로필 배경 변경', '네온 효과 추가', '애니메이션 효과'],
                popular: true,
                active: true
            },
            {
                name: '황금빛 럭셔리 테마',
                description: '고급스러운 황금색 테마로 품격을 높이세요',
                category: 'themes',
                rarity: 'epic',
                price: 800,
                originalPrice: 1000,
                discount: 20,
                iconName: 'Crown',
                iconBg: 'from-yellow-500 to-orange-500',
                features: ['황금 프레임', '반짝임 효과', 'VIP 뱃지'],
                active: true
            },
            {
                name: '우주 탐험가 테마',
                description: '신비로운 우주 테마로 프로필을 꾸며보세요',
                category: 'themes',
                rarity: 'legendary',
                price: 1200,
                iconName: 'Sparkles',
                iconBg: 'from-indigo-500 to-purple-500',
                features: ['우주 배경', '별똥별 애니메이션', '행성 장식'],
                limitedTime: true,
                active: true
            },

            // 부스터 아이템
            {
                name: '경험치 부스터',
                description: '7일간 획득 경험치가 2배로 증가합니다',
                category: 'boosts',
                rarity: 'common',
                price: 300,
                duration: '7일',
                iconName: 'TrendingUp',
                iconBg: 'from-green-500 to-emerald-500',
                features: ['경험치 2배', '레벨업 속도 증가'],
                popular: true,
                active: true
            },
            {
                name: '크레딧 부스터',
                description: '7일간 획득 크레딧이 1.5배로 증가합니다',
                category: 'boosts',
                rarity: 'rare',
                price: 500,
                duration: '7일',
                iconName: 'Gem',
                iconBg: 'from-blue-500 to-cyan-500',
                features: ['크레딧 1.5배', '보너스 크레딧 지급'],
                active: true
            },
            {
                name: '힌트 부스터',
                description: '14일간 힌트 사용 시 포인트 차감 50% 감소',
                category: 'boosts',
                rarity: 'epic',
                price: 700,
                duration: '14일',
                iconName: 'Brain',
                iconBg: 'from-purple-500 to-pink-500',
                features: ['힌트 비용 50% 감소', '추가 힌트 제공'],
                active: true
            },

            // 도구 아이템
            {
                name: '긴급 탈출권',
                description: '방탈출 중 즉시 탈출할 수 있는 아이템',
                category: 'tools',
                rarity: 'common',
                price: 100,
                quantity: 1,
                iconName: 'Key',
                iconBg: 'from-gray-500 to-gray-600',
                features: ['즉시 탈출', '포인트 보존'],
                active: true
            },
            {
                name: '시간 연장권',
                description: '방탈출 제한 시간을 10분 연장합니다',
                category: 'tools',
                rarity: 'rare',
                price: 200,
                quantity: 1,
                iconName: 'Timer',
                iconBg: 'from-orange-500 to-red-500',
                features: ['시간 10분 추가', '1회용'],
                active: true
            },
            {
                name: '힌트 토큰',
                description: '무료로 힌트를 사용할 수 있는 토큰',
                category: 'tools',
                rarity: 'common',
                price: 150,
                quantity: 3,
                iconName: 'Eye',
                iconBg: 'from-teal-500 to-green-500',
                features: ['무료 힌트 3회', '포인트 차감 없음'],
                popular: true,
                active: true
            },

            // 번들 아이템
            {
                name: '스타터 팩',
                description: '방탈출 초보자를 위한 기본 패키지',
                category: 'bundles',
                rarity: 'rare',
                price: 800,
                originalPrice: 1200,
                discount: 33,
                iconName: 'Gift',
                iconBg: 'from-pink-500 to-rose-500',
                features: ['경험치 부스터 7일', '힌트 토큰 5개', '시간 연장권 2개', '보너스 500 크레딧'],
                popular: true,
                active: true
            },
            {
                name: 'VIP 패키지',
                description: '프리미엄 사용자를 위한 특별 패키지',
                category: 'bundles',
                rarity: 'legendary',
                price: 2500,
                iconName: 'Crown',
                iconBg: 'from-yellow-500 to-amber-500',
                features: ['모든 부스터 14일', '프리미엄 테마 1개', '힌트 토큰 10개', '보너스 1000 크레딧'],
                limitedTime: true,
                active: true
            },

            // 특별 아이템
            {
                name: '미스터리 박스',
                description: '무엇이 나올지 모르는 랜덤 박스',
                category: 'special',
                rarity: 'mythic',
                price: 1000,
                iconName: 'Lock',
                iconBg: 'from-purple-600 to-pink-600',
                features: ['랜덤 아이템 3-5개', '레어 이상 보장', '한정판 아이템 확률'],
                active: true
            }
        ];
    }

    /**
     * Store 컬렉션 초기화
     */
    static async initializeStore(): Promise<void> {
        try {
            // 기존 아이템이 있는지 확인
            const existingItems = await this.queryDocuments<ItemDefinition>(
                COLLECTIONS.STORE,
                []
            );

            if (existingItems.length > 0) {
                console.log('Store already initialized with', existingItems.length, 'items');
                return;
            }

            console.log('Initializing store with default items...');

            const batch = writeBatch(db);
            const initialItems = this.getInitialItems();

            initialItems.forEach(item => {
                const docRef = doc(collection(db, COLLECTIONS.STORE));
                batch.set(docRef, {
                    ...item,
                    id: docRef.id,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });

            await batch.commit();
            console.log('Store initialized with', initialItems.length, 'items');
        } catch (error) {
            console.error('Failed to initialize store:', error);
            throw error;
        }
    }

    /**
     * 특정 아이템이 존재하는지 확인하고 없으면 생성
     */
    static async ensureItemExists(itemData: Omit<ItemDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            const existingItems = await this.queryDocuments<ItemDefinition>(
                COLLECTIONS.STORE,
                [where('name', '==', itemData.name)]
            );

            if (existingItems.length === 0) {
                const docRef = doc(collection(db, COLLECTIONS.STORE));
                await setDoc(docRef, {
                    ...itemData,
                    id: docRef.id,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                console.log('Created new item:', itemData.name);
            }
        } catch (error) {
            console.error('Failed to ensure item exists:', error);
        }
    }
}