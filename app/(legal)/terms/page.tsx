// app/(legal)/terms/page.tsx
'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {AlertTriangle, Ban, FileText, Info, MessageSquare, Scale, Shield, Users} from 'lucide-react'

export default function TermsPage() {
    // 조건부 타입 체크를 위한 타입 가드 함수들
    const hasItems = (obj: any): obj is { title: string; items: string[] } => {
        return 'items' in obj && Array.isArray(obj.items);
    };

    const hasByMethod = (obj: any): obj is { by: string; method: string } => {
        return 'by' in obj && 'method' in obj;
    };

    const sections = [
        {
            id: 'intro',
            title: '서비스 소개',
            icon: <Info className="w-5 h-5"/>,
            content: '본 이용약관("약관")은 BangtalBoyBand(이하 "당사")가 제공하는 EROOM 게임 서비스(이하 "서비스") 이용에 관한 조건과 규정을 설명합니다.'
        },
        {
            id: 'use',
            title: '서비스 이용',
            icon: <Users className="w-5 h-5"/>,
            conditions: [
                {
                    title: '이용 자격',
                    items: [
                        '만 13세 이상이어야 합니다',
                        '정확한 정보를 제공해야 합니다',
                        '계정 보안을 유지해야 합니다',
                        '불법적인 목적으로 사용할 수 없습니다'
                    ]
                },
                {
                    title: '금지 행위',
                    items: [
                        '타인의 권리 침해',
                        '서비스 방해 행위',
                        '부정한 방법으로 이용',
                        '허위 정보 유포'
                    ]
                }
            ]
        },
        {
            id: 'account',
            title: '계정 관리',
            icon: <Shield className="w-5 h-5"/>,
            policies: [
                {
                    title: '계정 생성',
                    description: '정확하고 완전한 정보를 제공하여 계정을 생성해야 합니다.'
                },
                {
                    title: '계정 보안',
                    description: '비밀번호를 안전하게 보관하고 무단 접근 시 즉시 신고해야 합니다.'
                },
                {
                    title: '계정 정지',
                    description: '약관 위반 시 사전 통지 없이 계정이 정지될 수 있습니다.'
                }
            ]
        },
        {
            id: 'content',
            title: '사용자 콘텐츠',
            icon: <FileText className="w-5 h-5"/>,
            rules: [
                '귀하는 업로드하는 콘텐츠에 대한 모든 권리를 보유해야 합니다',
                '당사에 콘텐츠 사용에 대한 라이선스를 부여합니다',
                '불법적이거나 부적절한 콘텐츠는 삭제될 수 있습니다',
                '타인의 지적재산권을 침해해서는 안 됩니다'
            ]
        },
        {
            id: 'intellectual',
            title: '지적재산권',
            icon: <Scale className="w-5 h-5"/>,
            content: '당사의 서비스, 소프트웨어, 상표, 로고 및 콘텐츠에 대한 모든 지적재산권은 당사 또는 라이선스 제공자의 소유입니다.'
        },
        {
            id: 'disclaimer',
            title: '면책 조항',
            icon: <AlertTriangle className="w-5 h-5"/>,
            disclaimers: [
                '서비스는 "있는 그대로" 제공됩니다',
                '서비스의 정확성이나 완전성을 보장하지 않습니다',
                '서비스 이용으로 인한 손해에 책임지지 않습니다',
                '제3자 콘텐츠에 대해 책임지지 않습니다'
            ]
        },
        {
            id: 'termination',
            title: '계약 해지',
            icon: <Ban className="w-5 h-5"/>,
            conditions: [
                {
                    by: '이용자',
                    method: '언제든지 계정 삭제를 요청할 수 있습니다'
                },
                {
                    by: '당사',
                    method: '약관 위반 시 서비스 이용을 제한하거나 계약을 해지할 수 있습니다'
                }
            ]
        }
    ]

    return (
        <>
            <PageHeader
                title="이용약관"
                description="EROOM 서비스 이용에 관한 약관입니다"
                badge="최종 업데이트: 2025년 6월 15일"
                icon={<FileText className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 중요 고지 */}
                <Card className="p-8 mb-12 bg-gradient-to-br from-purple-900/20 to-purple-800/20">
                    <div className="flex items-start gap-4">
                        <Scale className="w-8 h-8 text-purple-400 flex-shrink-0"/>
                        <div>
                            <h2 className="text-xl font-bold mb-3">약관 동의</h2>
                            <p className="text-gray-300 mb-4">
                                본 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다.
                                약관에 동의하지 않는 경우 서비스를 이용하실 수 없습니다.
                                본 약관을 주의 깊게 읽어보시기 바랍니다.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="warning">필수 동의</Badge>
                                <Badge variant="info">정기 검토 필요</Badge>
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
                                <hr className="border-gray-800 my-4"/>
                                <a
                                    href="#contact"
                                    className="block px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4 inline mr-2"/>
                                    문의하기
                                </a>
                            </nav>
                        </Card>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* 서비스 소개 */}
                        <Card id="intro" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[0].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[0].title}</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {sections[0].content}
                            </p>
                        </Card>

                        {/* 서비스 이용 */}
                        <Card id="use" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[1].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[1].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections[1].conditions?.map((condition, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 text-green-400">{condition.title}</h3>
                                        <ul className="space-y-2">
                                            {'items' in condition && condition.items.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-1">•</span>
                                                    <span className="text-gray-300">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 계정 관리 */}
                        <Card id="account" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[2].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[2].title}</h2>
                            </div>
                            <div className="space-y-4">
                                {sections[2].policies?.map((policy, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-2">{policy.title}</h3>
                                        <p className="text-gray-400">{policy.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 사용자 콘텐츠 */}
                        <Card id="content" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[3].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[3].title}</h2>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6">
                                <ul className="space-y-3">
                                    {sections[3].rules?.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">{index + 1}.</span>
                                            <span className="text-gray-300">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>

                        {/* 지적재산권 */}
                        <Card id="intellectual" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[4].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[4].title}</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                {sections[4].content}
                            </p>
                            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                                <p className="text-yellow-400 text-sm">
                                    ⚠️ 당사의 허가 없이 콘텐츠를 복제, 수정, 배포하는 것은 금지됩니다.
                                </p>
                            </div>
                        </Card>

                        {/* 면책 조항 */}
                        <Card id="disclaimer" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[5].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[5].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections[5].disclaimers?.map((disclaimer, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
                                        <span className="text-gray-300">{disclaimer}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 계약 해지 */}
                        <Card id="termination" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[6].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[6].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections[6].conditions?.map((condition, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        {'by' in condition && (
                                            <>
                                                <h3 className="font-bold text-lg mb-2 text-green-400">{condition.by}에 의한
                                                    해지</h3>
                                                <p className="text-gray-400">{condition.method}</p>
                                            </>
                                        )}
                                        {'title' in condition && (
                                            <>
                                                <h3 className="font-bold text-lg mb-4 text-green-400">{condition.title}</h3>
                                                {'items' in condition && (
                                                    <ul className="space-y-2">
                                                        {condition.items.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className="text-green-400 mt-1">•</span>
                                                                <span className="text-gray-300">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 문의하기 */}
                        <Card id="contact" className="p-8 bg-gradient-to-br from-gray-900 to-gray-800">
                            <h2 className="text-xl font-bold mb-4">약관에 대한 문의</h2>
                            <p className="text-gray-300 mb-6">
                                본 약관에 관한 질문이나 의견이 있으시면 다음 연락처로 문의해 주십시오.
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-400">이메일:</span>
                                    <a href="mailto:legal@example.com"
                                       className="ml-2 text-green-400 hover:text-green-300">
                                        legal@example.com
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400">주소:</span>
                                    <span className="ml-2">서울특별시 강남구 테헤란로 123, 456빌딩 7층</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">전화:</span>
                                    <span className="ml-2">02-123-4567</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}