// lib/hooks/useNotifications.ts
import {useEffect, useState} from 'react'
import {SocialService} from '@/lib/firebase/services'
import type {Notification, User} from '@/lib/firebase/types'
import {useAuth} from '@/contexts/AuthContext'
import {doc, updateDoc, writeBatch} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'

export function useNotifications() {
    const {user} = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>('default')

    // 브라우저 알림 권한 확인
    useEffect(() => {
        if ('Notification' in window) {
            setBrowserNotificationPermission(Notification.permission)
        }
    }, [])

    // 브라우저 푸시 알림 요청
    const requestBrowserNotificationPermission = async (): Promise<boolean> => {
        if (!('Notification' in window)) {
            return false
        }

        try {
            const permission = await Notification.requestPermission()
            setBrowserNotificationPermission(permission)
            return permission === 'granted'
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            return false
        }
    }

    // 브라우저 푸시 알림 표시
    const showBrowserNotification = async (notification: Notification) => {
        // 브라우저 알림 API 지원 확인
        if (!user || !('Notification' in window)) {
            return
        }

        // 권한 확인
        if (Notification.permission !== 'granted') {
            return
        }

        // 사용자 설정 확인 (최신 타입 구조에 맞춰 수정)
        const userSettings = (user as User).settings
        const shouldShowBrowserNotification = userSettings?.notifications?.browser ?? true

        if (!shouldShowBrowserNotification) {
            return
        }

        // 알림 타입별 브라우저 알림 설정 확인 (최신 타입에 맞춰 수정)
        const notificationSettings = userSettings?.notifications
        let shouldShow = false

        switch (notification.type) {
            case 'message':
                shouldShow = notificationSettings?.messages ?? true
                break
            case 'friend_request':
            case 'friend_request_accepted':
                shouldShow = notificationSettings?.friendRequests ?? true
                break
            case 'game_invite':
                shouldShow = true // 게임 초대는 기본적으로 표시
                break
            case 'achievement':
                shouldShow = notificationSettings?.achievements ?? true
                break
            case 'system':
            case 'follow':
                shouldShow = true // 시스템 알림과 팔로우는 기본적으로 표시
                break
        }

        if (!shouldShow) {
            return
        }

        // 브라우저 포커스 상태 확인 (포커스가 있으면 알림 표시 안 함)
        if (document.hasFocus()) {
            return
        }

        try {
            const browserNotification = new Notification(notification.title, {
                body: notification.body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                tag: notification.id,
                requireInteraction: false,
                silent: false,
                data: notification
            })

            // 알림 클릭 시 처리
            browserNotification.onclick = () => {
                window.focus()

                // 메시지 알림인 경우 해당 대화로 이동
                if (notification.type === 'message' && notification.data?.conversationId) {
                    window.location.href = `/profile/${user.username}?openChat=${notification.data.conversationId}`
                } else {
                    // 다른 알림은 프로필 페이지로 이동
                    window.location.href = `/profile/${user.username}`
                }

                browserNotification.close()
            }

            // 5초 후 자동으로 닫기
            setTimeout(() => {
                browserNotification.close()
            }, 5000)
        } catch (error) {
            console.error('Error showing browser notification:', error)
        }
    }

    useEffect(() => {
        if (!user) {
            setNotifications([])
            setUnreadCount(0)
            setLoading(false)
            return
        }

        let previousNotificationIds = new Set<string>()

        const unsubscribe = SocialService.subscribeToNotifications(
            user.uid,
            (notificationList) => {
                // 새로운 알림 감지
                const currentNotificationIds = new Set(notificationList.map(n => n.id))

                // 이전에 없던 새로운 알림만 찾기
                const newNotifications = notificationList.filter(n =>
                    !previousNotificationIds.has(n.id) && !n.read
                )

                // 새로운 알림이 있으면 브라우저 알림 표시
                if (newNotifications.length > 0 && previousNotificationIds.size > 0) {
                    // 가장 최근 알림만 표시
                    showBrowserNotification(newNotifications[0])
                }

                previousNotificationIds = currentNotificationIds
                // 차단된 사용자 ID 목록 (최신 타입에 맞춰 수정)
                const blockedIds = (user as User).social.blockedUsers || []
                // 차단된 사용자가 보낸 알림 제외
                const filtered = notificationList.filter(n =>
                    !(n.data?.senderId && blockedIds.includes(n.data.senderId))
                )
                setNotifications(filtered)
                setUnreadCount(filtered.filter(n => !n.read).length)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user])

    const markAsRead = async (notificationId: string) => {
        if (!user) return

        try {
            const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId)
            await updateDoc(notifRef, {
                read: true
            })
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return

        try {
            const batch = writeBatch(db)

            // 현재 읽지 않은 알림들만 읽음 처리
            const unreadNotifications = notifications.filter(n => !n.read)

            unreadNotifications.forEach((notif) => {
                const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id)
                batch.update(notifRef, {
                    read: true
                })
            })

            await batch.commit()
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const markNotificationsByConversation = async (conversationId: string) => {
        if (!user) return

        try {
            const batch = writeBatch(db)

            // 해당 대화와 관련된 메시지 알림들만 찾아서 읽음 처리
            const messageNotifications = notifications.filter(
                n => n.type === 'message' &&
                    n.data?.conversationId === conversationId &&
                    !n.read
            )

            messageNotifications.forEach((notif) => {
                const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id)
                batch.update(notifRef, {
                    read: true
                })
            })

            await batch.commit()
        } catch (error) {
            console.error('Error marking conversation notifications as read:', error)
        }
    }

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        markNotificationsByConversation,
        browserNotificationPermission,
        requestBrowserNotificationPermission
    }
}