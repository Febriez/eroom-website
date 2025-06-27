'use client'

import {Brain, ChevronRight, Download, Globe, Lock, Play, Sparkles, Star, Users} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'

export default function EroomPage() {
    const [activeTab, setActiveTab] = useState('overview')

    const features = [
        {
            icon: <Brain className="w-8 h-8"/>,
            title: "AI 기반 맵 생성",
            description: "GPT-4가 실시간으로 독창적인 퍼즐을 생성합니다"
        },
        {
            icon: <Users className="w-8 h-8"/>,
            title: "멀티플레이",
            description: "최대 4명의 친구와 함께 협동 플레이"
        },
        {
            icon: <Globe className="w-8 h-8"/>,
            title: "글로벌 공유",
            description: "전 세계 플레이어들과 맵을 공유하고 도전하세요"
        },
        {
            icon: <Star className="w-8 h-8"/>,
            title: "무한한 콘텐츠",
            description: "AI가 생성하는 끝없는 퍼즐과 스토리"
        }
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Hero */}
                <div className="relative mb-20">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent rounded-3xl blur-3xl"></div>
                    <div
                        className="relative bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-16 border border-green-900/30">
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div>
                                <div
                                    className="inline-flex items-center gap-2 bg-green-900/20 px-4 py-2 rounded-full mb-6">
                                    <Lock className="w-4 h-4 text-green-400"/>
                                    <span className="text-green-400 text-sm font-medium">AI 방탈출 게임</span>
                                </div>
                                <h1 className="text-8xl font-black mb-6 gradient-text">EROOM</h1>
                                <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
                                    인공지능이 만드는 무한한 방탈출의 세계.
                                    매번 새로운 도전, 끝없는 재미.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/support/download"
                                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-3">
                                        <Download className="w-5 h-5"/>
                                        지금 다운로드
                                    </Link>
                                    <button
                                        className="px-8 py-4 border-2 border-green-700 rounded-xl font-bold text-lg hover:bg-green-900/30 transition-all flex items-center gap-3">
                                        <Play className="w-5 h-5"/>
                                        트레일러 보기
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <div
                                    className="aspect-video bg-gradient-to-br from-green-900/20 to-black rounded-2xl border border-green-800/50 flex items-center justify-center">
                                    <Play className="w-20 h-20 text-green-400"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-12 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-4 font-medium transition-all ${
                            activeTab === 'overview'
                                ? 'text-green-400 border-b-2 border-green-400'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        개요
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`px-6 py-4 font-medium transition-all ${
                            activeTab === 'features'
                                ? 'text-green-400 border-b-2 border-green-400'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        주요 기능
                    </button>
                    <button
                        onClick={() => setActiveTab('requirements')}
                        className={`px-6 py-4 font-medium transition-all ${
                            activeTab === 'requirements'
                                ? 'text-green-400 border-b-2 border-green-400'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        시스템 요구사항
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mb-32">
                    {activeTab === 'overview' && (
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-4xl font-bold mb-6">차세대 AI 방탈출 게임</h2>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    EROOM은 최첨단 AI 기술을 활용하여 플레이어마다 완전히 다른 경험을 제공하는 혁신적인 방탈출 게임입니다.
                                    GPT-4 기반의 AI가 실시간으로 맵을 생성하고, 플레이어의 행동을 학습하여 최적화된 난이도를 제공합니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index}
                                         className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-8 border border-gray-800 hover:border-green-600/50 transition-all">
                                        <div className="text-green-400 mb-4">{feature.icon}</div>
                                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-8">
                            <div
                                className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800">
                                <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-green-400"/>
                                    AI 맵 생성 시스템
                                </h3>
                                <p className="text-gray-300 text-lg mb-6">
                                    최신 GPT-4 기술을 활용하여 매번 독특하고 창의적인 맵을 생성합니다.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-gray-400">
                                        <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/>
                                        <span>플레이어 스타일 학습 및 개인화된 퍼즐 생성</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-400">
                                        <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/>
                                        <span>실시간 난이도 조절로 최적의 도전 제공</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-400">
                                        <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/>
                                        <span>스토리 기반 퍼즐로 몰입감 극대화</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requirements' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div
                                className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800">
                                <h3 className="text-2xl font-bold mb-6 text-green-400">최소 사양</h3>
                                <ul className="space-y-4 text-gray-300">
                                    <li><strong>OS:</strong> Windows 10 64-bit</li>
                                    <li><strong>프로세서:</strong> Intel i5-8400 / AMD Ryzen 5 2600</li>
                                    <li><strong>메모리:</strong> 8 GB RAM</li>
                                    <li><strong>그래픽:</strong> GTX 1060 / RX 580</li>
                                    <li><strong>DirectX:</strong> 버전 12</li>
                                    <li><strong>저장공간:</strong> 25 GB</li>
                                </ul>
                            </div>
                            <div
                                className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-green-600/50">
                                <h3 className="text-2xl font-bold mb-6 text-green-400">권장 사양</h3>
                                <ul className="space-y-4 text-gray-300">
                                    <li><strong>OS:</strong> Windows 11 64-bit</li>
                                    <li><strong>프로세서:</strong> Intel i7-10700K / AMD Ryzen 7 3700X</li>
                                    <li><strong>메모리:</strong> 16 GB RAM</li>
                                    <li><strong>그래픽:</strong> RTX 3070 / RX 6700 XT</li>
                                    <li><strong>DirectX:</strong> 버전 12</li>
                                    <li><strong>저장공간:</strong> 25 GB SSD</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .gradient-text {
                        background: linear-gradient(to right, #10b981, #059669);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                `}</style>
            </div>
        </div>
    )
}