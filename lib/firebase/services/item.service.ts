// lib/firebase/services/item.service.ts

import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
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
}