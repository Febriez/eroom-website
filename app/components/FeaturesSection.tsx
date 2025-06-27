'use client'

import {Brain, Globe, Shield, Star, Users, Zap} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    tags: string[]
    color: string
}

export default function FeaturesSection() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            {threshold: 0.1}
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const features: Feature[] = [
        {
            icon: <Brain className="w-10 h-10"/>,
            title: "AI 실시간 맵 생성",
            description: "최첨단 GPT-4 기반 AI가 플레이어의 스타일과 선호도를 학습하여 매번 독특하고 도전적인 방탈출 맵을 실시간으로 생성합니다.",
            tags: ["동적 난이도", "개인화된 퍼즐", "무한 콘텐츠"],
            color: "from-green-600 to-green-800"
        },
        {
            icon: <Globe className="w-10 h-10"/>,
            title: "글로벌 맵 공유",
            description: "직관적인 맵 에디터로 당신만의 방을 제작하고, 전 세계 플레이어들과 공유하며 평가받으세요.",
            tags: ["맵 에디터", "평점 시스템", "주간 챌린지"],
            color: "from-emerald-600 to-emerald-800"
        },
        {
            icon: <Users className="w-10 h-10"/>,
            title: "협동 멀티플레이",
            description: "최대 4명의 친구들과 함께 복잡한 퍼즐을 해결하고, 실시간 음성 채팅으로 소통하며 탈출하세요.",
            tags: ["실시간 협동", "음성 채팅", "역할 분담"],
            color: "from-teal-600 to-teal-800"
        },
        {
            icon: <Star className="w-10 h-10"/>,
            title: "성장 시스템",
            description: "레벨업을 통해 새로운 스킬과 도구를 잠금 해제하고, 시즌별 보상과 업적을 달성하세요.",
            tags: ["스킬 트리", "시즌 패스", "업적 시스템"],
            color: "from-cyan-600 to-cyan-800"
        },
        {
            icon: <Shield className="w-10 h-10"/>,
            title: "안전한 환경",
            description: "AI 기반 콘텐츠 필터링과 신고 시스템으로 모든 플레이어가 안전하게 즐길 수 있는 환경을 제공합니다.",
            tags: ["콘텐츠 필터", "신고 시스템", "가족 친화적"],
            color: "from-green-700 to-green-900"
        },
        {
            icon: <Zap className="w-10 h-10"/>,
            title: "초고속 매칭",
            description: "지능형 매치메이킹 시스템으로 실력이 비슷한 플레이어들과 즉시 게임을 시작할 수 있습니다.",
            tags: ["스킬 매칭", "빠른 시작", "밸런스 조정"],
            color: "from-emerald-700 to-emerald-900"
        }
    ]

    return (
        <section ref={sectionRef} className="py-32 px-8 bg-gradient-to-b from-black via-green-950/5 to-black">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-24 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <h2 className="text-7xl font-black mb-8 gradient-text">
                        EROOM의 혁신적인 기능
                    </h2>
                    <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        최첨단 AI 기술이 만들어내는 완전히 새로운 게임 경험
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-8 mb-16">
                    {features.slice(0, 4).map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-12 border border-green-900/30 hover:border-green-600/50 transition-all duration-500 cursor-pointer overflow-hidden ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: hoveredCard === index ? 'scale(1.02)' : 'scale(1)'
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Background gradient on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative flex items-start gap-8">
                                <div
                                    className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold mb-4 group-hover:text-green-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {feature.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-4 py-2 bg-green-900/30 rounded-lg text-sm border border-green-800/50 group-hover:border-green-600/50 transition-colors"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="grid grid-cols-2 gap-8">
                    {features.slice(4).map((feature, index) => (
                        <div
                            key={index + 4}
                            className={`group relative bg-gradient-to-br from-gray-900/30 to-black rounded-2xl p-10 border border-gray-800 hover:border-green-900/50 transition-all duration-500 cursor-pointer ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{transitionDelay: `${(index + 4) * 100}ms`}}
                        >
                            <div className="flex items-center gap-6">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <p className="text-xl text-gray-400 mb-8">
                        더 많은 기능들이 계속 추가되고 있습니다
                    </p>
                    <button
                        className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105">
                        모든 기능 보기
                    </button>
                </div>
            </div>

            <style jsx>{`
        .gradient-text {
          background: linear-gradient(to right, #10b981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
        </section>
    )
}