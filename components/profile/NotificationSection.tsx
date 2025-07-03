// components/profile/NotificationSection.tsx
import {Bell, Mail, Settings, UserPlus, Users} from 'lucide-react'
import {formatRelativeTime} from '@/lib/utils'
import type {Notification, NotificationCategory} from '@/lib/firebase/types'

interface NotificationSectionProps {
    notifications: Notification[]
    notificationFilter: NotificationCategory
    onFilterChange: (filter: NotificationCategory) => void
    onMarkAsRead: (id: string) => void
    onOpenFriendRequests?: () => void
    currentUser: any
    router: any
}

export default function NotificationSection({
                                                notifications,
                                                notificationFilter,
                                                onFilterChange,
                                                onMarkAsRead,
                                                onOpenFriendRequests,
                                                currentUser,
                                                router
                                            }: NotificationSectionProps) {

    const getNotificationIcon = (category: NotificationCategory) => {
        switch (category) {
            case 'message':
                return <Mail className="w-4 h-4"/>
            case 'friend':
                return <Users className="w-4 h-4"/>
            case 'follow':
                return <UserPlus className="w-4 h-4"/>
            case 'system':
                return <Settings className="w-4 h-4"/>
            default:
                return <Bell className="w-4 h-4"/>
        }
    }

    const filterButtons: { id: NotificationCategory; label: string; icon?: JSX.Element }[] = [
        {id: 'all', label: '전체'},
        {id: 'message', label: '메시지', icon: <Mail className="w-3 h-3"/>},
        {id: 'friend', label: '친구', icon: <Users className="w-3 h-3"/>},
        {id: 'follow', label: '팔로우', icon: <UserPlus className="w-3 h-3"/>},
        {id: 'system', label: '시스템', icon: <Settings className="w-3 h-3"/>}
    ]

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.read) {
            await onMarkAsRead(notif.id)
        }

        // 알림 타입별 처리
        switch (notif.type) {
            case 'message':
                if (notif.data?.conversationId) {
                    router.push(`/profile/${currentUser!.username}?openChat=${notif.data.conversationId}`)
                }
                break
            case 'friend_request':
            case 'friend_request_accepted':
                if (onOpenFriendRequests) {
                    onOpenFriendRequests()
                }
                break
            case 'follow':
                if (notif.data?.senderId) {
                    // 팔로워의 프로필로 이동
                    router.push(`/profile/${notif.data.senderName || notif.data.senderId}`)
                }
                break
            default:
                // 시스템 알림 등은 특별한 동작 없음
                break
        }
    }

    return (
        <div className="relative bg-gray-900 rounded-xl p-6">
            <div className="relative z-10 flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5"/>
                    알림
                </h2>
                <div className="relative z-10 flex gap-2">
                    {filterButtons.map(button => (
                        <button
                            key={button.id}
                            onClick={() => onFilterChange(button.id)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                                notificationFilter === button.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                        >
                            {button.icon}
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative z-0 space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-lg border transition-colors ${
                                notif.read
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-gray-800/50 border-green-600/50 hover:bg-gray-800 cursor-pointer'
                            }`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400">
                                        {getNotificationIcon(notif.category || 'all')}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium mb-1">{notif.title}</h3>
                                        <p className="text-sm text-gray-400">{notif.body}</p>
                                        <p className="text-xs text-gray-500 mt-2">{formatRelativeTime(notif.createdAt)}</p>
                                    </div>
                                </div>
                                {!notif.read && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"/>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        {notificationFilter === 'all'
                            ? '알림이 없습니다'
                            : `${filterButtons.find(b => b.id === notificationFilter)?.label} 알림이 없습니다`}
                    </p>
                )}
            </div>
        </div>
    )
}