'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Card} from '@/components/ui/Card'
import {AlertCircle, AtSign, CheckCircle, Key, Lock, Mail, User} from 'lucide-react'
import {VALIDATION_RULES} from '@/lib/firebase/types'

export default function SignUpPage() {
    const router = useRouter()
    const {signUpWithEmail, signInWithGoogle, checkUsernameAvailability} = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        displayName: '',
        username: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

    const validateUsername = async (username: string) => {
        if (!username) {
            setUsernameAvailable(null)
            return
        }

        const {minLength, maxLength, pattern} = VALIDATION_RULES.username

        if (username.length < minLength) {
            setErrors(prev => ({...prev, username: `최소 ${minLength}자 이상이어야 합니다.`}))
            setUsernameAvailable(false)
            return
        }

        if (username.length > maxLength) {
            setErrors(prev => ({...prev, username: `최대 ${maxLength}자까지 가능합니다.`}))
            setUsernameAvailable(false)
            return
        }

        if (!pattern.test(username)) {
            setErrors(prev => ({...prev, username: '영문, 숫자, 언더스코어(_)만 사용 가능합니다.'}))
            setUsernameAvailable(false)
            return
        }

        if (VALIDATION_RULES.username.reserved.includes(username.toLowerCase())) {
            setErrors(prev => ({...prev, username: '사용할 수 없는 사용자명입니다.'}))
            setUsernameAvailable(false)
            return
        }

        setCheckingUsername(true)
        try {
            const available = await checkUsernameAvailability(username)
            setUsernameAvailable(available)
            if (!available) {
                setErrors(prev => ({...prev, username: '이미 사용 중인 사용자명입니다.'}))
            } else {
                setErrors(prev => ({...prev, username: ''}))
            }
        } catch (error) {
            console.error('Username check error:', error)
        } finally {
            setCheckingUsername(false)
        }
    }

    const validatePassword = (password: string) => {
        const {minLength, requireUppercase, requireLowercase, requireNumber} = VALIDATION_RULES.password
        const errors = []

        if (password.length < minLength) {
            errors.push(`최소 ${minLength}자 이상`)
        }
        if (requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('대문자 포함')
        }
        if (requireLowercase && !/[a-z]/.test(password)) {
            errors.push('소문자 포함')
        }
        if (requireNumber && !/[0-9]/.test(password)) {
            errors.push('숫자 포함')
        }

        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // 유효성 검사
        const newErrors: Record<string, string> = {}

        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요.'
        }

        const passwordErrors = validatePassword(formData.password)
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors.join(', ')
        }

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
        }

        if (!formData.displayName) {
            newErrors.displayName = '닉네임을 입력해주세요.'
        }

        if (!formData.username) {
            newErrors.username = '사용자명을 입력해주세요.'
        } else if (!usernameAvailable) {
            newErrors.username = '사용할 수 없는 사용자명입니다.'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)

        try {
            await signUpWithEmail(
                formData.email,
                formData.password,
                formData.displayName,
                formData.username
            )
            router.push('/')
        } catch (error: any) {
            console.error('Signup error:', error)

            if (error.code === 'auth/email-already-in-use') {
                setErrors({email: '이미 사용 중인 이메일입니다.'})
            } else {
                setErrors({submit: error.message || '회원가입 중 오류가 발생했습니다.'})
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setLoading(true)
        try {
            await signInWithGoogle()
            router.push('/')
        } catch (error: any) {
            console.error('Google signup error:', error)
            setErrors({submit: error.message || '구글 회원가입 중 오류가 발생했습니다.'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black to-gray-900">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12">
                            <Key className="w-8 h-8 transform -rotate-12"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">BangtalBoyBand</h1>
                            <p className="text-sm text-gray-500">AI Gaming Studio</p>
                        </div>
                    </div>
                </Link>

                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

                    {errors.submit && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"/>
                            <p className="text-red-400 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="이메일"
                            placeholder="your@email.com"
                            icon={<Mail className="w-5 h-5"/>}
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                            error={errors.email}
                            required
                        />

                        <Input
                            type="password"
                            label="비밀번호"
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5"/>}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                            error={errors.password}
                            required
                        />

                        <Input
                            type="password"
                            label="비밀번호 확인"
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5"/>}
                            value={formData.passwordConfirm}
                            onChange={(e) => setFormData(prev => ({...prev, passwordConfirm: e.target.value}))}
                            error={errors.passwordConfirm}
                            required
                        />

                        <Input
                            type="text"
                            label="닉네임"
                            placeholder="게임에서 표시될 이름"
                            icon={<User className="w-5 h-5"/>}
                            value={formData.displayName}
                            onChange={(e) => setFormData(prev => ({...prev, displayName: e.target.value}))}
                            error={errors.displayName}
                            required
                        />

                        <div>
                            <Input
                                type="text"
                                label="사용자명"
                                placeholder="username"
                                icon={<AtSign className="w-5 h-5"/>}
                                value={formData.username}
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase()
                                    setFormData(prev => ({...prev, username: value}))
                                    validateUsername(value)
                                }}
                                error={errors.username}
                                required
                            />
                            {checkingUsername && (
                                <p className="text-sm text-gray-400 mt-2">확인 중...</p>
                            )}
                            {usernameAvailable && !errors.username && (
                                <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4"/>
                                    사용 가능한 사용자명입니다.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading || !usernameAvailable}
                        >
                            회원가입
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-500">또는</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        fullWidth
                        onClick={handleGoogleSignup}
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        구글로 계속하기
                    </Button>

                    <p className="text-center text-gray-400 mt-8">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
                            로그인
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    )
}