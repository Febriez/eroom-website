'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {AlertCircle, Image, Mail, Paperclip, Send, X} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'

export default function InquiryPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [formData, setFormData] = useState({
        category: '',
        subject: '',
        content: '',
        email: user?.email || ''
    })
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const categories = [
        {value: 'account', label: '계정 문제'},
        {value: 'payment', label: '결제/환불'},
        {value: 'technical', label: '기술적 문제'},
        {value: 'gameplay', label: '게임 플레이'},
        {value: 'report', label: '신고/제재'},
        {value: 'suggestion', label: '건의사항'},
        {value: 'other', label: '기타'}
    ]

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const validFiles = files.filter(file => {
            // 이미지 파일만 허용 (최대 5MB)
            const isImage = file.type.startsWith('image/')
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
            return isImage && isValidSize
        })

        // 최대 3개 파일까지 허용
        const totalFiles = [...attachedFiles, ...validFiles].slice(0, 3)
        setAttachedFiles(totalFiles)

        // input 초기화
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setAttachedFiles(files => files.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // TODO: 실제 문의 제출 로직 구현
            // FormData로 파일과 함께 전송
            const submitData = new FormData()
            submitData.append('category', formData.category)
            submitData.append('subject', formData.subject)
            submitData.append('content', formData.content)
            submitData.append('email', formData.email)

            attachedFiles.forEach((file, index) => {
                submitData.append(`attachment_${index}`, file)
            })

            // Firebase Functions 또는 백엔드 API 호출
            await new Promise(resolve => setTimeout(resolve, 2000)) // 임시 딜레이

            setSubmitted(true)
            // 제출 완료 후 최상단으로 스크롤
            window.scrollTo({top: 0, behavior: 'smooth'})
        } catch (error) {
            console.error('Error submitting inquiry:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // 제출 완료 상태로 변경 시 스크롤 (추가 보장)
    useEffect(() => {
        if (submitted) {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }
    }, [submitted])

    if (submitted) {
        return (
            <>
                <PageHeader
                    title="1:1 문의하기"
                    description="고객센터에 직접 문의하실 수 있습니다"
                    badge="고객지원"
                    icon={<Mail className="w-5 h-5"/>}
                />

                <Container className="py-12">
                    <Card className="max-w-2xl mx-auto p-8 text-center animate-fade-in">
                        <div
                            className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-slide-up">
                            <Send className="w-8 h-8"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">문의가 접수되었습니다</h2>
                        <p className="text-gray-400 mb-6">
                            입력하신 이메일({formData.email})로 답변을 보내드리겠습니다.
                            <br/>
                            답변은 영업일 기준 1-2일 내에 발송됩니다.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="primary" onClick={() => router.push('/')}>
                                홈으로 돌아가기
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setSubmitted(false)
                                setFormData({
                                    category: '',
                                    subject: '',
                                    content: '',
                                    email: user?.email || ''
                                })
                                setAttachedFiles([])
                                window.scrollTo({top: 0, behavior: 'smooth'})
                            }}>
                                새 문의 작성
                            </Button>
                        </div>
                    </Card>

                    {/* 페이지 최소 높이 보장 */}
                    <div className="min-h-[50vh]"></div>
                </Container>
            </>
        )
    }

    return (
        <>
            <PageHeader
                title="1:1 문의하기"
                description="고객센터에 직접 문의하실 수 있습니다"
                badge="고객지원"
                icon={<Mail className="w-5 h-5"/>}
            />

            <Container className="py-12">
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 안내 메시지 */}
                            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"/>
                                    <div className="text-sm">
                                        <p className="text-blue-400 font-medium mb-1">문의 전 확인사항</p>
                                        <ul className="text-gray-400 space-y-1">
                                            <li>• FAQ에서 해결 방법을 찾으셨나요?</li>
                                            <li>• 답변은 영업일 기준 1-2일 내에 이메일로 발송됩니다.</li>
                                            <li>• 스크린샷이나 동영상이 있다면 첨부해주세요.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 문의 유형 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    문의 유형 <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                                    required
                                >
                                    <option value="">선택해주세요</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 제목 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    제목 <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="문의 제목을 입력해주세요"
                                    required
                                />
                            </div>

                            {/* 이메일 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    답변받을 이메일 <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>

                            {/* 내용 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    문의 내용 <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="문의하실 내용을 자세히 작성해주세요.&#10;&#10;문제 발생 시간, 오류 메시지, 재현 방법 등을 포함하시면 더 빠른 해결에 도움이 됩니다."
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none h-48"
                                    required
                                />
                            </div>

                            {/* 파일 첨부 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    파일 첨부
                                </label>
                                <div className="space-y-3">
                                    {/* 파일 업로드 버튼 */}
                                    <div className="flex items-center gap-3">
                                        <label
                                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors">
                                            <Paperclip className="w-4 h-4 mr-2"/>
                                            파일 선택
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <span className="text-sm text-gray-400">
                                            이미지 파일만 가능 (최대 3개, 각 5MB 이하)
                                        </span>
                                    </div>

                                    {/* 첨부된 파일 목록 */}
                                    {attachedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            {attachedFiles.map((file, index) => (
                                                <div key={index}
                                                     className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                                                    <div className="flex items-center gap-3">
                                                        <Image className="w-4 h-4 text-gray-400"/>
                                                        <div className="text-sm">
                                                            <p className="text-white">{file.name}</p>
                                                            <p className="text-gray-400">{formatFileSize(file.size)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 제출 버튼 */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '제출 중...' : '문의하기'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    취소
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* 추가 도움말 */}
                    <div className="mt-8 text-center text-sm text-gray-400">
                        <p>긴급한 문의사항은 고객센터로 전화 주세요.</p>
                        <p className="mt-1">☎️ 02-1234-5678 (평일 10:00 - 18:00)</p>
                    </div>
                </div>
            </Container>
        </>
    )
}