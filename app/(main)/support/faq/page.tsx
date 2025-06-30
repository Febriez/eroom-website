'use client'

import {useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {ChevronDown, ChevronUp, CreditCard, Download, Gamepad2, HelpCircle, Search, Shield, Users} from 'lucide-react'
import Link from "next/link";

interface FAQCategory {
    id: string
    name: string
    icon: React.ReactNode
    questions: {
        question: string
        answer: string
    }[]
}

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories: FAQCategory[] = [
        {
            id: 'general',
            name: '일반',
            icon: <HelpCircle className="w-5 h-5"/>,
            questions: [
                {
                    question: 'EROOM은 무엇인가요?',
                    answer: 'EROOM은 AI가 실시간으로 방탈출 맵을 생성하는 혁신적인 퍼즐 게임입니다. 매번 플레이할 때마다 새로운 경험을 제공하며, 플레이어가 직접 맵을 제작하고 공유할 수도 있습니다.'
                },
                {
                    question: '게임은 무료인가요?',
                    answer: '네, EROOM은 무료로 다운로드하고 플레이할 수 있습니다. 게임 내 구매를 통해 추가 콘텐츠나 편의 기능을 이용할 수 있지만, 핵심 게임플레이는 무료로 즐기실 수 있습니다.'
                },
                {
                    question: '어떤 플랫폼에서 플레이할 수 있나요?',
                    answer: '현재 EROOM은 Windows PC에서만 플레이 가능합니다. 향후 다른 플랫폼으로의 확장을 검토하고 있습니다.'
                }
            ]
        },
        {
            id: 'download',
            name: '다운로드 & 설치',
            icon: <Download className="w-5 h-5"/>,
            questions: [
                {
                    question: '게임을 어디서 다운로드할 수 있나요?',
                    answer: '공식 웹사이트의 다운로드 페이지에서 게임을 다운로드할 수 있습니다. 설치 파일을 다운로드한 후 안내에 따라 설치하시면 됩니다.'
                },
                {
                    question: '설치 중 오류가 발생했어요.',
                    answer: '1) 관리자 권한으로 설치 프로그램을 실행해보세요. 2) 백신 프로그램이 설치를 차단하고 있지 않은지 확인하세요. 3) 충분한 저장 공간(25GB 이상)이 있는지 확인하세요.'
                },
                {
                    question: '게임이 실행되지 않아요.',
                    answer: '시스템 요구사항을 충족하는지 확인하고, 그래픽 드라이버를 최신 버전으로 업데이트해보세요. Windows 업데이트도 확인해주세요.'
                }
            ]
        },
        {
            id: 'gameplay',
            name: '게임플레이',
            icon: <Gamepad2 className="w-5 h-5"/>,
            questions: [
                {
                    question: 'AI가 생성한 맵은 항상 클리어 가능한가요?',
                    answer: '네, AI는 모든 맵이 논리적으로 해결 가능하도록 설계합니다. 난이도에 따라 퍼즐의 복잡도가 달라지지만, 항상 해답이 존재합니다.'
                },
                {
                    question: '친구와 함께 플레이할 수 있나요?',
                    answer: '네, 최대 4명까지 함께 플레이할 수 있습니다. 협동 모드에서는 팀워크가 중요하며, 일부 퍼즐은 여러 명이 함께 해결해야 합니다.'
                },
                {
                    question: '제가 만든 맵을 공유할 수 있나요?',
                    answer: '물론입니다! 맵 에디터로 제작한 맵은 커뮤니티에 공유할 수 있으며, 다른 플레이어들의 평가를 받을 수 있습니다.'
                }
            ]
        },
        {
            id: 'store',
            name: '스토어 & 결제',
            icon: <CreditCard className="w-5 h-5"/>,
            questions: [
                {
                    question: '크레딧은 어떻게 사용하나요?',
                    answer: '크레딧은 게임 내 화폐로, 새로운 테마, 캐릭터 스킨, 특수 도구 등을 구매하는 데 사용됩니다. 게임을 플레이하면서 무료로 획득할 수도 있습니다.'
                },
                {
                    question: '환불은 가능한가요?',
                    answer: '구매 후 14일 이내, 사용하지 않은 아이템에 한해 환불이 가능합니다. 고객센터를 통해 환불 요청을 하실 수 있습니다.'
                },
                {
                    question: '시즌 패스는 무엇인가요?',
                    answer: '시즌 패스는 3개월 동안 특별한 보상과 혜택을 제공하는 프리미엄 서비스입니다. 독점 아이템, 2배 경험치, VIP 지위 등이 포함됩니다.'
                }
            ]
        },
        {
            id: 'technical',
            name: '기술 지원',
            icon: <Shield className="w-5 h-5"/>,
            questions: [
                {
                    question: '게임이 느려요.',
                    answer: '그래픽 설정을 낮춰보세요. 설정 > 그래픽에서 프리셋을 "낮음"으로 변경하거나, 해상도를 낮추면 성능이 향상됩니다.'
                },
                {
                    question: '네트워크 연결 오류가 발생해요.',
                    answer: '방화벽이나 백신 프로그램이 게임 연결을 차단하고 있지 않은지 확인하세요. 라우터를 재시작하거나 DNS를 변경해보는 것도 도움이 됩니다.'
                },
                {
                    question: '게임 데이터가 저장되지 않아요.',
                    answer: '클라우드 저장이 활성화되어 있는지 확인하세요. 로컬 저장 폴더에 쓰기 권한이 있는지도 확인해주세요.'
                }
            ]
        },
        {
            id: 'account',
            name: '계정 & 소셜',
            icon: <Users className="w-5 h-5"/>,
            questions: [
                {
                    question: '사용자명을 변경할 수 있나요?',
                    answer: '계정 생성 후 1회에 한해 사용자명을 변경할 수 있습니다. 프로필 설정에서 변경 가능합니다.'
                },
                {
                    question: '친구는 어떻게 추가하나요?',
                    answer: '프로필 페이지에서 사용자명으로 검색하거나, 게임 내에서 만난 플레이어에게 친구 요청을 보낼 수 있습니다.'
                },
                {
                    question: '계정이 해킹당한 것 같아요.',
                    answer: '즉시 비밀번호를 변경하고 고객센터에 문의해주세요. 2단계 인증을 활성화하면 계정 보안을 강화할 수 있습니다.'
                }
            ]
        }
    ]

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const filteredQuestions = categories.flatMap(category =>
        category.questions
            .filter(q =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(q => ({...q, category: category.name, categoryId: category.id}))
    )

    const displayCategories = selectedCategory
        ? categories.filter(c => c.id === selectedCategory)
        : categories

    return (
        <>
            <PageHeader
                title="자주 묻는 질문"
                description="EROOM에 대해 궁금한 점을 찾아보세요"
                badge="도움말"
                icon={<HelpCircle className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 */}
                <div className="max-w-2xl mx-auto mb-12">
                    <Input
                        placeholder="질문을 검색하세요..."
                        icon={<Search className="w-5 h-5"/>}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-lg"
                    />
                </div>

                {/* 카테고리 필터 */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            !selectedCategory
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        전체
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                selectedCategory === category.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {category.icon}
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* FAQ 목록 */}
                {searchTerm ? (
                    <div className="max-w-4xl mx-auto">
                        <p className="text-sm text-gray-400 mb-6">
                            &ldquo;{searchTerm}&rdquo;에 대한 검색 결과 {filteredQuestions.length}개
                        </p>
                        <div className="space-y-4">
                            {filteredQuestions.map((item, index) => {
                                const itemId = `search-${index}`
                                const isExpanded = expandedItems.includes(itemId)

                                return (
                                    <Card
                                        key={itemId}
                                        className="p-6 cursor-pointer hover:border-green-600/50 transition-colors"
                                        onClick={() => toggleExpanded(itemId)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-xs text-green-400 mb-2">{item.category}</p>
                                                <h3 className="font-bold mb-2">{item.question}</h3>
                                                {isExpanded && (
                                                    <p className="text-gray-300 mt-4">{item.answer}</p>
                                                )}
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-12">
                        {displayCategories.map(category => (
                            <div key={category.id}>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="text-green-400">{category.icon}</div>
                                    {category.name}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((item, index) => {
                                        const itemId = `${category.id}-${index}`
                                        const isExpanded = expandedItems.includes(itemId)

                                        return (
                                            <Card
                                                key={itemId}
                                                className="p-6 cursor-pointer hover:border-green-600/50 transition-colors"
                                                onClick={() => toggleExpanded(itemId)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold mb-2">{item.question}</h3>
                                                        {isExpanded && (
                                                            <p className="text-gray-300 mt-4">{item.answer}</p>
                                                        )}
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                                                    )}
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 추가 도움말 */}
                <Card className="p-8 mt-12 text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">원하는 답변을 찾지 못하셨나요?</h3>
                    <p className="text-gray-400 mb-6">
                        고객센터에서 더 자세한 도움을 받으실 수 있습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/support/help" className="btn-primary">
                            고객센터 문의
                        </Link>
                        <Link href="/community/guides" className="btn-outline">
                            커뮤니티 가이드
                        </Link>
                    </div>
                </Card>
            </Container>
        </>
    )
}