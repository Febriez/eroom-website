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
        // 데이터베이스가 비어있으면 샘플 데이터 추가
        await this.ensureGuidesExist()

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
        await this.ensureGuidesExist()

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
        await this.ensureGuidesExist()

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
        await this.ensureGuidesExist()

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
     * 가이드 컬렉션이 비어있는지 확인하고 필요시 샘플 데이터 추가
     */
    private static async ensureGuidesExist(): Promise<void> {
        try {
            const guidesSnapshot = await getDocs(collection(db, COLLECTIONS.GUIDES))

            if (guidesSnapshot.empty) {
                await this.seedGuides()
            }
        } catch (error) {
            console.error('Error checking guides collection:', error)
        }
    }

    /**
     * 초기 가이드 데이터 시딩
     */
    static async seedGuides(): Promise<void> {
        try {
            const sampleGuides: Omit<Guide, 'id'>[] = [
                {
                    title: '가장 빠르고 정확한 오브젝트 생성법: \'한 단어\'만 입력하세요',
                    description: 'AI 매직툴에 긴 설명을 입력했는데, 오히려 이상한 물체가 생성되었나요? EROOM의 AI를 가장 잘 다루는 비법은 바로 \'단어\' 하나에 있습니다. 원하는 오브젝트를 가장 정확하게 소환하는 방법을 알려드립니다.',
                    content: `# AI는 '설명'보다 '명령'을 좋아합니다\n\n많은 유저분들이 AI에게 원하는 사물을 상세히 설명하려 합니다. 하지만 EROOM의 AI 매직툴은 다르게 작동합니다. AI는 여러분의 창작 속도를 높이는 데 최적화되어 있기 때문입니다.\n\n## 원하는 오브젝트의 이름, 딱 한 단어만 입력하세요\n\n복잡한 설명은 오히려 AI를 혼란스럽게 할 수 있습니다. 가장 빠르고 정확한 방법은, 만들고 싶은 사물의 이름을 한 단어로 입력하는 것입니다.\n\n### 좋은 예시와 나쁜 예시\n\n**상황 1: '열쇠'를 생성하고 싶을 때**\n\n- **나쁜 예시 ❌**: \`녹슨 놋쇠로 된 해골 모양의 열쇠\`\n  *(이유: AI는 '녹슨', '놋쇠', '해골' 등 너무 많은 정보에 혼란을 느껴, 각 요소가 섞인 기괴한 형태를 만들 수 있습니다.)*\n\n- **좋은 예시 ✅**: \`열쇠\`\n  *(이유: AI에게 가장 표준적이고 명확한 '열쇠' 이미지를 생성하도록 직접적으로 명령합니다. AI가 즉시 알아듣고 기본 '열쇠'를 만들어 줍니다.)*\n\n\n**상황 2: '책'을 생성하고 싶을 때**\n\n- **나쁜 예시 ❌**: \`붉은색 가죽 표지에 용이 그려진 책\`\n  *(이유: AI가 '붉은색', '가죽', '용'의 이미지를 각각 해석하여 책과 합치려다 의도와 다른 결과를 낳을 수 있습니다.)*\n\n- **좋은 예시 ✅**: \`책\`\n  *(이유: 가장 기본적인 '책' 오브젝트를 즉시 생성합니다.)*\n\n---\n\n## '선 생성, 후 편집'을 기억하세요!\n\n그렇다면 디테일은 어떻게 추가할까요? 정답은 **'후편집'**입니다.\n\n1.  먼저 \`상자\`, \`보석\`, \`칼\`처럼 **한 단어로 기본 오브젝트를 생성**하세요.\n2.  생성된 오브젝트를 선택한 후, **'수정' 또는 '재질 편집' 툴**을 사용해 색상을 바꾸거나 무늬를 입히는 것이 훨씬 빠르고 정확합니다.\n\n이 **'선 생성, 후 편집'** 방식이 바로 EROOM의 AI 매직툴을 가장 효율적으로 사용하는 비법입니다.`,
                    category: 'map-creation',
                    tags: ['AI', '오브젝트 생성', '맵 제작', '팁', '키워드'],
                    difficulty: 'easy',
                    readTime: 5,
                    author: {
                        uid: 'system',
                        username: 'eroom_master',
                        displayName: 'eroom 운영'
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
                    description: '크레딧을 어디에 써야 할지 고민되시나요? EROOM의 핵심 보상 시스템인 \'시즌 패스\'의 모든 것과, 왜 시즌 패스가 가장 가성비 좋은 선택인지 알려드립니다.',
                    content: `# 크레딧, 어디에 써야 가장 이득일까?\n\n많은 플레이어들이 크레딧의 가장 효율적인 사용처를 궁금해합니다. 정답부터 말씀드리자면, EROOM을 꾸준히 즐기는 플레이어에게 **시즌 패스**보다 더 좋은 선택은 없습니다.\n\n## 시즌 패스란 무엇인가요?\n\n시즌 패스는 일정 기간 동안 진행되는 시즌 이벤트의 보상 시스템입니다. 게임을 플레이하여 시즌 경험치(SXP)를 얻으면 패스 레벨이 오르고, 레벨마다 정해진 보상을 획득하는 방식입니다.\n\n시즌 패스에는 두 가지 보상 트랙이 있습니다.\n\n- **1. 무료 트랙**: 모든 플레이어가 레벨만 올리면 기본적으로 받을 수 있는 보상입니다.\n- **2. 프리미엄 트랙**: 크레딧으로 활성화할 수 있으며, 무료 트랙과는 비교할 수 없는 훨씬 풍성하고 가치 있는 보상들로 구성되어 있습니다.\n\n## 왜 시즌 패스가 최고의 선택일까?\n\n- **압도적인 보상량**: 프리미엄 트랙을 활성화하고 최종 레벨까지 달성하면, 투자한 크레딧의 몇 배에 달하는 가치의 아이템(한정판 스킨, 맵 제작 에셋, 다량의 크레딧 등)을 얻게 됩니다.\n\n- **시즌 한정 아이템**: 프리미엄 패스에서만 얻을 수 있는 '시즌 한정' 스킨이나 이펙트는 해당 시즌이 끝나면 다시는 얻을 수 없어 희소 가치가 매우 높습니다.\n\n- **강력한 동기 부여**: 레벨을 올릴 때마다 보상이 기다리고 있으니, 게임을 플레이하는 매 순간이 더 즐겁고 목표가 뚜렷해집니다.\n\n---\n\n**결론: '시즌 패스'는 EROOM을 꾸준히 즐기는 모든 플레이어에게 가장 현명하고 가성비 높은 크레딧 사용처입니다.**`,
                    category: 'tips',
                    tags: ['시즌패스', '상점', '크레딧', '팁', '가성비'],
                    difficulty: 'easy',
                    readTime: 3,
                    author: {
                        uid: 'system',
                        username: 'eroom_master',
                        displayName: 'eroom 운영'
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
            console.log(`Successfully seeded ${sampleGuides.length} guides`)
        } catch (error) {
            console.error('Error seeding guides:', error)
        }
    }
}