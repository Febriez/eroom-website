// lib/firebase/services/guide.service.ts
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {Guide} from '@/lib/firebase/types/guide.types'

export class GuideService extends BaseService {
    /**
     * 모든 가이드 가져오기
     */
    static async getAllGuides(): Promise<Guide[]> {
        return this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('metadata.status', '==', 'published'),
                orderBy('createdAt', 'desc')
            ]
        )
    }

    /**
     * 카테고리별 가이드 가져오기
     */
    static async getGuidesByCategory(category: string): Promise<Guide[]> {
        return this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('category', '==', category),
                where('metadata.status', '==', 'published'),
                orderBy('createdAt', 'desc')
            ]
        )
    }

    /**
     * 추천 가이드 가져오기
     */
    static async getFeaturedGuides(limit: number = 6): Promise<Guide[]> {
        return this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('metadata.featured', '==', true),
                where('metadata.status', '==', 'published'),
                orderBy('stats.views', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 인기 가이드 가져오기
     */
    static async getPopularGuides(limit: number = 10): Promise<Guide[]> {
        return this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('metadata.status', '==', 'published'),
                orderBy('stats.views', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 단일 가이드 가져오기
     */
    static async getGuide(id: string): Promise<Guide | null> {
        const docRef = doc(db, COLLECTIONS.GUIDES, id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            // 조회수 증가
            await updateDoc(docRef, {
                'stats.views': increment(1)
            })

            return {id: docSnap.id, ...docSnap.data()} as Guide
        }
        return null
    }

    /**
     * 가이드 검색
     */
    static async searchGuides(searchTerm: string): Promise<Guide[]> {
        const lowerSearch = searchTerm.toLowerCase()

        // 제목으로 검색
        const guidesByTitle = await this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('metadata.status', '==', 'published'),
                where('title', '>=', searchTerm),
                where('title', '<=', searchTerm + '\uf8ff')
            ],
            {limit: 20}
        )

        // 태그로 검색
        const guidesByTag = await this.queryDocuments<Guide>(
            COLLECTIONS.GUIDES,
            [
                where('metadata.status', '==', 'published'),
                where('tags', 'array-contains', lowerSearch)
            ],
            {limit: 20}
        )

        // 중복 제거
        const guideIds = new Set<string>()
        const results: Guide[] = []

        // 두 결과 배열 병합 및 중복 제거
        const combinedGuides = [...guidesByTitle, ...guidesByTag];
        combinedGuides.forEach(guide => {
            if (!guideIds.has(guide.id)) {
                guideIds.add(guide.id)
                results.push(guide)
            }
        })

        return results
    }

    /**
     * 좋아요 토글
     */
    static async toggleLike(guideId: string, isLiked: boolean): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.GUIDES, guideId), {
            'stats.likes': increment(isLiked ? 1 : -1)
        })
    }

    /**
     * 북마크 토글
     */
    static async toggleBookmark(guideId: string, isBookmarked: boolean): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.GUIDES, guideId), {
            'stats.bookmarks': increment(isBookmarked ? 1 : -1)
        })
    }

    /**
     * 초기 가이드 데이터 시딩
     */
    static async seedGuides(): Promise<void> {
        try {
            const existingGuides = await getDocs(collection(db, COLLECTIONS.GUIDES))

            if (!existingGuides.empty) {
                console.log('Guides collection already has data')
                return
            }

            const sampleGuides: Omit<Guide, 'id'>[] = [
                {
                    title: '초보자를 위한 EROOM 시작 가이드',
                    description: 'EROOM을 처음 시작하는 플레이어를 위한 완벽한 입문 가이드',
                    content: `# EROOM 시작하기\n\n## 게임 소개\nEROOM은 AI가 생성하는 독특한 방탈출 게임입니다...\n\n## 기본 조작법\n- WASD: 이동\n- 마우스: 시점 이동\n- E: 상호작용\n- Tab: 인벤토리`,
                    category: 'beginner',
                    tags: ['초보자', '시작하기', '기본'],
                    difficulty: 'easy',
                    readTime: 5,
                    author: {
                        uid: 'system',
                        username: 'eroom_team',
                        displayName: 'EROOM Team'
                    },
                    stats: {
                        views: 15234,
                        likes: 892,
                        bookmarks: 234
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
                    title: '완벽한 맵 만들기: 제작자 가이드',
                    description: '인기 있는 맵을 만드는 비결과 맵 에디터 활용법',
                    content: `# 맵 제작 마스터하기\n\n## 맵 에디터 소개\n맵 에디터의 모든 기능을 알아봅시다...\n\n## 퍼즐 디자인 원칙\n좋은 퍼즐의 조건은...`,
                    category: 'map-creation',
                    tags: ['맵제작', '에디터', '퍼즐디자인'],
                    difficulty: 'medium',
                    readTime: 10,
                    author: {
                        uid: 'system',
                        username: 'master_creator',
                        displayName: '마스터 크리에이터'
                    },
                    stats: {
                        views: 8932,
                        likes: 567,
                        bookmarks: 189
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
                    title: '고급 탈출 전략과 스피드런 팁',
                    description: '프로 플레이어들의 비밀 전략을 공개합니다',
                    content: `# 프로처럼 플레이하기\n\n## 스피드런의 기초\n시간을 단축하는 핵심 전략...\n\n## 숨겨진 단축키와 팁\n알려지지 않은 꿀팁들...`,
                    category: 'advanced',
                    tags: ['고급', '스피드런', '전략'],
                    difficulty: 'hard',
                    readTime: 15,
                    author: {
                        uid: 'system',
                        username: 'speedrun_pro',
                        displayName: '스피드런 프로'
                    },
                    stats: {
                        views: 5678,
                        likes: 432,
                        bookmarks: 156
                    },
                    metadata: {
                        featured: false,
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
            console.log(`Successfully seeded ${sampleGuides.length} guides`)
        } catch (error) {
            console.error('Error seeding guides:', error)
        }
    }
}