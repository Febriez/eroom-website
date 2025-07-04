import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    limit as firestoreLimit,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {Guide} from '@/lib/firebase/types/guide.types'

export class GuideService extends BaseService {
    private static isSeedingInProgress = false
    private static hasSeedingCompleted = false

    static async getAllGuides(): Promise<Guide[]> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('metadata.status', '==', 'published'),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(guidesQuery)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Guide))
    }

    static async getGuidesByCategory(category: string): Promise<Guide[]> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('category', '==', category),
            where('metadata.status', '==', 'published'),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(guidesQuery)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Guide))
    }

    static async getFeaturedGuides(limitCount: number = 6): Promise<Guide[]> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('metadata.featured', '==', true),
            where('metadata.status', '==', 'published'),
            orderBy('stats.views', 'desc'),
            firestoreLimit(limitCount)
        )

        const snapshot = await getDocs(guidesQuery)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Guide))
    }

    static async getPopularGuides(limitCount: number = 10): Promise<Guide[]> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('metadata.status', '==', 'published'),
            orderBy('stats.views', 'desc'),
            firestoreLimit(limitCount)
        )

        const snapshot = await getDocs(guidesQuery)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Guide))
    }

    static async getGuide(id: string): Promise<Guide | null> {
        const docRef = doc(db, COLLECTIONS.GUIDES, id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {id: docSnap.id, ...docSnap.data()} as Guide
        }
        return null
    }

    static async incrementViews(guideId: string): Promise<void> {
        const guideRef = doc(db, COLLECTIONS.GUIDES, guideId)
        await updateDoc(guideRef, {
            'stats.views': increment(1)
        })
    }

    static async getRelatedGuides(category: string, excludeId: string): Promise<Guide[]> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('category', '==', category),
            where('metadata.status', '==', 'published'),
            orderBy('stats.views', 'desc'),
            firestoreLimit(6)
        )

        const snapshot = await getDocs(guidesQuery)
        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Guide))
            .filter(guide => guide.id !== excludeId)
            .slice(0, 5)
    }

    static async searchGuides(searchTerm: string): Promise<Guide[]> {
        if (!searchTerm.trim()) return []

        const lowerSearch = searchTerm.toLowerCase()

        // 제목으로 검색
        const titleQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('metadata.status', '==', 'published'),
            where('title', '>=', searchTerm),
            where('title', '<=', searchTerm + '\uf8ff'),
            firestoreLimit(20)
        )

        const titleSnapshot = await getDocs(titleQuery)

        // 태그로 검색
        const tagQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            where('metadata.status', '==', 'published'),
            where('tags', 'array-contains', lowerSearch),
            firestoreLimit(20)
        )

        const tagSnapshot = await getDocs(tagQuery)

        // 중복 제거 및 병합
        const guideMap = new Map<string, Guide>()

        titleSnapshot.docs.forEach(doc => {
            guideMap.set(doc.id, {id: doc.id, ...doc.data()} as Guide)
        })

        tagSnapshot.docs.forEach(doc => {
            if (!guideMap.has(doc.id)) {
                guideMap.set(doc.id, {id: doc.id, ...doc.data()} as Guide)
            }
        })

        return Array.from(guideMap.values())
    }

    static async toggleLike(guideId: string, isLiked: boolean): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.GUIDES, guideId), {
            'stats.likes': increment(isLiked ? 1 : -1)
        })
    }

    static async toggleBookmark(guideId: string, isBookmarked: boolean): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.GUIDES, guideId), {
            'stats.bookmarks': increment(isBookmarked ? 1 : -1)
        })
    }

    static async checkGuidesExist(): Promise<boolean> {
        const guidesQuery = query(
            collection(db, COLLECTIONS.GUIDES),
            firestoreLimit(1)
        )
        const snapshot = await getDocs(guidesQuery)
        return !snapshot.empty
    }

    static async seedGuides(): Promise<boolean> {
        if (this.isSeedingInProgress || this.hasSeedingCompleted) {
            return false
        }

        const guidesExist = await this.checkGuidesExist()
        if (guidesExist) {
            this.hasSeedingCompleted = true
            return false
        }

        this.isSeedingInProgress = true

        try {
            const sampleGuides: Omit<Guide, 'id'>[] = [
                {
                    title: '가장 빠르고 정확한 오브젝트 생성법: \'한 단어\'만 입력하세요',
                    description: 'AI 매직툴에 긴 설명을 입력했는데, 오히려 이상한 물체가 생성되었나요? EROOM의 AI를 가장 잘 다루는 비법은 바로 \'단어\' 하나에 있습니다.',
                    content: `# AI는 '설명'보다 '명령'을 좋아합니다\n\n많은 유저분들이 AI에게 원하는 사물을 상세히 설명하려 합니다...`,
                    category: 'map-creation',
                    tags: ['AI', '오브젝트 생성', '맵 제작', '팁'],
                    difficulty: 'easy',
                    readTime: 5,
                    author: {
                        uid: 'system',
                        username: 'eroom_master',
                        displayName: 'eroom 운영',
                        avatarUrl: '/images/avatars/eroom-master.png'
                    },
                    stats: {
                        views: 1523,
                        likes: 342,
                        bookmarks: 156
                    },
                    metadata: {
                        featured: true,
                        status: 'published',
                        lastUpdated: Timestamp.now()
                    },
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                },
                {
                    title: '크레딧 최고의 가성비: 시즌 패스 완벽 분석',
                    description: '크레딧을 어디에 써야 할지 고민되시나요? EROOM의 핵심 보상 시스템인 \'시즌 패스\'의 모든 것을 알려드립니다.',
                    content: `# 크레딧, 어디에 써야 가장 이득일까?\n\n많은 플레이어들이 크레딧의 가장 효율적인 사용처를 궁금해합니다...`,
                    category: 'tips',
                    tags: ['시즌패스', '상점', '크레딧', '팁'],
                    difficulty: 'easy',
                    readTime: 3,
                    author: {
                        uid: 'system',
                        username: 'eroom_master',
                        displayName: 'eroom 운영',
                        avatarUrl: '/images/avatars/eroom-master.png'
                    },
                    stats: {
                        views: 892,
                        likes: 256,
                        bookmarks: 98
                    },
                    metadata: {
                        featured: true,
                        status: 'published',
                        lastUpdated: Timestamp.now()
                    },
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                }
            ]

            const promises = sampleGuides.map(guide =>
                addDoc(collection(db, COLLECTIONS.GUIDES), guide)
            )

            await Promise.all(promises)
            this.hasSeedingCompleted = true
            return true
        } catch (error) {
            console.error('Error seeding guides:', error)
            return false
        } finally {
            this.isSeedingInProgress = false
        }
    }
}