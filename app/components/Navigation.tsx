'use client'

import Link from 'next/link'
import {Bell, Menu, Search, X} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {collection, getDocs, query, where} from 'firebase/firestore'
import {db} from '../lib/firebase'
import NotificationsPanel from './NotificationsPanel'

interface UserProfile {
    userId: string
    nickname: string
    email: string
    // 기타 필요한 프로필 데이터
}

export default function Navigation() {
    const {user, logout} = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const notificationsPanelRef = useRef<HTMLDivElement>(null)
    const bellIconRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 유저 프로필 정보 불러오기
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const q = query(collection(db, 'User'), where('uid', '==', user.uid))
                    const querySnapshot = await getDocs(q)

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data() as UserProfile
                        setUserProfile(userData)
                    } else {
                        console.log('No user profile found')
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error)
                }
            }
            setLoading(false)
        }

        fetchUserProfile()
    }, [user])

    useEffect(() => {
        // 알림 패널 외부 클릭 감지
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationsPanelRef.current &&
                !notificationsPanelRef.current.contains(event.target as Node) &&
                bellIconRef.current &&
                !bellIconRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            setIsMenuOpen(false)
            window.location.href = '/'
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    return (
        <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">EROOM</span>
                    </Link>

                    {/* 데스크톱 네비게이션 */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/store" className="text-gray-300 hover:text-green-400 transition-colors">
                            상점
                        </Link>
                        <Link href="/community" className="text-gray-300 hover:text-green-400 transition-colors">
                            커뮤니티
                        </Link>
                        <Link href="/support/help" className="text-gray-300 hover:text-green-400 transition-colors">
                            고객센터
                        </Link>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="검색..."
                                className="pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-sm border border-gray-800 focus:border-green-500 focus:outline-none w-48"
                            />
                        </div>
                    </div>

                    {/* 사용자 메뉴 */}
                    <div className="flex items-center">
                        {user ? (
                            <>
                                {/* 알림 아이콘 */}
                                <div ref={bellIconRef} className="relative mr-4 cursor-pointer">
                                    <Bell
                                        className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors"
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    />
                                    {/* 알림 인디케이터 */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>

                                    {/* 알림 패널 */}
                                    {isNotificationsOpen && (
                                        <div ref={notificationsPanelRef} className="absolute right-0 mt-2 w-80">
                                            <NotificationsPanel userProfile={userProfile} />
                                        </div>
                                    )}
                                </div>

                                {/* 프로필 아바타 */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold uppercase hover:bg-green-500 transition-colors"
                                    >
                                        {userProfile?.nickname?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </button>

                                    {/* 드롭다운 메뉴 */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg py-1 border border-gray-800">
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <p className="text-sm font-medium text-green-400">{userProfile?.nickname || '사용자'}</p>
                                                <p className="text-xs text-gray-400 mt-1 truncate">{userProfile?.email || user.email}</p>
                                            </div>
                                            <Link href={userProfile?.userId ? `/profile/${userProfile.userId}` : '/profile'}
                                                  onClick={() => setIsMenuOpen(false)}
                                                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                프로필
                                            </Link>
                                            <Link href={userProfile?.userId ? `/profile/${userProfile.userId}/settings` : '/profile/settings'}
                                                  onClick={() => setIsMenuOpen(false)}
                                                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                설정
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                                            >
                                                로그아웃
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link href="/auth/login"
                                      className="text-gray-300 hover:text-green-400 transition-colors">
                                    로그인
                                </Link>
                                <Link href="/auth/signup"
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    회원가입
                                </Link>
                            </div>
                        )}

                        {/* 모바일 메뉴 토글 */}
                        <div className="md:hidden ml-4">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-300"/>
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-300"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 모바일 메뉴 */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-800">
                        <div className="flex flex-col space-y-3 pb-5">
                            <Link href="/store"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-gray-300 hover:text-green-400 transition-colors py-2">
                                상점
                            </Link>
                            <Link href="/community"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-gray-300 hover:text-green-400 transition-colors py-2">
                                커뮤니티
                            </Link>
                            <Link href="/support/help"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-gray-300 hover:text-green-400 transition-colors py-2">
                                고객센터
                            </Link>

                            {user ? (
                                <>
                                    <Link href={userProfile?.userId ? `/profile/${userProfile.userId}` : '/profile'}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="text-gray-300 hover:text-green-400 transition-colors py-2">
                                        내 프로필
                                    </Link>
                                    <Link href={userProfile?.userId ? `/profile/${userProfile.userId}/settings` : '/profile/settings'}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="text-gray-300 hover:text-green-400 transition-colors py-2">
                                        설정
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-red-400 hover:text-red-300 transition-colors py-2"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-800">
                                    <Link href="/auth/login"
                                          onClick={() => setIsMenuOpen(false)}
                                          className="text-gray-300 hover:text-green-400 transition-colors">
                                        로그인
                                    </Link>
                                    <Link href="/auth/signup"
                                          onClick={() => setIsMenuOpen(false)}
                                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center">
                                        회원가입
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="검색..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-lg text-sm border border-gray-800 focus:border-green-500 focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}