'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {
    ArrowRight,
    Bell,
    Brain,
    CheckCheck,
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
import {useConversations} from '@/lib/hooks/useConversations'
import {Avatar} from '../ui/Avatar'
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
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const {user, loading: authLoading, logout} = useAuth()
    const {notifications, unreadCount, markAllAsRead: markAllNotificationsAsRead, markAsRead} = useNotifications()
    const {
        conversations,
        totalUnreadCount,
        dismissedConversations,
        markAllConversationsAsRead,
        dismissConversation
    } = useConversations()
    const router = useRouter()

    // 표시할 최대 알림/메시지 수
    const MAX_PREVIEW_ITEMS = 5

    // user 상태 변경 감지
    useEffect(() => {
        console.log('Navigation - User state changed:', user)
    }, [user])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // 모바일 메뉴 스크롤 제어 개선
    useEffect(() => {
        if (mobileMenuOpen) {
            // 현재 스크롤 위치 저장
            const scrollY = window.scrollY;

            // body에 스타일 적용
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // 스크롤 위치 복원
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        }
    }, [mobileMenuOpen])

    const menuItems: MenuItem[] = [
        {
            title: '게임',
            submenu: [
                {name: 'EROOM', desc: 'AI 방탈출 게임', icon: <Key className="w-4 h-4"/>, href: '/games/eroom'},
                {name: '출시 예정', desc: '곧 만나보세요', icon: <Sparkles className="w-4 h-4"/>, href: '/games/upcoming'},
                {name: '업데이트', desc: '최신 소식', icon: <Globe className="w-4 h-4"/>, href: '/games/updates'}
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
                {name: '고객센터', desc: '도움이 필요하신가요?', icon: <Users className="w-4 h-4"/>, href: '/support'}
            ]
        }
    ]

    const handleLogout = async () => {
        try {
            setMobileMenuOpen(false)
            await logout()
            // logout 함수 내부에서 이미 라우팅과 새로고침을 처리함
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

    // 알림 클릭 핸들러
    const handleNotificationClick = async (notif: any) => {
        // 읽지 않은 알림이면 읽음 처리
        if (!notif.read) {
            try {
                await markAsRead(notif.id)
            } catch (error) {
                console.error('Error marking notification as read:', error)
            }
        }

        // 메시지 알림인 경우 해당 대화로 이동
        if (notif.type === 'message' && notif.data?.conversationId) {
            router.push(`/profile/${user!.username}?openChat=${notif.data.conversationId}`)
        } else {
            // 다른 알림은 프로필 페이지로 이동
            router.push(`/profile/${user!.username}`)
        }

        // 알림 프리뷰 닫기
        setShowNotifications(false)
    }

    // 받은 메시지만 필터링 (닫지 않은 것만) - useMemo로 최적화
    const receivedMessages = React.useMemo(() =>
            conversations.filter(conv =>
                conv.lastMessage &&
                conv.lastMessage.senderId !== user?.uid &&
                !dismissedConversations.has(conv.id)
            ),
        [conversations, user?.uid, dismissedConversations]
    )

    // 받은 메시지의 총 읽지 않은 수 계산
    const totalReceivedUnreadCount = React.useMemo(() => {
        return receivedMessages.reduce((total, conv) => {
            return total + (conv.unreadCount?.[user!.uid] || 0)
        }, 0)
    }, [receivedMessages, user?.uid])

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 safe-top ${
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
                        <div className="hidden lg:flex items-center h-full">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative h-full"
                                    onMouseEnter={() => setActiveMenu(index)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    <button
                                        className="h-full px-6 text-gray-300 hover:text-white font-medium transition-colors duration-200 flex items-center gap-1">
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
                                        }`}
                                        style={{marginTop: '0px'}}
                                    >
                                        <div className="p-2">
                                            {item.submenu.map((subitem, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    href={subitem.href}
                                                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-all duration-200 group"
                                                    onClick={() => setActiveMenu(null)}
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
                                            onClick={() => router.push(`/profile/${user.username}`)}
                                            className="relative p-2 sm:p-3"
                                        >
                                            <MessageSquare
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white transition-colors"/>
                                            {totalReceivedUnreadCount > 0 && (
                                                <span
                                                    className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </button>

                                        {/* Message Preview - 받은 메시지만 표시 */}
                                        <div
                                            className={`absolute top-full right-0 mt-2 w-80 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 transition-all duration-200 ${
                                                showMessages
                                                    ? 'opacity-100 visible translate-y-0 z-50'
                                                    : 'opacity-0 invisible -translate-y-2 z-40'
                                            }`}>
                                            <div className="p-4 border-b border-gray-800">
                                                <h3 className="font-semibold flex items-center justify-between">
                                                    받은 메시지
                                                    {totalReceivedUnreadCount > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAllConversationsAsRead()
                                                            }}
                                                            className="text-xs text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1"
                                                        >
                                                            <CheckCheck className="w-3 h-3"/>
                                                            모두 읽음
                                                        </button>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {receivedMessages.length > 0 ? (
                                                    <>
                                                        {receivedMessages.slice(0, MAX_PREVIEW_ITEMS).map((conversation) => {
                                                            const unreadCount = conversation.unreadCount?.[user.uid] || 0
                                                            const hasUnread = unreadCount > 0

                                                            return (
                                                                <div
                                                                    key={conversation.id}
                                                                    className={`relative p-4 hover:bg-gray-900 transition-colors ${
                                                                        hasUnread ? 'bg-gray-900' : ''
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className="flex items-start gap-3 cursor-pointer"
                                                                        onClick={() => router.push(`/profile/${user.username}?openChat=${conversation.id}`)}
                                                                    >
                                                                        <div className="relative">
                                                                            <Avatar
                                                                                src={conversation.otherParticipant?.avatarUrl}
                                                                                size="sm"
                                                                            />
                                                                            {hasUnread && (
                                                                                <span
                                                                                    className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                                                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0 pr-8">
                                                                            <div
                                                                                className="flex items-center justify-between mb-1">
                                                                                <p className="font-medium text-sm">
                                                                                    {conversation.otherParticipant?.displayName || 'Unknown'}
                                                                                </p>
                                                                            </div>
                                                                            <p className="text-sm text-gray-400 truncate">
                                                                                {conversation.lastMessage?.content || '대화를 시작하세요'}
                                                                            </p>
                                                                            <div
                                                                                className="flex items-center justify-end mt-1">
                                                                                <span className="text-xs text-gray-500">
                                                                                    {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* X 버튼 */}
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            dismissConversation(conversation.id)
                                                                        }}
                                                                        className="absolute top-2 right-2 p-1 hover:bg-gray-800 rounded transition-colors"
                                                                        title="메시지 숨기기"
                                                                    >
                                                                        <X className="w-3 h-3 text-gray-500 hover:text-white"/>
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                        {receivedMessages.length > MAX_PREVIEW_ITEMS && (
                                                            <button
                                                                onClick={() => router.push(`/profile/${user.username}`)}
                                                                className="w-full p-3 text-center text-sm text-gray-400 hover:text-green-400 hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                더보기
                                                                <ArrowRight className="w-4 h-4"/>
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                                        <p className="text-sm">받은 메시지가 없습니다</p>
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
                                            onClick={() => router.push(`/profile/${user.username}`)}
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
                                                    ? 'opacity-100 visible translate-y-0 z-50'
                                                    : 'opacity-0 invisible -translate-y-2 z-40'
                                            }`}>
                                            <div className="p-4 border-b border-gray-800">
                                                <h3 className="font-semibold flex items-center justify-between">
                                                    알림
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAllNotificationsAsRead()
                                                            }}
                                                            className="text-xs text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1"
                                                        >
                                                            <CheckCheck className="w-3 h-3"/>
                                                            모두 읽음
                                                        </button>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    <>
                                                        {notifications.slice(0, MAX_PREVIEW_ITEMS).map((notif) => {
                                                            const icon = getNotificationIcon(notif.type)
                                                            return (
                                                                <div
                                                                    key={notif.id}
                                                                    className={`p-4 hover:bg-gray-900 transition-colors cursor-pointer ${
                                                                        !notif.read ? 'bg-gray-900' : ''
                                                                    }`}
                                                                    onClick={() => handleNotificationClick(notif)}
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
                                                        })}
                                                        {notifications.length > MAX_PREVIEW_ITEMS && (
                                                            <button
                                                                onClick={() => router.push(`/profile/${user.username}`)}
                                                                className="w-full p-3 text-center text-sm text-gray-400 hover:text-green-400 hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                더보기
                                                                <ArrowRight className="w-4 h-4"/>
                                                            </button>
                                                        )}
                                                    </>
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
                                    <div
                                        className="hidden sm:block relative h-full"
                                        onMouseEnter={() => setShowProfileMenu(true)}
                                        onMouseLeave={() => setShowProfileMenu(false)}
                                    >
                                        <button
                                            className="flex items-center gap-3 px-4 sm:px-6 h-full text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                            <Avatar src={user.avatarUrl} size="sm"/>
                                            <span className="hidden sm:block">{user.displayName}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                                showProfileMenu ? 'rotate-180' : ''
                                            }`}/>
                                        </button>

                                        {/* Profile Dropdown */}
                                        <div
                                            className={`absolute top-full right-0 w-56 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 transition-all duration-200 ${
                                                showProfileMenu
                                                    ? 'opacity-100 visible translate-y-0 z-50'
                                                    : 'opacity-0 invisible -translate-y-2 z-40'
                                            }`}
                                            style={{marginTop: '0px'}}
                                        >
                                            <div className="p-2">
                                                <Link
                                                    href={`/profile/${user.username}`}
                                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition-all duration-200"
                                                    onClick={() => setShowProfileMenu(false)}
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
                                        </div>
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

                {/* Mobile Menu - 수정된 구조 */}
                <div
                    className={`lg:hidden fixed inset-0 bg-black/50 transition-all duration-300 ${
                        mobileMenuOpen ? 'opacity-100 visible z-[60]' : 'opacity-0 invisible pointer-events-none'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div
                    className={`lg:hidden fixed top-0 right-0 h-full w-[280px] bg-gray-950 transition-transform duration-300 z-[70] ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="text-lg font-bold">메뉴</h2>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    <div className="p-4 h-[calc(100%-64px)] overflow-y-auto">
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