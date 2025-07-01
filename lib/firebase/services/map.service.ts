import {collection, doc, getDoc, getDocs, orderBy, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {GameMapCard} from '@/lib/firebase/types/game-map-card.types'
import {roomToGameMapCard} from '@/lib/firebase/types/game-map-card.types'

/**
 * 읽기 전용 맵 서비스
 * Room 컬렉션에서 게임 맵 데이터를 조회만 합니다
 */
export class MapService extends BaseService {
    /**
     * 단일 맵(룸) 가져오기
     */
    static async getMap(mapId: string): Promise<GameMapCard | null> {
        try {
            const docRef = doc(db, COLLECTIONS.ROOMS, mapId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return roomToGameMapCard({id: docSnap.id, ...docSnap.data()})
            }
            return null
        } catch (error) {
            console.error('Error getting room:', error)
            return null
        }
    }

    /**
     * 추천 맵 가져오기 (PlayCount가 높은 룸들)
     */
    static async getFeaturedMaps(limit: number = 12): Promise<GameMapCard[]> {
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                orderBy('PlayCount', 'desc'),
                orderBy('LikeCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 인기 맵 가져오기
     */
    static async getPopularMaps(limit: number = 12): Promise<GameMapCard[]> {
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 최신 맵 가져오기
     */
    static async getRecentMaps(limit: number = 12): Promise<GameMapCard[]> {
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                orderBy('CreatedDate', 'desc')
            ],
            {limit}
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 사용자가 만든 맵 가져오기
     */
    static async getUserMaps(uid: string): Promise<GameMapCard[]> {
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                where('CreatorId', '==', uid),
                orderBy('CreatedDate', 'desc')
            ]
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 맵 검색
     */
    static async searchMaps(searchTerm: string): Promise<GameMapCard[]> {
        try {
            const lowerSearch = searchTerm.toLowerCase()

            // 제목으로 검색
            const roomsByTitle = await this.queryDocuments<any>(
                COLLECTIONS.ROOMS,
                [
                    where('RoomTitle', '>=', searchTerm),
                    where('RoomTitle', '<=', searchTerm + '\uf8ff')
                ],
                {limit: 20}
            )

            // 키워드로 검색
            const roomsByKeyword = await this.queryDocuments<any>(
                COLLECTIONS.ROOMS,
                [
                    where('Keywords', 'array-contains', lowerSearch)
                ],
                {limit: 20}
            )

            // 중복 제거 후 반환
            const roomIds = new Set<string>()
            const results: any[] = []

            const allRooms = [...roomsByTitle, ...roomsByKeyword]
            allRooms.forEach((room) => {
                if (!roomIds.has(room.id)) {
                    roomIds.add(room.id)
                    results.push(room)
                }
            })

            return results.map(room => roomToGameMapCard(room))
        } catch (error) {
            console.error('Error searching rooms:', error)
            return []
        }
    }

    /**
     * 난이도별 맵 가져오기
     */
    static async getMapsByDifficulty(difficulty: string, limit: number = 12): Promise<GameMapCard[]> {
        const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                where('Difficulty', '==', capitalizedDifficulty),
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 테마별 맵 가져오기
     */
    static async getMapsByTheme(theme: string, limit: number = 12): Promise<GameMapCard[]> {
        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            [
                where('Theme', '==', theme),
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 실시간 맵 구독
     */
    static subscribeToMaps(
        filter: 'featured' | 'popular' | 'new',
        callback: (maps: GameMapCard[]) => void
    ) {
        let constraints: any[] = []

        switch (filter) {
            case 'featured':
            case 'popular':
                constraints.push(orderBy('PlayCount', 'desc'))
                break
            case 'new':
                constraints.push(orderBy('CreatedDate', 'desc'))
                break
        }

        return this.subscribeToQuery<any>(
            COLLECTIONS.ROOMS,
            constraints,
            (rooms) => {
                const gameMaps = rooms.map(room => roomToGameMapCard(room))
                callback(gameMaps)
            }
        )
    }

    /**
     * 여러 필터를 조합한 맵 가져오기
     */
    static async getFilteredMaps(filters: {
        difficulty?: string
        theme?: string
        sortBy?: 'popular' | 'recent' | 'liked'
        limit?: number
    }): Promise<GameMapCard[]> {
        const constraints: any[] = []

        if (filters.difficulty) {
            const capitalizedDifficulty = filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)
            constraints.push(where('Difficulty', '==', capitalizedDifficulty))
        }

        if (filters.theme) {
            constraints.push(where('Theme', '==', filters.theme))
        }

        // 정렬 조건
        switch (filters.sortBy) {
            case 'popular':
                constraints.push(orderBy('PlayCount', 'desc'))
                break
            case 'liked':
                constraints.push(orderBy('LikeCount', 'desc'))
                break
            case 'recent':
            default:
                constraints.push(orderBy('CreatedDate', 'desc'))
                break
        }

        const rooms = await this.queryDocuments<any>(
            COLLECTIONS.ROOMS,
            constraints,
            {limit: filters.limit || 12}
        )

        return rooms.map(room => roomToGameMapCard(room))
    }

    /**
     * 전체 맵 개수 가져오기
     */
    static async getTotalMapCount(): Promise<number> {
        try {
            const snapshot = await getDocs(collection(db, COLLECTIONS.ROOMS))
            return snapshot.size
        } catch (error) {
            console.error('Error getting total map count:', error)
            return 0
        }
    }

    /**
     * 특정 테마의 맵 개수 가져오기
     */
    static async getMapCountByTheme(theme: string): Promise<number> {
        try {
            const q = await getDocs(
                collection(db, COLLECTIONS.ROOMS)
            )
            return q.docs.filter(doc => doc.data().Theme === theme).length
        } catch (error) {
            console.error('Error getting map count by theme:', error)
            return 0
        }
    }
}