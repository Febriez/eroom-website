'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {auth, db, googleProvider} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {UserService} from '@/lib/firebase/services'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {Key, Lock, Mail} from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 간단한 검증
        const newErrors: Record<string, string> = {}
        if (!formData.email) newErrors.email = '이메일을 입력해주세요'
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password)
            router.push('/')
        } catch (error: any) {
            console.error('Login error:', error)
            if (error.code === 'auth/user-not-found') {
                setErrors({email: '등록되지 않은 이메일입니다'})
            } else if (error.code === 'auth/wrong-password') {
                setErrors({password: '비밀번호가 올바르지 않습니다'})
            } else {
                setErrors({general: '로그인 중 오류가 발생했습니다'})
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // 기존 사용자인지 확인
            const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid))

            if (!userDoc.exists()) {
                // 신규 구글 사용자 - 기본 username 생성
                const baseUsername = user.email?.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user'
                let username = baseUsername
                let counter = 1

                // 중복되지 않는 username 찾기
                while (await UserService.getUserByUsername(username)) {
                    username = `${baseUsername}${counter}`
                    counter++
                }

                await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
                    uid: user.uid,
                    email: user.email,
                    username: username,
                    displayName: user.displayName || username,
                    bio: '안녕하세요. 잘 부탁드립니다.',
                    avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,

                    // 게임 정보
                    level: 1,
                    points: 0,
                    credits: 150, // 구글 가입 보너스

                    // 통계
                    stats: {
                        mapsCompleted: 0,
                        mapsCreated: 0,
                        totalPlayTime: 0,
                        winRate: 0,
                        avgClearTime: 0,
                        achievements: []
                    },

                    // 소셜
                    social: {
                        followers: [],
                        following: [],
                        friends: [],
                        blocked: [],
                        friendCount: 0
                    },

                    // 설정
                    settings: {
                        privacy: {
                            showProfile: true,
                            showStats: true,
                            showFriends: true,
                            showActivity: true,
                            allowMessages: true,
                            allowFriendRequests: true
                        },
                        preferences: {
                            soundEnabled: true,
                            musicVolume: 0.7,
                            effectsVolume: 0.7,
                            mouseSensitivity: 1,
                            language: 'ko',
                            theme: 'dark'
                        },
                        notifications: {
                            friendRequests: true,
                            messages: true,
                            gameInvites: true,
                            achievements: true,
                            updates: true,
                            marketing: false
                        }
                    },

                    // 메타데이터
                    role: 'user',
                    canChangeUsername: true, // 구글 사용자는 1회 변경 가능
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastLoginAt: new Date()
                })
            }

            router.push('/')
        } catch (error) {
            console.error('Google login error:', error)
            setErrors({general: '구글 로그인 중 오류가 발생했습니다'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12">
                            <Key className="w-8 h-8 text-white transform -rotate-12"/>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">로그인</h1>
                    <p className="text-gray-400">다시 만나서 반가워요!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">이메일</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({...formData, email: e.target.value})
                                setErrors({...errors, email: ''})
                            }}
                            placeholder="your@email.com"
                            icon={<Mail className="w-5 h-5"/>}
                            error={errors.email}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">비밀번호</label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({...formData, password: e.target.value})
                                setErrors({...errors, password: ''})
                            }}
                            placeholder="비밀번호 입력"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.password}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 bg-gray-800 border-gray-700 rounded"/>
                            <span className="ml-2 text-sm text-gray-400">로그인 상태 유지</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-green-400 hover:text-green-300">
                            비밀번호 찾기
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-black text-gray-400">또는</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        구글로 로그인
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        아직 계정이 없으신가요?{' '}
                        <Link href="/signup" className="text-green-400 hover:text-green-300">
                            회원가입
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}