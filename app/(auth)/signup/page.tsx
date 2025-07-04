'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {validateDisplayName, validateEmail, validatePassword, validateUsername} from '@/lib/utils/validators'
import {UserService} from '@/lib/firebase/services'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {GoogleAuthButton} from '@/components/auth/GoogleAuthButton'
import {AlertCircle, Key, Lock, Mail, User} from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const {signUpWithEmail, signInWithGoogle, redirectLoading, user, loading: authLoading} = useAuth()

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
    const [googleLoading, setGoogleLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // 리디렉션 처리 중 메시지 표시
    useEffect(() => {
        if (redirectLoading) {
            setGoogleLoading(true)
            setSuccessMessage('구글 계정 확인 중...')
        } else {
            setGoogleLoading(false)
            if (!successMessage.includes('구글')) {
                setSuccessMessage('')
            }
        }
    }, [redirectLoading])

    // 로그인 성공 시 자동 이동
    useEffect(() => {
        if (user && !authLoading) {
            router.push('/')
            router.refresh()
        }
    }, [user, authLoading, router])

    // 폼 검증
    const validateForm = async (): Promise<boolean> => {
        const newErrors: Record<string, string> = {}

        // 이메일 검증
        const emailValidation = validateEmail(formData.email)
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error!
        }

        // 비밀번호 검증
        const passwordValidation = validatePassword(formData.password)
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error!
        }

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
        }

        // 닉네임 검증 (한국어 허용)
        const displayNameValidation = validateDisplayName(formData.displayName)
        if (!displayNameValidation.isValid) {
            newErrors.displayName = displayNameValidation.error!
        }

        // 사용자명 검증
        const usernameValidation = validateUsername(formData.username)
        if (!usernameValidation.isValid) {
            newErrors.username = usernameValidation.error!
        } else {
            // 중복 체크
            try {
                const existingUser = await UserService.getUserByUsername(formData.username)
                if (existingUser) {
                    newErrors.username = '이미 사용중인 사용자명입니다'
                }
            } catch (error) {
                console.error('Username check error:', error)
            }
        }

        // 약관 동의 확인
        if (!agreements.terms || !agreements.privacy) {
            newErrors.agreements = '필수 약관에 모두 동의해주세요'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // 일반 회원가입 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!await validateForm()) return

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
            if (error.message) {
                setErrors({general: error.message})
            } else {
                setErrors({general: '회원가입 중 오류가 발생했습니다'})
            }
        } finally {
            setLoading(false)
        }
    }

    // 구글 회원가입 처리
    const handleGoogleSignup = async () => {
        // 약관 동의 확인
        if (!agreements.terms || !agreements.privacy) {
            setErrors({agreements: '필수 약관에 모두 동의해주세요'})
            return
        }

        setGoogleLoading(true)
        setErrors({})

        try {
            await signInWithGoogle()
            // 리디렉션되므로 추가 처리 불필요
            setSuccessMessage('구글 계정으로 이동 중...')
        } catch (error: any) {
            console.error('Google signup error:', error)
            setErrors({general: error.message || '구글 회원가입 중 오류가 발생했습니다.'})
            setGoogleLoading(false)
        }
    }

    // 닉네임 실시간 검증
    const handleDisplayNameChange = (value: string) => {
        setFormData({...formData, displayName: value})

        if (value.length > 0) {
            const validation = validateDisplayName(value)
            if (!validation.isValid) {
                setErrors(prev => ({...prev, displayName: validation.error!}))
            } else {
                setErrors(prev => {
                    const newErrors = {...prev}
                    delete newErrors.displayName
                    return newErrors
                })
            }
        }
    }

    // 사용자명 실시간 검증
    const handleUsernameChange = (value: string) => {
        // 소문자로 자동 변환
        const lowercase = value.toLowerCase()
        setFormData({...formData, username: lowercase})

        if (lowercase.length > 0) {
            const validation = validateUsername(lowercase)
            if (!validation.isValid) {
                setErrors(prev => ({...prev, username: validation.error!}))
            } else {
                setErrors(prev => {
                    const newErrors = {...prev}
                    delete newErrors.username
                    return newErrors
                })
            }
        }
    }

    // 전체 약관 동의
    const handleAllAgreements = (checked: boolean) => {
        setAgreements({
            terms: checked,
            privacy: checked,
            all: checked
        })

        if (checked) {
            setErrors(prev => {
                const newErrors = {...prev}
                delete newErrors.agreements
                return newErrors
            })
        }
    }

    // 개별 약관 동의
    const handleSingleAgreement = (type: 'terms' | 'privacy', checked: boolean) => {
        const newAgreements = {...agreements, [type]: checked}
        newAgreements.all = newAgreements.terms && newAgreements.privacy
        setAgreements(newAgreements)

        if (newAgreements.terms && newAgreements.privacy) {
            setErrors(prev => {
                const newErrors = {...prev}
                delete newErrors.agreements
                return newErrors
            })
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transform rotate-12">
                            <Key className="w-8 h-8 text-white transform -rotate-12"/>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">회원가입</h1>
                    <p className="text-gray-400">방탈소년단과 함께 모험을 시작하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 에러 메시지 */}
                    {errors.general && (
                        <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* 구글 로그인 상태 메시지 */}
                    {(redirectLoading || googleLoading) && successMessage && (
                        <div
                            className="bg-green-900/20 border border-green-600/50 rounded-lg p-4 text-green-400 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">이메일</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="your@email.com"
                            icon={<Mail className="w-5 h-5"/>}
                            error={errors.email}
                            disabled={loading || googleLoading || redirectLoading}
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">비밀번호</label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="8자 이상, 대소문자 및 숫자 포함"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.password}
                            disabled={loading || googleLoading || redirectLoading}
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
                        <Input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            placeholder="비밀번호 재입력"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.confirmPassword}
                            disabled={loading || googleLoading || redirectLoading}
                        />
                    </div>

                    {/* 닉네임 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">닉네임</label>
                        <Input
                            value={formData.displayName}
                            onChange={(e) => handleDisplayNameChange(e.target.value)}
                            placeholder="게임에서 표시될 이름"
                            icon={<User className="w-5 h-5"/>}
                            error={errors.displayName}
                            maxLength={32}
                            disabled={loading || googleLoading || redirectLoading}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            3-16자, 한글/영문/숫자 사용 가능, 언제든지 변경 가능
                        </p>
                        {formData.displayName && !errors.displayName && (
                            <p className="text-xs text-green-400 mt-1">✓ 사용 가능한 닉네임입니다</p>
                        )}
                    </div>

                    {/* 사용자명 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">사용자명</label>
                        <div
                            className="mb-2 bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
                            <div className="text-sm text-yellow-400">
                                <p className="font-medium mb-1">⚠️ 주의: 사용자명은 영구적입니다!</p>
                                <p className="text-xs">한 번 설정한 사용자명은 절대 변경할 수 없습니다.</p>
                            </div>
                        </div>
                        <Input
                            value={formData.username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            placeholder="username (영문, 숫자, _ 만 가능)"
                            icon={<span className="text-gray-400">@</span>}
                            error={errors.username}
                            disabled={loading || googleLoading || redirectLoading}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            프로필 URL: /profile/{formData.username || 'username'}
                        </p>
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
                                    disabled={loading || googleLoading || redirectLoading}
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
                                    disabled={loading || googleLoading || redirectLoading}
                                />
                                <span className="ml-3 text-sm">
                                    <span className="text-red-400">*</span>{' '}
                                    <Link
                                        href="/terms"
                                        target="_blank"
                                        className="text-green-400 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        이용약관
                                    </Link>
                                    에 동의합니다
                                </span>
                            </label>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreements.privacy}
                                    onChange={(e) => handleSingleAgreement('privacy', e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    disabled={loading || googleLoading || redirectLoading}
                                />
                                <span className="ml-3 text-sm">
                                    <span className="text-red-400">*</span>{' '}
                                    <Link
                                        href="/privacy"
                                        target="_blank"
                                        className="text-green-400 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        개인정보처리방침
                                    </Link>
                                    에 동의합니다
                                </span>
                            </label>
                        </div>

                        {errors.agreements && (
                            <p className="text-red-500 text-xs mt-1">{errors.agreements}</p>
                        )}
                    </div>

                    {/* 회원가입 버튼 */}
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading || googleLoading || redirectLoading}
                    >
                        {loading ? '가입 중...' : '회원가입'}
                    </Button>

                    {/* 구분선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-black text-gray-400">또는</span>
                        </div>
                    </div>

                    {/* 구글 회원가입 */}
                    <GoogleAuthButton
                        onClick={handleGoogleSignup}
                        disabled={loading || googleLoading || redirectLoading}
                        loading={googleLoading || redirectLoading}
                        variant="signup"
                    />

                    {/* 로그인 링크 */}
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