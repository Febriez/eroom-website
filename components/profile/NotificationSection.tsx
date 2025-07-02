// components/profile/NotificationSection.tsx
import {Bell} from 'lucide-react'
import {formatRelativeTime} from '@/lib/utils'
import type {Notification} from '@/lib/firebase/types'

interface NotificationSectionProps {
    notifications: Notification[]
    notificationFilter: 'all' | 'read' | 'unread'
    onFilterChange: (filter: 'all' | 'read' | 'unread') => void
    onMarkAsRead: (id: string) => void
    currentUser: any
    router: any
}

export default function NotificationSection({
                                                notifications,
                                                notificationFilter,
                                                onFilterChange,
                                                onMarkAsRead,
                                                currentUser,
                                                router
                                            }: NotificationSectionProps) {
    return (
        <div className="relative bg-gray-900 rounded-xl p-6">
            <div className="relative z-10 flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5"/>
                    알림
                </h2>
                <div className="relative z-10 flex gap-2">
                    <button
                        onClick={() => onFilterChange('all')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            notificationFilter === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => onFilterChange('unread')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            notificationFilter === 'unread'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        읽지 않음
                    </button>
                    <button
                        onClick={() => onFilterChange('read')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            notificationFilter === 'read'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        읽음
                    </button>
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
                            onClick={async () => {
                                if (!notif.read) {
                                    await onMarkAsRead(notif.id)
                                    if (notif.type === 'message' && notif.data?.conversationId) {
                                        router.push(`/profile/${currentUser!.username}?openChat=${notif.data.conversationId}`)
                                    }
                                }
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium mb-1">{notif.title}</h3>
                                    <p className="text-sm text-gray-400">{notif.body}</p>
                                    <p className="text-xs text-gray-500 mt-2">{formatRelativeTime(notif.createdAt)}</p>
                                </div>
                                {!notif.read && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"/>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        {notificationFilter === 'unread'
                            ? '새로운 알림이 없습니다'
                            : notificationFilter === 'read'
                                ? '읽은 알림이 없습니다'
                                : '알림이 없습니다'}
                    </p>
                )}
            </div>
        </div>
    )
}