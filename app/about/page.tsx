'use client'

import {Brain, Code, Heart, Key, Rocket, Shield, Star, Users} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
    const milestones = [
        {year: "2023", title: "BangtalBoyBand 설립", desc: "AI 게임 개발을 위한 첫 발걸음"},
        {year: "2024", title: "EROOM 프로토타입 완성", desc: "GPT-4 기반 맵 생성 엔진 개발"},
        {year: "2025", title: "EROOM 정식 출시", desc: "글로벌 서비스 런칭 및 10만 유저 달성"},
        {year: "미래", title: "새로운 도전", desc: "더 많은 AI 게임으로 확장"}
    ]

    const values = [
        {
            icon: <Brain className="w-8 h-8"/>,
            title: "혁신",
            description: "AI 기술을 통해 게임 산업의 새로운 패러다임을 제시합니다"
        },
        {
            icon: <Heart className="w-8 h-8"/>,
            title: "열정",
            description: "게임에 대한 사랑과 열정으로 최고의 경험을 만들어갑니다"
        },
        {
            icon: <Users className="w-8 h-8"/>,
            title: "소통",
            description: "플레이어와의 끊임없는 소통으로 더 나은 게임을 만듭니다"
        },
        {
            icon: <Shield className="w-8 h-8"/>,
            title: "신뢰",
            description: "투명하고 정직한 운영으로 신뢰받는 회사가 되겠습니다"
        }
    ]

    const team = [
        {
            name: "방화채",
            role: "CEO & Founder",
            description: "AI 연구자 출신, 10년간의 게임 개발 경험",
            icon: <Star className="w-12 h-12"/>
        },
        {
            name: "김철수",
            role: "CTO",
            description: "풀스택 개발자, AI 시스템 아키텍처 전문가",
            icon: <Code className="w-12 h-12"/>
        },
        {
            name: "이영희",
            role: "Lead Game Designer",
            description: "AAA 게임 디자이너 출신, 창의적인 게임플레이 설계",
            icon: <Rocket className="w-12 h-12"/>
        }
    ]

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center justify-center mb-8">
                        <div className="relative group">
                            <div
                                className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center transform rotate-12">
                                <Key className="w-16 h-16 transform -rotate-12"/>
                            </div>
                            <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-3xl"></div>
                        </div>
                    </div>
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        BangtalBoyBand
                    </h1>
                    <p className="text-3xl text-gray-300 mb-4">AI Gaming Studio</p>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        인공지능과 창의성이 만나 새로운 게임 경험을 창조합니다
                    </p>
                </div>

                {/* Mission Section */}
                <div className="mb-32">
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-16 border border-green-900/30">
                        <h2 className="text-4xl font-bold mb-8 text-center">우리의 미션</h2>
                        <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
                            BangtalBoyBand는 최첨단 AI 기술을 활용하여 플레이어마다 독특하고 개인화된 게임 경험을 제공합니다.
                            우리는 게임이 단순한 오락을 넘어 창의성을 자극하고, 문제 해결 능력을 키우며,
                            전 세계 사람들을 연결하는 매개체가 될 수 있다고 믿습니다.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-32">
                    <h2 className="text-5xl font-bold text-center mb-16">핵심 가치</h2>
                    <div className="grid grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <div key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 hover:border-green-600/50 transition-all">
                                <div className="flex items-start gap-6">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {value.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                                        <p className="text-gray-400">{value.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Journey Section */}
                <div className="mb-32">
                    <h2 className="text-5xl font-bold text-center mb-16">우리의 여정</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-600 to-green-800"></div>

                        {/* Milestones */}
                        <div className="space-y-16">
                            {milestones.map((milestone, index) => (
                                <div key={index}
                                     className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="flex-1">
                                        <div
                                            className={`bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-8 border border-gray-800 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                            <h3 className="text-3xl font-bold text-green-400 mb-2">{milestone.year}</h3>
                                            <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                                            <p className="text-gray-400">{milestone.desc}</p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 bg-green-600 rounded-full border-4 border-black z-10"></div>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-32">
                    <h2 className="text-5xl font-bold text-center mb-16">리더십 팀</h2>
                    <div className="grid grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 hover:border-green-600/50 transition-all text-center">
                                <div
                                    className="w-24 h-24 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <div className="text-green-400">{member.icon}</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                                <p className="text-green-400 mb-4">{member.role}</p>
                                <p className="text-gray-400">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-8">함께 미래를 만들어가요</h2>
                    <p className="text-xl text-gray-400 mb-8">BangtalBoyBand와 함께 게임의 새로운 미래를 만들어갈 인재를 찾습니다</p>
                    <Link href="/careers"
                          className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105">
                        채용 정보 보기
                    </Link>
                </div>
            </div>
        </div>
    )
}