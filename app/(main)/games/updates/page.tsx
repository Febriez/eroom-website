'use client'

import {useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Calendar, ChevronRight, Clock, Code, Sparkles, Star, Trophy, Zap} from 'lucide-react'

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
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

    const updates: Update[] = [
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
        },
        {
            id: '7',
            version: '1.1.0',
            date: '2024-01-05',
            title: '첫 번째 콘텐츠 업데이트',
            category: 'minor',
            highlights: [
                '새로운 테마 방 3개 추가',
                '업적 시스템 도입',
                '사운드 효과 개선'
            ],
            changes: [
                {type: 'feature', description: '병원 테마의 새로운 방 3개 추가'},
                {type: 'feature', description: '28개의 업적과 도전 과제 추가'},
                {type: 'improvement', description: '배경 음악 및 효과음 품질 향상'},
                {type: 'improvement', description: '힌트 시스템 개선'},
                {type: 'fix', description: '특정 아이템 상호작용 오류 수정'}
            ]
        },
        {
            id: '8',
            version: '1.0.2',
            date: '2023-12-28',
            title: '연말 안정화 패치',
            category: 'patch',
            highlights: [
                '안정성 향상',
                '번역 품질 개선'
            ],
            changes: [
                {type: 'fix', description: '메모리 누수 문제 해결'},
                {type: 'improvement', description: '한국어 번역 품질 개선'},
                {type: 'fix', description: '저장 시스템 안정성 향상'},
                {type: 'improvement', description: '튜토리얼 설명 보완'}
            ]
        },
        {
            id: '9',
            version: '1.0.1',
            date: '2023-12-22',
            title: '출시일 핫픽스',
            category: 'hotfix',
            highlights: [
                '출시일 긴급 수정사항'
            ],
            changes: [
                {type: 'fix', description: '게임 로딩 중 멈춤 현상 긴급 수정'},
                {type: 'fix', description: '일부 퍼즐의 해답 인식 오류 수정'},
                {type: 'fix', description: '오디오 드라이버 호환성 문제 해결'}
            ]
        },
        {
            id: '10',
            version: '1.0.0',
            date: '2023-12-21',
            title: 'EROOM 정식 출시',
            category: 'major',
            highlights: [
                '정식 버전 출시',
                '15개 방탈출 방',
                '완전한 스토리 모드'
            ],
            changes: [
                {type: 'feature', description: '총 15개의 방탈출 방 제공'},
                {type: 'feature', description: '완성된 스토리 모드와 엔딩'},
                {type: 'feature', description: '다양한 난이도 옵션'},
                {type: 'feature', description: '힌트 시스템 및 도움말 기능'},
                {type: 'feature', description: '성과 추적 및 통계 시스템'}
            ]
        }
    ]

    const toggleCategory = (category: string) => {
        const newSet = new Set(selectedCategories)
        if (newSet.has(category)) {
            newSet.delete(category)
        } else {
            newSet.add(category)
        }
        setSelectedCategories(newSet)
    }

    const filteredUpdates = selectedCategories.size === 0
        ? updates
        : updates.filter(update => selectedCategories.has(update.category))

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'major':
                return 'success'
            case 'minor':
                return 'info'
            case 'patch':
                return 'warning'
            case 'hotfix':
                return 'danger'
            default:
                return 'default'
        }
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'major':
                return '메이저 업데이트'
            case 'minor':
                return '마이너 업데이트'
            case 'patch':
                return '패치'
            case 'hotfix':
                return '핫픽스'
            default:
                return category
        }
    }

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

    const categories = [
        {
            key: 'major',
            label: '메이저 업데이트',
            color: 'bg-green-600',
            count: updates.filter(u => u.category === 'major').length
        },
        {
            key: 'minor',
            label: '마이너 업데이트',
            color: 'bg-blue-600',
            count: updates.filter(u => u.category === 'minor').length
        },
        {key: 'patch', label: '패치', color: 'bg-yellow-600', count: updates.filter(u => u.category === 'patch').length},
        {key: 'hotfix', label: '핫픽스', color: 'bg-red-600', count: updates.filter(u => u.category === 'hotfix').length}
    ]

    return (
        <>
            <PageHeader
                title="전체 업데이트 소식"
                description="EROOM의 모든 업데이트 히스토리와 패치 노트를 확인하세요"
                badge="완전한 기록"
                icon={<Sparkles className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 업데이트 필터 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {categories.map(category => (
                        <button
                            key={category.key}
                            onClick={() => toggleCategory(category.key)}
                            className={`p-4 rounded-lg border transition-all ${
                                selectedCategories.has(category.key)
                                    ? 'border-white bg-gray-800'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-3 h-3 rounded-full ${category.color}`}/>
                                <span className="text-2xl font-bold">
                                    {category.count}
                                </span>
                            </div>
                            <div className="text-sm text-left">{category.label}</div>
                        </button>
                    ))}
                </div>

                {/* 필터 상태 표시 */}
                {selectedCategories.size > 0 && (
                    <div className="mb-6 flex items-center gap-2">
                        <span className="text-sm text-gray-400">필터:</span>
                        {Array.from(selectedCategories).map(cat => (
                            <Badge
                                key={cat}
                                variant={getCategoryColor(cat) as any}
                                className="cursor-pointer"
                                onClick={() => toggleCategory(cat)}
                            >
                                {getCategoryLabel(cat)} ✕
                            </Badge>
                        ))}
                        <button
                            onClick={() => setSelectedCategories(new Set())}
                            className="text-sm text-gray-400 hover:text-white ml-2"
                        >
                            필터 초기화
                        </button>
                    </div>
                )}

                {/* 업데이트 목록 */}
                <div className="space-y-6">
                    {filteredUpdates.map(update => {
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
                                                <Badge variant={getCategoryColor(update.category) as any} size="sm">
                                                    {getCategoryLabel(update.category)}
                                                </Badge>
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
                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
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

                {/* 결과 없음 */}
                {filteredUpdates.length === 0 && (
                    <div className="text-center py-20">
                        <Sparkles className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">선택한 필터에 해당하는 업데이트가 없습니다</h3>
                        <p className="text-gray-400">다른 카테고리를 선택해보세요</p>
                    </div>
                )}

                {/* 완료 메시지 */}
                {filteredUpdates.length > 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-2">
                            {selectedCategories.size > 0
                                ? `${filteredUpdates.length}개의 업데이트가 표시되었습니다.`
                                : `총 ${updates.length}개의 업데이트 내역을 모두 확인했습니다.`
                            }
                        </p>
                        <p className="text-sm text-gray-500">
                            EROOM의 정식 출시부터 현재까지의 모든 변경사항이 포함되어 있습니다.
                        </p>
                    </div>
                )}
            </Container>
        </>
    )
}