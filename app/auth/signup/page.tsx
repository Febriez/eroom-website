'use client'

import {useState} from 'react'
import Link from 'next/link'
import {AlertCircle, AtSign, Eye, EyeOff, Key, Mail, User} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'
import {useRouter} from 'next/navigation'

interface FormErrors {
    userId?: string
    nickname?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
    general?: string
}

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [userId, setUserId] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [checkingUserId, setCheckingUserId] = useState(false)
    const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null)
    const {signUpWithEmail, signInWithGoogle, checkUserIdAvailability} = useAuth()
    const router = useRouter()

    const clearErrors = () => {
        setErrors({})
    }

    const validateUserId = (id: string) => {
        const regex = /^[a-zA-Z0-9_]{3,20}$/
        return regex.test(id)
    }

    const handleUserIdChange = async (value: string) => {
        setUserId(value)
        setUserIdAvailable(null)

        // 에러 초기화
        if (errors.userId) {
            setErrors({...errors, userId: undefined})
        }

        if (value.length >= 3 && validateUserId(value)) {
            setCheckingUserId(true)
            try {
                const available = await checkUserIdAvailability(value)
                setUserIdAvailable(available)
            } catch (error) {
                console.error('Error checking userId:', error)
            } finally {
                setCheckingUserId(false)
            }
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        // 사용자 ID 검증
        if (!userId) {
            newErrors.userId = '사용자 ID를 입력해주세요.'
        } else if (!validateUserId(userId)) {
            newErrors.userId = '사용자 ID는 3-20자의 영문, 숫자, 언더스코어(_)만 사용 가능합니다.'
        } else if (userIdAvailable === false) {
            newErrors.userId = '이미 사용 중인 ID입니다. 다른 ID를 선택해주세요.'
        }

        // 닉네임 검증
        if (!nickname) {
            newErrors.nickname = '닉네임을 입력해주세요.'
        } else if (nickname.length < 2) {
            newErrors.nickname = '닉네임은 2자 이상이어야 합니다.'
        } else if (nickname.length > 20) {
            newErrors.nickname = '닉네임은 20자 이하여야 합니다.'
        }

        // 이메일 검증
        if (!email) {
            newErrors.email = '이메일을 입력해주세요.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다. (예: example@email.com)'
        }

        // 비밀번호 검증
        if (!password) {
            newErrors.password = '비밀번호를 입력해주세요.'
        } else if (password.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.'
        }

        // 비밀번호 확인 검증
        if (!confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
        }

        // 이용약관 동의 검증
        if (!agreedToTerms) {
            newErrors.terms = '이용약관에 동의해주세요.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        clearErrors()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            if (signUpWithEmail) {
                await signUpWithEmail(email, password, nickname, userId)
                router.push('/auth/login')
            }
        } catch (err: any) {
            console.error('Signup error:', err)

            const newErrors: FormErrors = {}

            switch (err.code) {
                case 'auth/email-already-in-use':
                    newErrors.email = '이미 사용 중인 이메일입니다. 다른 이메일을 사용하거나 로그인해주세요.'
                    break
                case 'auth/weak-password':
                    newErrors.password = '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.'
                    break
                case 'auth/invalid-email':
                    newErrors.email = '올바른 이메일 형식이 아닙니다.'
                    break
                case 'auth/operation-not-allowed':
                    newErrors.general = '이메일 회원가입이 비활성화되어 있습니다. 관리자에게 문의해주세요.'
                    break
                case 'auth/network-request-failed':
                    newErrors.general = '네트워크 연결을 확인해주세요.'
                    break
                default:
                    if (err.message?.includes('userId already exists')) {
                        newErrors.userId = '이미 사용 중인 사용자 ID입니다. 다른 ID를 선택해주세요.'
                    } else {
                        newErrors.general = '회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.'
                    }
            }

            setErrors(newErrors)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        clearErrors()

        if (!agreedToTerms) {
            setErrors({terms: '이용약관에 동의해주세요.'})
            return
        }

        setIsLoading(true)

        try {
            if (signInWithGoogle) {
                const result = await signInWithGoogle()
                if (result?.success) {
                    router.push('/')
                }
            }
        } catch (err: any) {
            console.error('Google signup error:', err)

            const newErrors: FormErrors = {}

            if (err.message === '로그인이 취소되었습니다.') {
                // 사용자가 팝업을 닫은 경우 - 에러 메시지 표시하지 않음
                setIsLoading(false)
                return
            } else if (err.message === '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.') {
                newErrors.general = '팝업이 차단되었습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.'
            } else {
                newErrors.general = '구글 회원가입에 실패했습니다. 다시 시도해주세요.'
            }

            setErrors(newErrors)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-8 py-20">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center mb-12">
                    <div className="relative group">
                        <div
                            className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12">
                            <Key className="w-10 h-10 transform -rotate-12"/>
                        </div>
                        <div
                            className="absolute inset-0 bg-green-500/30 rounded-xl blur-2xl"></div>
                    </div>
                </Link>

                {/* Signup Form */}
                <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                    <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>

                    <form onSubmit={handleEmailSignup} className="space-y-6">
                        {/* User ID Input */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-400 mb-2">
                                사용자 ID (프로필 주소에 사용됩니다)
                            </label>
                            <div className="relative">
                                <AtSign
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.userId ? 'text-red-500' : 'text-gray-500'
                                    }`}/>
                                <input
                                    id="userId"
                                    type="text"
                                    value={userId}
                                    onChange={(e) => handleUserIdChange(e.target.value.toLowerCase())}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${
                                        errors.userId
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-gray-700 focus:border-green-600'
                                    }`}
                                    placeholder="my_unique_id"
                                    disabled={isLoading}
                                />
                                {checkingUserId && (
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                        확인 중...
                                    </span>
                                )}
                                {!checkingUserId && userIdAvailable === true && userId.length >= 3 && (
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 text-sm">
                                        사용 가능
                                    </span>
                                )}
                                {!checkingUserId && userIdAvailable === false && (
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 text-sm">
                                        사용 불가
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                3-20자의 영문, 숫자, 언더스코어(_)만 사용 가능
                            </p>
                            {errors.userId && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.userId}</p>
                                </div>
                            )}
                        </div>

                        {/* Nickname Input */}
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-400 mb-2">
                                닉네임
                            </label>
                            <div className="relative">
                                <User
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.nickname ? 'text-red-500' : 'text-gray-500'
                                    }`}/>
                                <input
                                    id="nickname"
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value)
                                        if (errors.nickname) {
                                            setErrors({...errors, nickname: undefined})
                                        }
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${
                                        errors.nickname
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-gray-700 focus:border-green-600'
                                    }`}
                                    placeholder="게임에서 사용할 닉네임"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.nickname && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.nickname}</p>
                                </div>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <Mail
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.email ? 'text-red-500' : 'text-gray-500'
                                    }`}/>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) {
                                            setErrors({...errors, email: undefined})
                                        }
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${
                                        errors.email
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-gray-700 focus:border-green-600'
                                    }`}
                                    placeholder="email@example.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Key
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.password ? 'text-red-500' : 'text-gray-500'
                                    }`}/>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password) {
                                            setErrors({...errors, password: undefined})
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${
                                        errors.password
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-gray-700 focus:border-green-600'
                                    }`}
                                    placeholder="8자 이상, 영문과 숫자 포함"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                                비밀번호 확인
                            </label>
                            <div className="relative">
                                <Key
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.confirmPassword ? 'text-red-500' : 'text-gray-500'
                                    }`}/>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                        if (errors.confirmPassword) {
                                            setErrors({...errors, confirmPassword: undefined})
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${
                                        errors.confirmPassword
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-gray-700 focus:border-green-600'
                                    }`}
                                    placeholder="비밀번호 재입력"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                </div>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div className={`rounded-lg p-4 border ${
                            errors.terms ? 'bg-red-900/10 border-red-800' : 'bg-gray-900/50 border-gray-800'
                        }`}>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => {
                                        setAgreedToTerms(e.target.checked)
                                        if (errors.terms) {
                                            setErrors({...errors, terms: undefined})
                                        }
                                    }}
                                    className="w-4 h-4 mt-1 bg-gray-900 border-gray-700 rounded focus:ring-green-600 cursor-pointer"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-gray-300">
                                    회원가입시 자사의{' '}
                                    <Link
                                        href="/terms"
                                        className="text-green-400 hover:text-green-300 underline underline-offset-2 decoration-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        이용약관
                                    </Link>
                                    {' '}및{' '}
                                    <Link
                                        href="/privacy"
                                        className="text-green-400 hover:text-green-300 underline underline-offset-2 decoration-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        개인정보 수집 및 이용약관
                                    </Link>
                                    에 동의하는 것으로 간주합니다
                                </span>
                            </label>
                            {errors.terms && (
                                <div className="mt-2 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-500">{errors.terms}</p>
                                </div>
                            )}
                        </div>

                        {/* General Error Message */}
                        {errors.general && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"/>
                                <p className="text-red-400 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isLoading || userIdAvailable === false}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '가입 중...' : '회원가입'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 border-t border-gray-800"></div>
                        <span className="text-sm text-gray-500">또는</span>
                        <div className="flex-1 border-t border-gray-800"></div>
                    </div>

                    {/* Google Signup */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {isLoading ? '가입 중...' : '구글로 회원가입'}
                    </button>

                    {/* Login Link */}
                    <p className="text-center mt-8 text-gray-400">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors">
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}