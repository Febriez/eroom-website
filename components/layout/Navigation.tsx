'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {
    Bell,
    Brain,
    ChevronDown,
    CreditCard,
    Download,
    Globe,
    Key,
    LogOut,
    Menu,
    MessageSquare,
    Shield,
    ShoppingCart,
    Sparkles,
    Star,
    User,
    Users,
    X
} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'
import {useNotifications} from '@/lib/hooks/useNotifications'
// @ts-ignore - useConversations를 아직 생성 중
import {useConversations} from '@/lib/hooks/useConversations'
import {Avatar} from '../ui/Avatar'
import {Dropdown} from '../ui/Dropdown'
import {Button} from '../ui/Button'

interface MenuItem {
    title: string
    submenu: {
        name: string
        desc: string
        icon: React.ReactNode
        href: string
    }[]
}

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeMenu, setActiveMenu] = useState<number | null>(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showMessages, setShowMessages] = useState(false)
    const {user, logout} = useAuth()
    const {notifications, unreadCount} = useNotifications()
    const {conversations, totalUnreadCount} = useConversations()
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    const menuItems: MenuItem[] = [
        {
            title: '게임',
            submenu: [
                {name: 'EROOM', desc: 'AI 방탈출 게임', icon: <Key className="w-4 h-4"/>, href: '/games/eroom'},
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

    const handleLogout = async () => {
        try {
            await logout()
            setMobileMenuOpen(false)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const formatTime = (timestamp: any) => {
        if (!timestamp) return ''

        // Firestore Timestamp를 Date로 변환
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return '방금'
        if (minutes < 60) return `${minutes}분 전`
        if (hours < 24) return `${hours}시간 전`
        return `${days}일 전`
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'friend_request':
                return {
                    icon: <Users className="w-4 h-4 text-blue-400"/>,
                    bg: 'bg-gray-800'
                }
            case 'message':
                return {
                    icon: <MessageSquare className="w-4 h-4 text-green-400"/>,
                    bg: 'bg-gray-800'
                }
            case 'game_invite':
                return {
                    icon: <Sparkles className="w-4 h-4 text-purple-400"/>,
                    bg: 'bg-gray-800'
                }
            case 'achievement':
                return {
                    icon: <Star className="w-4 h-4 text-yellow-400"/>,
                    bg: 'bg-gray-800'
                }
            default:
                return {
                    icon: <Bell className="w-4 h-4 text-gray-400"/>,
                    bg: 'bg-gray-800'
                }
        }
    }

    return (
        <>
            <nav className={`fixed w-full z-40 transition-all duration-300 safe-top ${
                scrolled ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black to-transparent'
            }`}>
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative group">
                                <div
                                    className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12 transition-all duration-300 group-hover:rotate-45">
                                    <Key
                                        className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-12 transition-all duration-300 group-hover:-rotate-45"/>
                                </div>
                                <div
                                    className="absolute inset-0 bg-green-500/30 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-2xl font-black tracking-tight">BangtalBoyBand</h1>
                                <p className="hidden sm:block text-xs text-gray-500 tracking-widest uppercase">AI Gaming
                                    Studio</p>
                            </div>
                        </Link>

                        {/* Desktop Menu with Hover */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setActiveMenu(index)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    <button
                                        className="px-6 py-8 text-gray-300 hover:text-white font-medium transition-colors duration-200 flex items-center gap-1">
                                        {item.title}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                            activeMenu === index ? 'rotate-180' : ''
                                        }`}/>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div
                                        className={`absolute top-full left-0 w-80 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 transition-all duration-200 ${
                                            activeMenu === index
                                                ? 'opacity-100 visible translate-y-0'
                                                : 'opacity-0 invisible -translate-y-2'
                                        }`}>
                                        <div className="p-2">
                                            {item.submenu.map((subitem, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    href={subitem.href}
                                                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-all duration-200 group"
                                                >
                                                    <div
                                                        className="p-2 bg-gray-800 rounded-lg text-green-400 group-hover:bg-gray-700 transition-colors">
                                                        {subitem.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                                                            {subitem.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">{subitem.desc}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {user ? (
                                <>
                                    {/* Message Button with Preview */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setShowMessages(true)}
                                        onMouseLeave={() => setShowMessages(false)}
                                    >
                                        <button
                                            onClick={() => router.push('/messages')}
                                            className="relative p-2 sm:p-3"
                                        >
                                            <MessageSquare
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white transition-colors"/>
                                            {totalUnreadCount > 0 && (
                                                <span
                                                    className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </button>

                                        {/* Message Preview */}
                                        <div
                                            className={`absolute top-full right-0 mt-2 w-80 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 transition-all duration-200 ${
                                                showMessages
                                                    ? 'opacity-100 visible translate-y-0'
                                                    : 'opacity-0 invisible -translate-y-2'
                                            }`}>
                                            <div className="p-4 border-b border-gray-800">
                                                <h3 className="font-semibold flex items-center justify-between">
                                                    메시지
                                                    <button
                                                        onClick={() => router.push(`/profile/${user.username}`)}
                                                        className="text-xs text-gray-500 hover:text-green-400 transition-colors"
                                                    >
                                                        모두 보기
                                                    </button>
                                                </h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {conversations.length > 0 ? (
                                                    conversations.slice(0, 3).map((conversation) => {
                                                        const unreadCount = conversation.unreadCount?.[user.uid] || 0
                                                        const hasUnread = unreadCount > 0

                                                        return (
                                                            <div
                                                                key={conversation.id}
                                                                className={`p-4 hover:bg-gray-900 transition-colors cursor-pointer ${
                                                                    hasUnread ? 'bg-gray-900' : ''
                                                                }`}
                                                                onClick={() => router.push(`/profile/${user.username}?openChat=${conversation.id}`)}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <Avatar
                                                                        src={conversation.otherParticipant?.avatarUrl}
                                                                        size="sm"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div
                                                                            className="flex items-center justify-between">
                                                                            <p className="font-medium text-sm">
                                                                                {conversation.otherParticipant?.displayName || 'Unknown'}
                                                                            </p>
                                                                            <span className="text-xs text-gray-500">
                                                                                {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-400 truncate mt-1">
                                                                            {conversation.lastMessage?.content || '대화를 시작하세요'}
                                                                        </p>
                                                                    </div>
                                                                    {hasUnread && (
                                                                        <span
                                                                            className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                                                            {unreadCount}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                                        <p className="text-sm">메시지가 없습니다</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Button with Preview */}
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setShowNotifications(true)}
                                        onMouseLeave={() => setShowNotifications(false)}
                                    >
                                        <button
                                            onClick={() => router.push('/notifications')}
                                            className="relative p-2 sm:p-3"
                                        >
                                            <Bell
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white transition-colors"/>
                                            {unreadCount > 0 && (
                                                <span
                                                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                            )}
                                        </button>

                                        {/* Notification Preview */}
                                        <div
                                            className={`absolute top-full right-0 mt-2 w-80 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 transition-all duration-200 ${
                                                showNotifications
                                                    ? 'opacity-100 visible translate-y-0'
                                                    : 'opacity-0 invisible -translate-y-2'
                                            }`}>
                                            <div className="p-4 border-b border-gray-800">
                                                <h3 className="font-semibold flex items-center justify-between">
                                                    알림
                                                    <button
                                                        onClick={() => router.push(`/profile/${user.username}`)}
                                                        className="text-xs text-gray-500 hover:text-green-400 transition-colors"
                                                    >
                                                        모두 보기
                                                    </button>
                                                </h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.slice(0, 3).map((notif) => {
                                                        const icon = getNotificationIcon(notif.type)
                                                        return (
                                                            <div
                                                                key={notif.id}
                                                                className={`p-4 hover:bg-gray-900 transition-colors cursor-pointer ${
                                                                    !notif.read ? 'bg-gray-900' : ''
                                                                }`}
                                                                onClick={() => router.push('/notifications')}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`p-2 ${icon.bg} rounded-lg`}>
                                                                        {icon.icon}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{notif.title}</p>
                                                                        <p className="text-sm text-gray-400 mt-1">{notif.body}</p>
                                                                        <span
                                                                            className="text-xs text-gray-500 mt-2 block">
                                                                            {formatTime(notif.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                                        <p className="text-sm">새로운 알림이 없습니다</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Menu - Desktop */}
                                    <div className="hidden sm:block">
                                        <Dropdown
                                            trigger={
                                                <button
                                                    className="flex items-center gap-3 px-4 sm:px-6 py-8 text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                                    <Avatar src={user.avatarUrl} size="sm"/>
                                                    <span className="hidden sm:block">{user.displayName}</span>
                                                    <ChevronDown className="w-4 h-4"/>
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <div className="p-2">
                                                <Link
                                                    href={`/profile/${user.username}`}
                                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition-all duration-200"
                                                >
                                                    <User className="w-5 h-5 text-green-400"/>
                                                    <span>프로필</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 text-left"
                                                >
                                                    <LogOut className="w-5 h-5 text-green-400"/>
                                                    <span>로그아웃</span>
                                                </button>
                                            </div>
                                        </Dropdown>
                                    </div>

                                    {/* User Avatar - Mobile */}
                                    <Link href={`/profile/${user.username}`} className="sm:hidden">
                                        <Avatar src={user.avatarUrl} size="sm"/>
                                    </Link>
                                </>
                            ) : (
                                <div className="hidden sm:flex items-center space-x-4">
                                    <Link href="/login"
                                          className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                        로그인
                                    </Link>
                                    <Button variant="primary" size="sm" onClick={() => router.push('/signup')}>
                                        회원가입
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden fixed inset-0 top-16 bg-gray-950 transition-all duration-300 ${
                        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}>
                    <div className="container-custom py-6 h-full overflow-y-auto scrollbar-thin">
                        {!user && (
                            <div className="flex gap-4 mb-6">
                                <Button variant="outline" fullWidth onClick={() => {
                                    router.push('/login');
                                    setMobileMenuOpen(false);
                                }}>
                                    로그인
                                </Button>
                                <Button variant="primary" fullWidth onClick={() => {
                                    router.push('/signup');
                                    setMobileMenuOpen(false);
                                }}>
                                    회원가입
                                </Button>
                            </div>
                        )}

                        {menuItems.map((item, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-lg font-bold text-green-400 mb-3">{item.title}</h3>
                                <div className="space-y-1">
                                    {item.submenu.map((subitem, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={subitem.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="text-green-400">{subitem.icon}</div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{subitem.name}</h4>
                                                <p className="text-sm text-gray-500">{subitem.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {user && (
                            <div className="pt-6 mt-6 border-t border-gray-800">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg bg-red-950 hover:bg-red-900 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 text-red-400"/>
                                    <span className="text-red-400">로그아웃</span>
                                </button>
                            </div>
                        )}

                        <div className="safe-bottom"></div>
                    </div>
                </div>
            </nav>
        </>
    )
}