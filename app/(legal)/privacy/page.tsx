'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {AlertCircle, Clock, Database, Lock, Shield, UserCheck, Users} from 'lucide-react'
import {CONSTANTS} from '@/lib/utils/constants'

export default function PrivacyPage() {
    const sections = [
        {
            id: 'overview',
            title: '개요',
            icon: <Shield className="w-5 h-5"/>,
            content: `본 개인정보 처리방침은 ${CONSTANTS.COMPANY.NAME}(이하 "당사")가 귀하의 개인정보를 수집, 사용, 보호하는 방법에 대해 설명합니다. 당사는 귀하의 개인정보 보호를 중요하게 생각하며, 관련 법률 및 규정을 준수하고 있습니다.`
        },
        {
            id: 'collect',
            title: '수집하는 개인정보',
            icon: <Database className="w-5 h-5"/>,
            categories: [
                {
                    title: '계정 정보',
                    items: ['이름', '이메일 주소', '비밀번호', '사용자명']
                },
                {
                    title: '프로필 정보',
                    items: ['프로필 사진', '자기소개', '위치']
                },
                {
                    title: '기기 정보',
                    items: ['IP 주소', '브라우저 유형', '운영 체제', '기기 식별자']
                },
                {
                    title: '사용 정보',
                    items: ['로그인 기록', '활동 내역', '서비스 이용 시간']
                }
            ]
        },
        {
            id: 'use',
            title: '개인정보 이용 목적',
            icon: <UserCheck className="w-5 h-5"/>,
            purposes: [
                {
                    title: '서비스 제공',
                    description: '계정 관리, 게임 서비스 제공, 기술적 지원'
                },
                {
                    title: '서비스 개선',
                    description: '사용자 경험 향상, 맞춤형 콘텐츠 제공, 신기능 개발'
                },
                {
                    title: '보안 및 안전',
                    description: '부정 사용 방지, 계정 보안, 서비스 안정성 유지'
                },
                {
                    title: '법적 의무',
                    description: '관련 법률 준수, 법적 요청 대응, 권리 보호'
                }
            ]
        },
        {
            id: 'retention',
            title: '개인정보 보유 및 파기',
            icon: <Clock className="w-5 h-5"/>,
            policies: [
                {
                    type: '일반 원칙',
                    period: '목적 달성 시까지',
                    description: '개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기'
                },
                {
                    type: '전자상거래법',
                    period: '5년',
                    description: '계약/청약철회 기록, 대금결제 및 재화 공급 기록'
                },
                {
                    type: '통신비밀보호법',
                    period: '3개월',
                    description: '로그인 기록'
                }
            ]
        },
        {
            id: 'rights',
            title: '이용자의 권리',
            icon: <Users className="w-5 h-5"/>,
            rights: [
                '개인정보 열람 및 복사본 요청',
                '부정확한 정보의 수정 요청',
                '개인정보 처리 정지 요청',
                '개인정보 삭제 요청',
                '개인정보 이동 요청',
                '동의 철회'
            ]
        },
        {
            id: 'security',
            title: '개인정보 보호 조치',
            icon: <Lock className="w-5 h-5"/>,
            measures: [
                {
                    title: '기술적 보호',
                    items: ['데이터 암호화', '방화벽 및 침입 탐지', '정기 보안 점검']
                },
                {
                    title: '관리적 보호',
                    items: ['접근 권한 관리', '직원 교육', '보안 정책 수립']
                },
                {
                    title: '물리적 보호',
                    items: ['전산실 접근 통제', '백업 시스템', '재해 복구 계획']
                }
            ]
        }
    ]

    const contactInfo = {
        title: '개인정보 보호책임자',
        name: CONSTANTS.LEGAL.PRIVACY_OFFICER.NAME,
        position: CONSTANTS.LEGAL.PRIVACY_OFFICER.POSITION,
        email: CONSTANTS.LEGAL.PRIVACY_OFFICER.EMAIL,
        phone: CONSTANTS.LEGAL.PRIVACY_OFFICER.PHONE
    }

    return (
        <>
            <PageHeader
                title="개인정보처리방침"
                description="고객님의 소중한 개인정보를 안전하게 보호합니다"
                badge="최종 업데이트: 2025년 6월 15일"
                icon={<Shield className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 중요 고지 */}
                <Card className="p-8 mb-12 bg-gradient-to-br from-blue-900/20 to-blue-800/20">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-8 h-8 text-blue-400 flex-shrink-0"/>
                        <div>
                            <h2 className="text-xl font-bold mb-3">개인정보 보호 약속</h2>
                            <p className="text-gray-300 mb-4">
                                {CONSTANTS.COMPANY.NAME}는 고객님의 개인정보를 소중히 여기며,
                                개인정보보호법 등 관련 법령을 준수하고 있습니다.
                                본 처리방침은 당사 서비스 이용 시 수집되는 개인정보와
                                그 처리 방법에 대해 안내합니다.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="info">GDPR 준수</Badge>
                                <Badge variant="success">SSL 암호화</Badge>
                                <Badge variant="warning">최소 수집 원칙</Badge>
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
                        {/* 개요 */}
                        <Card id="overview" className="p-8">
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

                        {/* 수집하는 개인정보 */}
                        <Card id="collect" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[1].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[1].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections[1].categories?.map((category, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4">{category.title}</h3>
                                        <ul className="space-y-2">
                                            {category.items.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                    <span className="text-gray-300">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 이용 목적 */}
                        <Card id="use" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[2].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[2].title}</h2>
                            </div>
                            <div className="space-y-4">
                                {sections[2].purposes?.map((purpose, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-2">{purpose.title}</h3>
                                        <p className="text-gray-400">{purpose.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 보유 및 파기 */}
                        <Card id="retention" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[3].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[3].title}</h2>
                            </div>
                            <div className="space-y-4">
                                {sections[3].policies?.map((policy, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold">{policy.type}</h3>
                                            <Badge variant="info">{policy.period}</Badge>
                                        </div>
                                        <p className="text-gray-400 text-sm">{policy.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 이용자 권리 */}
                        <Card id="rights" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[4].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[4].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections[4].rights?.map((right, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                                        <UserCheck className="w-5 h-5 text-green-400 flex-shrink-0"/>
                                        <span className="text-gray-300">{right}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 보안 조치 */}
                        <Card id="security" className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-800 rounded-lg text-green-400">
                                    {sections[5].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{sections[5].title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {sections[5].measures?.map((measure, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 text-green-400">{measure.title}</h3>
                                        <ul className="space-y-2">
                                            {measure.items.map((item, idx) => (
                                                <li key={idx} className="text-gray-400 text-sm">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* 문의처 */}
                        <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800">
                            <h2 className="text-xl font-bold mb-6">{contactInfo.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400">이름:</span>
                                        <span className="ml-2">{contactInfo.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">직위:</span>
                                        <span className="ml-2">{contactInfo.position}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400">이메일:</span>
                                        <a href={`mailto:${contactInfo.email}`}
                                           className="ml-2 text-green-400 hover:text-green-300">
                                            {contactInfo.email}
                                        </a>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">전화:</span>
                                        <span className="ml-2">{contactInfo.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}