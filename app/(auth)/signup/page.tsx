'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {auth, db, googleProvider} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {UserService} from '@/lib/firebase/services'
import {validateUsername} from '@/lib/validators'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {AlertCircle, Key, Lock, Mail, User} from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        username: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const validateForm = async () => {
        const newErrors: Record<string, string> = {}

        // 이메일 검증
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다'
        }

        // 비밀번호 검증
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요'
        } else if (formData.password.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
        }

        // 닉네임 검증 (validators.ts 사용)
        if (!formData.displayName) {
            newErrors.displayName = '닉네임을 입력해주세요'
        } else {
            const nicknameValidation = validateUsername(formData.displayName)
            if (!nicknameValidation.isValid) {
                newErrors.displayName = nicknameValidation.error!
            }
        }

        // 사용자명 검증 (영문만 허용)
        if (!formData.username) {
            newErrors.username = '사용자명을 입력해주세요'
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
            newErrors.username = '3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다'
        } else {
            // 중복 체크
            const existingUser = await UserService.getUserByUsername(formData.username)
            if (existingUser) {
                newErrors.username = '이미 사용중인 사용자명입니다'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!await validateForm()) return

        setLoading(true)
        try {
            // Firebase Auth 회원가입
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: formData.email,
                username: formData.username,
                displayName: formData.displayName,
                bio: '안녕하세요. 잘 부탁드립니다.',
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,

                // 게임 정보
                level: 1,
                points: 0,
                credits: 100, // 신규 가입 보너스

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
                canChangeUsername: false, // 일반 회원가입은 변경 불가
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            })

            router.push('/')
        } catch (error: any) {
            console.error('Signup error:', error)
            if (error.code === 'auth/email-already-in-use') {
                setErrors({email: '이미 사용중인 이메일입니다'})
            } else {
                setErrors({general: '회원가입 중 오류가 발생했습니다'})
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
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

                // Google 사용자의 displayName도 검증
                let displayName = user.displayName || username
                const displayNameValidation = validateUsername(displayName)
                if (!displayNameValidation.isValid) {
                    // 유효하지 않으면 username을 사용
                    displayName = username
                }

                await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
                    uid: user.uid,
                    email: user.email,
                    username: username,
                    displayName: displayName,
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
            console.error('Google signup error:', error)
            setErrors({general: '구글 로그인 중 오류가 발생했습니다'})
        } finally {
            setLoading(false)
        }
    }

    const handleDisplayNameChange = (value: string) => {
        setFormData({...formData, displayName: value})

        // 실시간 검증
        const validation = validateUsername(value)
        if (!validation.isValid && value.length > 0) {
            setErrors({...errors, displayName: validation.error!})
        } else {
            const newErrors = {...errors}
            delete newErrors.displayName
            setErrors(newErrors)
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
                    <h1 className="text-3xl font-bold mb-2">회원가입</h1>
                    <p className="text-gray-400">방탈보이밴드와 함께 모험을 시작하세요</p>
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
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="8자 이상 입력"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.password}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
                        <Input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            placeholder="비밀번호 재입력"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.confirmPassword}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">닉네임</label>
                        <Input
                            value={formData.displayName}
                            onChange={(e) => handleDisplayNameChange(e.target.value)}
                            placeholder="게임에서 표시될 이름"
                            icon={<User className="w-5 h-5"/>}
                            error={errors.displayName}
                            maxLength={32} // 여유있게 설정 (한글 16자 = 최대 32바이트)
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            최대 16자 (한글 8자), 공백 사용 가능, 언제든지 변경 가능
                        </p>
                        {formData.displayName && !errors.displayName && (
                            <p className="text-xs text-green-400 mt-1">
                                사용 가능한 닉네임입니다
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">사용자명</label>
                        <div
                            className="mb-2 bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
                            <div className="text-sm text-yellow-400">
                                <p className="font-medium mb-1">⚠️ 주의: 사용자명은 영구적입니다!</p>
                                <p className="text-xs">한 번 설정한 사용자명은 절대 변경이 불가능하니 신중히 선택하세요.</p>
                            </div>
                        </div>
                        <Input
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                            placeholder="@username (영문, 숫자, _ 만 가능)"
                            icon={<span className="text-gray-400">@</span>}
                            error={errors.username}
                        />
                        <p className="text-xs text-gray-400 mt-1">프로필 URL에 사용됩니다:
                            /profile/{formData.username || 'username'}</p>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? '가입 중...' : '회원가입'}
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
                        onClick={handleGoogleSignup}
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
                        구글로 시작하기
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-green-400 hover:text-green-300">
                            로그인
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}