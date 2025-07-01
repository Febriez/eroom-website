// lib/firebase/services/map.service.ts
import {addDoc, collection, doc, getDoc, orderBy, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {GameMapCard} from '@/lib/firebase/types/game-map-card.types'

interface MapFilters {
    difficulty?: string
    theme?: string
    sortBy?: 'popular' | 'liked' | 'recent'
    limit?: number
}

export class MapService extends BaseService {
    /**
     * 인기 맵 가져오기
     */
    static async getPopularMaps(limit: number = 20): Promise<GameMapCard[]> {
        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                orderBy('stats.playCount', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 최신 맵 가져오기
     */
    static async getRecentMaps(limit: number = 20): Promise<GameMapCard[]> {
        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                orderBy('createdAt', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 필터링된 맵 가져오기
     */
    static async getFilteredMaps(filters: MapFilters): Promise<GameMapCard[]> {
        const constraints: any[] = [
            where('metadata.status', '==', 'published')
        ]

        // 난이도 필터
        if (filters.difficulty) {
            constraints.push(where('difficulty', '==', filters.difficulty))
        }

        // 테마 필터
        if (filters.theme) {
            constraints.push(where('theme', '==', filters.theme))
        }

        // 정렬
        switch (filters.sortBy) {
            case 'popular':
                constraints.push(orderBy('stats.playCount', 'desc'))
                break
            case 'liked':
                constraints.push(orderBy('stats.likeCount', 'desc'))
                break
            case 'recent':
            default:
                constraints.push(orderBy('createdAt', 'desc'))
                break
        }

        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            constraints,
            {limit: filters.limit || 20}
        )
    }

    /**
     * 특정 유저가 만든 맵 가져오기
     */
    static async getMapsByCreator(creatorUid: string): Promise<GameMapCard[]> {
        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('creator.uid', '==', creatorUid),
                where('metadata.status', '==', 'published'),
                orderBy('createdAt', 'desc')
            ]
        )
    }

    /**
     * 단일 맵 가져오기
     */
    static async getMap(mapId: string): Promise<GameMapCard | null> {
        const docRef = doc(db, COLLECTIONS.ROOMS, mapId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {id: docSnap.id, ...docSnap.data()} as GameMapCard
        }
        return null
    }

    /**
     * 맵 생성
     */
    static async createMap(mapData: Omit<GameMapCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTIONS.ROOMS), {
            ...mapData,
            stats: {
                // 기본값 설정 (맵 데이터에 있는 값이 우선됨)
                ...{
                    playCount: 0,
                    likeCount: 0,
                    dislikeCount: 0,
                    avgRating: 0,
                    avgClearTime: 0,
                    completionRate: 0,
                    comments: 0
                },
                ...(mapData.stats || {})
            },
            metadata: {
                // 기본값 설정 (맵 데이터에 있는 값이 우선됨)
                ...{
                    status: 'draft',
                    isAIGenerated: false,
                    isFeatured: false,
                    isOfficial: false,
                    version: '1.0.0'
                },
                ...(mapData.metadata || {})
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return docRef.id
    }

    /**
     * 맵 업데이트
     */
    static async updateMap(mapId: string, updates: Partial<GameMapCard>): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.ROOMS, mapId), {
            ...updates,
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 맵 통계 업데이트
     */
    static async updateMapStats(
        mapId: string,
        stats: Partial<GameMapCard['stats']>
    ): Promise<void> {
        const updates: any = {}

        Object.entries(stats).forEach(([key, value]) => {
            updates[`stats.${key}`] = value
        })

        await updateDoc(doc(db, COLLECTIONS.ROOMS, mapId), updates)
    }

    /**
     * 맵 검색
     */
    static async searchMaps(searchTerm: string): Promise<GameMapCard[]> {
        const lowerSearch = searchTerm.toLowerCase()

        // 이름으로 검색
        const nameResults = await this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                where('name', '>=', searchTerm),
                where('name', '<=', searchTerm + '\uf8ff')
            ],
            {limit: 20}
        )

        // 태그로 검색 (실제로는 더 복잡한 검색 로직 필요)
        const tagResults = await this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                where('tags', 'array-contains', lowerSearch)
            ],
            {limit: 20}
        )

        // 중복 제거
        const mapIds = new Set<string>()
        const results: GameMapCard[] = []
        const allResults = [...nameResults, ...tagResults]

        allResults.forEach(map => {
            if (!mapIds.has(map.id)) {
                mapIds.add(map.id)
                results.push(map)
            }
        })

        return results
    }

    /**
     * 추천 맵 가져오기
     */
    static async getFeaturedMaps(limit: number = 10): Promise<GameMapCard[]> {
        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                where('metadata.isFeatured', '==', true),
                orderBy('stats.playCount', 'desc')
            ],
            {limit}
        )
    }

    /**
     * 공식 맵 가져오기
     */
    static async getOfficialMaps(limit: number = 20): Promise<GameMapCard[]> {
        return this.queryDocuments<GameMapCard>(
            COLLECTIONS.ROOMS,
            [
                where('metadata.status', '==', 'published'),
                where('metadata.isOfficial', '==', true),
                orderBy('createdAt', 'desc')
            ],
            {limit}
        )
    }
}