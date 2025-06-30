import {useEffect, useState} from 'react'
import {SocialService} from '@/lib/firebase/services'
import type {Notification} from '@/lib/firebase/types'
import {useAuth} from '@/contexts/AuthContext'

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
        // Implementation would update the notification in Firestore
    }

    const markAllAsRead = async () => {
        // Implementation would update all notifications in Firestore
    }

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead
    }
}