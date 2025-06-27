'use client'

import {Calendar, Sparkles} from 'lucide-react'

export default function UpcomingPage() {
    const upcomingGames = [
        {
            title: "Project: MIND",
            genre: "심리 호러 퍼즐",
            releaseDate: "2025 Q4",
            description: "AI가 플레이어의 심리를 분석하여 공포를 극대화하는 차세대 호러 게임",
            features: ["심리 분석 AI", "개인화된 공포 경험", "VR 지원"]
        },
        {
            title: "ChronoLoop",
            genre: "시간 조작 퍼즐",
            releaseDate: "2026 Q1",
            description: "시간을 되돌리고 조작하여 퍼즐을 해결하는 혁신적인 게임",
            features: ["시간 역행 메커니즘", "멀티 타임라인", "협동 시간 조작"]
        },
        {
            title: "Neural Network",
            genre: "사이버펑크 액션",
            releaseDate: "2026 Q2",
            description: "AI와 인간이 공존하는 미래 도시를 배경으로 한 액션 어드벤처",
            features: ["오픈 월드", "AI 동료 시스템", "해킹 메커니즘"]
        }
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        출시 예정 게임
                    </h1>
                    <p className="text-2xl text-gray-300">BangtalBoyBand가 준비 중인 차세대 AI 게임들</p>
                </div>

                <div className="space-y-8 mb-32">
                    {upcomingGames.map((game, index) => (
                        <div key={index}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-12 border border-gray-800 hover:border-green-600/50 transition-all">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-4xl font-bold mb-3">{game.title}</h2>
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <span
                                            className="px-3 py-1 bg-green-900/30 rounded-lg text-green-400">{game.genre}</span>
                                        <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4"/>
                                            {game.releaseDate}
                    </span>
                                    </div>
                                </div>
                                <Sparkles className="w-10 h-10 text-green-400"/>
                            </div>

                            <p className="text-xl text-gray-300 mb-8">{game.description}</p>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-green-400">주요 특징</h3>
                                <div className="flex gap-3">
                                    {game.features.map((feature, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300">
                      {feature}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}