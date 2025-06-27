'use client'

import {useState} from 'react'
import Link from 'next/link'
import {AtSign, Eye, EyeOff, Key, Mail, User} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [userId, setUserId] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [checkingUserId, setCheckingUserId] = useState(false)
    const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null)
    const {signUpWithEmail, signInWithGoogle, checkUserIdAvailability} = useAuth()

    const validatePassword = () => {
        if (password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.')
            return false
        }
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.')
            return false
        }
        return true
    }

    const validateUserId = (id: string) => {
        // 영문, 숫자, 언더스코어만 허용, 3-20자
        const regex = /^[a-zA-Z0-9_]{3,20}$/
        return regex.test(id)
    }

    const handleUserIdChange = async (value: string) => {
        setUserId(value)
        setUserIdAvailable(null)

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

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!agreedToTerms) {
            setError('이용약관에 동의해주세요.')
            return
        }

        if (!validateUserId(userId)) {
            setError('사용자 ID는 3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.')
            return
        }

        if (!userIdAvailable) {
            setError('사용할 수 없는 사용자 ID입니다.')
            return
        }

        if (!validatePassword()) {
            return
        }

        setIsLoading(true)

        try {
            if (signUpWithEmail) {
                await signUpWithEmail(email, password, nickname, userId)
            }
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('이미 사용 중인 이메일입니다.')
            } else if (err.code === 'auth/weak-password') {
                setError('비밀번호가 너무 약합니다.')
            } else if (err.message?.includes('userId already exists')) {
                setError('이미 사용 중인 사용자 ID입니다.')
            } else {
                setError('회원가입에 실패했습니다. 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        if (!agreedToTerms) {
            setError('이용약관에 동의해주세요.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            if (signInWithGoogle) {
                await signInWithGoogle()
            }
        } catch (err) {
            setError('구글 회원가입에 실패했습니다.')
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

                    <div className="space-y-6">
                        {/* User ID Input */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-400 mb-2">
                                사용자 ID (프로필 주소에 사용됩니다)
                            </label>
                            <div className="relative">
                                <AtSign
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"/>
                                <input
                                    id="userId"
                                    type="text"
                                    value={userId}
                                    onChange={(e) => handleUserIdChange(e.target.value.toLowerCase())}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                    placeholder="my_unique_id"
                                    required
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
                        </div>

                        {/* Nickname Input */}
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-400 mb-2">
                                닉네임
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"/>
                                <input
                                    id="nickname"
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                    placeholder="게임에서 사용할 닉네임"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"/>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Key
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"/>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                    placeholder="8자 이상"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                                비밀번호 확인
                            </label>
                            <div className="relative">
                                <Key
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"/>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                    placeholder="비밀번호 재입력"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 mt-1 bg-gray-900 border-gray-700 rounded focus:ring-green-600 cursor-pointer"
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
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Signup Button */}
                        <button
                            onClick={handleEmailSignup}
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '가입 중...' : '회원가입'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900/50 text-gray-500">또는</span>
                        </div>
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
                        구글로 회원가입
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