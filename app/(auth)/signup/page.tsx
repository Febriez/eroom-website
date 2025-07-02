// app/(auth)/signup/page.tsx
'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore'
import {auth, db, googleProvider} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {UserService} from '@/lib/firebase/services'
import {validateUsername} from '@/lib/utils/validators'
import {useGoogleAuth} from '@/lib/hooks/useGoogleAuth'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {GoogleAuthButton} from '@/components/auth/GoogleAuthButton'
import {GoogleAuthStatus} from '@/components/auth/GoogleAuthStatus'
import {AlertCircle, Key, Lock, Mail, User} from 'lucide-react'

// 사용자 기본 설정 타입
interface UserSettings {
    privacy: {
        showProfile: boolean
        showStats: boolean
        showFriends: boolean
        showActivity: boolean
        allowMessages: boolean
        allowFriendRequests: boolean
    }
    preferences: {
        soundEnabled: boolean
        musicVolume: number
        effectsVolume: number
        mouseSensitivity: number
        language: string
        theme: string
    }
    notifications: {
        friendRequests: boolean
        messages: boolean
        gameInvites: boolean
        achievements: boolean
        updates: boolean
        marketing: boolean
    }
}

// 사용자 기본 설정 생성 함수
const createDefaultUserSettings = (): UserSettings => ({
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
})

// 새 사용자 문서 생성 함수
const createUserDocument = (
    uid: string,
    email: string,
    username: string,
    displayName: string,
    avatarUrl: string,
    credits: number,
    canChangeUsername: boolean
) => ({
    uid,
    email,
    username,
    displayName,
    bio: '안녕하세요. 잘 부탁드립니다.',
    avatarUrl,

    // 게임 정보
    level: 1,
    points: 0,
    credits,

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
    settings: createDefaultUserSettings(),

    // 메타데이터
    role: 'user',
    canChangeUsername,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
})

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        username: ''
    })
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        all: false
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    // 구글 인증 커스텀 훅 사용
    const {googleLoading, googleCountdown, startGoogleAuth, resetGoogleAuth} = useGoogleAuth(() => {
        setErrors({general: '로그인 시간이 초과되었습니다. 다시 시도해주세요.'})
    })

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

        // 약관 동의 확인
        if (!agreements.terms || !agreements.privacy) {
            newErrors.agreements = '필수 약관에 모두 동의해주세요'
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
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
            const userDoc = createUserDocument(
                userCredential.user.uid,
                formData.email,
                formData.username,
                formData.displayName,
                avatarUrl,
                100, // 신규 가입 보너스
                false // 일반 회원가입은 변경 불가
            )

            await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), userDoc)

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
        // 약관 동의 확인
        if (!agreements.terms || !agreements.privacy) {
            setErrors({agreements: '필수 약관에 모두 동의해주세요'})
            return
        }

        startGoogleAuth()
        setErrors({})

        // 팝업 감지를 위한 타이머
        let popupCheckInterval: NodeJS.Timeout | null = null

        try {
            // 팝업 창이 닫혔는지 주기적으로 확인
            popupCheckInterval = setInterval(() => {
                // 여기서는 실제 팝업 창에 대한 참조가 없으므로
                // 시간 초과만 처리합니다
            }, 500)

            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // 인터벌 정리
            if (popupCheckInterval) clearInterval(popupCheckInterval)

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

                const avatarUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
                const newUserDoc = createUserDocument(
                    user.uid,
                    user.email!,
                    username,
                    displayName,
                    avatarUrl,
                    150, // 구글 가입 보너스
                    true // 구글 사용자는 1회 변경 가능
                )

                await setDoc(doc(db, COLLECTIONS.USERS, user.uid), newUserDoc)
            }

            router.push('/')
        } catch (error: any) {
            console.error('Google signup error:', error)

            // 인터벌 정리
            if (popupCheckInterval) clearInterval(popupCheckInterval)

            if (error.code === 'auth/popup-closed-by-user') {
                setErrors({general: '회원가입이 취소되었습니다.'})
            } else if (error.code === 'auth/popup-blocked') {
                setErrors({general: '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'})
            } else {
                setErrors({general: '구글 회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'})
            }
        } finally {
            resetGoogleAuth()
            if (popupCheckInterval) clearInterval(popupCheckInterval)
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

    const handleAllAgreements = (checked: boolean) => {
        setAgreements({
            terms: checked,
            privacy: checked,
            all: checked
        })
        // 약관 동의 에러 제거
        if (checked) {
            const newErrors = {...errors}
            delete newErrors.agreements
            setErrors(newErrors)
        }
    }

    const handleSingleAgreement = (type: 'terms' | 'privacy', checked: boolean) => {
        const newAgreements = {...agreements, [type]: checked}
        newAgreements.all = newAgreements.terms && newAgreements.privacy
        setAgreements(newAgreements)

        // 모두 동의했으면 에러 제거
        if (newAgreements.terms && newAgreements.privacy) {
            const newErrors = {...errors}
            delete newErrors.agreements
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

                    {/* 구글 로그인 카운트다운 메시지 */}
                    <GoogleAuthStatus loading={googleLoading} countdown={googleCountdown}/>

                    <div>
                        <label className="block text-sm font-medium mb-2">이메일</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="your@email.com"
                            icon={<Mail className="w-5 h-5"/>}
                            error={errors.email}
                            disabled={loading || googleLoading}
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
                            disabled={loading || googleLoading}
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
                            disabled={loading || googleLoading}
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
                            disabled={loading || googleLoading}
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
                            disabled={loading || googleLoading}
                        />
                        <p className="text-xs text-gray-400 mt-1">프로필 URL에 사용됩니다:
                            /profile/{formData.username || 'username'}</p>
                    </div>

                    {/* 약관 동의 */}
                    <div className="space-y-3">
                        <div className="border border-gray-800 rounded-lg p-4 space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreements.all}
                                    onChange={(e) => handleAllAgreements(e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    disabled={loading || googleLoading}
                                />
                                <span className="ml-3 text-sm font-medium">전체 동의</span>
                            </label>

                            <hr className="border-gray-800"/>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreements.terms}
                                    onChange={(e) => handleSingleAgreement('terms', e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    disabled={loading || googleLoading}
                                />
                                <span className="ml-3 text-sm">
                                    <span className="text-red-400">*</span>{' '}
                                    <a
                                        href="/legal/terms"
                                        target="_blank"
                                        className="text-green-400 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        이용약관
                                    </a>
                                    에 동의합니다
                                </span>
                            </label>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreements.privacy}
                                    onChange={(e) => handleSingleAgreement('privacy', e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    disabled={loading || googleLoading}
                                />
                                <span className="ml-3 text-sm">
                                    <span className="text-red-400">*</span>{' '}
                                    <a
                                        href="/legal/privacy"
                                        target="_blank"
                                        className="text-green-400 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        개인정보처리방침
                                    </a>
                                    에 동의합니다
                                </span>
                            </label>
                        </div>

                        {errors.agreements && (
                            <p className="text-red-500 text-xs mt-1">{errors.agreements}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading || googleLoading}
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

                    <GoogleAuthButton
                        onClick={handleGoogleSignup}
                        disabled={loading || googleLoading}
                        loading={googleLoading}
                        countdown={googleCountdown}
                        variant="signup"
                    />

                    <p className="text-center text-sm text-gray-400">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/(auth)/login" className="text-green-400 hover:text-green-300">
                            로그인
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}