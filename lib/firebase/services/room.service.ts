import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {Room, RoomCard, RoomFilters, UpdateRoomStats} from '@/lib/firebase/types/room.types'
import {roomToCard} from '@/lib/firebase/types/room.types'

export class RoomService extends BaseService {

    /**
     * 공통 룸 쿼리 실행 헬퍼 메서드
     */
    private static async executeRoomQuery(
        constraints: QueryConstraint[],
        limitCount?: number
    ): Promise<Room[]> {
        try {
            const roomsRef = collection(db, COLLECTIONS.ROOMS);
            const queryConstraints = limitCount
                ? [...constraints, limit(limitCount)]
                : constraints;

            const q = query(roomsRef, ...queryConstraints);
            const querySnapshot = await getDocs(q);

            const rooms: Room[] = [];
            querySnapshot.forEach((doc) => {
                rooms.push({
                    id: doc.id,
                    ...doc.data()
                } as Room);
            });

            return rooms;
        } catch (error) {
            console.error('Error executing room query:', error);
            throw error;
        }
    }

    /**
     * 필터링된 룸 가져오기
     */
    static async getFilteredRooms(filters: RoomFilters): Promise<RoomCard[]> {
        const constraints: QueryConstraint[] = []

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
     * 단일 룸 카드 가져오기
     */
    static async getRoomCard(roomId: string): Promise<RoomCard | null> {
        const room = await this.getRoom(roomId)
        return room ? roomToCard(room) : null
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

    /**
     * 모든 룸 가져오기
     */
    static async getAllRooms(limitCount: number = 24): Promise<Room[]> {
        return this.executeRoomQuery([
            orderBy('CreatedDate', 'desc')
        ], limitCount);
    }

    /**
     * 인기 룸 가져오기 (플레이 카운트 기준)
     */
    static async getPopularRooms(limitCount: number = 24): Promise<Room[]> {
        return this.executeRoomQuery([
            orderBy('PlayCount', 'desc')
        ], limitCount);
    }

    /**
     * 좋아요 많은 룸 가져오기
     */
    static async getLikedRooms(limitCount: number = 24): Promise<Room[]> {
        return this.executeRoomQuery([
            orderBy('LikeCount', 'desc')
        ], limitCount);
    }

    /**
     * 최신 룸 가져오기
     */
    static async getRecentRooms(limitCount: number = 24): Promise<Room[]> {
        return this.executeRoomQuery([
            orderBy('CreatedDate', 'desc')
        ], limitCount);
    }

    /**
     * 룸 검색
     */
    static async searchRooms(searchTerm: string): Promise<Room[]> {
        const allRooms = await this.executeRoomQuery([
            orderBy('CreatedDate', 'desc')
        ]);

        // 검색 조건 적용
        const searchLower = searchTerm.toLowerCase();
        return allRooms.filter(room => {
            const matchesTitle = room.RoomTitle.toLowerCase().includes(searchLower);
            const matchesDescription = room.RoomDescription.toLowerCase().includes(searchLower);
            const matchesTheme = room.Theme.toLowerCase().includes(searchLower);
            const matchesKeywords = room.Keywords?.some(keyword =>
                keyword.toLowerCase().includes(searchLower)
            );

            return matchesTitle || matchesDescription || matchesTheme || matchesKeywords;
        });
    }

    /**
     * 특정 룸 가져오기 (Firestore 문서 ID로)
     */
    static async getRoom(roomId: string): Promise<Room | null> {
        try {
            const docRef = doc(db, COLLECTIONS.ROOMS, roomId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as Room;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting room:', error);
            throw error;
        }
    }
}