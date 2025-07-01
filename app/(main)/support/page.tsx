'use client'

import {BookOpen, Download, HelpCircle, Mail, MessageSquare, Shield} from 'lucide-react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import Link from 'next/link'

export default function SupportPage() {
    const supportItems = [
        {
            title: '자주 묻는 질문',
            description: '설치, 계정, 결제 등 자주 문의되는 질문과 답변을 확인해보세요.',
            icon: <BookOpen className="w-5 h-5 text-green-400"/>,
            href: '/support/faq',
            color: 'from-green-600/20 to-green-700/20'
        },
        {
            title: '다운로드',
            description: 'Windows PC용 EROOM 설치 파일을 다운로드하세요.',
            icon: <Download className="w-5 h-5 text-blue-400"/>,
            href: '/support/download',
            color: 'from-blue-600/20 to-blue-700/20'
        },
        {
            title: '시스템 요구사항',
            description: '원활한 게임 플레이를 위한 권장 사양을 확인하세요.',
            icon: <Shield className="w-5 h-5 text-purple-400"/>,
            href: '/support/requirements',
            color: 'from-purple-600/20 to-purple-700/20'
        },
        {
            title: '커뮤니티 가이드',
            description: '다른 유저들과 팁을 공유하고 문제 해결법을 찾아보세요.',
            icon: <MessageSquare className="w-5 h-5 text-orange-400"/>,
            href: '/community/guides',
            color: 'from-orange-600/20 to-orange-700/20'
        },
        {
            title: '1:1 문의하기',
            description: '해결되지 않은 문제가 있다면 직접 문의해주세요.',
            icon: <Mail className="w-5 h-5 text-red-400"/>,
            href: '/support/inquiry',
            color: 'from-red-600/20 to-red-700/20'
        },
        {
            title: '버그 신고',
            description: '게임 내 버그나 오류를 발견하면 신고해주세요.',
            icon: <HelpCircle className="w-5 h-5 text-yellow-400"/>,
            href: '/support/bug-report',
            color: 'from-yellow-600/20 to-yellow-700/20'
        }
    ]

    return (
        <>
            <PageHeader
                title="고객센터"
                description="EROOM에 대한 모든 도움말과 지원을 찾아보세요"
                badge="고객지원"
                icon={<HelpCircle className="w-5 h-5"/>}
            />

            <Container className="py-12 space-y-12">
                {/* 지원 항목 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supportItems.map((item, index) => (
                        <Link key={index} href={item.href}>
                            <Card className="p-6 hover:scale-105 transition-all duration-300 h-full">
                                <div
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {item.description}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* 추가 정보 섹션 */}
                <div className="space-y-8">
                    <Card className="p-8 bg-gradient-to-br from-green-900/20 to-green-800/20">
                        <h2 className="text-2xl font-bold mb-4">빠른 해결 팁</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 font-bold">1.</span>
                                <div>
                                    <h4 className="font-semibold mb-1">최신 버전 확인</h4>
                                    <p className="text-sm text-gray-400">
                                        게임이 최신 버전으로 업데이트되어 있는지 확인하세요. 많은 문제가 업데이트로 해결됩니다.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 font-bold">2.</span>
                                <div>
                                    <h4 className="font-semibold mb-1">그래픽 드라이버 업데이트</h4>
                                    <p className="text-sm text-gray-400">
                                        NVIDIA, AMD, Intel 그래픽 드라이버를 최신 버전으로 업데이트하세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 font-bold">3.</span>
                                <div>
                                    <h4 className="font-semibold mb-1">방화벽 및 백신 프로그램 확인</h4>
                                    <p className="text-sm text-gray-400">
                                        EROOM이 방화벽이나 백신 프로그램에 의해 차단되지 않았는지 확인하세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">문제가 해결되지 않으셨나요?</h2>
                        <p className="text-gray-400 mb-6">
                            고객센터 운영 시간: 평일 오전 10시 - 오후 6시 (주말 및 공휴일 제외)
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/support/inquiry" className="btn-primary">
                                1:1 문의하기
                            </Link>
                            <Link href="/support/faq" className="btn-outline">
                                FAQ 다시 보기
                            </Link>
                        </div>
                    </Card>
                </div>
            </Container>
        </>
    )
}