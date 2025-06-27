'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {ChevronDown, Download, Play} from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({x: 50, y: 50})
    const heroRef = useRef<HTMLDivElement>(null)

    // 파티클 위치를 미리 계산하여 저장
    const particles = useMemo(() => {
        return Array.from({length: 30}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            depth: 0.5 + Math.random() * 0.5
        }))
    }, [])

    const largeParticles = useMemo(() => {
        return Array.from({length: 10}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            depth: 0.3 + Math.random() * 0.7
        }))
    }, [])

    useEffect(() => {
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
    }, [])

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
            {/* Dynamic Background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/10 to-black"></div>

                {/* Mouse-following spotlight */}
                <div
                    className="absolute w-[1000px] h-[1000px] opacity-20"
                    style={{
                        background: `radial-gradient(circle at center, #10b981 0%, transparent 70%)`,
                        left: `${mousePosition.x}%`,
                        top: `${mousePosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(100px)',
                        transition: 'all 0.3s ease-out',
                    }}
                />

                {/* Static glowing orbs */}
                <div
                    className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] bg-green-800/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-green-700/20 rounded-full blur-3xl animate-pulse"
                    style={{animationDelay: '2s'}}></div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="h-full w-full"
                         style={{
                             backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), 
                                   linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                             backgroundSize: '50px 50px'
                         }}>
                    </div>
                </div>

                {/* Floating particles with mouse parallax */}
                <div className="absolute inset-0 overflow-hidden">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-green-400/50 rounded-full transition-all duration-[3000ms] ease-out"
                            style={{
                                left: `${particle.x + (mousePosition.x - 50) * particle.depth * 0.2}%`,
                                top: `${particle.y + (mousePosition.y - 50) * particle.depth * 0.2}%`,
                                transform: `scale(${0.5 + particle.depth})`,
                                opacity: 0.3 + particle.depth * 0.3,
                            }}
                        />
                    ))}
                </div>

                {/* Larger floating particles for depth */}
                <div className="absolute inset-0 overflow-hidden">
                    {largeParticles.map((particle, i) => (
                        <div
                            key={`large-${i}`}
                            className="absolute w-2 h-2 bg-green-400/30 rounded-full transition-all duration-[4000ms] ease-out"
                            style={{
                                left: `${particle.x + (mousePosition.x - 50) * particle.depth * 0.3}%`,
                                top: `${particle.y + (mousePosition.y - 50) * particle.depth * 0.3}%`,
                                transform: `scale(${0.8 + particle.depth})`,
                                filter: 'blur(1px)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div
                    className="mb-10 inline-flex items-center gap-3 bg-green-900/20 backdrop-blur-xl px-8 py-4 rounded-full border border-green-800/50">
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-base font-medium text-green-400 tracking-wide uppercase">
            AI가 창조하는 무한한 방탈출 세계
          </span>
                </div>

                {/* Main Title */}
                <h1 className="mb-12">
          <span className="block text-7xl font-black text-white mb-4 tracking-tight">
            차세대 AI 게이밍
          </span>
                    <span className="block text-9xl font-black gradient-text tracking-tight">
            EROOM
          </span>
                </h1>

                {/* Description */}
                <p className="text-2xl text-gray-300 mb-20 max-w-4xl mx-auto leading-relaxed font-light">
                    인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐.
                    <br/>
                    당신의 창의력으로 만든 방을 전 세계와 공유하세요.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-8 justify-center items-center mb-32">
                    <Link
                        href="/download"
                        className="group relative px-12 py-6 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-900/50 overflow-hidden flex items-center gap-4"
                    >
            <span className="relative z-10 flex items-center gap-4">
              <Download className="w-6 h-6"/>
              무료 다운로드
            </span>
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </Link>

                    <button
                        className="group px-12 py-6 border-2 border-green-700 rounded-xl font-bold text-xl hover:bg-green-900/30 backdrop-blur-sm transition-all duration-300 flex items-center gap-4">
                        <Play className="w-6 h-6 group-hover:scale-110 transition-transform"/>
                        게임플레이 영상
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto">
                    <div className="text-center group">
                        <div
                            className="text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform">
                            100K+
                        </div>
                        <div className="text-gray-400 text-lg">활성 플레이어</div>
                    </div>
                    <div className="text-center group">
                        <div
                            className="text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform">
                            50K+
                        </div>
                        <div className="text-gray-400 text-lg">커뮤니티 제작 맵</div>
                    </div>
                    <div className="text-center group">
                        <div
                            className="text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform">
                            ∞
                        </div>
                        <div className="text-gray-400 text-lg">AI 생성 퍼즐</div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-green-600/50"/>
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