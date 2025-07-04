import {collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import type {Room, RoomCard, RoomFilters, UpdateRoomStats} from '@/lib/firebase/types/room.types'
import {roomToCard} from '@/lib/firebase/types/room.types'

export class RoomService extends BaseService {

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

    // 모든 룸 가져오기
    static async getAllRooms(limitCount: number = 24): Promise<Room[]> {
        try {
            const roomsRef = collection(db, 'rooms');
            const q = query(
                roomsRef,
                orderBy('CreatedDate', 'desc'),
                limit(limitCount)
            );

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
            console.error('Error getting all rooms:', error);
            throw error;
        }
    }

    // 인기 룸 가져오기 (플레이 카운트 기준)
    static async getPopularRooms(limitCount: number = 24): Promise<Room[]> {
        try {
            const roomsRef = collection(db, 'rooms');
            const q = query(
                roomsRef,
                orderBy('PlayCount', 'desc'),
                limit(limitCount)
            );

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
            console.error('Error getting popular rooms:', error);
            throw error;
        }
    }

    // 좋아요 많은 룸 가져오기
    static async getLikedRooms(limitCount: number = 24): Promise<Room[]> {
        try {
            const roomsRef = collection(db, 'rooms');
            const q = query(
                roomsRef,
                orderBy('LikeCount', 'desc'),
                limit(limitCount)
            );

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
            console.error('Error getting liked rooms:', error);
            throw error;
        }
    }

    // 최신 룸 가져오기
    static async getRecentRooms(limitCount: number = 24): Promise<Room[]> {
        try {
            const roomsRef = collection(db, 'rooms');
            const q = query(
                roomsRef,
                orderBy('CreatedDate', 'desc'),
                limit(limitCount)
            );

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
            console.error('Error getting recent rooms:', error);
            throw error;
        }
    }

    // 룸 검색
    static async searchRooms(searchTerm: string): Promise<Room[]> {
        try {
            const roomsRef = collection(db, 'rooms');

            // Firestore는 복잡한 텍스트 검색을 지원하지 않으므로,
            // 모든 룸을 가져온 후 클라이언트에서 필터링
            const q = query(roomsRef, orderBy('CreatedDate', 'desc'));
            const querySnapshot = await getDocs(q);

            const rooms: Room[] = [];
            querySnapshot.forEach((doc) => {
                const roomData = {id: doc.id, ...doc.data()} as Room;

                // 검색 조건 확인
                const searchLower = searchTerm.toLowerCase();
                const matchesTitle = roomData.RoomTitle.toLowerCase().includes(searchLower);
                const matchesDescription = roomData.RoomDescription.toLowerCase().includes(searchLower);
                const matchesTheme = roomData.Theme.toLowerCase().includes(searchLower);
                const matchesKeywords = roomData.Keywords?.some(keyword =>
                    keyword.toLowerCase().includes(searchLower)
                );

                if (matchesTitle || matchesDescription || matchesTheme || matchesKeywords) {
                    rooms.push(roomData);
                }
            });

            return rooms;
        } catch (error) {
            console.error('Error searching rooms:', error);
            throw error;
        }
    }

    // 특정 룸 가져오기 (상세 페이지용)
    static async getRoom(roomId: string): Promise<Room | null> {
        try {
            const roomsRef = collection(db, 'rooms');
            const q = query(roomsRef, where('RoomId', '==', roomId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            } as Room;
        } catch (error) {
            console.error('Error getting room:', error);
            throw error;
        }
    }
}