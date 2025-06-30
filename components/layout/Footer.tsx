'use client'

import {Key, Mail, MapPin, Phone} from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        games: [
            {name: 'EROOM', href: '/games/eroom'},
            {name: '업데이트 노트', href: '/news/updates'},
            {name: '로드맵', href: '/roadmap'},
            {name: '출시 예정', href: '/games/upcoming'}
        ],
        community: [
            {name: 'Discord', href: 'https://discord.gg/bangtalboyband'},
            {name: 'Reddit', href: 'https://reddit.com/r/eroom'},
            {name: 'YouTube', href: 'https://youtube.com/@bangtalboyband'},
            {name: 'Twitch', href: 'https://twitch.tv/bangtalboyband'}
        ],
        support: [
            {name: '고객센터', href: '/support'},
            {name: 'FAQ', href: '/support/faq'},
            {name: '시스템 요구사항', href: '/support/requirements'},
            {name: '버그 리포트', href: '/support/bug-report'}
        ],
        company: [
            {name: '회사 소개', href: '/about'},
            {name: '채용 정보', href: '/careers'},
            {name: '언론 보도', href: '/press'},
            {name: '파트너십', href: '/partners'}
        ]
    }

    return (
        <footer className="bg-black border-t border-green-900/30">
            <div className="container-custom py-12 sm:py-20">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-4 mb-6 sm:mb-8 group">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center transform rotate-12 transition-all duration-300 group-hover:rotate-45">
                                    <Key
                                        className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-12 transition-all duration-300 group-hover:-rotate-45"/>
                                </div>
                                <div
                                    className="absolute inset-0 bg-green-500/30 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black">BangtalBoyBand</h3>
                                <p className="text-sm text-gray-500">AI Gaming Studio</p>
                            </div>
                        </Link>

                        <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed max-w-lg">
                            AI 기술을 활용한 혁신적인 게임을 만드는 스튜디오입니다.
                            EROOM을 시작으로 더 많은 재미있는 경험을 선사하겠습니다.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/about"
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
                            >
                                회사 소개
                            </Link>
                            <Link
                                href="/careers"
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all font-medium"
                            >
                                채용 정보
                            </Link>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-8 lg:col-span-3">
                        <div>
                            <h4 className="font-bold mb-4 sm:mb-6 text-green-400 text-base sm:text-lg">게임</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.games.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 sm:mb-6 text-green-400 text-base sm:text-lg">커뮤니티</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.community.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base flex items-center gap-2"
                                        >
                                            {link.name}
                                            <span className="text-xs">↗</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <h4 className="font-bold mb-4 sm:mb-6 text-green-400 text-base sm:text-lg">지원</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-12 border-t border-gray-800 mb-8 sm:mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-green-400"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">이메일</p>
                            <p className="text-gray-300">pickpictest@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-400"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">고객센터</p>
                            <p className="text-gray-300">02-1234-5678</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-green-400"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">주소</p>
                            <p className="text-gray-300">서울특별시 강남구</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="border-t border-gray-800 pt-8 sm:pt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
                        © {currentYear} BangtalBoyBand. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-500 text-sm sm:text-base">
                        <Link href="/terms" className="hover:text-green-400 transition-colors">
                            이용약관
                        </Link>
                        <Link href="/privacy" className="hover:text-green-400 transition-colors">
                            개인정보처리방침
                        </Link>
                        <Link href="/cookies" className="hover:text-green-400 transition-colors">
                            쿠키 정책
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}