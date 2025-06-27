'use client'

import {Bug, Calendar, Sparkles, Users, Zap} from 'lucide-react'
import {useState} from 'react'

interface PatchNote {
    version: string
    date: string
    type: 'major' | 'minor' | 'hotfix'
    title: string
    description: string
    features?: string[]
    improvements?: string[]
    bugfixes?: string[]
    icon: React.ReactNode
}

export default function UpdatesPage() {
    const [selectedType, setSelectedType] = useState<string>('all')

    const allPatchNotes: PatchNote[] = [
        {
            version: "2.0.0",
            date: "2025.06.20",
            type: "major",
            title: "AI 엔진 대규모 업데이트",
            description: "차세대 AI 기술을 적용한 대규모 업데이트입니다. 더욱 똑똑하고 창의적인 맵 생성이 가능해졌습니다.",
            features: [
                "GPT-4 기반 맵 생성 알고리즘 도입",
                "실시간 난이도 조절 시스템",
                "40개 이상의 새로운 퍼즐 메커니즘",
                "AI 힌트 시스템 추가"
            ],
            improvements: [
                "맵 생성 속도 50% 향상",
                "메모리 사용량 30% 감소",
                "그래픽 품질 개선"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        },
        {
            version: "1.9.5",
            date: "2025.06.15",
            type: "minor",
            title: "협동 플레이 개선",
            description: "친구들과 함께하는 플레이가 더욱 즐거워집니다.",
            features: [
                "새로운 4인 협동 전용 맵",
                "역할 분담 시스템 추가",
                "팀 전용 도전과제"
            ],
            improvements: [
                "음성 채팅 품질 향상",
                "매칭 시스템 개선",
                "친구 초대 UI 개편"
            ],
            bugfixes: [
                "간헐적 연결 끊김 문제 해결",
                "음성 채팅 에코 문제 수정"
            ],
            icon: <Users className="w-6 h-6"/>
        },
        {
            version: "1.9.4",
            date: "2025.06.10",
            type: "hotfix",
            title: "긴급 버그 수정",
            description: "안정성 향상을 위한 긴급 패치입니다.",
            bugfixes: [
                "메모리 누수 문제 해결",
                "특정 맵에서 발생하는 충돌 수정",
                "저장 파일 손상 문제 해결",
                "UI 겹침 현상 수정"
            ],
            icon: <Bug className="w-6 h-6"/>
        }
    ]

    const filteredNotes = selectedType === 'all'
        ? allPatchNotes
        : allPatchNotes.filter(note => note.type === selectedType)

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'major':
                return 'from-green-600 to-emerald-600'
            case 'minor':
                return 'from-blue-600 to-cyan-600'
            case 'hotfix':
                return 'from-orange-600 to-amber-600'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        패치 노트
                    </h1>
                    <p className="text-2xl text-gray-300">EROOM의 모든 업데이트 내역을 확인하세요</p>
                </div>

                {/* Filter */}
                <div className="flex gap-4 mb-12">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedType('major')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'major'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        메이저
                    </button>
                    <button
                        onClick={() => setSelectedType('minor')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'minor'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        마이너
                    </button>
                    <button
                        onClick={() => setSelectedType('hotfix')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'hotfix'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        핫픽스
                    </button>
                </div>

                {/* Patch Notes */}
                <div className="space-y-8 mb-32">
                    {filteredNotes.map((note, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800"
                        >
                            <div className="flex items-start gap-6 mb-8">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(note.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    {note.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h2 className="text-3xl font-bold">v{note.version} - {note.title}</h2>
                                        <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/>
                                            {note.date}
                    </span>
                                    </div>
                                    <p className="text-gray-400 text-lg">{note.description}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {note.features && (
                                    <div>
                                        <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5"/>
                                            새로운 기능
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-green-500 mt-1">+</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {note.improvements && (
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                                            <Zap className="w-5 h-5"/>
                                            개선사항
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.improvements.map((improvement, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {note.bugfixes && (
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                                            <Bug className="w-5 h-5"/>
                                            버그 수정
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.bugfixes.map((fix, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-orange-500 mt-1">-</span>
                                                    <span>{fix}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}