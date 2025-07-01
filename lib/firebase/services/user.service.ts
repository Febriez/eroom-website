import {addDoc, collection, doc, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {User} from '@/lib/firebase/types'
import {db} from "@/lib/firebase/config";
import {validateUsername} from '@/lib/validators';

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
        // 닉네임 변경 시 검증
        if (data.username) {
            const validation = validateUsername(data.username);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // 중복 체크
            const existingUser = await this.getUserByUsername(data.username);
            if (existingUser && existingUser.id !== id) {
                throw new Error('이미 사용 중인 닉네임입니다.');
            }
        }

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

    /**
     * 사용자 생성 시 초기 데이터 검증 및 생성
     */
    static async createUser(userData: Partial<User>): Promise<string> {
        // 필수 필드 검증
        if (!userData.uid || !userData.email || !userData.username) {
            throw new Error('필수 정보가 누락되었습니다.');
        }

        // 닉네임 검증
        const validation = validateUsername(userData.username);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        // 중복 체크
        const existingUser = await this.getUserByUsername(userData.username);
        if (existingUser) {
            throw new Error('이미 사용 중인 닉네임입니다.');
        }

        // 기본값 설정
        const newUser = {
            ...userData,
            displayName: userData.displayName || userData.username,
            level: 1,
            points: 0,
            credits: 0,
            stats: {
                mapsCompleted: 0,
                mapsCreated: 0,
                totalPlayTime: 0,
                winRate: 0,
                avgClearTime: 0
            },
            social: {
                followers: [],
                following: [],
                friends: [],
                blocked: [],
                friendCount: 0
            },
            settings: {
                privacy: {
                    profileVisibility: 'public',
                    showOnlineStatus: true,
                    allowFriendRequests: true,
                    allowMessages: 'friends'
                },
                preferences: {
                    language: 'ko',
                    theme: 'dark',
                    soundEnabled: true,
                    musicEnabled: true,
                    notificationsEnabled: true
                },
                notifications: {
                    friendRequests: true,
                    messages: true,
                    gameInvites: true,
                    updates: true,
                    marketing: false
                }
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
        };

        // BaseService에 맞는 메서드로 변경 필요
        // createDocument가 없으면 addDoc 사용
        const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
            ...newUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
        });
        return docRef.id;
    }
}