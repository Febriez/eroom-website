// app/(main)/support/inquiry/page.tsx
'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {useAuth} from '@/contexts/AuthContext'
import {CheckCircle, HelpCircle, Mail, MessageSquare, Phone, Send} from 'lucide-react'

export default function InquiryPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        type: 'general',
        subject: '',
        message: '',
        email: user?.email || '',
        name: user?.displayName || ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const inquiryTypes = [
        {value: 'general', label: '일반 문의'},
        {value: 'bug', label: '버그 신고'},
        {value: 'account', label: '계정 관련'},
        {value: 'payment', label: '결제 관련'},
        {value: 'suggestion', label: '제안 사항'},
        {value: 'other', label: '기타'}
    ]

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.subject.trim()) {
            newErrors.subject = '제목을 입력해주세요'
        }

        if (!formData.message.trim()) {
            newErrors.message = '문의 내용을 입력해주세요'
        } else if (formData.message.length < 10) {
            newErrors.message = '문의 내용은 10자 이상 입력해주세요'
        }

        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해주세요'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다'
        }

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        // TODO: 실제로는 Firebase Functions나 백엔드 API로 문의 내용을 전송해야 함
        // 현재는 성공 상태만 표시
        setSubmitted(true)

        // 3초 후 고객센터 메인으로 이동
        setTimeout(() => {
            router.push('/support')
        }, 3000)
    }

    if (submitted) {
        return (
            <>
                <PageHeader
                    title="1:1 문의하기"
                    description="문의가 성공적으로 접수되었습니다"
                    badge="고객지원"
                    icon={<Mail className="w-5 h-5"/>}
                />

                <Container className="py-12">
                    <Card className="max-w-2xl mx-auto p-12 text-center">
                        <div
                            className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">문의가 접수되었습니다</h2>
                        <p className="text-gray-400 mb-6">
                            빠른 시일 내에 입력하신 이메일로 답변을 보내드리겠습니다.<br/>
                            평균 응답 시간: 영업일 기준 1-2일
                        </p>
                        <Button variant="primary" onClick={() => router.push('/support')}>
                            고객센터로 돌아가기
                        </Button>
                    </Card>
                </Container>
            </>
        )
    }

    return (
        <>
            <PageHeader
                title="1:1 문의하기"
                description="해결되지 않은 문제가 있다면 직접 문의해주세요"
                badge="고객지원"
                icon={<Mail className="w-5 h-5"/>}
            />

            <Container className="py-12">
                <div className="max-w-4xl mx-auto">
                    {/* 안내 메시지 */}
                    <Card className="p-6 mb-8 bg-gradient-to-br from-blue-900/20 to-blue-800/20">
                        <div className="flex items-start gap-4">
                            <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="font-bold mb-2">문의하기 전에 확인해주세요</h3>
                                <ul className="space-y-1 text-sm text-gray-400">
                                    <li>• 자주 묻는 질문(FAQ)에서 답변을 찾을 수 있는지 확인해보세요</li>
                                    <li>• 버그 신고 시 발생 상황을 자세히 설명해주세요</li>
                                    <li>• 영업일 기준 1-2일 내에 답변드립니다</li>
                                    <li>• 긴급한 문의는 고객센터 전화로 연락주세요: 02-123-4567</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* 문의 폼 */}
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 문의 유형 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">문의 유형</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                                >
                                    {inquiryTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 이름 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">이름</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="홍길동"
                                    error={errors.name}
                                />
                            </div>

                            {/* 이메일 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">이메일</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="your@email.com"
                                    error={errors.email}
                                />
                                <p className="text-xs text-gray-400 mt-1">답변을 받으실 이메일 주소를 입력해주세요</p>
                            </div>

                            {/* 제목 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">제목</label>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="문의 제목을 입력해주세요"
                                    error={errors.subject}
                                />
                            </div>

                            {/* 문의 내용 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">문의 내용</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="문의하실 내용을 자세히 작성해주세요"
                                    rows={8}
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:border-green-500 resize-none ${
                                        errors.message ? 'border-red-500' : 'border-gray-700'
                                    }`}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    {formData.message.length}/1000자
                                </p>
                            </div>

                            {/* 제출 버튼 */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4"/>
                                    문의 보내기
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    취소
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* 연락처 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <Card className="p-6 text-center">
                            <Phone className="w-8 h-8 text-green-400 mx-auto mb-3"/>
                            <h4 className="font-bold mb-2">전화 문의</h4>
                            <p className="text-sm text-gray-400">02-123-4567</p>
                            <p className="text-xs text-gray-500 mt-1">평일 10:00 - 18:00</p>
                        </Card>

                        <Card className="p-6 text-center">
                            <Mail className="w-8 h-8 text-green-400 mx-auto mb-3"/>
                            <h4 className="font-bold mb-2">이메일</h4>
                            <p className="text-sm text-gray-400">support@example.com</p>
                            <p className="text-xs text-gray-500 mt-1">1-2일 내 답변</p>
                        </Card>

                        <Card className="p-6 text-center">
                            <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-3"/>
                            <h4 className="font-bold mb-2">실시간 채팅</h4>
                            <p className="text-sm text-gray-400">준비 중</p>
                            <p className="text-xs text-gray-500 mt-1">곧 오픈 예정</p>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}