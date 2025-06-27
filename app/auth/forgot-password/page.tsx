'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Key, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase'

interface FormErrors {
    email?: string
    general?: string
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [emailSent, setEmailSent] = useState(false)

    const clearErrors = () => {
        setErrors({})
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        // 이메일 검증
        if (!email) {
            newErrors.email = '이메일을 입력해주세요.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다. (예: example@email.com)'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearErrors()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await sendPasswordResetEmail(auth, email)
            setEmailSent(true)
        } catch (err: any) {
            console.error('Password reset error:', err)

            const newErrors: FormErrors = {}

            switch (err.code) {
                case 'auth/user-not-found':
                    newErrors.email = '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'
                    break
                case 'auth/invalid-email':
                    newErrors.email = '올바른 이메일 형식이 아닙니다.'
                    break
                case 'auth/network-request-failed':
                    newErrors.general = '네트워크 연결을 확인해주세요.'
                    break
                case 'auth/too-many-requests':
                    newErrors.general = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.'
                    break
                default:
                    newErrors.general = '비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.'
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

                {/* Forgot Password Form */}
                <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                    <h1 className="text-3xl font-bold text-center mb-8">비밀번호 찾기</h1>

                    {emailSent ? (
                        <div className="space-y-6">
                            <div className="bg-green-900/20 border border-green-800 rounded-lg p-5 flex flex-col items-center text-center gap-3">
                                <CheckCircle className="w-12 h-12 text-green-500 mb-1" />
                                <p className="text-gray-300">
                                    <span className="font-semibold text-white">{email}</span> 주소로 비밀번호 재설정 이메일을 발송했습니다.
                                </p>
                                <p className="text-sm text-gray-400">
                                    이메일의 안내에 따라 비밀번호를 재설정해주세요. 메일이 도착하지 않았다면 스팸함을 확인해주세요.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 mt-6">
                                <button
                                    onClick={() => {
                                        setEmailSent(false)
                                        setEmail('')
                                    }}
                                    className="w-full py-3 bg-gray-800 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                >
                                    다른 이메일로 시도
                                </button>

                                <Link href="/auth/login"
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-center hover:from-green-700 hover:to-green-800 transition-all"
                                >
                                    로그인 페이지로 이동
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-400 text-center mb-6">
                                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                        이메일
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-500'}`}
                                        />
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
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-700 focus:border-green-600'}`}
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

                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"/>
                                        <p className="text-red-400 text-sm">{errors.general}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? '전송 중...' : '재설정 링크 전송'}
                                </button>

                                {/* Back to Login */}
                                <Link href="/auth/login" className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors mt-4">
                                    <ArrowLeft className="w-4 h-4" />
                                    로그인 페이지로 돌아가기
                                </Link>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
