// app/(company)/careers/page.tsx
'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {ArrowRight, Briefcase, Calendar, Coffee, Heart, MapPin, Sparkles, Zap} from 'lucide-react'

interface JobPosition {
    id: string
    title: string
    department: string
    type: string
    level: string
    description: string
    requirements: string[]
    preferred: string[]
    location: string
    employmentType: string
}

export default function CareersPage() {
    const positions: JobPosition[] = [
        {
            id: 'dev-junior',
            title: '주니어 게임 개발자',
            department: '개발팀',
            type: 'tech',
            level: '신입/경력',
            description: 'EROOM 플랫폼의 핵심 기능을 개발하고 개선하는 역할을 담당합니다. AI 기반 게임 시스템과 실시간 멀티플레이 기능을 구현합니다.',
            requirements: [
                'Next.js, React, TypeScript 개발 경험',
                '게임 개발에 대한 열정과 관심',
                'Git을 활용한 협업 경험',
                '문제 해결 능력과 학습 의지'
            ],
            preferred: [
                'Three.js 또는 WebGL 경험',
                'Firebase 또는 실시간 데이터베이스 경험',
                'AI/ML 기초 지식',
                '게임 개발 프로젝트 경험'
            ],
            location: '서울 강남구',
            employmentType: '정규직'
        },
        {
            id: 'designer-junior',
            title: '주니어 게임 기획자',
            department: '기획팀',
            type: 'creative',
            level: '신입/경력',
            description: '플레이어에게 최고의 경험을 제공할 수 있는 게임 콘텐츠를 기획하고 설계합니다. 레벨 디자인과 게임 밸런싱을 담당합니다.',
            requirements: [
                '게임 기획 문서 작성 능력',
                '논리적 사고와 창의력',
                '다양한 게임에 대한 이해도',
                '원활한 커뮤니케이션 능력'
            ],
            preferred: [
                '방탈출 게임 플레이 경험',
                '데이터 분석 능력',
                'Unity 또는 게임 엔진 사용 경험',
                '프로토타이핑 도구 활용 능력'
            ],
            location: '서울 강남구',
            employmentType: '정규직'
        }
    ]

    const benefits = [
        {
            icon: <Coffee className="w-6 h-6"/>,
            title: '자유로운 문화',
            description: '수평적 조직문화와 자유로운 근무 환경',
            color: 'from-purple-600 to-purple-700'
        },
        {
            icon: <Calendar className="w-6 h-6"/>,
            title: '워라밸',
            description: '유연근무제와 충분한 휴가 보장',
            color: 'from-green-600 to-green-700'
        },
        {
            icon: <Zap className="w-6 h-6"/>,
            title: '성장 지원',
            description: '교육비 지원 및 컨퍼런스 참가 기회',
            color: 'from-yellow-600 to-yellow-700'
        },
        {
            icon: <Heart className="w-6 h-6"/>,
            title: '건강 관리',
            description: '종합 건강검진 및 의료비 지원',
            color: 'from-red-600 to-red-700'
        }
    ]

    const culture = [
        {
            title: '도전과 실험',
            description: '실패를 두려워하지 않고 새로운 시도를 장려합니다'
        },
        {
            title: '협업과 소통',
            description: '팀원 간 활발한 소통으로 시너지를 만들어갑니다'
        },
        {
            title: '플레이어 중심',
            description: '항상 플레이어의 관점에서 생각하고 개발합니다'
        },
        {
            title: '지속적 성장',
            description: '개인과 회사가 함께 성장하는 환경을 추구합니다'
        }
    ]

    const getDepartmentColor = (type: string) => {
        switch (type) {
            case 'tech':
                return 'text-blue-400 bg-blue-900/30'
            case 'creative':
                return 'text-purple-400 bg-purple-900/30'
            default:
                return 'text-gray-400 bg-gray-800'
        }
    }

    return (
        <>
            <PageHeader
                title="채용"
                description="EROOM과 함께 게임의 미래를 만들어갈 인재를 찾습니다"
                badge="채용 중"
                icon={<Briefcase className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 인트로 섹션 */}
                <Card className="p-8 mb-12 bg-gradient-to-br from-green-900/20 to-green-800/20">
                    <div className="text-center max-w-3xl mx-auto">
                        <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                        <h2 className="text-3xl font-bold mb-4">함께 만들어가는 혁신</h2>
                        <p className="text-lg text-gray-300">
                            EROOM은 AI와 게임의 결합으로 새로운 엔터테인먼트 경험을 창조합니다.
                            우리와 함께 게임 산업의 미래를 개척해나갈 열정적인 동료를 기다립니다.
                        </p>
                    </div>
                </Card>

                {/* 채용 공고 */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8">열린 포지션</h2>
                    <div className="space-y-6">
                        {positions.map((position) => (
                            <Card key={position.id} className="p-8 hover:border-green-600/50 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-bold">{position.title}</h3>
                                            <Badge variant="success">{position.level}</Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${getDepartmentColor(position.type)}`}>
                                                {position.department}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4"/>
                                                {position.location}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-gray-400">
                                                <Briefcase className="w-4 h-4"/>
                                                {position.employmentType}
                                            </span>
                                        </div>

                                        <p className="text-gray-300 mb-6">{position.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-3 text-green-400">자격 요건</h4>
                                                <ul className="space-y-2">
                                                    {position.requirements.map((req, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">•</span>
                                                            <span className="text-sm text-gray-300">{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-3 text-blue-400">우대 사항</h4>
                                                <ul className="space-y-2">
                                                    {position.preferred.map((pref, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-blue-400 mt-1">•</span>
                                                            <span className="text-sm text-gray-300">{pref}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:ml-8">
                                        <Button variant="primary" size="md" className="whitespace-nowrap">
                                            지원하기
                                            <ArrowRight className="w-4 h-4 ml-2"/>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 복지 혜택 */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8">복지 & 혜택</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="p-6 text-center hover:scale-105 transition-transform">
                                <div
                                    className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-400">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 기업 문화 */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8">우리의 문화</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {culture.map((item, index) => (
                            <Card key={index} className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                                <h3 className="text-lg font-bold mb-2 text-green-400">{item.title}</h3>
                                <p className="text-gray-300">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 채용 프로세스 */}
                <Card className="p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">채용 프로세스</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {step: 1, title: '서류 전형', desc: '이력서 및 포트폴리오 검토'},
                            {step: 2, title: '1차 면접', desc: '직무 역량 및 기술 면접'},
                            {step: 3, title: '2차 면접', desc: '팀 컬처핏 및 최종 면접'},
                            {step: 4, title: '최종 합격', desc: '처우 협의 및 입사'}
                        ].map((process) => (
                            <div key={process.step} className="text-center">
                                <div
                                    className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl font-bold text-green-400">{process.step}</span>
                                </div>
                                <h3 className="font-bold mb-2">{process.title}</h3>
                                <p className="text-sm text-gray-400">{process.desc}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* CTA 섹션 */}
                <Card className="p-8 text-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <h2 className="text-2xl font-bold mb-4">지원 방법</h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        관심 있는 포지션에 지원하시려면 아래 이메일로 이력서와 포트폴리오를 보내주세요.
                        메일 제목에 [지원 포지션명_성명] 형식으로 기재해 주시기 바랍니다.
                    </p>
                    <a
                        href="mailto:recruit@eroom-game.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                        <Briefcase className="w-5 h-5"/>
                        recruit@eroom-game.com
                    </a>
                    <p className="text-sm text-gray-400 mt-4">
                        문의사항이 있으시면 언제든 연락주세요!
                    </p>
                </Card>
            </Container>
        </>
    )
}