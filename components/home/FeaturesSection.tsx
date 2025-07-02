// components/home/FeaturesSection.tsx
'use client'

import {ArrowRight, Brain, Globe, Shield, Star, Users, Wand2, Zap} from 'lucide-react'
import React, {useEffect, useRef, useState} from 'react'
import {Card} from '../ui/Card'
import {useRouter} from 'next/navigation'

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    tags: string[]
    color: string
}

export default function FeaturesSection() {
    const router = useRouter()
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    // 클라이언트 사이드에서만 디바이스 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // IntersectionObserver 설정 (클라이언트 사이드에서만)
    useEffect(() => {
        // 서버 사이드에서는 실행하지 않음
        if (typeof window === 'undefined' || !sectionRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px 0px'
            }
        )

        observer.observe(sectionRef.current)

        return () => observer.disconnect()
    }, [])

    const features: Feature[] = [
        {
            icon: <Brain className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "AI 실시간 맵 생성",
            description: "최첨단 GPT-4 기반 AI가 플레이어의 스타일과 선호도를 학습하여 매번 독특하고 도전적인 방탈출 맵을 실시간으로 생성합니다.",
            tags: ["동적 난이도", "개인화된 퍼즐", "무한 콘텐츠"],
            color: "from-green-600 to-green-800"
        },
        {
            icon: <Globe className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "글로벌 맵 공유",
            description: "직관적인 맵 에디터로 당신만의 방을 제작하고, 전 세계 플레이어들과 공유하며 평가받으세요.",
            tags: ["맵 에디터", "평점 시스템", "주간 챌린지"],
            color: "from-emerald-600 to-emerald-800"
        },
        {
            icon: <Users className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "협동 멀티플레이",
            description: "최대 4명의 친구들과 함께 복잡한 퍼즐을 해결하고, 실시간 음성 채팅으로 소통하며 탈출하세요.",
            tags: ["실시간 협동", "음성 채팅", "역할 분담"],
            color: "from-teal-600 to-teal-800"
        },
        {
            icon: <Star className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "성장 시스템",
            description: "레벨업을 통해 새로운 스킬과 도구를 잠금 해제하고, 시즌별 보상과 업적을 달성하세요.",
            tags: ["스킬 트리", "시즌 패스", "업적 시스템"],
            color: "from-cyan-600 to-cyan-800"
        },
        {
            icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "안전한 환경",
            description: "AI 기반 콘텐츠 필터링과 신고 시스템으로 모든 플레이어가 안전하게 즐길 수 있는 환경을 제공합니다.",
            tags: ["콘텐츠 필터", "신고 시스템", "가족 친화적"],
            color: "from-green-700 to-green-900"
        },
        {
            icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10"/>,
            title: "초고속 매칭",
            description: "지능형 매치메이킹 시스템으로 실력이 비슷한 플레이어들과 즉시 게임을 시작할 수 있습니다.",
            tags: ["스킬 매칭", "빠른 시작", "밸런스 조정"],
            color: "from-emerald-700 to-emerald-900"
        }
    ]

    const handleViewAllFeatures = () => {
        // 옵션 1: 기능 상세 페이지로 이동
        router.push('/community/guides')

        // 옵션 2: 업데이트 페이지로 이동 (기능 업데이트 내역)
        // router.push('/updates')

        // 옵션 3: 외부 링크로 이동
        // window.open('https://eroom.co.kr/features', '_blank')
    }

    return (
        <section
            ref={sectionRef}
            className="py-16 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-black via-green-950/5 to-black min-h-screen"
        >
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className={`text-center mb-12 sm:mb-24 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        EROOM의 혁신적인 기능
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        최첨단 AI 기술이 만들어내는 완전히 새로운 게임 경험
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-16">
                    {features.slice(0, 4).map((feature, index) => (
                        <Card
                            key={index}
                            hover
                            className={`p-8 sm:p-12 transition-all duration-500 cursor-pointer overflow-hidden group ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: !isMobile && hoveredCard === index ? 'scale(1.02)' : 'scale(1)'
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(index)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                        >
                            {/* Background gradient on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                            />

                            <div className="relative flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                                <div
                                    className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg text-white`}>
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white hover:text-green-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {feature.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-900/30 rounded-lg text-xs sm:text-sm border border-green-800/50 hover:border-green-600/50 transition-colors text-green-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {features.slice(4).map((feature, index) => (
                        <Card
                            key={index + 4}
                            hover
                            variant="gradient"
                            className={`p-6 sm:p-10 cursor-pointer transition-all duration-500 group ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{transitionDelay: `${(index + 4) * 100}ms`}}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                <div
                                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 text-white`}>
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white hover:text-green-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-12 sm:mt-20 transition-all duration-1000 delay-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
                        더 많은 기능들이 계속 추가되고 있습니다
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/support/download')}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-white">
                            <Wand2 className="w-5 h-5"/>
                            첫번째 맵 만들기
                        </button>
                        <button
                            onClick={handleViewAllFeatures}
                            className="px-8 py-4 bg-gray-800 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-white flex items-center justify-center gap-2">
                            <ArrowRight className="w-5 h-5"/>
                            모든 기능 보기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}