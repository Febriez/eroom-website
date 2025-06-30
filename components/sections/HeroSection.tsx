'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {ChevronDown, Download, Play} from 'lucide-react'
import {useDevice} from '@/lib/hooks/useDevice'
import {useRouter} from 'next/navigation'
import {Button} from '../ui/Button'

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({x: 50, y: 50})
    const heroRef = useRef<HTMLDivElement>(null)
    const {isMobile} = useDevice()
    const router = useRouter()

    // 파티클 위치를 미리 계산
    const particles = useMemo(() => {
        return Array.from({length: isMobile ? 15 : 30}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            depth: 0.5 + Math.random() * 0.5
        }))
    }, [isMobile])

    const largeParticles = useMemo(() => {
        return Array.from({length: isMobile ? 5 : 10}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            depth: 0.3 + Math.random() * 0.7
        }))
    }, [isMobile])

    useEffect(() => {
        if (isMobile) return

        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect()
                setMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                })
            }
        }

        const hero = heroRef.current
        if (hero) {
            hero.addEventListener('mousemove', handleMouseMove)
            return () => hero.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isMobile])

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-32"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/10 to-black"></div>

                {/* Mouse-following spotlight - Desktop only */}
                {!isMobile && (
                    <div
                        className="absolute w-[1000px] h-[1000px] opacity-20 hidden lg:block"
                        style={{
                            background: `radial-gradient(circle at center, #10b981 0%, transparent 70%)`,
                            left: `${mousePosition.x}%`,
                            top: `${mousePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(100px)',
                            transition: 'all 0.3s ease-out',
                        }}
                    />
                )}

                {/* Static glowing orbs */}
                <div
                    className="absolute top-1/3 -left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-green-800/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/3 -right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-green-700/20 rounded-full blur-3xl animate-pulse"
                    style={{animationDelay: '2s'}}
                ></div>

                {/* Grid overlay */}
                <div className={`absolute inset-0 ${isMobile ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}>
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), 
                               linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                            backgroundSize: isMobile ? '30px 30px' : '50px 50px'
                        }}
                    />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-green-400/50 rounded-full transition-all duration-[3000ms] ease-out"
                            style={{
                                left: `${particle.x + (isMobile ? 0 : (mousePosition.x - 50) * particle.depth * 0.2)}%`,
                                top: `${particle.y + (isMobile ? 0 : (mousePosition.y - 50) * particle.depth * 0.2)}%`,
                                transform: `scale(${0.5 + particle.depth})`,
                                opacity: 0.3 + particle.depth * 0.3,
                            }}
                        />
                    ))}
                </div>

                {/* Larger floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {largeParticles.map((particle, i) => (
                        <div
                            key={`large-${i}`}
                            className="absolute w-2 h-2 bg-green-400/30 rounded-full transition-all duration-[4000ms] ease-out"
                            style={{
                                left: `${particle.x + (isMobile ? 0 : (mousePosition.x - 50) * particle.depth * 0.3)}%`,
                                top: `${particle.y + (isMobile ? 0 : (mousePosition.y - 50) * particle.depth * 0.3)}%`,
                                transform: `scale(${0.8 + particle.depth})`,
                                filter: 'blur(1px)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 container-custom text-center">
                {/* Badge */}
                <div
                    className="mb-6 sm:mb-10 inline-flex items-center gap-2 sm:gap-3 bg-green-900/20 px-6 py-2 rounded-full">
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-xs sm:text-base font-medium text-green-400 tracking-wide uppercase">
            AI가 창조하는 무한한 방탈출 세계
          </span>
                </div>

                {/* Main Title */}
                <h1 className="mb-6 sm:mb-12">
          <span className="block text-4xl sm:text-7xl font-black text-white mb-2 sm:mb-4 tracking-tight">
            차세대 AI 게이밍
          </span>
                    <span className="block text-6xl sm:text-9xl font-black gradient-text tracking-tight">
            EROOM
          </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-2xl text-gray-300 mb-10 sm:mb-20 max-w-4xl mx-auto leading-relaxed font-light px-4">
                    인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐.
                    <br className="hidden sm:block"/>
                    <span className="sm:hidden"> </span>
                    당신의 창의력으로 만든 방을 전 세계와 공유하세요.
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center mb-16 sm:mb-32 px-4">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/support/download')}
                        className="w-full sm:w-auto"
                    >
                        <Download className="w-5 h-5"/>
                        무료 다운로드
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        <Play className="w-5 h-5"/>
                        게임플레이 영상
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto mb-12 sm:mb-24 px-4">
                    <div className="text-center group">
                        <div
                            className="text-4xl sm:text-5xl font-black text-green-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                            100K+
                        </div>
                        <div className="text-gray-400 text-base sm:text-lg">활성 플레이어</div>
                    </div>
                    <div className="text-center group">
                        <div
                            className="text-4xl sm:text-5xl font-black text-green-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                            50K+
                        </div>
                        <div className="text-gray-400 text-base sm:text-lg">커뮤니티 제작 맵</div>
                    </div>
                    <div className="text-center group">
                        <div
                            className="text-4xl sm:text-5xl font-black text-green-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                            ∞
                        </div>
                        <div className="text-gray-400 text-base sm:text-lg">AI 생성 퍼즐</div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-5 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-green-600/50"/>
                </div>
            </div>
        </section>
    )
}