import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {GameMap, LeaderboardEntry, PaginationParams, PlayRecord} from '@/lib/firebase/types'
import {
    addDoc,
    collection,
    doc,
    increment,
    QueryConstraint,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {db} from "@/lib/firebase/config";

export class GameService extends BaseService {
    static async createMap(
        map: Omit<GameMap, 'id' | 'stats' | 'createdAt' | 'updatedAt'>
    ): Promise<string> {
        const mapRef = await addDoc(collection(db, COLLECTIONS.MAPS), {
            ...map,
            stats: {
                playCount: 0,
                likeCount: 0,
                dislikeCount: 0,
                avgRating: 0,
                avgClearTime: 0,
                completionRate: 0,
                comments: 0
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return mapRef.id
    }

    static async recordPlay(
        playRecord: Omit<PlayRecord, 'id' | 'createdAt'>
    ): Promise<void> {
        await addDoc(collection(db, COLLECTIONS.PLAY_RECORDS), {
            ...playRecord,
            createdAt: serverTimestamp()
        })

        // 맵 통계 업데이트
        if (playRecord.completed && playRecord.clearTime) {
            await this.updateMapStats(playRecord.mapId, playRecord.clearTime)
        }
    }

    private static async updateMapStats(
        mapId: string,
        clearTime: number
    ): Promise<void> {
        const map = await this.getDocument<GameMap>(COLLECTIONS.MAPS, mapId)
        if (!map) return

        const playRecords = await this.queryDocuments<PlayRecord>(
            COLLECTIONS.PLAY_RECORDS,
            [
                where('mapId', '==', mapId),
                where('completed', '==', true)
            ]
        )

        const totalClearTime = playRecords.reduce((sum, record) =>
            sum + (record.clearTime || 0), 0
        )
        const completedCount = playRecords.length

        await updateDoc(doc(db, COLLECTIONS.MAPS, mapId), {
            'stats.playCount': increment(1),
            'stats.avgClearTime': completedCount > 0 ? totalClearTime / completedCount : 0,
            'stats.completionRate': (completedCount / (map.stats.playCount + 1)) * 100,
            updatedAt: serverTimestamp()
        })
    }

    static async getLeaderboard(
        type: 'global' | 'map' | 'weekly' | 'monthly',
        mapId?: string,
        pagination?: PaginationParams
    ): Promise<LeaderboardEntry[]> {
        const constraints: QueryConstraint[] = [where('type', '==', type)]

        if (mapId && type === 'map') {
            constraints.push(where('mapId', '==', mapId))
        }

        return this.queryDocuments<LeaderboardEntry>(
            COLLECTIONS.LEADERBOARD,
            constraints,
            {
                orderBy: 'score',
                direction: 'desc',
                ...pagination
            }
        )
    }
}