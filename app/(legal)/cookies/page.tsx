// app/(legal)/cookies/page.tsx
'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Cookie, Eye, Info, Settings, Shield} from 'lucide-react'

export default function CookiesPage() {
    const sections = [
        {
            id: 'what',
            title: '쿠키란 무엇인가요?',
            icon: <Info className="w-5 h-5"/>,
            content: [
                '쿠키는 사용자가 웹사이트를 방문할 때 사용자의 기기에 저장되는 작은 텍스트 파일입니다.',
                '쿠키는 웹사이트가 사용자의 기기를 인식하고, 사용자 경험을 향상시키며, 맞춤형 서비스를 제공하는 데 도움을 줍니다.',
                '쿠키 외에도 웹 비콘, 픽셀 태그, 로컬 스토리지 등의 유사한 기술이 사용될 수 있으며, 본 정책에서는 이러한 모든 기술을 "쿠키"로 통칭합니다.'
            ]
        },
        {
            id: 'types',
            title: '사용하는 쿠키 유형',
            icon: <Cookie className="w-5 h-5"/>,
            subsections: [
                {
                    title: '필수 쿠키',
                    badge: 'required',
                    items: [
                        '로그인 상태 유지',
                        '장바구니 관리',
                        '보안 인증'
                    ]
                },
                {
                    title: '선호 설정 쿠키',
                    badge: 'preference',
                    items: [
                        '언어 설정',
                        '테마 설정 (다크/라이트 모드)',
                        '알림 환경설정'
                    ]
                },
                {
                    title: '분석 쿠키',
                    badge: 'analytics',
                    items: [
                        '방문 페이지 추적',
                        '체류 시간 측정',
                        '사용자 행동 분석'
                    ]
                },
                {
                    title: '마케팅 쿠키',
                    badge: 'marketing',
                    items: [
                        '타겟 광고',
                        '리마케팅',
                        '소셜 미디어 연동'
                    ]
                }
            ]
        },
        {
            id: 'third-party',
            title: '제3자 쿠키',
            icon: <Eye className="w-5 h-5"/>,
            providers: [
                {name: 'Google Analytics', purpose: '웹사이트 트래픽 및 사용자 행동 분석'},
                {name: 'Google 광고', purpose: '맞춤형 광고 제공'},
                {name: 'Facebook', purpose: '소셜 공유 기능 및 타겟 광고'},
                {name: 'Firebase', purpose: '사용자 인증 및 분석'}
            ]
        },
        {
            id: 'manage',
            title: '쿠키 관리 방법',
            icon: <Settings className="w-5 h-5"/>,
            browsers: [
                {name: 'Chrome', path: '설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터'},
                {name: 'Firefox', path: '환경설정 → 개인정보 및 보안 → 쿠키 및 사이트 데이터'},
                {name: 'Safari', path: '환경설정 → 개인정보 보호 → 쿠키 및 웹사이트 데이터'},
                {name: 'Edge', path: '설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터 관리'}
            ]
        }
    ]

    return (
        <>
            <PageHeader
                title="쿠키 정책"
                description="당사가 쿠키를 사용하는 방법과 관리 방법에 대해 알아보세요"
                badge="최종 업데이트: 2025년 6월 15일"
                icon={<Cookie className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 요약 카드 */}
                <Card className="p-8 mb-12 bg-gradient-to-br from-green-900/20 to-green-800/20">
                    <div className="flex items-start gap-4">
                        <Shield className="w-8 h-8 text-green-400 flex-shrink-0"/>
                        <div>
                            <h2 className="text-xl font-bold mb-3">쿠키 사용에 대한 약속</h2>
                            <p className="text-gray-300 mb-4">
                                당사는 사용자의 개인정보를 존중하며, 투명한 쿠키 사용을 약속합니다.
                                필수적이지 않은 쿠키는 사용자의 동의를 받아 사용하며,
                                언제든지 쿠키 설정을 변경할 수 있습니다.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="success">투명성</Badge>
                                <Badge variant="info">사용자 제어</Badge>
                                <Badge variant="warning">최소 수집</Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 사이드바 네비게이션 */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="font-bold mb-4">목차</h3>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="block px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </Card>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* 쿠키란 무엇인가요? */}
                        <Card id="what" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[0].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[0].title}</h2>
                            </div>
                            <div className="space-y-4">
                                {sections[0].content?.map((text, index) => (
                                    <p key={index} className="text-gray-300 leading-relaxed">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </Card>

                        {/* 사용하는 쿠키 유형 */}
                        <Card id="types" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[1].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[1].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections[1].subsections?.map((subsection, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg">{subsection.title}</h3>
                                            <Badge
                                                variant={
                                                    subsection.badge === 'required' ? 'danger' :
                                                        subsection.badge === 'preference' ? 'info' :
                                                            subsection.badge === 'analytics' ? 'warning' :
                                                                'success'
                                                }
                                                size="sm"
                                            >
                                                {subsection.badge === 'required' ? '필수' :
                                                    subsection.badge === 'preference' ? '선호' :
                                                        subsection.badge === 'analytics' ? '분석' :
                                                            '마케팅'}
                                            </Badge>
                                        </div>
                                        <ul className="space-y-2">
                                            {subsection.items.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-1">•</span>
                                                    <span className="text-gray-400">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 제3자 쿠키 */}
                        <Card id="third-party" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[2].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[2].title}</h2>
                            </div>
                            <p className="text-gray-300 mb-6">
                                일부 쿠키는 당사가 아닌 제3자에 의해 설정됩니다.
                                이러한 제3자는 당사 웹사이트를 통해 귀하의 기기에 쿠키를 설정하여 정보를 수집할 수 있습니다.
                            </p>
                            <div className="space-y-4">
                                {sections[2].providers?.map((provider, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-1">{provider.name}</h4>
                                            <p className="text-sm text-gray-400">{provider.purpose}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 쿠키 관리 방법 */}
                        <Card id="manage" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[3].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[3].title}</h2>
                            </div>
                            <p className="text-gray-300 mb-6">
                                대부분의 웹 브라우저는 쿠키를 자동으로 허용하도록 설정되어 있지만,
                                사용자는 브라우저 설정을 변경하여 쿠키를 허용하거나 거부할 수 있습니다.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections[3].browsers?.map((browser, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">{browser.name}</h4>
                                        <p className="text-sm text-gray-400">{browser.path}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 문의하기 */}
                        <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800">
                            <h2 className="text-xl font-bold mb-4">쿠키 정책에 대한 문의</h2>
                            <p className="text-gray-300 mb-6">
                                쿠키 사용에 관한 질문이나 우려사항이 있으시면 다음 연락처로 문의해 주십시오.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">이메일:</span>
                                    <a href="mailto:privacy@example.com"
                                       className="text-green-400 hover:text-green-300">
                                        privacy@example.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">전화:</span>
                                    <span>02-123-4567</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}