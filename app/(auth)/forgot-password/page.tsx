'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Card} from '@/components/ui/Card'
import {AlertCircle, ArrowLeft, CheckCircle, Key, Mail} from 'lucide-react'

export default function ForgotPasswordPage() {
    const {resetPassword} = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (error: any) {
            console.error('Password reset error:', error)

            if (error.code === 'auth/user-not-found') {
                setError('등록되지 않은 이메일입니다.')
            } else if (error.code === 'auth/invalid-email') {
                setError('유효하지 않은 이메일 형식입니다.')
            } else {
                setError('비밀번호 재설정 중 오류가 발생했습니다.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black to-gray-900">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
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
                    {success ? (
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-400"/>
                            </div>

                            <h2 className="text-2xl font-bold mb-4">이메일을 확인해주세요</h2>

                            <p className="text-gray-400 mb-8">
                                <span className="text-green-400">{email}</span>으로 비밀번호 재설정 링크를 보냈습니다.
                                이메일을 확인하여 비밀번호를 재설정해주세요.
                            </p>

                            <div className="space-y-4">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => window.location.href = 'mailto:'}
                                >
                                    이메일 앱 열기
                                </Button>

                                <Link href="/login" className="block">
                                    <Button variant="outline" fullWidth>
                                        로그인으로 돌아가기
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-sm text-gray-500 mt-6">
                                이메일이 오지 않았나요? 스팸 폴더를 확인해주세요.
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h2>

                            <p className="text-gray-400 text-center mb-8">
                                가입하신 이메일 주소를 입력하시면
                                비밀번호 재설정 링크를 보내드립니다.
                            </p>

                            {error && (
                                <div
                                    className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"/>
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    type="email"
                                    label="이메일"
                                    placeholder="your@email.com"
                                    icon={<Mail className="w-5 h-5"/>}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    loading={loading}
                                    disabled={loading}
                                >
                                    재설정 링크 보내기
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link
                                    href="/login"
                                    className="text-gray-400 hover:text-white flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4"/>
                                    로그인으로 돌아가기
                                </Link>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}