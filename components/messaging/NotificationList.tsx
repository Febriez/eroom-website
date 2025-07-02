import {useState} from 'react';
import {BellOff} from 'lucide-react';
import Link from 'next/link';

type NotificationType = 'friend_request' | 'game_invite' | 'achievement' | 'system';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
}

interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
}

export default function NotificationList({
                                             notifications,
                                             onMarkAsRead,
                                             onMarkAllAsRead,
                                             onClearAll
                                         }: NotificationListProps) {
    const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');

    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : notifications.filter(notification => notification.type === activeFilter);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'friend_request':
                return '👤';
            case 'game_invite':
                return '🎮';
            case 'achievement':
                return '🏆';
            case 'system':
                return '🔔';
            default:
                return '📢';
        }
    };

    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case 'friend_request':
                return 'bg-blue-100';
            case 'game_invite':
                return 'bg-green-100';
            case 'achievement':
                return 'bg-yellow-100';
            case 'system':
                return 'bg-gray-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-h-[500px] flex flex-col"
             style={{width: '320px'}}>
            <div className="p-3 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">알림</h3>
                    {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}개 새 알림
            </span>
                    )}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="space-x-1 text-xs">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-2 py-1 rounded ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setActiveFilter('friend_request')}
                            className={`px-2 py-1 rounded ${activeFilter === 'friend_request' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            친구
                        </button>
                        <button
                            onClick={() => setActiveFilter('game_invite')}
                            className={`px-2 py-1 rounded ${activeFilter === 'game_invite' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            게임
                        </button>
                    </div>
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        모두 읽음
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-grow">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                        <BellOff className="mb-2" size={24}/>
                        <p>알림이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {filteredNotifications.map((notification) => (
                            <li key={notification.id} className={notification.read ? '' : 'bg-blue-50'}>
                                {notification.read ? (
                                    // 읽은 알림은 그냥 div로 표시 (클릭 기능 없음)
                                    <div className="p-3">
                                        <div className="flex">
                                            <div
                                                className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center mr-3`}>
                                                <span
                                                    className="text-lg">{getNotificationIcon(notification.type)}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                                <p className="text-xs text-gray-600">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // 읽지 않은 알림만 클릭 가능
                                    <Link
                                        href={notification.actionUrl || '#'}
                                        className="block p-3 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => onMarkAsRead(notification.id)}
                                    >
                                        <div className="flex">
                                            <div
                                                className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center mr-3`}>
                                                <span
                                                    className="text-lg">{getNotificationIcon(notification.type)}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                                <p className="text-xs text-gray-600">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {filteredNotifications.length > 0 && (
                <div className="p-2 border-t text-center">
                    <button
                        onClick={onClearAll}
                        className="text-xs text-gray-600 hover:text-gray-800"
                    >
                        모든 알림 삭제
                    </button>
                </div>
            )}
        </div>
    );
}