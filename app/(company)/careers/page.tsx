'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {ArrowRight, Briefcase, Calendar, Coffee, Heart, MapPin, Sparkles, Zap} from 'lucide-react'
import {CONSTANTS} from '@/lib/utils/constants'

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
            id: 'ai-developer',
            title: 'AI 개발자',
            department: 'AI 기술팀',
            type: 'tech',
            level: '신입 & 경력',
            description: 'AI 기술을 활용한 게임 콘텐츠 생성 시스템을 개발하고 개선하는 역할을 담당합니다.',
            requirements: [
                'Python 및 주요 머신러닝 프레임워크(PyTorch, TensorFlow 등) 사용 경험',
                '절차적 콘텐츠 생성(PCG) 또는 강화학습 관련 지식 보유',
                '자료구조, 알고리즘 등 탄탄한 컴퓨터 공학 기초 지식',
                '새로운 AI 기술 및 논문을 빠르게 학습하고 적용하는 능력'
            ],
            preferred: [
                '게임 개발, 특히 Unity 환경에 대한 이해가 있으신 분',
                '생성 모델(GAN, VAE 등) 관련 프로젝트 경험',
                'AWS, GCP 등 클라우드 환경에서 모델 배포 및 운영 경험'
            ],
            location: '서울 본사',
            employmentType: '정규직'
        },
        {
            id: 'backend-developer',
            title: '백엔드 개발자 (플랫폼)',
            department: '플랫폼팀',
            type: 'tech',
            level: '신입 & 경력',
            description: 'EROOM 플랫폼의 서버 시스템을 개발하고 확장 가능한 인프라를 구축합니다.',
            requirements: [
                'Java/Kotlin, Go, Python, Node.js 중 하나 이상의 언어에 능숙하신 분',
                'RESTful API 설계 및 구축 경험',
                'MySQL(MariaDB) 등 RDBMS 및 NoSQL 사용 경험',
                'AWS, GCP 등 클라우드 인프라 기반 서비스 개발 및 운영 경험'
            ],
            preferred: [
                '대용량 트래픽 처리 및 실시간 통신(WebSocket 등) 경험',
                'Docker, Kubernetes 등 컨테이너 기술 활용 능력',
                'MSA(Microservice Architecture) 설계 및 구축 경험'
            ],
            location: '서울 본사',
            employmentType: '정규직'
        },
        {
            id: 'ui-ux-designer',
            title: '게임 UI/UX 디자이너',
            department: '프로덕트팀',
            type: 'creative',
            level: '신입 & 경력',
            description: '플레이어에게 최적의 게임 경험을 제공하는 UI/UX를 설계하고 구현합니다.',
            requirements: [
                'Figma, Sketch, Adobe XD 등 프로토타이핑 툴 활용 능력',
                '사용자 중심 설계(UCD) 방법론에 대한 깊은 이해',
                '게임의 재미와 편의성을 모두 고려한 UI 설계 능력',
                '본인의 강점이 잘 드러나는 포트폴리오 제출 필수'
            ],
            preferred: [
                'Unity UGUI 시스템에 대한 이해 및 실제 적용 경험',
                '게임 플레이어의 심리와 행동 패턴에 대한 이해가 높으신 분',
                '모션 그래픽 디자인 및 제작 능력'
            ],
            location: '서울 본사',
            employmentType: '정규직'
        }
    ]

    const benefits = [
        {
            icon: <Coffee className="w-6 h-6"/>,
            title: '자율과 책임',
            description: '자율과 책임을 기반으로 한 유연 근무제 및 원격 근무 지원',
            color: 'from-purple-600 to-purple-700'
        },
        {
            icon: <Calendar className="w-6 h-6"/>,
            title: '리프레시 휴가',
            description: '자유로운 휴가 사용 및 리프레시 휴가 제도',
            color: 'from-green-600 to-green-700'
        },
        {
            icon: <Zap className="w-6 h-6"/>,
            title: '성장 지원',
            description: '자기계발비, 도서 구매, 외부 세미나 비용 지원',
            color: 'from-yellow-600 to-yellow-700'
        },
        {
            icon: <Heart className="w-6 h-6"/>,
            title: '복지 혜택',
            description: '점심 식사 및 무제한 간식/음료 제공, 최신형 업무 장비 지원',
            color: 'from-red-600 to-red-700'
        }
    ]

    const culture = [
        {
            title: '수평적 문화',
            description: '직급 없이 \'~님\'으로 소통하는 수평적인 문화'
        },
        {
            title: '실험 문화',
            description: '데이터를 기반으로 가설을 세우고, 실패를 두려워하지 않고 빠르게 실험하는 문화'
        },
        {
            title: '투명한 소통',
            description: '모든 정보는 투명하게, 의사결정 과정은 모두에게 공유하는 문화'
        },
        {
            title: '플레이어 중심',
            description: '플레이어의 즐거움을 최우선으로 생각하고 함께 게임을 즐기는 문화'
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
                description={`${CONSTANTS.COMPANY.NAME}과 함께 게임의 미래를 만들어갈 인재를 찾습니다`}
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
                            {CONSTANTS.COMPANY.NAME}은 AI와 게임의 결합으로 새로운 엔터테인먼트 경험을 창조합니다.
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
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            • 업계 최고 수준의 보상 및 스톡옵션 부여 기회
                        </p>
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
                        href={`mailto:${CONSTANTS.COMPANY.RECRUITER_EMAIL}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                        <Briefcase className="w-5 h-5"/>
                        {CONSTANTS.COMPANY.RECRUITER_EMAIL}
                    </a>
                    <p className="text-sm text-gray-400 mt-4">
                        문의사항이 있으시면 언제든 연락주세요!
                    </p>
                </Card>
            </Container>
        </>
    )
}