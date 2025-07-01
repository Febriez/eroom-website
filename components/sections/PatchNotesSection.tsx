'use client'

import {useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {ArrowRight, Calendar, Clock, Code, Sparkles, Star, Trophy, Zap} from 'lucide-react'
import {useRouter} from 'next/navigation'

interface Update {
    id: string
    version: string
    date: string
    title: string
    category: 'major' | 'minor' | 'patch' | 'hotfix'
    highlights: string[]
    changes: {
        type: 'feature' | 'improvement' | 'fix' | 'balance'
        description: string
    }[]
}

export default function UpdatesPage() {
    const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null)
    const router = useRouter()

    const allUpdates: Update[] = [
        {
            id: '1',
            version: '1.2.0',
            date: '2024-03-15',
            title: '새로운 챕터: 우주 정거장',
            category: 'major',
            highlights: [
                '신규 챕터 5개 추가',
                '멀티플레이어 협동 모드',
                'AI 난이도 조절 시스템'
            ],
            changes: [
                {type: 'feature', description: '우주 정거장 테마의 새로운 방 5개 추가'},
                {type: 'feature', description: '2-4인 협동 플레이 모드 추가'},
                {type: 'improvement', description: 'AI가 플레이어 실력에 맞춰 난이도를 조절합니다'},
                {type: 'fix', description: '특정 퍼즐에서 진행이 막히는 버그 수정'},
                {type: 'balance', description: '챕터 3의 시간 제한 완화 (10분 → 15분)'}
            ]
        },
        {
            id: '2',
            version: '1.1.5',
            date: '2024-03-01',
            title: '성능 최적화 업데이트',
            category: 'minor',
            highlights: [
                '로딩 시간 50% 단축',
                '메모리 사용량 개선',
                '새로운 그래픽 옵션'
            ],
            changes: [
                {type: 'improvement', description: '게임 시작 시 로딩 시간 대폭 개선'},
                {type: 'improvement', description: '저사양 PC를 위한 그래픽 옵션 추가'},
                {type: 'fix', description: '간헐적으로 발생하는 프레임 드롭 현상 수정'},
                {type: 'fix', description: '일부 사용자의 세이브 파일 손상 문제 해결'}
            ]
        },
        {
            id: '3',
            version: '1.1.4',
            date: '2024-02-20',
            title: '긴급 패치',
            category: 'hotfix',
            highlights: [
                '치명적인 버그 수정'
            ],
            changes: [
                {type: 'fix', description: '특정 상황에서 게임이 종료되는 문제 긴급 수정'},
                {type: 'fix', description: '클라우드 저장 동기화 오류 수정'}
            ]
        },
        {
            id: '4',
            version: '1.1.3',
            date: '2024-02-10',
            title: 'UI/UX 개선 업데이트',
            category: 'minor',
            highlights: [
                '새로운 메뉴 디자인',
                '접근성 개선',
                '사용자 경험 향상'
            ],
            changes: [
                {type: 'improvement', description: '메인 메뉴 디자인 개선'},
                {type: 'improvement', description: '색맹 사용자를 위한 색상 옵션 추가'},
                {type: 'feature', description: '키보드 단축키 커스터마이징 기능 추가'},
                {type: 'fix', description: '일부 UI 요소가 겹치는 문제 수정'}
            ]
        },
        {
            id: '5',
            version: '1.1.2',
            date: '2024-01-25',
            title: '밸런스 조정',
            category: 'patch',
            highlights: [
                '게임 난이도 조정',
                '점수 시스템 개선'
            ],
            changes: [
                {type: 'balance', description: '챕터 2의 퍼즐 난이도 하향 조정'},
                {type: 'balance', description: '보너스 점수 계산 방식 개선'},
                {type: 'fix', description: '순위표 표시 오류 수정'}
            ]
        },
        {
            id: '6',
            version: '1.1.1',
            date: '2024-01-15',
            title: '출시 후 첫 번째 패치',
            category: 'patch',
            highlights: [
                '초기 버그 수정',
                '안정성 개선'
            ],
            changes: [
                {type: 'fix', description: '게임 시작 시 충돌 문제 수정'},
                {type: 'fix', description: '일부 언어에서 텍스트가 잘리는 문제 해결'},
                {type: 'improvement', description: '전반적인 성능 최적화'}
            ]
        }
    ]

    const displayedUpdates = allUpdates.slice(0, 3)
    const getChangeIcon = (type: string) => {
        switch (type) {
            case 'feature':
                return <Sparkles className="w-4 h-4 text-green-400"/>
            case 'improvement':
                return <Zap className="w-4 h-4 text-blue-400"/>
            case 'fix':
                return <Code className="w-4 h-4 text-orange-400"/>
            case 'balance':
                return <Trophy className="w-4 h-4 text-purple-400"/>
            default:
                return <Star className="w-4 h-4 text-gray-400"/>
        }
    }

    const handleViewAllUpdates = () => {
        router.push('/games/updates')
    }

    return (
        <>
            <PageHeader
                title="업데이트 소식"
                description="EROOM의 최신 업데이트와 패치 노트를 확인하세요"
                badge="최신 정보"
                icon={<Sparkles className="w-5 h-5"/>}
            />

            <Container className="py-12">

                {/* 업데이트 목록 */}
                <div className="space-y-6">
                    {displayedUpdates.map(update => {
                        const isExpanded = expandedUpdate === update.id

                        return (
                            <Card key={update.id} className="overflow-hidden">
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                    onClick={() => setExpandedUpdate(isExpanded ? null : update.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold">v{update.version}</h3>
                                            </div>
                                            <h4 className="text-lg font-medium mb-2">{update.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4"/>
                                                    {new Date(update.date).toLocaleDateString('ko-KR')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4"/>
                                                    {Math.ceil((Date.now() - new Date(update.date).getTime()) / (1000 * 60 * 60 * 24))}일 전
                                                </span>
                                            </div>
                                            {!isExpanded && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-300 font-medium mb-2">주요 변경사항:</p>
                                                    <ul className="space-y-1">
                                                        {update.highlights.map((highlight, index) => (
                                                            <li key={index}
                                                                className="text-sm text-gray-400 flex items-start gap-2">
                                                                <span className="text-green-400 mt-0.5">•</span>
                                                                <span>{highlight}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${
                                            isExpanded ? 'rotate-90' : ''
                                        }`}/>
                                    </div>
                                </div>

                                {/* 상세 내용 */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 border-t border-gray-800">
                                        <div className="pt-6 space-y-6">
                                            {/* 주요 변경사항 */}
                                            <div>
                                                <h5 className="text-lg font-bold mb-4 text-green-400">주요 변경사항</h5>
                                                <div className="grid gap-3">
                                                    {update.highlights.map((highlight, index) => (
                                                        <div key={index}
                                                             className="flex items-start gap-3 bg-gray-800 rounded-lg p-4">
                                                            <Star
                                                                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"/>
                                                            <p className="text-gray-200">{highlight}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 전체 변경사항 */}
                                            <div>
                                                <h5 className="text-lg font-bold mb-4">전체 변경사항</h5>
                                                <div className="space-y-2">
                                                    {update.changes.map((change, index) => (
                                                        <div key={index} className="flex items-start gap-3 py-2">
                                                            {getChangeIcon(change.type)}
                                                            <p className="text-sm text-gray-300">{change.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>

                {/* 전체 패치 노트 보기 버튼 */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-6">
                        더 많은 업데이트 내역을 확인하고 싶으신가요?
                    </p>
                    <button
                        onClick={handleViewAllUpdates}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                        전체 패치 노트 보기
                        <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>
            </Container>
        </>
    )
}