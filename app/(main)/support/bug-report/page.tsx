// app/(main)/support/bug-report/page.tsx
'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {AlertCircle, Bug, CheckCircle, Paperclip, Upload, X} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'

interface BugReport {
    title: string
    category: string
    severity: string
    description: string
    steps: string
    system: string
    attachments: File[]
}

export default function BugReportPage() {
    const {user} = useAuth()
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState<BugReport>({
        title: '',
        category: 'bug',
        severity: 'medium',
        description: '',
        steps: '',
        system: '',
        attachments: []
    })

    const categories = [
        {value: 'bug', label: '버그', description: '게임 오류 및 문제점'},
        {value: 'suggestion', label: '제안', description: '개선 아이디어'},
        {value: 'other', label: '기타', description: '기타 문의사항'}
    ]

    const severities = [
        {value: 'low', label: '낮음', color: 'text-gray-400'},
        {value: 'medium', label: '보통', color: 'text-yellow-400'},
        {value: 'high', label: '높음', color: 'text-orange-400'},
        {value: 'critical', label: '심각', color: 'text-red-400'}
    ]

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files].slice(0, 5) // 최대 5개
        }))
    }

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        // 실제 제출 로직 시뮬레이션
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)) // API 호출 시뮬레이션
            console.log('Submitting bug report:', formData)
            setSubmitted(true)
            // 제출 완료 후 최상단으로 스크롤
            window.scrollTo({top: 0, behavior: 'smooth'})
        } catch (error) {
            console.error('Error submitting bug report:', error)
        } finally {
            setSubmitting(false)
        }
    }

    // 제출 완료 상태로 변경 시 스크롤 (추가 보장)
    useEffect(() => {
        if (submitted) {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }
    }, [submitted])

    // 로그인하지 않은 경우
    if (!user) {
        return (
            <>
                <PageHeader
                    title="버그 리포트"
                    description="게임 개선을 위한 여러분의 소중한 의견을 들려주세요"
                    badge="피드백"
                    icon={<Bug className="w-5 h-5"/>}
                />

                <Container className="py-12">
                    <Card className="p-8 text-center max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                        <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
                        <p className="text-gray-400 mb-6">
                            버그 리포트를 제출하려면 로그인해주세요.
                        </p>
                        <Button variant="primary" onClick={() => window.location.href = '/login'}>
                            로그인하기
                        </Button>
                    </Card>
                </Container>
            </>
        )
    }

    // 제출 완료 상태
    if (submitted) {
        return (
            <>
                <PageHeader
                    title="버그 리포트"
                    description="게임 개선을 위한 여러분의 소중한 의견을 들려주세요"
                    badge="피드백"
                    icon={<Bug className="w-5 h-5"/>}
                />

                <Container className="py-12">
                    <Card className="p-12 text-center max-w-md mx-auto animate-fade-in">
                        <div className="relative">
                            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 animate-slide-up"/>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">제출 완료!</h2>
                        <p className="text-gray-300 mb-2">
                            소중한 의견 감사합니다.
                        </p>
                        <p className="text-gray-400 mb-8">
                            빠른 시일 내에 검토하여 개선하겠습니다.
                        </p>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => {
                                    setSubmitted(false)
                                    setFormData({
                                        title: '',
                                        category: 'bug',
                                        severity: 'medium',
                                        description: '',
                                        steps: '',
                                        system: '',
                                        attachments: []
                                    })
                                    window.scrollTo({top: 0, behavior: 'smooth'})
                                }}
                            >
                                새 리포트 작성
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => window.location.href = '/'}
                            >
                                홈으로 돌아가기
                            </Button>
                        </div>
                    </Card>

                    {/* 페이지 최소 높이 보장 */}
                    <div className="min-h-[50vh]"></div>
                </Container>
            </>
        )
    }

    // 리포트 작성 폼
    return (
        <>
            <PageHeader
                title="버그 리포트"
                description="게임 개선을 위한 여러분의 소중한 의견을 들려주세요"
                badge="피드백"
                icon={<Bug className="w-5 h-5"/>}
            />

            <Container className="py-12">
                <div className="max-w-3xl mx-auto">
                    {/* 안내 메시지 */}
                    <Card className="p-6 mb-8 bg-blue-900/20 border-blue-700/50">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5"/>
                            <div>
                                <h3 className="font-bold mb-2">버그 리포트 작성 팁</h3>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li>• 문제를 명확하고 구체적으로 설명해주세요</li>
                                    <li>• 재현 방법을 단계별로 작성해주세요</li>
                                    <li>• 스크린샷이나 동영상을 첨부하면 도움이 됩니다</li>
                                    <li>• 시스템 사양을 포함해주세요</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* 리포트 폼 */}
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 카테고리 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    카테고리
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {categories.map(category => (
                                        <button
                                            key={category.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({...prev, category: category.value}))}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                formData.category === category.value
                                                    ? 'border-green-600 bg-green-900/20'
                                                    : 'border-gray-800 hover:border-gray-700'
                                            }`}
                                        >
                                            <p className="font-medium mb-1">{category.label}</p>
                                            <p className="text-xs text-gray-400">{category.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 심각도 (버그인 경우에만) */}
                            {formData.category === 'bug' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        심각도
                                    </label>
                                    <div className="flex gap-3">
                                        {severities.map(severity => (
                                            <button
                                                key={severity.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    severity: severity.value
                                                }))}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                    formData.severity === severity.value
                                                        ? 'bg-gray-700 ring-2 ring-green-600'
                                                        : 'bg-gray-800 hover:bg-gray-700'
                                                }`}
                                            >
                                                <span className={severity.color}>{severity.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 제목 */}
                            <Input
                                label="제목"
                                placeholder="문제를 간단히 요약해주세요"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                required
                            />

                            {/* 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    상세 설명
                                </label>
                                <textarea
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
                                    rows={5}
                                    placeholder="문제에 대해 자세히 설명해주세요"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                    required
                                />
                            </div>

                            {/* 재현 방법 */}
                            {formData.category === 'bug' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        재현 방법
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
                                        rows={4}
                                        placeholder="1. 게임을 실행합니다&#10;2. 메인 메뉴에서 '시작'을 클릭합니다&#10;3. ..."
                                        value={formData.steps}
                                        onChange={(e) => setFormData(prev => ({...prev, steps: e.target.value}))}
                                    />
                                </div>
                            )}

                            {/* 시스템 정보 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    시스템 정보 (선택사항)
                                </label>
                                <textarea
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="OS: Windows 11&#10;CPU: Intel i7-10700K&#10;GPU: RTX 3070&#10;RAM: 16GB"
                                    value={formData.system}
                                    onChange={(e) => setFormData(prev => ({...prev, system: e.target.value}))}
                                />
                            </div>

                            {/* 파일 첨부 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    파일 첨부 (선택사항)
                                </label>
                                <div className="space-y-3">
                                    <label
                                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 cursor-pointer transition-colors">
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                                            <p className="text-sm text-gray-400">
                                                클릭하여 파일 업로드 (최대 5개)
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                이미지, 동영상, 로그 파일 등
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            accept="image/*,video/*,.txt,.log"
                                        />
                                    </label>

                                    {/* 첨부된 파일 목록 */}
                                    {formData.attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.attachments.map((file, index) => (
                                                <div key={index}
                                                     className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Paperclip className="w-4 h-4 text-gray-400"/>
                                                        <span className="text-sm break-keep-all">{file.name}</span>
                                                        <span className="text-xs text-gray-500">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-gray-400 hover:text-red-400 transition-colors"
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
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!formData.title || !formData.description || submitting}
                                    fullWidth
                                >
                                    {submitting ? '제출 중...' : '리포트 제출'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </Container>
        </>
    )
}