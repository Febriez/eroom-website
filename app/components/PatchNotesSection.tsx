'use client'

import {ArrowRight, Bug, Calendar, Gamepad2, Shield, Sparkles} from 'lucide-react'
import Link from 'next/link'

interface PatchNote {
    version: string
    date: string
    type: 'major' | 'minor' | 'hotfix'
    title: string
    highlights: string[]
    icon: React.ReactNode
}

export default function PatchNotesSection() {
    const patchNotes: PatchNote[] = [
        {
            version: "2.0.0",
            date: "2025.06.20",
            type: "major",
            title: "AI 엔진 대규모 업데이트",
            highlights: [
                "GPT-4 기반 맵 생성 알고리즘 개선",
                "실시간 난이도 조절 시스템 추가",
                "40개 이상의 새로운 퍼즐 메커니즘"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        },
        {
            version: "1.9.5",
            date: "2025.06.15",
            type: "minor",
            title: "협동 플레이 개선",
            highlights: [
                "음성 채팅 품질 향상",
                "새로운 팀 전용 퍼즐 추가",
                "친구 초대 시스템 개편"
            ],
            icon: <Gamepad2 className="w-6 h-6"/>
        },
        {
            version: "1.9.4",
            date: "2025.06.10",
            type: "hotfix",
            title: "버그 수정 및 최적화",
            highlights: [
                "메모리 누수 문제 해결",
                "로딩 시간 30% 단축",
                "충돌 문제 수정"
            ],
            icon: <Bug className="w-6 h-6"/>
        }
    ]

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

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'major':
                return '메이저 업데이트'
            case 'minor':
                return '마이너 업데이트'
            case 'hotfix':
                return '핫픽스'
            default:
                return '업데이트'
        }
    }

    return (
        <section className="py-32 px-8 bg-gradient-to-b from-black via-gray-900/20 to-black">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-green-900/20 px-6 py-2 rounded-full mb-6">
                        <Shield className="w-5 h-5 text-green-400"/>
                        <span className="text-green-400 font-medium">최신 업데이트</span>
                    </div>
                    <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        패치 노트
                    </h2>
                    <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        EROOM의 최신 업데이트와 개선사항을 확인하세요
                    </p>
                </div>

                {/* Patch Notes Cards */}
                <div className="grid gap-8 mb-16">
                    {patchNotes.map((note, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 hover:border-green-600/50 transition-all duration-500"
                        >
                            <div className="flex items-start gap-8">
                                {/* Icon */}
                                <div
                                    className={`w-20 h-20 bg-gradient-to-br ${getTypeColor(note.type)} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    {note.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                    <span
                        className={`px-4 py-1 bg-gradient-to-r ${getTypeColor(note.type)} rounded-full text-sm font-bold`}>
                      {getTypeBadge(note.type)}
                    </span>
                                        <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/>
                                            {note.date}
                    </span>
                                        <span className="text-2xl font-bold text-gray-300">v{note.version}</span>
                                    </div>

                                    <h3 className="text-3xl font-bold mb-6 group-hover:text-green-400 transition-colors">
                                        {note.title}
                                    </h3>

                                    <ul className="space-y-3">
                                        {note.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-400 text-lg">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Arrow */}
                                <ArrowRight
                                    className="w-8 h-8 text-gray-600 group-hover:text-green-400 group-hover:translate-x-2 transition-all duration-300 flex-shrink-0 mt-8"/>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/news/updates"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
                    >
                        모든 업데이트 보기
                        <ArrowRight className="w-6 h-6"/>
                    </Link>
                </div>
            </div>
        </section>
    )
}