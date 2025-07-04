// lib/firebase/services/user.service.ts
import {
    arrayRemove,
    arrayUnion,
    doc,
    increment,
    orderBy,
    runTransaction,
    serverTimestamp,
    Unsubscribe,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {InventoryItem, User, UserSettings} from '@/lib/firebase/types'

export class UserService extends BaseService {
    /**
     * 사용자 실시간 구독
     */
    static subscribeToUser(uid: string, callback: (user: User | null) => void): Unsubscribe {
        return this.subscribeToDocument<User>(COLLECTIONS.USERS, uid, callback)
    }

    /**
     * UID로 사용자 정보 가져오기 (일회성)
     */
    static async getUserById(uid: string): Promise<User | null> {
        return this.getDocument<User>(COLLECTIONS.USERS, uid)
    }

    /**
     * Username으로 사용자 정보 가져오기
     */
    static async getUserByUsername(username: string): Promise<User | null> {
        const users = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [where('username', '==', username)],
            {limit: 1}
        )
        return users[0] || null
    }

    /**
     * 사용자 정보 업데이트
     */
    static async updateUser(userId: string, data: Partial<User>): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 사용자 통계 업데이트 (새로운 UserStats 구조 반영)
     */
    static async updateUserStats(
        userId: string,
        stats: {
            totalPlays?: number
            successRate?: number
            fastestTime?: number
            averageTime?: number
            hintsUsed?: number
            perfectClears?: number
            achievements?: number
            createdRooms?: number
        }
    ): Promise<void> {
        const updates: any = {}

        if (stats.totalPlays !== undefined) {
            updates['stats.totalPlays'] = increment(stats.totalPlays)
        }
        if (stats.successRate !== undefined) {
            updates['stats.successRate'] = stats.successRate
        }
        if (stats.fastestTime !== undefined) {
            updates['stats.fastestTime'] = stats.fastestTime
        }
        if (stats.averageTime !== undefined) {
            updates['stats.averageTime'] = stats.averageTime
        }
        if (stats.hintsUsed !== undefined) {
            updates['stats.hintsUsed'] = increment(stats.hintsUsed)
        }
        if (stats.perfectClears !== undefined) {
            updates['stats.perfectClears'] = increment(stats.perfectClears)
        }
        if (stats.achievements !== undefined) {
            updates['stats.achievements'] = increment(stats.achievements)
        }
        if (stats.createdRooms !== undefined) {
            updates['stats.createdRooms'] = increment(stats.createdRooms)
        }

        updates.updatedAt = serverTimestamp()

        await updateDoc(doc(db, COLLECTIONS.USERS, userId), updates)
    }

    /**
     * 경험치 및 레벨 업데이트
     */
    static async updateExpAndLevel(userId: string, expGained: number): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const currentExp = userData.exp || 0
            const currentLevel = userData.level || 1
            const newExp = currentExp + expGained

            // 레벨 업 로직 (예: 1000 경험치마다 레벨 업)
            const newLevel = Math.floor(newExp / 1000) + 1

            transaction.update(userRef, {
                exp: newExp,
                level: newLevel,
                updatedAt: serverTimestamp()
            })
        })
    }

    /**
     * 포인트 순으로 사용자 가져오기
     */
    static async getUsersByPoints(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('points', 'desc')],
            {limit: limitCount}
        )
    }

    /**
     * 총 플레이 횟수 순으로 사용자 가져오기
     */
    static async getUsersByTotalPlays(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('stats.totalPlays', 'desc')],
            {limit: limitCount}
        )
    }

    /**
     * 생성한 방 수 순으로 사용자 가져오기
     */
    static async getUsersByCreatedRooms(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('stats.createdRooms', 'desc')],
            {limit: limitCount}
        )
    }

    /**
     * 레벨 순으로 사용자 가져오기
     */
    static async getUsersByLevel(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('level', 'desc')],
            {limit: limitCount}
        )
    }

    /**
     * 친구 추가
     */
    static async addFriend(userId: string, friendId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const friendRef = doc(db, COLLECTIONS.USERS, friendId)

        await updateDoc(userRef, {
            'social.friends': arrayUnion(friendId),
            'social.friendCount': increment(1),
            updatedAt: serverTimestamp()
        })

        await updateDoc(friendRef, {
            'social.friends': arrayUnion(userId),
            'social.friendCount': increment(1),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 친구 제거
     */
    static async removeFriend(userId: string, friendId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const friendRef = doc(db, COLLECTIONS.USERS, friendId)

        await updateDoc(userRef, {
            'social.friends': arrayRemove(friendId),
            'social.friendCount': increment(-1),
            updatedAt: serverTimestamp()
        })

        await updateDoc(friendRef, {
            'social.friends': arrayRemove(userId),
            'social.friendCount': increment(-1),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 팔로우
     */
    static async followUser(followerId: string, targetId: string): Promise<void> {
        const followerRef = doc(db, COLLECTIONS.USERS, followerId)
        const targetRef = doc(db, COLLECTIONS.USERS, targetId)

        await updateDoc(followerRef, {
            'social.following': arrayUnion(targetId),
            updatedAt: serverTimestamp()
        })

        await updateDoc(targetRef, {
            'social.followers': arrayUnion(followerId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 언팔로우
     */
    static async unfollowUser(followerId: string, targetId: string): Promise<void> {
        const followerRef = doc(db, COLLECTIONS.USERS, followerId)
        const targetRef = doc(db, COLLECTIONS.USERS, targetId)

        await updateDoc(followerRef, {
            'social.following': arrayRemove(targetId),
            updatedAt: serverTimestamp()
        })

        await updateDoc(targetRef, {
            'social.followers': arrayRemove(followerId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 사용자 차단
     */
    static async blockUser(userId: string, targetId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const targetRef = doc(db, COLLECTIONS.USERS, targetId)

        await updateDoc(userRef, {
            'social.blockedUsers': arrayUnion(targetId),
            updatedAt: serverTimestamp()
        })

        await updateDoc(targetRef, {
            'social.blockedBy': arrayUnion(userId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 사용자 차단 해제
     */
    static async unblockUser(userId: string, targetId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const targetRef = doc(db, COLLECTIONS.USERS, targetId)

        await updateDoc(userRef, {
            'social.blockedUsers': arrayRemove(targetId),
            updatedAt: serverTimestamp()
        })

        await updateDoc(targetRef, {
            'social.blockedBy': arrayRemove(userId),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 크레딧 잔액 확인
     */
    static async getCreditBalance(uid: string): Promise<number> {
        const user = await this.getUserById(uid)
        return user?.credits || 0
    }

    /**
     * 크레딧 차감 (트랜잭션으로 안전하게)
     */
    static async deductCredits(uid: string, amount: number): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, uid)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const currentCredits = userData.credits || 0

            if (currentCredits < amount) {
                throw new Error('크레딧이 부족합니다')
            }

            transaction.update(userRef, {
                credits: currentCredits - amount,
                updatedAt: serverTimestamp()
            })
        })
    }

    /**
     * 크레딧 추가
     */
    static async addCredits(uid: string, amount: number): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, uid)

        await updateDoc(userRef, {
            credits: increment(amount),
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 사용자 설정 업데이트
     */
    static async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await updateDoc(userRef, {
            settings: settings,
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 인벤토리 아이템 추가
     */
    static async addInventoryItem(
        userId: string,
        itemId: string,
        item: InventoryItem
    ): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await updateDoc(userRef, {
            [`inventory.items.${itemId}`]: {
                ...item,
                purchasedAt: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 인벤토리 아이템 사용
     */
    static async consumeInventoryItem(
        userId: string,
        itemId: string,
        quantity: number = 1
    ): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User
            const currentItem = userData.inventory?.items[itemId]

            if (!currentItem || currentItem.quantity < quantity) {
                throw new Error('아이템이 부족합니다')
            }

            const newQuantity = currentItem.quantity - quantity

            if (newQuantity <= 0) {
                // 아이템 제거
                transaction.update(userRef, {
                    [`inventory.items.${itemId}`]: null,
                    updatedAt: serverTimestamp()
                })
            } else {
                // 수량 업데이트
                transaction.update(userRef, {
                    [`inventory.items.${itemId}.quantity`]: newQuantity,
                    [`inventory.items.${itemId}.lastUsedAt`]: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            }
        })
    }

    /**
     * 사용자 상태 업데이트
     */
    static async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await updateDoc(userRef, {
            status: status,
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 사용자명 변경
     */
    static async changeUsername(userId: string, newUsername: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists()) {
                throw new Error('사용자를 찾을 수 없습니다')
            }

            const userData = userDoc.data() as User

            if (!userData.canChangeUsername) {
                throw new Error('사용자명을 변경할 수 없습니다')
            }

            // 중복 체크
            const existingUser = await this.getUserByUsername(newUsername)
            if (existingUser) {
                throw new Error('이미 사용중인 사용자명입니다')
            }

            transaction.update(userRef, {
                username: newUsername,
                canChangeUsername: false,
                usernameChangedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })
    }

    /**
     * 마지막 로그인 시간 업데이트
     */
    static async updateLastLogin(userId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)

        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp()
        })
    }

    /**
     * 사용자 검색 (개선된 버전)
     */
    static async searchUsers(searchTerm: string, limitCount: number = 20): Promise<User[]> {
        const lowerSearch = searchTerm.toLowerCase()

        // username으로 검색
        const usernameResults = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                where('username', '>=', lowerSearch),
                where('username', '<=', lowerSearch + '\uf8ff'),
                where('status', '==', 'active')
            ],
            {limit: limitCount}
        )

        // displayName으로 검색
        const displayNameResults = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                where('displayName', '>=', searchTerm),
                where('displayName', '<=', searchTerm + '\uf8ff'),
                where('status', '==', 'active')
            ],
            {limit: limitCount}
        )

        // 중복 제거
        const userMap = new Map<string, User>()
        const allResults = [...usernameResults, ...displayNameResults]

        allResults.forEach(user => {
            userMap.set(user.uid, user)
        })

        return Array.from(userMap.values()).slice(0, limitCount)
    }

    /**
     * 친구 목록 가져오기
     */
    static async getFriends(userId: string): Promise<User[]> {
        const user = await this.getUserById(userId)
        if (!user?.social?.friends?.length) {
            return []
        }

        const friendsPromises = user.social.friends.map(friendId => this.getUserById(friendId))
        const friends = await Promise.all(friendsPromises)

        return friends.filter(friend => friend !== null) as User[]
    }

    /**
     * 팔로워 목록 가져오기
     */
    static async getFollowers(userId: string): Promise<User[]> {
        const user = await this.getUserById(userId)
        if (!user?.social?.followers?.length) {
            return []
        }

        const followersPromises = user.social.followers.map(followerId => this.getUserById(followerId))
        const followers = await Promise.all(followersPromises)

        return followers.filter(follower => follower !== null) as User[]
    }

    /**
     * 팔로잉 목록 가져오기
     */
    static async getFollowing(userId: string): Promise<User[]> {
        const user = await this.getUserById(userId)
        if (!user?.social?.following?.length) {
            return []
        }

        const followingPromises = user.social.following.map(followingId => this.getUserById(followingId))
        const following = await Promise.all(followingPromises)

        return following.filter(follow => follow !== null) as User[]
    }

    /**
     * 랭킹 정보 가져오기 (통합)
     */
    static async getRankings(type: 'points' | 'level' | 'totalPlays' | 'createdRooms', limitCount: number = 50): Promise<User[]> {
        const orderField = type === 'points' ? 'points' :
            type === 'level' ? 'level' :
                type === 'totalPlays' ? 'stats.totalPlays' :
                    'stats.createdRooms'

        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                orderBy(orderField, 'desc'),
                where('status', '==', 'active')
            ],
            {limit: limitCount}
        )
    }
}