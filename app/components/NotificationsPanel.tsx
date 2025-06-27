'use client'
'use client'

import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Link from 'next/link'

interface Notification {
    id: string
    userId: string
    title: string
    message: string
    read: boolean
    createdAt: any
    type: string
    link: string
}

interface UserProfile {
    userId: string
    nickname?: string
    // 기타 프로필 정보
}

export default function NotificationsPanel({ userProfile }: { userProfile: UserProfile | null }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userProfile?.userId) return

            try {
                const q = query(
                    collection(db, 'Notifications'),
                    where('userId', '==', userProfile.userId),
                    orderBy('createdAt', 'desc'),
                    limit(10)
                )

                const querySnapshot = await getDocs(q)
                const notificationsList: Notification[] = []

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    notificationsList.push({
                        id: doc.id,
                        userId: data.userId,
                        title: data.title,
                        message: data.message,
                        read: data.read || false,
                        createdAt: data.createdAt,
                        type: data.type || 'info',
                        link: data.link || '#'
                    })
                })

                setNotifications(notificationsList)
            } catch (error) {
                console.error('알림을 불러오는 중 오류 발생:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [userProfile])

    const markAsRead = async (notificationId: string) => {
        try {
            const notificationRef = doc(db, 'Notifications', notificationId)
            await updateDoc(notificationRef, { read: true })

            // 로컬 상태 업데이트
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            )
        } catch (error) {
            console.error('알림 읽음 표시 중 오류 발생:', error)
        }
    }

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-semibold">알림</h3>
                {notifications.length > 0 && (
                    <Link href={userProfile && userProfile.userId ? `/profile/${userProfile.userId}/notifications` : '#'}
                          className="text-xs text-green-400 hover:text-green-300">
                        모두 보기
                    </Link>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-center text-gray-400">
                        <p>알림을 불러오는 중...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p>새로운 알림이 없습니다</p>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <Link
                            href={notification.link}
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`block p-4 hover:bg-gray-800 transition-colors ${index !== notifications.length - 1 ? 'border-b border-gray-800' : ''} ${!notification.read ? 'bg-gray-800/50' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>{notification.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                </div>
                                {!notification.read && (
                                    <div
                                        className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
            {notifications.length > 5 && (
                <Link
                    href={userProfile && userProfile.userId ? `/profile/${userProfile.userId}` : '/profile'}
                    className="block text-center text-sm text-green-400 hover:text-green-300 mt-3 pt-3 border-t border-gray-800"
                >
                    모든 알림 보기
                </Link>
            )}
        </div>
    )
}
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { collection, query, where, getDocs, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Bell, Loader2, ArrowDown } from 'lucide-react'
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

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { user } = useAuth()
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
        prev.map(notification => ({ ...notification, read: true }))
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
            <Bell className="w-5 h-5 text-green-400" />
            알림 {getUnreadCount() > 0 && <span className="text-sm bg-green-500 text-black px-1.5 rounded-full">{getUnreadCount()}</span>}
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
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-2">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-green-400" />
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
