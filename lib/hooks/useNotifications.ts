// lib/hooks/useNotifications.ts
import {useEffect, useState} from 'react'
import {SocialService} from '@/lib/firebase/services'
import type {Notification} from '@/lib/firebase/types'
import {useAuth} from '@/contexts/AuthContext'
import {doc, updateDoc, writeBatch} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'

export function useNotifications() {
    const {user} = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setNotifications([])
            setUnreadCount(0)
            setLoading(false)
            return
        }

        const unsubscribe = SocialService.subscribeToNotifications(
            user.uid,
            (notificationList) => {
                setNotifications(notificationList)
                setUnreadCount(notificationList.filter(n => !n.read).length)
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
        markNotificationsByConversation
    }
}