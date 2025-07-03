// lib/firebase/services/user.service.ts
import {
    arrayUnion,
    collection,
    doc,
    getDocs,
    increment,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    Unsubscribe,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {User} from '@/lib/firebase/types'

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
        await updateDoc(userRef, data)
    }

    /**
     * 사용자 통계 업데이트
     */
    static async updateUserStats(
        userId: string,
        stats: {
            mapsCompleted?: number
            mapsCreated?: number
            totalPlayTime?: number
            points?: number
        }
    ): Promise<void> {
        const updates: any = {}

        if (stats.mapsCompleted !== undefined) {
            updates['stats.mapsCompleted'] = increment(stats.mapsCompleted)
        }
        if (stats.mapsCreated !== undefined) {
            updates['stats.mapsCreated'] = increment(stats.mapsCreated)
        }
        if (stats.totalPlayTime !== undefined) {
            updates['stats.totalPlayTime'] = increment(stats.totalPlayTime)
        }
        if (stats.points !== undefined) {
            updates.points = increment(stats.points)
        }

        await updateDoc(doc(db, COLLECTIONS.USERS, userId), updates)
    }

    /**
     * 모든 사용자 가져오기 (랭킹용)
     */
    static async getAllUsers(): Promise<User[]> {
        const snapshot = await getDocs(query(
            collection(db, COLLECTIONS.USERS),
            orderBy('points', 'desc')
        ))

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as User))
    }

    /**
     * 플레이 횟수 순으로 사용자 가져오기
     */
    static async getUsersByPlayCount(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('stats.mapsCompleted', 'desc')],
            {limit: limitCount}
        )
    }

    /**
     * 맵 제작 수 순으로 사용자 가져오기
     */
    static async getUsersByMapCount(limitCount: number = 50): Promise<User[]> {
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [orderBy('stats.mapsCreated', 'desc')],
            {limit: limitCount}
        )
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
     * 친구 추가
     */
    static async addFriend(userId: string, friendId: string): Promise<void> {
        const userRef = doc(db, COLLECTIONS.USERS, userId)
        const friendRef = doc(db, COLLECTIONS.USERS, friendId)

        // 양쪽 모두 친구 목록에 추가
        await updateDoc(userRef, {
            'social.friends': arrayUnion(friendId),
            'social.friendCount': increment(1)
        })

        await updateDoc(friendRef, {
            'social.friends': arrayUnion(userId),
            'social.friendCount': increment(1)
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
     * 팔로우
     */
    static async followUser(followerId: string, targetId: string): Promise<void> {
        const followerRef = doc(db, COLLECTIONS.USERS, followerId)
        const targetRef = doc(db, COLLECTIONS.USERS, targetId)

        await updateDoc(followerRef, {
            'social.following': arrayUnion(targetId)
        })

        await updateDoc(targetRef, {
            'social.followers': arrayUnion(followerId)
        })
    }

    /**
     * 언팔로우
     */
    static async unfollowUser(followerId: string, targetId: string): Promise<void> {
        // 실제로는 배열에서 제거하는 로직이 필요
        // 여기서는 간단히 구현
    }

    /**
     * 사용자 검색
     */
    static async searchUsers(searchTerm: string, limitCount: number = 20): Promise<User[]> {
        const lowerSearch = searchTerm.toLowerCase()

        // username으로 검색
        const usernameResults = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                where('username', '>=', lowerSearch),
                where('username', '<=', lowerSearch + '\uf8ff')
            ],
            {limit: limitCount}
        )

        // displayName으로 검색 (실제로는 더 복잡한 검색 로직 필요)
        const displayNameResults = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                where('displayName', '>=', searchTerm),
                where('displayName', '<=', searchTerm + '\uf8ff')
            ],
            {limit: limitCount}
        )

        // 중복 제거
        const userMap = new Map<string, User>()
        const allResults = [...usernameResults, ...displayNameResults]

        allResults.forEach(user => {
            userMap.set(user.id, user)
        })

        return Array.from(userMap.values()).slice(0, limitCount)
    }
}