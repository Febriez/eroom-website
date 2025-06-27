'use client'

import Link from 'next/link'
import {BarChart, Clock, Cookie, Info, Settings, Shield} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function CookiesPage() {
    const { user, loading } = useAuth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            setIsLoggedIn(true)
        }
    }, [user, loading])
    const sections = [
        {
            title: "1. 쿠키란 무엇인가요?",
            icon: <Cookie className="w-6 h-6 text-green-400"/>,
            content: [
                "쿠키는 웹사이트를 방문할 때 브라우저에 저장되는 작은 텍스트 파일입니다. 쿠키는 웹사이트가 정상적으로 작동하도록 돕고, 보다 안전하고 개인화된 경험을 제공하며, 웹사이트의 성능을 개선하는 데 사용됩니다.",
                "",
                "쿠키는 귀하의 브라우저를 식별하는 데 사용되지만, 귀하를 개인적으로 식별하는 정보는 포함하지 않습니다."
            ]
        },
        {
            title: "2. 우리가 사용하는 쿠키의 종류",
            icon: <Info className="w-6 h-6 text-green-400"/>,
            content: []
        },
        {
            title: "3. 쿠키 관리 방법",
            icon: <Settings className="w-6 h-6 text-green-400"/>,
            content: [
                "대부분의 웹 브라우저는 자동으로 쿠키를 수락하지만, 원하는 경우 브라우저 설정을 변경하여 쿠키를 거부할 수 있습니다.",
                "",
                "브라우저별 쿠키 설정 방법:",
                "• Chrome: 설정 > 개인정보 및 보안 > 쿠키 및 기타 사이트 데이터",
                "• Firefox: 설정 > 개인 정보 및 보안 > 쿠키 및 사이트 데이터",
                "• Safari: 환경설정 > 개인 정보 보호 > 쿠키 및 웹 사이트 데이터",
                "• Edge: 설정 > 쿠키 및 사이트 권한",
                "",
                "쿠키를 거부하면 일부 서비스가 제대로 작동하지 않을 수 있습니다."
            ]
        },
        {
            title: "4. 제3자 쿠키",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                "우리는 다음과 같은 제3자 서비스를 사용하며, 이들은 자체 쿠키를 설정할 수 있습니다:",
                "",
                "• Google Analytics: 웹사이트 사용 통계 분석",
                "• Firebase: 인증 및 데이터베이스 서비스",
                "• 소셜 미디어 플러그인: 콘텐츠 공유 기능",
                "",
                "이러한 제3자 쿠키는 해당 서비스 제공업체의 개인정보 처리방침에 따라 관리됩니다."
            ]
        }
    ]

    const cookieTypes = [
        {
            name: "필수 쿠키",
            icon: <Shield className="w-5 h-5 text-green-400"/>,
            description: "웹사이트가 정상적으로 작동하는 데 필요한 쿠키입니다. 이 쿠키가 없으면 로그인, 장바구니 등의 기능을 사용할 수 없습니다.",
            examples: ["사용자 인증", "보안 토큰", "언어 설정"]
        },
        {
            name: "성능 쿠키",
            icon: <BarChart className="w-5 h-5 text-blue-400"/>,
            description: "방문자가 웹사이트를 어떻게 사용하는지 이해하는 데 도움이 되는 쿠키입니다. 이 정보는 웹사이트 개선에 사용됩니다.",
            examples: ["페이지 조회수", "방문 시간", "오류 메시지"]
        },
        {
            name: "기능 쿠키",
            icon: <Settings className="w-5 h-5 text-purple-400"/>,
            description: "웹사이트가 귀하의 선택사항을 기억하고 향상된 기능을 제공할 수 있도록 하는 쿠키입니다.",
            examples: ["사용자 설정", "게임 진행 상황", "UI 테마"]
        },
        {
            name: "타겟팅 쿠키",
            icon: <Info className="w-5 h-5 text-yellow-400"/>,
            description: "귀하의 관심사와 관련된 광고를 표시하는 데 사용되는 쿠키입니다. 제3자 광고 네트워크에서 설정할 수 있습니다.",
            examples: ["맞춤 광고", "리타겟팅", "전환 추적"]
        }
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        쿠키 정책
                    </h1>
                    <p className="text-2xl text-gray-300 mb-4">
                        BangtalBoyBand는 더 나은 서비스 제공을 위해 쿠키를 사용합니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        최종 업데이트: 2025년 6월 27일
                    </p>
                </div>

                {/* Cookie Types Grid */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">쿠키 유형</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {cookieTypes.map((type, index) => (
                            <div key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-8 border border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    {type.icon}
                                    <h3 className="text-xl font-semibold">{type.name}</h3>
                                </div>
                                <p className="text-gray-400 mb-4">{type.description}</p>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">예시:</p>
                                    <ul className="text-sm text-gray-400">
                                        {type.examples.map((example, idx) => (
                                            <li key={idx}>• {example}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-12 mb-32">
                    {sections.map((section, index) => (
                        <div key={index}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800">
                            <div className="flex items-center gap-4 mb-6">
                                {section.icon}
                                <h2 className="text-3xl font-bold">{section.title}</h2>
                            </div>

                            {section.content.length > 0 ? (
                                <div className="space-y-4">
                                    {section.content.map((paragraph, pIndex) => (
                                        <p key={pIndex} className="text-gray-300 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ) : section.title.includes("사용하는 쿠키의 종류") && (
                                <p className="text-gray-400">위의 쿠키 유형 섹션을 참조해주세요.</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Cookie Duration Info */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 mb-32">
                    <div className="flex items-center gap-4 mb-8 justify-center">
                        <Clock className="w-8 h-8 text-green-400"/>
                        <h2 className="text-3xl font-bold">쿠키 보존 기간</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-3 text-green-400">세션 쿠키</h3>
                            <p className="text-gray-400">브라우저를 닫으면 자동으로 삭제됩니다.</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-3 text-green-400">영구 쿠키</h3>
                            <p className="text-gray-400">설정된 기간 동안 기기에 저장됩니다. (최대 1년)</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 mb-16">
                    <h3 className="text-2xl font-bold mb-4">쿠키 정책에 대한 문의</h3>
                    <p className="text-gray-300 mb-4">
                        쿠키 사용에 대해 궁금한 점이 있으시면 아래로 연락해주세요:
                    </p>
                    <div className="space-y-2 text-gray-400">
                        <p>이메일: pickpictest@gmail.com</p>
                        <p>전화: 02-1234-5678</p>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
                    <Link href="/"
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                        메인으로
                    </Link>
                    {!isLoggedIn && (
                        <Link href="/privacy"
                              className="px-8 py-3 border border-green-700 rounded-lg font-medium hover:bg-green-900/30 transition-all">
                            개인정보 처리방침
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}