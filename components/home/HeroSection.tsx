'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {ChevronDown, Download, Play} from 'lucide-react'
import {useDevice} from '@/lib/hooks/useDevice'
import {useRouter} from 'next/navigation'
import {Button} from '../ui/Button'

// 시드를 사용한 랜덤 함수 (서버-클라이언트 일관성 보장)
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({x: 50, y: 50})
    const [smoothMousePosition, setSmoothMousePosition] = useState({x: 50, y: 50})
    const [isClient, setIsClient] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>()
    const {isMobile} = useDevice()
    const router = useRouter()

    // 클라이언트 사이드 마운트 확인
    useEffect(() => {
        setIsClient(true)
    }, [])

    // 파티클 위치를 시드를 사용해 미리 계산 (클라이언트에서만)
    const particles = useMemo(() => {
        if (!isClient) return []
        const count = isMobile ? 15 : 30;
        return Array.from({length: count}, (_, i) => ({
            x: seededRandom(i * 2 + 1) * 100,
            y: seededRandom(i * 2 + 2) * 100,
            depth: 0.5 + seededRandom(i * 2 + 3) * 0.5
        }))
    }, [isMobile, isClient])

    const largeParticles = useMemo(() => {
        if (!isClient) return []
        const count = isMobile ? 5 : 10;
        return Array.from({length: count}, (_, i) => ({
            x: seededRandom(i * 3 + 100) * 100,
            y: seededRandom(i * 3 + 101) * 100,
            depth: 0.3 + seededRandom(i * 3 + 102) * 0.7
        }))
    }, [isMobile, isClient])

    // 부드러운 마우스 추적을 위한 애니메이션
    useEffect(() => {
        if (!isClient || isMobile) return

        const smoothing = 0.1 // 부드러움 정도 (0-1, 낮을수록 부드러움)

        const updateSmoothPosition = () => {
            setSmoothMousePosition(prev => ({
                x: prev.x + (mousePosition.x - prev.x) * smoothing,
                y: prev.y + (mousePosition.y - prev.y) * smoothing
            }))
            animationRef.current = requestAnimationFrame(updateSmoothPosition)
        }

        animationRef.current = requestAnimationFrame(updateSmoothPosition)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [mousePosition, isMobile, isClient])

    useEffect(() => {
        if (!isClient || isMobile) return

        const handleMouseMove = (e: MouseEvent) => {
            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight
            setMousePosition({
                x: (e.clientX / windowWidth) * 100,
                y: (e.clientY / windowHeight) * 100,
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isMobile, isClient])

    // 클라이언트가 마운트되기 전에는 기본 레이아웃만 렌더링
    if (!isClient) {
        return (
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-32"
                style={{position: 'relative', zIndex: 1}}
            >
                {/* 기본 배경 (동적 요소 없음) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/10 to-black"></div>
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
                    <div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto mb-12 sm:mb-24 px-4">
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

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-32"
            style={{position: 'relative', zIndex: 1}}
        >
            {/* Dynamic Background - 클라이언트에서만 렌더링 */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/10 to-black"></div>

                {/* Mouse-following spotlight - Desktop only */}
                {!isMobile && (
                    <div
                        className="absolute w-[1000px] h-[1000px] opacity-20 hidden lg:block"
                        style={{
                            background: `radial-gradient(circle at center, #10b981 0%, transparent 70%)`,
                            left: `${smoothMousePosition.x}%`,
                            top: `${smoothMousePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(100px)',
                            pointerEvents: 'none',
                            willChange: 'transform',
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

                {/* Floating particles - 작은 파티클 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-green-400/50 rounded-full"
                            style={{
                                left: `${particle.x + (isMobile ? 0 : (smoothMousePosition.x - 50) * particle.depth * 0.2)}%`,
                                top: `${particle.y + (isMobile ? 0 : (smoothMousePosition.y - 50) * particle.depth * 0.2)}%`,
                                transform: `scale(${0.5 + particle.depth})`,
                                opacity: 0.3 + particle.depth * 0.3,
                                willChange: 'transform',
                            }}
                        />
                    ))}
                </div>

                {/* Larger floating particles - 큰 파티클 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {largeParticles.map((particle, i) => (
                        <div
                            key={`large-${i}`}
                            className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                            style={{
                                left: `${particle.x + (isMobile ? 0 : (smoothMousePosition.x - 50) * particle.depth * 0.3)}%`,
                                top: `${particle.y + (isMobile ? 0 : (smoothMousePosition.y - 50) * particle.depth * 0.3)}%`,
                                transform: `scale(${0.8 + particle.depth})`,
                                filter: 'blur(1px)',
                                willChange: 'transform',
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