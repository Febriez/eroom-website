'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {useGoogleAuth} from '@/lib/hooks/useGoogleAuth'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {GoogleAuthButton} from '@/components/auth/GoogleAuthButton'
import {GoogleAuthStatus} from '@/components/auth/GoogleAuthStatus'
import {CheckCircle, Key, Lock, Mail, XCircle} from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const {signInWithEmail, signInWithGoogle} = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [successMessage, setSuccessMessage] = useState('')

    // 구글 인증 커스텀 훅 사용
    const {googleLoading, googleCountdown, startGoogleAuth, resetGoogleAuth} = useGoogleAuth(() => {
        setErrors({general: '로그인 시간이 초과되었습니다. 다시 시도해주세요.'})
    })

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
        setLoginStatus('idle')
        setErrors({})

        try {
            // AuthContext의 signInWithEmail 사용
            await signInWithEmail(formData.email, formData.password)

            // 로그인 성공 표시
            setLoginStatus('success')
            setSuccessMessage('로그인 성공! 메인 페이지로 이동합니다...')

            // 즉시 이동 (AuthContext에서 상태 업데이트가 완료됨)
            setTimeout(() => {
                router.push('/')
                router.refresh() // 페이지 새로고침 강제
            }, 500)

        } catch (error: any) {
            console.error('Login error:', error)
            setLoginStatus('error')

            // 에러 메시지를 더 명확하게 표시
            if (error.code === 'auth/user-not-found') {
                setErrors({
                    email: '등록되지 않은 이메일입니다',
                    general: '계정이 존재하지 않습니다. 회원가입을 진행해주세요.'
                })
            } else if (error.code === 'auth/wrong-password') {
                setErrors({
                    password: '비밀번호가 올바르지 않습니다',
                    general: '비밀번호를 확인해주세요.'
                })
            } else if (error.code === 'auth/invalid-email') {
                setErrors({
                    email: '올바른 이메일 형식이 아닙니다',
                    general: '이메일 형식을 확인해주세요.'
                })
            } else if (error.code === 'auth/too-many-requests') {
                setErrors({
                    general: '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
                })
            } else {
                setErrors({
                    general: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        startGoogleAuth()
        setLoginStatus('idle')
        setErrors({})

        // 팝업 감지를 위한 타이머
        let popupCheckInterval: NodeJS.Timeout | null = null

        try {
            // 팝업 창 참조를 얻기 위한 Promise
            const signInPromise = signInWithGoogle()

            // 팝업 창이 닫혔는지 주기적으로 확인하는 대신
            // 카운트다운만 처리 (실제 팝업 참조를 얻을 수 없으므로)
            popupCheckInterval = setInterval(() => {
                // 카운트다운 처리는 useEffect에서 수행
            }, 500)

            // AuthContext의 signInWithGoogle 사용
            await signInPromise

            // 성공 시 인터벌 정리
            if (popupCheckInterval) clearInterval(popupCheckInterval)

            setLoginStatus('success')
            setSuccessMessage('로그인 성공! 메인 페이지로 이동합니다...')

            // 즉시 이동
            setTimeout(() => {
                router.push('/')
                router.refresh() // 페이지 새로고침 강제
            }, 500)

        } catch (error: any) {
            console.error('Google login error:', error)

            // 인터벌 정리
            if (popupCheckInterval) clearInterval(popupCheckInterval)

            setLoginStatus('error')

            if (error.message === '로그인이 취소되었습니다.') {
                setErrors({general: '로그인이 취소되었습니다.'})
            } else if (error.message && error.message.includes('팝업')) {
                setErrors({general: error.message})
            } else {
                setErrors({general: '구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.'})
            }
        } finally {
            resetGoogleAuth()
            if (popupCheckInterval) clearInterval(popupCheckInterval)
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
                    {/* 상태 메시지 */}
                    {loginStatus === 'success' && (
                        <div
                            className="bg-green-900/20 border border-green-600/50 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0"/>
                            <p className="text-green-400 text-sm">{successMessage}</p>
                        </div>
                    )}

                    {loginStatus === 'error' && errors.general && (
                        <div
                            className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0"/>
                            <p className="text-red-400 text-sm">{errors.general}</p>
                        </div>
                    )}

                    {/* 구글 로그인 카운트다운 메시지 */}
                    <GoogleAuthStatus loading={googleLoading} countdown={googleCountdown}/>

                    <div>
                        <label className="block text-sm font-medium mb-2">이메일</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({...formData, email: e.target.value})
                                setErrors({...errors, email: '', general: ''})
                                setLoginStatus('idle')
                            }}
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
                            onChange={(e) => {
                                setFormData({...formData, password: e.target.value})
                                setErrors({...errors, password: '', general: ''})
                                setLoginStatus('idle')
                            }}
                            placeholder="비밀번호 입력"
                            icon={<Lock className="w-5 h-5"/>}
                            error={errors.password}
                            disabled={loading || googleLoading}
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
                        disabled={loading || googleLoading || loginStatus === 'success'}
                    >
                        {loading ? '로그인 중...' : loginStatus === 'success' ? '로그인 완료!' : '로그인'}
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
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading || loginStatus === 'success'}
                        loading={googleLoading}
                        countdown={googleCountdown}
                        variant="login"
                    />

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