import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    increment,
    orderBy,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {GameMapCard} from '@/lib/firebase/types/game-map-card.types'
import {roomToGameMapCard} from '@/lib/firebase/types/game-map-card.types'

export class MapService extends BaseService {
    /**
     * 맵(룸) 생성
     */
    static async createMap(mapData: {
        name: string
        description: string
        difficulty: string
        theme: string
        tags: string[]
        thumbnail?: string
        creatorId: string
    }): Promise<string> {
        try {
            const roomData = {
                CommentAuthorIds: [],
                CreatedDate: Timestamp.now(),
                CreatorId: mapData.creatorId,
                Difficulty: mapData.difficulty.charAt(0).toUpperCase() + mapData.difficulty.slice(1),
                Keywords: mapData.tags,
                LastUpdated: Timestamp.now(),
                LikeCount: 0,
                Objects: [],
                PlayCount: 0,
                RoomDescription: mapData.description,
                RoomId: '', // 생성 후 업데이트
                RoomPrefabUrl: '',
                RoomTitle: mapData.name,
                Theme: mapData.theme,
                Thumbnail: mapData.thumbnail || '',
                Version: 1
            }

            const docRef = await addDoc(collection(db, COLLECTIONS.ROOMS), roomData)

            // RoomId를 문서 ID로 업데이트
            await updateDoc(doc(db, COLLECTIONS.ROOMS, docRef.id), {
                RoomId: docRef.id
            })

            return docRef.id
        } catch (error) {
            console.error('Error creating room:', error)
            throw error
        }
    }

    /**
     * 맵(룸) 업데이트
     */
    static async updateMap(mapId: string, data: Partial<{
        name?: string
        description?: string
        difficulty?: string
        theme?: string
        tags?: string[]
        thumbnail?: string
    }>): Promise<void> {
        try {
            const updateData: any = {}

            if (data.name) updateData.RoomTitle = data.name
            if (data.description) updateData.RoomDescription = data.description
            if (data.difficulty) updateData.Difficulty = data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)
            if (data.theme) updateData.Theme = data.theme
            if (data.tags) updateData.Keywords = data.tags
            if (data.thumbnail) updateData.Thumbnail = data.thumbnail

            updateData.LastUpdated = Timestamp.now()

            await updateDoc(doc(db, COLLECTIONS.ROOMS, mapId), updateData)
        } catch (error) {
            console.error('Error updating room:', error)
            throw error
        }
    }

    /**
     * 맵(룸) 삭제
     */
    static async deleteMap(mapId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, COLLECTIONS.ROOMS, mapId))
        } catch (error) {
            console.error('Error deleting room:', error)
            throw error
        }
    }

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
     * 플레이 횟수 증가
     */
    static async incrementPlayCount(mapId: string): Promise<void> {
        try {
            await updateDoc(doc(db, COLLECTIONS.ROOMS, mapId), {
                PlayCount: increment(1)
            })
        } catch (error) {
            console.error('Error incrementing play count:', error)
        }
    }

    /**
     * 좋아요 토글
     */
    static async toggleLike(mapId: string, userId: string, isLiked: boolean): Promise<void> {
        try {
            await updateDoc(doc(db, COLLECTIONS.ROOMS, mapId), {
                LikeCount: increment(isLiked ? 1 : -1)
            })
        } catch (error) {
            console.error('Error toggling like:', error)
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
}