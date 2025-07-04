import {addDoc, collection, doc, getDoc, orderBy, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {
    CreateRoomData,
    Room,
    RoomCard,
    RoomFilters,
    UpdateRoomData,
    UpdateRoomStats
} from '@/lib/firebase/types/room.types'
import {roomToCard} from '@/lib/firebase/types/room.types'

export class RoomService extends BaseService {
    /**
     * 인기 룸 가져오기
     */
    static async getPopularRooms(limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 최신 룸 가져오기
     */
    static async getRecentRooms(limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                orderBy('CreatedDate', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 좋아요 많은 룸 가져오기
     */
    static async getLikedRooms(limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                orderBy('LikeCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 필터링된 룸 가져오기
     */
    static async getFilteredRooms(filters: RoomFilters): Promise<RoomCard[]> {
        const constraints: any[] = []

        // 난이도 필터
        if (filters.difficulty) {
            const difficultyMap = {
                'easy': 'Easy',
                'normal': 'Normal',
                'hard': 'Hard'
            }
            constraints.push(where('Difficulty', '==', difficultyMap[filters.difficulty]))
        }

        // 테마 필터
        if (filters.theme) {
            constraints.push(where('Theme', '==', filters.theme))
        }

        // 키워드 필터
        if (filters.keywords && filters.keywords.length > 0) {
            constraints.push(where('Keywords', 'array-contains-any', filters.keywords))
        }

        // 정렬
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

        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            constraints,
            {limit: filters.limit || 20}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 특정 유저가 만든 룸 가져오기
     */
    static async getRoomsByCreator(creatorId: string): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('CreatorId', '==', creatorId),
                orderBy('CreatedDate', 'desc')
            ]
        )
        return rooms.map(roomToCard)
    }

    /**
     * 단일 룸 가져오기
     */
    static async getRoom(roomId: string): Promise<Room | null> {
        const docRef = doc(db, COLLECTIONS.ROOMS, roomId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {id: docSnap.id, ...docSnap.data()} as Room
        }
        return null
    }

    /**
     * 단일 룸 카드 가져오기
     */
    static async getRoomCard(roomId: string): Promise<RoomCard | null> {
        const room = await this.getRoom(roomId)
        return room ? roomToCard(room) : null
    }

    /**
     * 룸 생성
     */
    static async createRoom(roomData: CreateRoomData): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTIONS.ROOMS), {
            ...roomData,
            RoomId: crypto.randomUUID(), // 게임 내부 UUID 생성
            PlayCount: 0,
            LikeCount: 0,
            CommentAuthorIds: [],
            Version: 1,
            CreatedDate: serverTimestamp(),
            LastUpdated: serverTimestamp()
        })

        return docRef.id
    }

    /**
     * 룸 업데이트
     */
    static async updateRoom(roomId: string, updates: UpdateRoomData): Promise<void> {
        const updateData: any = {
            ...updates,
            LastUpdated: serverTimestamp()
        }

        // 버전 업데이트
        if (updates.Version) {
            updateData.Version = updates.Version
        } else {
            // 버전이 명시되지 않은 경우 자동 증가
            const currentRoom = await this.getRoom(roomId)
            if (currentRoom) {
                updateData.Version = currentRoom.Version + 1
            }
        }

        await updateDoc(doc(db, COLLECTIONS.ROOMS, roomId), updateData)
    }

    /**
     * 룸 통계 업데이트
     */
    static async updateRoomStats(
        roomId: string,
        stats: UpdateRoomStats
    ): Promise<void> {
        const updates: any = {
            LastUpdated: serverTimestamp()
        }

        if (stats.PlayCount !== undefined) {
            updates.PlayCount = stats.PlayCount
        }

        if (stats.LikeCount !== undefined) {
            updates.LikeCount = stats.LikeCount
        }

        if (stats.CommentAuthorIds !== undefined) {
            updates.CommentAuthorIds = stats.CommentAuthorIds
        }

        await updateDoc(doc(db, COLLECTIONS.ROOMS, roomId), updates)
    }

    /**
     * 플레이 카운트 증가
     */
    static async incrementPlayCount(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if (room) {
            await this.updateRoomStats(roomId, {
                PlayCount: room.PlayCount + 1
            })
        }
    }

    /**
     * 좋아요 카운트 증가
     */
    static async incrementLikeCount(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if (room) {
            await this.updateRoomStats(roomId, {
                LikeCount: room.LikeCount + 1
            })
        }
    }

    /**
     * 좋아요 카운트 감소
     */
    static async decrementLikeCount(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if (room && room.LikeCount > 0) {
            await this.updateRoomStats(roomId, {
                LikeCount: room.LikeCount - 1
            })
        }
    }

    /**
     * 댓글 작성자 추가
     */
    static async addCommentAuthor(roomId: string, authorId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if (room) {
            const commentAuthorIds = room.CommentAuthorIds || []
            if (!commentAuthorIds.includes(authorId)) {
                commentAuthorIds.push(authorId)
                await this.updateRoomStats(roomId, {
                    CommentAuthorIds: commentAuthorIds
                })
            }
        }
    }

    /**
     * 댓글 작성자 제거
     */
    static async removeCommentAuthor(roomId: string, authorId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if (room) {
            const commentAuthorIds = room.CommentAuthorIds || []
            const updatedIds = commentAuthorIds.filter(id => id !== authorId)
            await this.updateRoomStats(roomId, {
                CommentAuthorIds: updatedIds
            })
        }
    }

    /**
     * 룸 검색
     */
    static async searchRooms(searchTerm: string): Promise<RoomCard[]> {
        const lowerSearch = searchTerm.toLowerCase()

        // 제목으로 검색
        const titleResults = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('RoomTitle', '>=', searchTerm),
                where('RoomTitle', '<=', searchTerm + '\uf8ff')
            ],
            {limit: 20}
        )

        // 키워드로 검색
        const keywordResults = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('Keywords', 'array-contains', lowerSearch)
            ],
            {limit: 20}
        )

        // 테마로 검색
        const themeResults = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('Theme', '>=', searchTerm),
                where('Theme', '<=', searchTerm + '\uf8ff')
            ],
            {limit: 20}
        )

        // 중복 제거
        const roomIds = new Set<string>()
        const results: Room[] = []
        const allResults = [...titleResults, ...keywordResults, ...themeResults]

        allResults.forEach(room => {
            if (!roomIds.has(room.id)) {
                roomIds.add(room.id)
                results.push(room)
            }
        })

        return results.map(roomToCard)
    }

    /**
     * 테마별 룸 가져오기
     */
    static async getRoomsByTheme(theme: string, limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('Theme', '==', theme),
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 난이도별 룸 가져오기
     */
    static async getRoomsByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard', limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('Difficulty', '==', difficulty),
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 특정 키워드를 포함하는 룸 가져오기
     */
    static async getRoomsByKeywords(keywords: string[], limit: number = 20): Promise<RoomCard[]> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('Keywords', 'array-contains-any', keywords),
                orderBy('PlayCount', 'desc')
            ],
            {limit}
        )
        return rooms.map(roomToCard)
    }

    /**
     * 룸 ID로 게임 내부 UUID 가져오기
     */
    static async getRoomUUID(roomId: string): Promise<string | null> {
        const room = await this.getRoom(roomId)
        return room ? room.RoomId : null
    }

    /**
     * 게임 내부 UUID로 룸 찾기
     */
    static async getRoomByUUID(roomUUID: string): Promise<Room | null> {
        const rooms = await this.queryDocuments<Room>(
            COLLECTIONS.ROOMS,
            [
                where('RoomId', '==', roomUUID)
            ],
            {limit: 1}
        )
        return rooms.length > 0 ? rooms[0] : null
    }
}