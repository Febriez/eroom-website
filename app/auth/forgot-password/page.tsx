'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {AlertCircle, ArrowLeft, Check, Mail} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {resetPassword} = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('유효한 이메일 주소를 입력해주세요.')
            return
        }

        setIsLoading(true)

        try {
            if (resetPassword) {
                await resetPassword(email)
                setIsSuccess(true)
            }
        } catch (err: any) {
            console.error('Password reset error:', err)

            if (err.code === 'auth/user-not-found') {
                setError('해당 이메일로 등록된 계정을 찾을 수 없습니다.')
            } else if (err.code === 'auth/invalid-email') {
                setError('올바른 이메일 형식이 아닙니다.')
            } else {
                setError('비밀번호 재설정 이메일 발송에 실패했습니다. 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-8">
            <div className="w-full max-w-md">
                {/* Header with Back Button */}
                <div className="flex items-center mb-10">
                    <Link
                        href="/auth/login"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                        <span>로그인으로 돌아가기</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                    {!isSuccess ? (
                        <>
                            <h1 className="text-3xl font-bold text-center mb-2">비밀번호 찾기</h1>
                            <p className="text-gray-400 text-center mb-8">
                                가입할 때 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                        이메일
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${error ? 'text-red-500' : 'text-gray-500'}`}
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                if (error) setError(null)
                                            }}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-700 focus:border-green-600'}`}
                                            placeholder="email@example.com"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {error && (
                                        <div className="mt-2 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
                                            <p className="text-sm text-red-500">{error}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? '처리 중...' : '비밀번호 재설정 링크 받기'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div
                                className="w-16 h-16 mx-auto bg-green-600/20 rounded-full flex items-center justify-center mb-6">
                                <Check className="w-8 h-8 text-green-400"/>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">이메일이 전송되었습니다</h2>
                            <p className="text-gray-400 mb-6">
                                {email} 주소로 비밀번호 재설정 링크를 발송했습니다. <br/>
                                이메일을 확인하여 비밀번호를 재설정해주세요.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                이메일이 도착하지 않았다면 스팸 폴더를 확인하거나 다시 시도해주세요.
                            </p>
                            <button
                                onClick={() => {
                                    setIsSuccess(false)
                                    setEmail('')
                                }}
                                className="text-green-400 hover:text-green-300 transition-colors"
                            >
                                다른 이메일로 다시 시도
                            </button>
                        </div>
                    )}

                    {/* Login Link */}
                    {!isSuccess && (
                        <p className="text-center mt-8 text-gray-400">
                            계정이 기억나셨나요?{' '}
                            <Link href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors">
                                로그인하기
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}