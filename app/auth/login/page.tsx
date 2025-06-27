'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {AlertCircle, Eye, EyeOff, Key, Mail} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'
import {useRouter} from 'next/navigation'

interface FormErrors {
    email?: string
    password?: string
    general?: string
}

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const {signInWithEmail, signInWithGoogle} = useAuth()
    const router = useRouter()

    const clearErrors = () => {
        setErrors({})
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        // 이메일 검증
        if (!email) {
            newErrors.email = '이메일을 입력해주세요.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.'
        }

        // 비밀번호 검증
        if (!password) {
            newErrors.password = '비밀번호를 입력해주세요.'
        } else if (password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        clearErrors()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            if (signInWithEmail) {
                await signInWithEmail(email, password)
                router.push('/')
            }
        } catch (err: any) {
            console.error('Email login error:', err)

            const newErrors: FormErrors = {}

            switch (err.code) {
                case 'auth/user-not-found':
                    newErrors.email = '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'
                    break
                case 'auth/wrong-password':
                    newErrors.password = '비밀번호가 올바르지 않습니다. 다시 확인해주세요.'
                    break
                case 'auth/invalid-email':
                    newErrors.email = '올바른 이메일 형식이 아닙니다. (예: example@email.com)'
                    break
                case 'auth/user-disabled':
                    newErrors.general = '비활성화된 계정입니다. 고객센터에 문의해주세요.'
                    break
                case 'auth/too-many-requests':
                    newErrors.general = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
                    break
                case 'auth/network-request-failed':
                    newErrors.general = '네트워크 연결을 확인해주세요.'
                    break
                default:
                    newErrors.general = '로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.'
            }

            setErrors(newErrors)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        clearErrors()

        try {
            if (signInWithGoogle) {
                const result = await signInWithGoogle()
                if (result?.success) {
                    router.push('/')
                }
            }
        } catch (err: any) {
            console.error('Google login error:', err)

            const newErrors: FormErrors = {}

            if (err.message === '로그인이 취소되었습니다.') {
                // 사용자가 팝업을 닫은 경우 - 에러 메시지 표시하지 않음
                setIsLoading(false)
                return
            } else if (err.message === '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.') {
                newErrors.general = '팝업이 차단되었습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.'
            } else {
                newErrors.general = '구글 로그인에 실패했습니다. 다시 시도해주세요.'
            }

            setErrors(newErrors)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-8">
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

                {/* Login Form */}
                <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                    <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>

                    <form onSubmit={handleEmailLogin} className="space-y-6">
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
                                    placeholder="••••••••"
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox"
                                       className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-green-600"
                                       disabled={isLoading}/>
                                <span className="ml-2 text-sm text-gray-400">로그인 상태 유지</span>
                            </label>
                            <Link href="/auth/forgot-password"
                                  className="text-sm text-green-400 hover:text-green-300 transition-colors hover:underline">
                                비밀번호를 잊으셨나요?
                            </Link>
                        </div>

                        {/* General Error Message */}
                        {errors.general && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"/>
                                <p className="text-red-400 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 border-t border-gray-800"></div>
                        <span className="text-sm text-gray-500">또는</span>
                        <div className="flex-1 border-t border-gray-800"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
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
                        {isLoading ? '로그인 중...' : '구글로 로그인'}
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-center mt-8 text-gray-400">
                        아직 계정이 없으신가요?{' '}
                        <Link href="/auth/signup" className="text-green-400 hover:text-green-300 transition-colors">
                            계정을 새로 만드시겠어요?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}