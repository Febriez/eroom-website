import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import type {FriendRequest, Notification} from '@/lib/firebase/types'
import {getNotificationCategory} from '@/lib/firebase/types'
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
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

    /**
     * 받은 친구 요청 목록 가져오기
     */
    static async getReceivedFriendRequests(userId: string) {
        const q = query(
            collection(db, COLLECTIONS.FRIEND_REQUESTS),
            where('to.uid', '==', userId),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FriendRequest[]
    }

    /**
     * 보낸 친구 요청 목록 가져오기
     */
    static async getSentFriendRequests(userId: string) {
        const q = query(
            collection(db, COLLECTIONS.FRIEND_REQUESTS),
            where('from.uid', '==', userId),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FriendRequest[]
    }

    /**
     * 친구 요청 수락
     */
    static async acceptFriendRequest(requestId: string, currentUserId: string, friendId: string) {
        // 1. 친구 요청 상태 업데이트
        await updateDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId), {
            status: 'accepted',
            acceptedAt: serverTimestamp()
        })

        // 2. 양쪽 사용자의 친구 목록에 추가
        const currentUserRef = doc(db, COLLECTIONS.USERS, currentUserId)
        const friendRef = doc(db, COLLECTIONS.USERS, friendId)

        await updateDoc(currentUserRef, {
            'social.friends': arrayUnion(friendId),
            'social.friendCount': increment(1)
        })

        await updateDoc(friendRef, {
            'social.friends': arrayUnion(currentUserId),
            'social.friendCount': increment(1)
        })

        // 3. 친구 정보 가져오기
        const friend = await UserService.getUserById(friendId)
        const currentUser = await UserService.getUserById(currentUserId)

        if (friend && currentUser) {
            // 4. 알림 생성
            await this.createNotification({
                recipientId: friendId,
                type: 'friend_request_accepted',
                category: 'friend',
                title: '친구 요청 수락됨',
                body: `${currentUser.displayName}님이 친구 요청을 수락했습니다.`,
                data: {
                    senderId: currentUserId,
                    senderName: currentUser.username,
                    requestId: requestId
                }
            })
        }
    }

    /**
     * 친구 요청 거절
     */
    static async rejectFriendRequest(requestId: string) {
        await updateDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId), {
            status: 'rejected',
            rejectedAt: serverTimestamp()
        })
    }

    /**
     * 친구 요청 취소
     */
    static async cancelFriendRequest(requestId: string) {
        await deleteDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId))
    }

    /**
     * 특정 사용자에게 보낸 친구 요청 확인
     */
    static async getPendingRequestToUser(fromUserId: string, toUserId: string) {
        const q = query(
            collection(db, COLLECTIONS.FRIEND_REQUESTS),
            where('from.uid', '==', fromUserId),
            where('to.uid', '==', toUserId),
            where('status', '==', 'pending')
        )

        const snapshot = await getDocs(q)
        if (snapshot.empty) return null

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        } as FriendRequest
    }

    /**
     * 특정 사용자로부터 받은 친구 요청 확인
     */
    static async getPendingRequestFromUser(toUserId: string, fromUserId: string) {
        const q = query(
            collection(db, COLLECTIONS.FRIEND_REQUESTS),
            where('to.uid', '==', toUserId),
            where('from.uid', '==', fromUserId),
            where('status', '==', 'pending')
        )

        const snapshot = await getDocs(q)
        if (snapshot.empty) return null

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        } as FriendRequest
    }

    /**
     * 친구 요청 보내기
     */
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
        const existingRequest = await this.getPendingRequestToUser(from.uid, to.uid)
        if (existingRequest) {
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
            category: 'friend',
            title: '새로운 친구 요청',
            body: `${from.displayName}님이 친구 요청을 보냈습니다.`,
            data: {
                senderId: from.uid,
                senderName: from.displayName,
                requestId: requestRef.id
            }
        })
    }

    /**
     * 친구 제거
     */
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

    /**
     * 팔로우
     */
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

        // 팔로우 알림 생성
        await this.createNotification({
            recipientId: targetId,
            type: 'follow',
            category: 'follow',
            title: '새로운 팔로워',
            body: `${follower.displayName}님이 회원님을 팔로우하기 시작했습니다.`,
            data: {
                senderId: followerId,
                senderName: follower.username
            }
        })
    }

    /**
     * 언팔로우
     */
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

    /**
     * 알림 생성
     */
    static async createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> {
        // category가 없으면 type에서 자동 추론
        const category = notification.category || getNotificationCategory(notification.type)

        // 새 알림 생성
        await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            ...notification,
            category,
            read: false,
            createdAt: serverTimestamp()
        })

        // 해당 사용자의 알림 자동 정리
        await this.cleanupUserNotifications(notification.recipientId)
    }

    /**
     * 사용자의 알림 자동 정리
     */
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

    /**
     * 친구 요청 관련 알림 삭제
     */
    static async deleteFriendRequestNotification(recipientId: string, requestId: string) {
        try {
            const q = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('recipientId', '==', recipientId),
                where('type', '==', 'friend_request'),
                where('data.requestId', '==', requestId)
            )

            const snapshot = await getDocs(q)
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
            await Promise.all(deletePromises)
        } catch (error) {
            console.error('Error deleting friend request notification:', error)
        }
    }

    /**
     * 문서 가져오기 (BaseService에서 상속받은 메소드 사용)
     */
    static async getDocument<T>(collection: string, docId: string): Promise<T | null> {
        try {
            const docRef = doc(db, collection, docId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return {id: docSnap.id, ...docSnap.data()} as T
            }
            return null
        } catch (error) {
            console.error('Error getting document:', error)
            return null
        }
    }

    /**
     * 받은 친구 요청 실시간 구독
     */
    static subscribeToReceivedFriendRequests(
        userId: string,
        callback: (requests: FriendRequest[]) => void
    ) {
        return this.subscribeToQuery<FriendRequest>(
            COLLECTIONS.FRIEND_REQUESTS,
            [
                where('to.uid', '==', userId),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            ],
            callback
        )
    }

    /**
     * 보낸 친구 요청 실시간 구독
     */
    static subscribeToSentFriendRequests(
        userId: string,
        callback: (requests: FriendRequest[]) => void
    ) {
        return this.subscribeToQuery<FriendRequest>(
            COLLECTIONS.FRIEND_REQUESTS,
            [
                where('from.uid', '==', userId),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            ],
            callback
        )
    }

    /**
     * 알림 구독
     */
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