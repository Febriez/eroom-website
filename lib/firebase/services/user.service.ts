import {doc, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {User} from '@/lib/firebase/types'
import {db} from "@/lib/firebase/config";

export class UserService extends BaseService {
    static async getUser(uid: string): Promise<User | null> {
        const users = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [where('uid', '==', uid)]
        )
        return users[0] || null
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const users = await this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [where('username', '==', username)]
        )
        return users[0] || null
    }

    static async updateUser(id: string, data: Partial<User>): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.USERS, id), {
            ...data,
            updatedAt: serverTimestamp()
        })
    }

    static async searchUsers(searchTerm: string): Promise<User[]> {
        // Firestore doesn't support full-text search, so we search by exact username
        // In production, consider using Algolia or ElasticSearch
        return this.queryDocuments<User>(
            COLLECTIONS.USERS,
            [
                where('username', '>=', searchTerm),
                where('username', '<=', searchTerm + '\uf8ff')
            ],
            {limit: 10}
        )
    }

    static subscribeToUser(uid: string, callback: (user: User | null) => void) {
        return this.subscribeToQuery<User>(
            COLLECTIONS.USERS,
            [where('uid', '==', uid)],
            (users) => callback(users[0] || null)
        )
    }
}