// lib/firebase/services/rating.service.ts

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import {UserService} from './user.service'
import type {CreateRatingData, Rating, RatingStats, RatingWithUser} from '@/lib/firebase/types/rating.types'

export class RatingService extends BaseService {
    /**
     * 특정 룸의 평점 통계 가져오기
     */
    static async getRatingStats(roomId: string): Promise<RatingStats> {
        const q = query(
            collection(db, COLLECTIONS.RATINGS),
            where('roomId', '==', roomId)
        )

        const snapshot = await getDocs(q)
        const ratings: Rating[] = []

        snapshot.forEach((doc) => {
            ratings.push({id: doc.id, ...doc.data()} as Rating)
        })

        if (ratings.length === 0) {
            return {
                averageScore: 0,
                totalCount: 0,
                distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }
        }

        // 평균 계산
        const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0)
        const averageScore = totalScore / ratings.length

        // 분포 계산
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        ratings.forEach(rating => {
            distribution[rating.score as keyof typeof distribution]++
        })

        return {
            averageScore: Math.round(averageScore * 10) / 10, // 소수점 1자리
            totalCount: ratings.length,
            distribution
        }
    }

    /**
     * 특정 룸의 평점 목록 가져오기 (리뷰가 있는 것만)
     */
    static async getRatingsWithReviews(
        roomId: string,
        limit: number = 10
    ): Promise<RatingWithUser[]> {
        const q = query(
            collection(db, COLLECTIONS.RATINGS),
            where('roomId', '==', roomId),
            where('review', '!=', '')
        )

        const snapshot = await getDocs(q)
        const ratings: Rating[] = []

        snapshot.forEach((doc) => {
            ratings.push({id: doc.id, ...doc.data()} as Rating)
        })

        // 최신순 정렬
        ratings.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

        // limit 적용
        const limitedRatings = ratings.slice(0, limit)

        // 사용자 정보 추가
        return await Promise.all(
            limitedRatings.map(async (rating) => {
                const user = await UserService.getUserById(rating.userId)
                return {
                    ...rating,
                    user: user ? {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.avatarUrl || '',
                        level: user.level
                    } : {
                        uid: rating.userId,
                        displayName: '탈퇴한 사용자',
                        photoURL: '',
                        level: 0
                    }
                } as RatingWithUser
            })
        )
    }

    /**
     * 사용자의 평점 가져오기
     */
    static async getUserRating(
        roomId: string,
        userId: string
    ): Promise<Rating | null> {
        const q = query(
            collection(db, COLLECTIONS.RATINGS),
            where('roomId', '==', roomId),
            where('userId', '==', userId)
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return null
        }

        const doc = snapshot.docs[0]
        return {id: doc.id, ...doc.data()} as Rating
    }

    /**
     * 평점 생성 또는 업데이트
     */
    static async createOrUpdateRating(data: CreateRatingData): Promise<string> {
        // 기존 평점이 있는지 확인
        const existingRating = await this.getUserRating(data.roomId, data.userId)

        if (existingRating) {
            // 업데이트
            await updateDoc(doc(db, COLLECTIONS.RATINGS, existingRating.id), {
                score: data.score,
                review: data.review || '',
                updatedAt: serverTimestamp()
            })
            return existingRating.id
        } else {
            // 새로 생성
            const docRef = await addDoc(collection(db, COLLECTIONS.RATINGS), {
                ...data,
                review: data.review || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
            return docRef.id
        }
    }

    /**
     * 평점 삭제
     */
    static async deleteRating(ratingId: string): Promise<void> {
        const ratingRef = doc(db, COLLECTIONS.RATINGS, ratingId)
        const ratingDoc = await getDoc(ratingRef)

        if (!ratingDoc.exists()) {
            throw new Error('평점을 찾을 수 없습니다.')
        }

        await deleteDoc(ratingRef);
    }

    /**
     * 특정 사용자가 평가한 룸 수 가져오기
     */
    static async getUserRatingCount(userId: string): Promise<number> {
        const q = query(
            collection(db, COLLECTIONS.RATINGS),
            where('userId', '==', userId)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
    }

    /**
     * 룸의 평균 평점 계산 (캐시용)
     */
    static async calculateAverageRating(roomId: string): Promise<number> {
        const stats = await this.getRatingStats(roomId)
        return stats.averageScore
    }

    /**
     * 특정 점수 이상의 평점을 받은 룸 ID 목록 가져오기
     */
    static async getHighRatedRoomIds(
        minScore: number = 4.0,
        minRatingCount: number = 5
    ): Promise<string[]> {
        // 모든 평점을 가져와서 룸별로 그룹화
        const allRatingsSnapshot = await getDocs(collection(db, COLLECTIONS.RATINGS))
        const roomRatings: { [roomId: string]: number[] } = {}

        allRatingsSnapshot.forEach((doc) => {
            const rating = doc.data() as Rating
            if (!roomRatings[rating.roomId]) {
                roomRatings[rating.roomId] = []
            }
            roomRatings[rating.roomId].push(rating.score)
        })

        // 조건에 맞는 룸 필터링
        const highRatedRooms: string[] = []

        Object.entries(roomRatings).forEach(([roomId, scores]) => {
            if (scores.length >= minRatingCount) {
                const average = scores.reduce((a, b) => a + b, 0) / scores.length
                if (average >= minScore) {
                    highRatedRooms.push(roomId)
                }
            }
        })

        return highRatedRooms
    }
}