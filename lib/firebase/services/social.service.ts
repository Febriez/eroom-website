import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {FriendRequest, Notification} from '@/lib/firebase/types'
import {addDoc, collection, doc, orderBy, serverTimestamp, updateDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase/config";
import {UserService} from "@/lib/firebase/services/user.service";

export class SocialService extends BaseService {
    // 친구 요청
    static async sendFriendRequest(
        from: { uid: string; username: string; displayName: string },
        to: { uid: string; username: string; displayName: string }
    ): Promise<void> {
        // 친구 요청 생성
        const requestRef = await addDoc(collection(db, COLLECTIONS.FRIEND_REQUESTS), {
            from,
            to,
            status: 'pending',
            createdAt: serverTimestamp()
        })

        // 알림 생성
        await this.createNotification({
            recipientId: to.uid,
            type: 'friend_request',
            title: '새로운 친구 요청',
            body: `${from.displayName}님이 친구 요청을 보냈습니다.`,
            data: {
                senderId: from.uid,
                senderName: from.displayName,
                requestId: requestRef.id
            }
        })
    }

    static async acceptFriendRequest(requestId: string): Promise<void> {
        const request = await this.getDocument<FriendRequest>(
            COLLECTIONS.FRIEND_REQUESTS,
            requestId
        )

        if (!request || request.status !== 'pending') {
            throw new Error('Invalid friend request')
        }

        // 양쪽 유저의 friends 배열 업데이트
        const fromUser = await UserService.getUserById(request.from.uid)
        const toUser = await UserService.getUserById(request.to.uid)

        if (!fromUser || !toUser) {
            throw new Error('User not found')
        }

        await Promise.all([
            UserService.updateUser(fromUser.id, {
                social: {
                    ...fromUser.social,
                    friends: [...fromUser.social.friends, request.to.uid],
                    friendCount: fromUser.social.friendCount + 1
                }
            }),
            UserService.updateUser(toUser.id, {
                social: {
                    ...toUser.social,
                    friends: [...toUser.social.friends, request.from.uid],
                    friendCount: toUser.social.friendCount + 1
                }
            }),
            updateDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId), {
                status: 'accepted',
                respondedAt: serverTimestamp()
            })
        ])

        // 수락 알림
        await this.createNotification({
            recipientId: request.from.uid,
            type: 'friend_request',
            title: '친구 요청 수락됨',
            body: `${request.to.displayName}님이 친구 요청을 수락했습니다.`,
            data: {
                senderId: request.to.uid,
                senderName: request.to.displayName
            }
        })
    }

    // 팔로우
    static async followUser(followerId: string, targetId: string): Promise<void> {
        const follower = await UserService.getUserById(followerId)
        const target = await UserService.getUserById(targetId)

        if (!follower || !target) {
            throw new Error('User not found')
        }

        await Promise.all([
            UserService.updateUser(follower.id, {
                social: {
                    ...follower.social,
                    following: [...follower.social.following, targetId]
                }
            }),
            UserService.updateUser(target.id, {
                social: {
                    ...target.social,
                    followers: [...target.social.followers, followerId]
                }
            })
        ])
    }

    // 알림
    static async createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> {
        await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            ...notification,
            read: false,
            createdAt: serverTimestamp()
        })
    }

    static subscribeToNotifications(
        userId: string,
        callback: (notifications: Notification[]) => void
    ) {
        return this.subscribeToQuery<Notification>(
            COLLECTIONS.NOTIFICATIONS,
            [
                where('recipientId', '==', userId),
                orderBy('createdAt', 'desc')
            ],
            callback
        )
    }
}