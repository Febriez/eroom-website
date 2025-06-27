'use client'

import {AlertCircle, Bug, CheckCircle, Clock, FileText, Upload} from 'lucide-react'
import {useState} from 'react'

export default function BugReportPage() {
    const [bugType, setBugType] = useState('')
    const [severity, setSeverity] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [steps, setSteps] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const bugTypes = [
        {id: 'crash', name: '게임 충돌/종료', icon: '💥'},
        {id: 'gameplay', name: '게임플레이 오류', icon: '🎮'},
        {id: 'visual', name: '그래픽/시각적 문제', icon: '🖼️'},
        {id: 'audio', name: '사운드 문제', icon: '🔊'},
        {id: 'network', name: '네트워크/연결 문제', icon: '🌐'},
        {id: 'performance', name: '성능/최적화 문제', icon: '⚡'},
        {id: 'other', name: '기타', icon: '📋'}
    ]

    const severityLevels = [
        {id: 'critical', name: '치명적', desc: '게임을 플레이할 수 없음', color: 'text-red-500'},
        {id: 'major', name: '심각', desc: '주요 기능이 작동하지 않음', color: 'text-orange-500'},
        {id: 'minor', name: '보통', desc: '불편하지만 플레이 가능', color: 'text-yellow-500'},
        {id: 'trivial', name: '경미', desc: '사소한 문제', color: 'text-green-500'}
    ]

    const recentReports = [
        {id: 1, title: "멀티플레이 중 연결 끊김", type: "network", severity: "major", status: "investigating", date: "2일 전"},
        {id: 2, title: "특정 맵에서 텍스처 깨짐", type: "visual", severity: "minor", status: "fixed", date: "5일 전"},
        {id: 3, title: "음성 채팅 에코 현상", type: "audio", severity: "minor", status: "in-progress", date: "1주일 전"}
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'fixed':
                return <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm">해결됨</span>
            case 'in-progress':
                return <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-lg text-sm">처리 중</span>
            case 'investigating':
                return <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-lg text-sm">조사 중</span>
            default:
                return null
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // 실제로는 여기서 API 호출
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-black py-32 px-8 flex items-center justify-center">
                <div className="max-w-2xl mx-auto text-center">
                    <div
                        className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-12 h-12"/>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">버그 리포트가 제출되었습니다!</h1>
                    <p className="text-xl text-gray-300 mb-8">
                        소중한 제보 감사합니다. 24시간 이내에 검토 후 이메일로 답변드리겠습니다.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false)
                            setBugType('')
                            setSeverity('')
                            setTitle('')
                            setDescription('')
                            setSteps('')
                            setEmail('')
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all"
                    >
                        새 버그 신고하기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        버그 리포트
                    </h1>
                    <p className="text-2xl text-gray-300">게임을 개선하는데 도움을 주세요</p>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-16">
                    {/* Bug Report Form */}
                    <div className="col-span-2">
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Bug className="w-8 h-8 text-green-400"/>
                                버그 신고하기
                            </h2>

                            <div className="space-y-6">
                                {/* Bug Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-3">
                                        버그 유형 *
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {bugTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setBugType(type.id)}
                                                className={`p-4 rounded-lg border text-center transition-all ${
                                                    bugType === type.id
                                                        ? 'border-green-600 bg-green-900/20'
                                                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                                                }`}
                                            >
                                                <div className="text-2xl mb-2">{type.icon}</div>
                                                <div className="text-sm">{type.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-3">
                                        심각도 *
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {severityLevels.map((level) => (
                                            <button
                                                key={level.id}
                                                type="button"
                                                onClick={() => setSeverity(level.id)}
                                                className={`p-4 rounded-lg border transition-all ${
                                                    severity === level.id
                                                        ? 'border-green-600 bg-green-900/20'
                                                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                                                }`}
                                            >
                                                <div className={`font-bold mb-1 ${level.color}`}>{level.name}</div>
                                                <div className="text-xs text-gray-500">{level.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                                        제목 *
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                        placeholder="버그를 간단히 설명해주세요"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-400 mb-2">
                                        상세 설명 *
                                    </label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                        rows={5}
                                        placeholder="버그가 발생한 상황을 자세히 설명해주세요"
                                        required
                                    />
                                </div>

                                {/* Reproduction Steps */}
                                <div>
                                    <label htmlFor="steps" className="block text-sm font-medium text-gray-400 mb-2">
                                        재현 방법 *
                                    </label>
                                    <textarea
                                        id="steps"
                                        value={steps}
                                        onChange={(e) => setSteps(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                        rows={4}
                                        placeholder="1. 게임을 실행합니다&#10;2. 멀티플레이 메뉴를 선택합니다&#10;3. ..."
                                        required
                                    />
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        스크린샷/동영상 (선택사항)
                                    </label>
                                    <div
                                        className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-600/50 transition-colors cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3"/>
                                        <p className="text-gray-400">파일을 드래그하거나 클릭하여 업로드</p>
                                        <p className="text-sm text-gray-500 mt-2">최대 10MB (PNG, JPG, MP4)</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                        이메일 (답변 받으실 주소) *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !bugType || !severity || !title || !description || !steps || !email}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? '제출 중...' : '버그 리포트 제출'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Guidelines */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-400"/>
                                리포트 작성 가이드
                            </h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>구체적이고 명확하게 작성해주세요</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>재현 가능한 단계를 포함해주세요</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>시스템 사양을 함께 알려주세요</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>가능하면 스크린샷을 첨부해주세요</span>
                                </li>
                            </ul>
                        </div>

                        {/* System Info */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-green-400"/>
                                자동 수집 정보
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                다음 정보는 자동으로 수집됩니다:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>• 게임 버전</li>
                                <li>• 운영체제</li>
                                <li>• 그래픽 카드</li>
                                <li>• 오류 로그</li>
                            </ul>
                        </div>

                        {/* Recent Reports */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-400"/>
                                최근 리포트 상태
                            </h3>
                            <div className="space-y-3">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="p-3 bg-gray-900 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-sm">{report.title}</h4>
                                            {getStatusBadge(report.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{bugTypes.find(t => t.id === report.type)?.name}</span>
                                            <span>{report.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}