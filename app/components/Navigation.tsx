'use client'

import React, {useEffect, useState} from 'react'
import {
    Bell,
    Brain,
    ChevronDown,
    CreditCard,
    Download,
    Globe,
    Key,
    Lock,
    LogOut,
    Shield,
    ShoppingCart,
    Sparkles,
    Star,
    User,
    Users
} from 'lucide-react'
import Link from 'next/link'
import {useAuth} from '../contexts/AuthContext'
import {collection, getDocs, onSnapshot, query, where} from 'firebase/firestore'
import {db} from '../lib/firebase'

interface MenuItem {
    title: string
    submenu: {
        name: string
        desc: string
        icon: React.ReactNode
        href: string
    }[]
}

interface Notification {
    id: string
    type: 'friend_request' | 'game_update' | 'bug_report_response'
    title: string
    message: string
    from?: string
    fromNickname?: string
    createdAt: any
    read: boolean
}

interface UserProfile {
    docId: string
    uid: string
    userId: string
    email: string
    nickname: string
    bio?: string
    Username?: string
}

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const {user, logout, loading} = useAuth()

    // 알림 관련 상태
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!user) return

        // 사용자 프로필 가져오기
        const getUserProfile = async () => {
            try {
                const usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                const querySnapshot = await getDocs(usersQuery)

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0]
                    setUserProfile(userDoc.data() as UserProfile)
                }
            } catch (error) {
                console.error('Error getting user profile:', error)
            }
        }

        getUserProfile()

        // 실시간 알림 구독
        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('to', '==', user.uid)
        )

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsList: Notification[] = []
            snapshot.forEach((doc) => {
                notificationsList.push({id: doc.id, ...doc.data()} as Notification)
            })

            // 최신순 정렬
            notificationsList.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0
                const bTime = b.createdAt?.seconds || 0
                return bTime - aTime
            })

            setNotifications(notificationsList)
            setUnreadCount(notificationsList.filter(n => !n.read).length)
        })

        return () => unsubscribe()
    }, [user])

    const menuItems: MenuItem[] = [
        {
            title: '게임',
            submenu: [
                {name: 'EROOM', desc: 'AI 방탈출 게임', icon: <Lock className="w-4 h-4"/>, href: '/games/eroom'},
                {name: '출시 예정', desc: '곧 만나보세요', icon: <Sparkles className="w-4 h-4"/>, href: '/games/upcoming'},
                {name: '업데이트', desc: '최신 소식', icon: <Globe className="w-4 h-4"/>, href: '/news/updates'}
            ]
        },
        {
            title: '스토어',
            submenu: [
                {name: '크레딧 구매', desc: '게임 내 재화', icon: <CreditCard className="w-4 h-4"/>, href: '/store/credits'},
                {name: '아이템 샵', desc: '스킨 & 테마', icon: <ShoppingCart className="w-4 h-4"/>, href: '/store/items'},
                {name: '시즌 패스', desc: '프리미엄 혜택', icon: <Star className="w-4 h-4"/>, href: '/store/season-pass'}
            ]
        },
        {
            title: '커뮤니티',
            submenu: [
                {name: '맵 공유', desc: '유저 제작 맵', icon: <Users className="w-4 h-4"/>, href: '/community/maps'},
                {name: '랭킹', desc: '최고의 플레이어', icon: <Star className="w-4 h-4"/>, href: '/community/rankings'},
                {name: '가이드', desc: '게임 팁 & 공략', icon: <Brain className="w-4 h-4"/>, href: '/community/guides'}
            ]
        },
        {
            title: '지원',
            submenu: [
                {name: '다운로드', desc: 'Windows PC', icon: <Download className="w-4 h-4"/>, href: '/support/download'},
                {name: '시스템 요구사항', desc: '권장 사양', icon: <Shield className="w-4 h-4"/>, href: '/support/requirements'},
                {name: '고객센터', desc: '도움이 필요하신가요?', icon: <Users className="w-4 h-4"/>, href: '/support/help'}
            ]
        }
    ]

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'friend_request':
                return <Users className="w-4 h-4"/>
            case 'game_update':
                return <Sparkles className="w-4 h-4"/>
            case 'bug_report_response':
                return <Shield className="w-4 h-4"/>
            default:
                return <Bell className="w-4 h-4"/>
        }
    }

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-black/98 backdrop-blur-xl shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black to-transparent'
        }`}>
            <div className="max-w-screen-xl mx-auto px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-4">
                        <div className="relative group">
                            <div
                                className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12 transition-all duration-300 group-hover:rotate-45">
                                <Key
                                    className="w-7 h-7 transform -rotate-12 transition-all duration-300 group-hover:-rotate-45"/>
                            </div>
                            <div
                                className="absolute inset-0 bg-green-500/30 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">BangtalBoyBand</h1>
                            <p className="text-xs text-gray-500 tracking-widest uppercase">AI Gaming Studio</p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-1">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative" onMouseEnter={() => setActiveDropdown(index)}
                                 onMouseLeave={() => setActiveDropdown(null)}>
                                <button
                                    className="px-6 py-8 text-gray-300 hover:text-white font-medium transition-colors duration-200 flex items-center gap-1">
                                    {item.title}
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`}/>
                                </button>

                                <div
                                    className={`absolute top-full left-0 w-72 bg-gray-900/95 backdrop-blur-xl border border-green-900/30 rounded-xl shadow-2xl shadow-black/50 transition-all duration-300 ${
                                        activeDropdown === index ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
                                    }`}>
                                    <div className="p-2">
                                        {item.submenu.map((subitem, subIndex) => (
                                            <Link key={subIndex} href={subitem.href}
                                                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-900/20 transition-all duration-200 group">
                                                <div
                                                    className="p-2 bg-green-900/30 rounded-lg text-green-400 group-hover:bg-green-800/40 transition-colors">
                                                    {subitem.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">{subitem.name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{subitem.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center ml-4">
                            {loading ? (
                                <div className="px-6 py-8 text-gray-500">로딩중...</div>
                            ) : user ? (
                                <>
                                    {/* Notification Button */}
                                    <div className="relative"
                                         onMouseEnter={() => setShowNotifications(true)}
                                         onMouseLeave={() => setShowNotifications(false)}>
                                        <button className="p-3 relative">
                                            <Bell
                                                className={`w-6 h-6 ${unreadCount > 0 ? 'text-green-400' : 'text-gray-400'} hover:text-white transition-colors`}/>
                                            {unreadCount > 0 && (
                                                <div
                                                    className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                                            )}
                                        </button>

                                        <div
                                            className={`absolute top-full right-0 w-80 bg-gray-900/95 backdrop-blur-xl border border-green-900/30 rounded-xl shadow-2xl shadow-black/50 transition-all duration-300 ${
                                                showNotifications ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
                                            }`}>
                                            <div className="p-4">
                                                <h3 className="font-semibold mb-3">알림</h3>
                                                {notifications.length === 0 ? (
                                                    <p className="text-gray-500 text-sm text-center py-4">
                                                        새로운 알림이 없습니다
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                                        {notifications.slice(0, 5).map((notification) => (
                                                            <Link
                                                                key={notification.id}
                                                                href={userProfile && userProfile.userId ? `/profile/${userProfile.userId}` : '/profile'}
                                                                className={`block p-3 rounded-lg transition-all ${
                                                                    notification.read
                                                                        ? 'bg-gray-800/50 hover:bg-gray-800'
                                                                        : 'bg-green-900/30 hover:bg-green-900/40'
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="text-green-400 mt-0.5">
                                                                        {getNotificationIcon(notification.type)}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{notification.title}</p>
                                                                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                                                    </div>
                                                                    {!notification.read && (
                                                                        <div
                                                                            className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                                {notifications.length > 5 && (
                                                    <Link
                                                        href={userProfile && userProfile.userId ? `/profile/${userProfile.userId}` : '/profile'}
                                                        className="block text-center text-sm text-green-400 hover:text-green-300 mt-3 pt-3 border-t border-gray-800"
                                                    >
                                                        모든 알림 보기
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Menu */}
                                    <div className="relative"
                                         onMouseEnter={() => setShowUserMenu(true)}
                                         onMouseLeave={() => setShowUserMenu(false)}>
                                        <button
                                            className="flex items-center gap-3 px-6 py-8 text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                            <div
                                                className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5"/>
                                            </div>
                                            <span>{user.displayName || '플레이어'}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}/>
                                        </button>

                                        <div
                                            className={`absolute top-full right-0 w-64 bg-gray-900/95 backdrop-blur-xl border border-green-900/30 rounded-xl shadow-2xl shadow-black/50 transition-all duration-300 ${
                                                showUserMenu ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
                                            }`}>
                                            <div className="p-2">
                                                                                                      <Link href={userProfile && userProfile.userId ? `/profile/${userProfile.userId}` : '/profile'}
                                                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-green-900/20 transition-all duration-200">
                                                    <User className="w-5 h-5 text-green-400"/>
                                                    <span>프로필</span>
                                                </Link>
                                                <button
                                                    onClick={() => logout()}
                                                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-green-900/20 transition-all duration-200 text-left">
                                                    <LogOut className="w-5 h-5 text-green-400"/>
                                                    <span>로그아웃</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login"
                                          className="px-6 py-8 text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                        로그인
                                    </Link>
                                    <Link href="/auth/signup"
                                          className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                                        계정을 새로 만드시겠어요?
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}