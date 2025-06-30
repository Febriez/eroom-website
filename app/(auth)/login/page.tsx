'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Card} from '@/components/ui/Card'
import {AlertCircle, Key, Lock, Mail} from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const {signInWithEmail, signInWithGoogle} = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signInWithEmail(email, password)
            router.push('/')
        } catch (error: any) {
            console.error('Login error:', error)

            if (error.code === 'auth/user-not-found') {
                setError('등록되지 않은 이메일입니다.')
            } else if (error.code === 'auth/wrong-password') {
                setError('비밀번호가 올바르지 않습니다.')
            } else if (error.code === 'auth/invalid-email') {
                setError('유효하지 않은 이메일 형식입니다.')
            } else {
                setError('로그인 중 오류가 발생했습니다.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            await signInWithGoogle()
            router.push('/')
        } catch (error: any) {
            console.error('Google login error:', error)
            setError(error.message || '구글 로그인 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black to-gray-900">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
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
                    <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"/>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        <Input
                            type="email"
                            label="이메일"
                            placeholder="your@email.com"
                            icon={<Mail className="w-5 h-5"/>}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="비밀번호"
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5"/>}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    defaultChecked
                                />
                                <span className="text-gray-400">로그인 상태 유지</span>
                            </label>
                            <Link href="/forgot-password" className="text-green-400 hover:text-green-300">
                                비밀번호 찾기
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                        >
                            로그인
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
                        onClick={handleGoogleLogin}
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
                        아직 계정이 없으신가요?{' '}
                        <Link href="/signup" className="text-green-400 hover:text-green-300 font-medium">
                            회원가입
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    )
}