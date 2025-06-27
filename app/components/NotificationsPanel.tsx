'use client'

import {useEffect, useState} from 'react'
import {collection, doc, onSnapshot, orderBy, query, updateDoc, where} from 'firebase/firestore'
import {db} from '../lib/firebase'
import {useAuth} from '../contexts/AuthContext'
import {ArrowDown, Bell, Loader2} from 'lucide-react'
import NotificationItem from './NotificationItem'

interface Notification {
    id: string
    type: 'friend_request' | 'game_update' | 'bug_report_response'
    title: string
    message: string
    from?: string
    fromNickname?: string
    fromUserId?: string
    createdAt: any
    read: boolean
    requestId?: string
}

interface NotificationsPanelProps {
    isOpen: boolean
    onClose: () => void
}

export default function NotificationsPanel({isOpen, onClose}: NotificationsPanelProps) {
    const {user} = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshFlag, setRefreshFlag] = useState(0)

    useEffect(() => {
        if (!user || !isOpen) return

        setLoading(true)

        // 실시간 알림 구독
        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('to', '==', user.uid),
            orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsList: Notification[] = []
            snapshot.forEach((doc) => {
                notificationsList.push({
                    id: doc.id,
                    ...doc.data()
                } as Notification)
            })

            setNotifications(notificationsList)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user, isOpen, refreshFlag])

    const handleRefresh = () => {
        setRefreshFlag(prev => prev + 1)
    }

    const markAllAsRead = async () => {
        if (!user) return

        try {
            const unreadNotifications = notifications.filter(notification => !notification.read)

            for (const notification of unreadNotifications) {
                await updateDoc(doc(db, 'notifications', notification.id), {
                    read: true
                })
            }

            // 상태 업데이트
            setNotifications(prev =>
                prev.map(notification => ({...notification, read: true}))
            )
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const getUnreadCount = () => {
        return notifications.filter(notification => !notification.read).length
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 sm:items-start sm:pt-20">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-green-400"/>
                        알림 {getUnreadCount() > 0 &&
                        <span className="text-sm bg-green-500 text-black px-1.5 rounded-full">{getUnreadCount()}</span>}
                    </h3>
                    <div className="flex items-center gap-2">
                        {getUnreadCount() > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-md"
                            >
                                모두 읽음 표시
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <ArrowDown className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-2">
                    {loading ? (
                        <div className="py-10 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-green-400"/>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            알림이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    {...notification}
                                    onAction={handleRefresh}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
