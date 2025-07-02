import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {FriendRequest, Notification} from '@/lib/firebase/types'
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore"
import {db} from "@/lib/firebase/config"
import {UserService} from "@/lib/firebase/services/user.service"

export class SocialService extends BaseService {
    // 친구 요청
    static async sendFriendRequest(
        from: { uid: string; username: string; displayName: string },
        to: { uid: string; username: string; displayName: string }
    ): Promise<void> {
        // 이미 친구인지 확인
        const fromUser = await UserService.getUserById(from.uid)
        const toUser = await UserService.getUserById(to.uid)

        if (!fromUser || !toUser) {
            throw new Error('User not found')
        }

        if (fromUser.social.friends.includes(to.uid)) {
            throw new Error('Already friends')
        }

        // 이미 보낸 요청이 있는지 확인
        const existingRequest = await getDocs(query(
            collection(db, COLLECTIONS.FRIEND_REQUESTS),
            where('from.uid', '==', from.uid),
            where('to.uid', '==', to.uid),
            where('status', '==', 'pending')
        ))

        if (!existingRequest.empty) {
            throw new Error('Friend request already sent')
        }

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
            updateDoc(doc(db, COLLECTIONS.USERS, fromUser.id), {
                'social.friends': arrayUnion(request.to.uid),
                'social.friendCount': fromUser.social.friendCount + 1
            }),
            updateDoc(doc(db, COLLECTIONS.USERS, toUser.id), {
                'social.friends': arrayUnion(request.from.uid),
                'social.friendCount': toUser.social.friendCount + 1
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

    // 친구 요청 거절
    static async rejectFriendRequest(requestId: string): Promise<void> {
        const request = await this.getDocument<FriendRequest>(
            COLLECTIONS.FRIEND_REQUESTS,
            requestId
        )

        if (!request || request.status !== 'pending') {
            throw new Error('Invalid friend request')
        }

        await updateDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId), {
            status: 'rejected',
            respondedAt: serverTimestamp()
        })
    }

    // 친구 제거
    static async removeFriend(userId: string, friendId: string): Promise<void> {
        const user = await UserService.getUserById(userId)
        const friend = await UserService.getUserById(friendId)

        if (!user || !friend) {
            throw new Error('User not found')
        }

        await Promise.all([
            updateDoc(doc(db, COLLECTIONS.USERS, user.id), {
                'social.friends': arrayRemove(friendId),
                'social.friendCount': Math.max(0, user.social.friendCount - 1)
            }),
            updateDoc(doc(db, COLLECTIONS.USERS, friend.id), {
                'social.friends': arrayRemove(userId),
                'social.friendCount': Math.max(0, friend.social.friendCount - 1)
            })
        ])
    }

    // 팔로우
    static async followUser(followerId: string, targetId: string): Promise<void> {
        const follower = await UserService.getUserById(followerId)
        const target = await UserService.getUserById(targetId)

        if (!follower || !target) {
            throw new Error('User not found')
        }

        await Promise.all([
            updateDoc(doc(db, COLLECTIONS.USERS, follower.id), {
                'social.following': arrayUnion(targetId)
            }),
            updateDoc(doc(db, COLLECTIONS.USERS, target.id), {
                'social.followers': arrayUnion(followerId)
            })
        ])
    }

    // 언팔로우
    static async unfollowUser(followerId: string, targetId: string): Promise<void> {
        const follower = await UserService.getUserById(followerId)
        const target = await UserService.getUserById(targetId)

        if (!follower || !target) {
            throw new Error('User not found')
        }

        await Promise.all([
            updateDoc(doc(db, COLLECTIONS.USERS, follower.id), {
                'social.following': arrayRemove(targetId)
            }),
            updateDoc(doc(db, COLLECTIONS.USERS, target.id), {
                'social.followers': arrayRemove(followerId)
            })
        ])
    }

    // 알림 생성 시 자동 정리 포함
    static async createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> {
        // 새 알림 생성
        await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            ...notification,
            read: false,
            createdAt: serverTimestamp()
        })

        // 해당 사용자의 알림 자동 정리
        await this.cleanupUserNotifications(notification.recipientId)
    }

    // 사용자의 알림 자동 정리
    static async cleanupUserNotifications(userId: string): Promise<void> {
        try {
            // 3일 전 시간 계산
            const threeDaysAgo = new Date()
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
            const threeDaysAgoTimestamp = Timestamp.fromDate(threeDaysAgo)

            // 읽은 알림 중 3일 지난 것들 삭제
            const oldReadQuery = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('recipientId', '==', userId),
                where('read', '==', true),
                where('createdAt', '<', threeDaysAgoTimestamp)
            )

            const oldReadDocs = await getDocs(oldReadQuery)
            const deletePromises: Promise<void>[] = []

            oldReadDocs.forEach((doc) => {
                deletePromises.push(deleteDoc(doc.ref))
            })

            // 읽은 알림이 100개를 넘는 경우 오래된 것부터 삭제
            const readNotificationsQuery = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('recipientId', '==', userId),
                where('read', '==', true),
                orderBy('createdAt', 'desc')
            )

            const readDocs = await getDocs(readNotificationsQuery)

            if (readDocs.size > 100) {
                // 100개 이후의 알림들 삭제
                readDocs.docs.slice(100).forEach((doc) => {
                    deletePromises.push(deleteDoc(doc.ref))
                })
            }

            // 읽지 않은 알림이 20개를 넘는 경우 오래된 것부터 삭제
            const unreadNotificationsQuery = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('recipientId', '==', userId),
                where('read', '==', false),
                orderBy('createdAt', 'desc')
            )

            const unreadDocs = await getDocs(unreadNotificationsQuery)

            if (unreadDocs.size > 20) {
                // 20개 이후의 알림들 삭제
                unreadDocs.docs.slice(20).forEach((doc) => {
                    deletePromises.push(deleteDoc(doc.ref))
                })
            }

            // 모든 삭제 작업 실행
            await Promise.all(deletePromises)
        } catch (error) {
            console.error('Error cleaning up notifications:', error)
        }
    }

    static subscribeToNotifications(
        userId: string,
        callback: (notifications: Notification[]) => void
    ) {
        return this.subscribeToQuery<Notification>(
            COLLECTIONS.NOTIFICATIONS,
            [
                where('recipientId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(50) // 최대 50개까지만 가져오기
            ],
            callback
        )
    }
}