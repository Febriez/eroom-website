'use client'

import {useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {
    AlertCircle,
    Blocks,
    Brush,
    ChevronRight,
    Code,
    Cpu,
    Eye,
    Gamepad2,
    Layers,
    Lightbulb,
    Map,
    Palette,
    PuzzleIcon,
    Settings,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Wand2,
    Zap
} from 'lucide-react'
import {useRouter} from 'next/navigation'

export default function MapCreationGuidePage() {
    const router = useRouter()
    const [selectedSection, setSelectedSection] = useState<string>('basics')

    const sections = [
        {
            id: 'basics',
            title: '기초 개념',
            icon: <Blocks className="w-5 h-5"/>,
            color: 'text-green-400'
        },
        {
            id: 'editor',
            title: '에디터 사용법',
            icon: <Settings className="w-5 h-5"/>,
            color: 'text-blue-400'
        },
        {
            id: 'design',
            title: '디자인 원칙',
            icon: <Palette className="w-5 h-5"/>,
            color: 'text-purple-400'
        },
        {
            id: 'puzzle',
            title: '퍼즐 제작',
            icon: <PuzzleIcon className="w-5 h-5"/>,
            color: 'text-orange-400'
        },
        {
            id: 'ai',
            title: 'AI 활용법',
            icon: <Cpu className="w-5 h-5"/>,
            color: 'text-pink-400'
        },
        {
            id: 'tips',
            title: '프로 팁',
            icon: <Lightbulb className="w-5 h-5"/>,
            color: 'text-yellow-400'
        }
    ]

    const content = {
        basics: {
            title: '맵 제작의 기초',
            items: [
                {
                    title: '좋은 맵의 조건',
                    description: '플레이어가 즐거워하는 맵을 만드는 핵심 요소들',
                    icon: <Target className="w-6 h-6 text-green-400"/>,
                    details: [
                        '너무 눈에 띄는 위치에 있는 오브젝트는 지양',
                        '적절한 난이도',
                        '직관적인 퍼즐 디자인',
                        '몰입감 있는 스토리텔링'
                    ]
                },
                {
                    title: '맵 구조 이해하기',
                    description: '효과적인 공간 배치와 동선 설계',
                    icon: <Map className="w-6 h-6 text-green-400"/>,
                    details: [
                        '시작점과 종료점(ExitDoor) 설정',
                        '메인 경로와 서브 경로 *지원예정'
                    ]
                },
                {
                    title: '테마 선택하기',
                    description: '일관성 있는 분위기와 세계관 구축',
                    icon: <Brush className="w-6 h-6 text-green-400"/>,
                    details: [
                        '인기 테마: 정신병동, 빅토리아',
                        '테마에 맞는 키워드 선택'
                    ]
                }
            ]
        },
        editor: {
            title: '에디터 마스터하기',
            items: [
                {
                    title: '인터페이스 둘러보기',
                    description: '에디터의 모든 기능을 효율적으로 사용하는 방법',
                    icon: <Layers className="w-6 h-6 text-blue-400"/>,
                    details: [
                        '설정 패널과 단축키',
                        '오브젝트 라이브러리',
                        '미리보기와 테스트 모드 *지원예정'
                    ]
                },
                {
                    title: '고급 편집 기능 *지원예정',
                    description: '전문가처럼 맵을 제작하는 고급 테크닉',
                    icon: <Code className="w-6 h-6 text-blue-400"/>,
                    details: [
                        'AI Assist 활용',
                        '커스텀 이벤트 생성',
                        '변수와 조건문 사용',
                        '복잡한 메커니즘 구현'
                    ]
                },
                {
                    title: '최적화 기법',
                    description: '부드러운 플레이를 위한 성능 최적화',
                    icon: <Zap className="w-6 h-6 text-blue-400"/>,
                    details: [
                        '오브젝트 수 관리',
                        '충돌 박스 간소화'
                    ]
                }
            ]
        },
        design: {
            title: '디자인 철학',
            items: [
                {
                    title: '시각적 가이드',
                    description: '플레이어의 시선을 이끄는 비주얼 디자인',
                    icon: <Eye className="w-6 h-6 text-purple-400"/>,
                    details: [
                        '랜드마크 배치',
                        '시각적 계층 구조'
                    ]
                },
                {
                    title: '공간 디자인',
                    description: '효과적인 공간 활용과 레이아웃',
                    icon: <Sparkles className="w-6 h-6 text-purple-400"/>,
                    details: [
                        '개방감과 폐쇄감의 균형',
                        '수직 공간 활용',
                        '대칭과 비대칭',
                        '공간의 리듬감'
                    ]
                },
                {
                    title: '분위기 연출',
                    description: '감정을 자극하는 환경 디자인',
                    icon: <Wand2 className="w-6 h-6 text-purple-400"/>,
                    details: [
                        '조명과 그림자',
                        '사운드스케이프',
                        '환경 스토리텔링',
                        '디테일의 중요성'
                    ]
                }
            ]
        },
        puzzle: {
            title: '퍼즐 디자인',
            items: [
                {
                    title: '퍼즐 유형',
                    description: '다양한 퍼즐 메커니즘과 활용법',
                    icon: <PuzzleIcon className="w-6 h-6 text-orange-400"/>,
                    details: [
                        '논리 퍼즐',
                        '물리 기반 퍼즐',
                        '패턴 인식',
                        '시간 제한 퍼즐'
                    ]
                },
                {
                    title: '난이도 밸런싱',
                    description: '모든 플레이어가 즐길 수 있는 난이도 설정',
                    icon: <Gamepad2 className="w-6 h-6 text-orange-400"/>,
                    details: [
                        '단계적 난이도 상승',
                        '힌트 시스템 구현',
                        '선택적 도전 과제',
                        '다중 해결법 제공'
                    ]
                },
                {
                    title: '퍼즐 연결하기',
                    description: '유기적으로 연결된 퍼즐 시퀀스 만들기',
                    icon: <Layers className="w-6 h-6 text-orange-400"/>,
                    details: [
                        '퍼즐 간 연계성',
                        '점진적 학습 곡선',
                        '테마 일관성',
                        '보상 시스템'
                    ]
                }
            ]
        },
        ai: {
            title: 'AI 도구 활용',
            items: [
                {
                    title: 'AI 맵 생성',
                    description: 'AI를 활용한 빠른 프로토타이핑',
                    icon: <Cpu className="w-6 h-6 text-pink-400"/>,
                    details: [
                        'AI 프롬프트 작성법',
                        '생성된 맵 커스터마이징',
                        'AI와 협업하기',
                        '창의적 아이디어 얻기'
                    ]
                },
                {
                    title: 'AI 퍼즐 도우미',
                    description: 'AI를 활용한 퍼즐 아이디어 생성',
                    icon: <Sparkles className="w-6 h-6 text-pink-400"/>,
                    details: [
                        '퍼즐 로직 검증',
                        '난이도 자동 조정',
                        '대안 해결법 찾기',
                        'AI 피드백 활용'
                    ]
                },
                {
                    title: 'AI 테스터',
                    description: 'AI를 통한 맵 테스트와 개선',
                    icon: <Target className="w-6 h-6 text-pink-400"/>,
                    details: [
                        '자동 플레이테스트',
                        '병목 구간 발견',
                        '밸런스 조정 제안',
                        '접근성 검사'
                    ]
                }
            ]
        },
        tips: {
            title: '프로 제작자의 팁',
            items: [
                {
                    title: '인기 맵의 비결',
                    description: '많은 플레이어가 찾는 맵 만들기',
                    icon: <Star className="w-6 h-6 text-yellow-400"/>,
                    details: [
                        '첫인상의 중요성',
                        '적절한 플레이 시간',
                        '재플레이 가치',
                        '커뮤니티 피드백 활용'
                    ]
                },
                {
                    title: '흔한 실수 피하기',
                    description: '초보 제작자가 자주 하는 실수들',
                    icon: <AlertCircle className="w-6 h-6 text-yellow-400"/>,
                    details: [
                        '과도한 복잡성',
                        '불명확한 목표',
                        '부족한 테스트',
                        '일관성 없는 디자인'
                    ]
                },
                {
                    title: '지속적인 개선',
                    description: '맵을 업데이트하고 발전시키는 방법',
                    icon: <TrendingUp className="w-6 h-6 text-yellow-400"/>,
                    details: [
                        '플레이어 피드백 수집',
                        '데이터 분석 활용',
                        '정기적인 업데이트',
                        '커뮤니티와 소통'
                    ]
                }
            ]
        }
    }

    const currentContent = content[selectedSection as keyof typeof content]

    return (
        <>
            <PageHeader
                title="맵 제작 가이드"
                description="나만의 독창적인 방탈출 맵을 만들어보세요"
                badge="크리에이터"
                icon={<Map className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 섹션 네비게이션 */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setSelectedSection(section.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                    selectedSection === section.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <span className={section.color}>{section.icon}</span>
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 섹션 콘텐츠 */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold mb-6">{currentContent.title}</h2>

                    <div className="grid gap-6">
                        {currentContent.items.map((item, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gray-800 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-400 mb-4">{item.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {item.details.map((detail, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0"/>
                                                    <span className="text-sm">{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* CTA 섹션 */}
                    <Card className="p-8 bg-gradient-to-br from-green-900/20 to-green-800/20 text-center">
                        <h3 className="text-2xl font-bold mb-4">준비되셨나요?</h3>
                        <p className="text-gray-400 mb-6">
                            이제 당신만의 독창적인 맵을 만들어볼 시간입니다!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="primary"
                                onClick={() => router.push('/support/download')}
                            >
                                에디터 다운로드
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/community/maps')}
                            >
                                다른 맵 둘러보기
                            </Button>
                        </div>
                    </Card>
                </div>
            </Container>
        </>
    )
}

