'use client'

import {useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {Badge} from '@/components/ui/Badge'
import {BookOpen, Brain, ChevronRight, Clock, Search, Shield, Sparkles, Target, Users, Zap} from 'lucide-react'
import Link from 'next/link'

interface Guide {
    id: string
    title: string
    description: string
    category: 'beginner' | 'advanced' | 'strategy' | 'tips'
    icon: React.ReactNode
    readTime: string
    author: string
    views: number
}

export default function GuidesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const guides: Guide[] = [
        {
            id: '1',
            title: 'EROOM 시작하기',
            description: '게임의 기본 조작법과 인터페이스를 알아보세요',
            category: 'beginner',
            icon: <Zap className="w-6 h-6"/>,
            readTime: '5분',
            author: 'BangtalBoyBand',
            views: 15420
        },
        {
            id: '2',
            title: '퍼즐 해결의 기본 전략',
            description: '모든 방탈출 맵에 적용할 수 있는 기본 전략을 배워보세요',
            category: 'strategy',
            icon: <Brain className="w-6 h-6"/>,
            readTime: '8분',
            author: 'GameMaster',
            views: 12350
        },
        {
            id: '3',
            title: '스피드런 가이드',
            description: '최단 시간 클리어를 위한 고급 테크닉',
            category: 'advanced',
            icon: <Clock className="w-6 h-6"/>,
            readTime: '12분',
            author: 'SpeedRunner',
            views: 8900
        },
        {
            id: '4',
            title: 'AI 맵 생성 시스템 이해하기',
            description: 'EROOM의 핵심, AI 맵 생성 시스템의 작동 원리',
            category: 'tips',
            icon: <Sparkles className="w-6 h-6"/>,
            readTime: '10분',
            author: 'TechExplorer',
            views: 10200
        },
        {
            id: '5',
            title: '팀플레이 마스터하기',
            description: '친구들과 함께 플레이할 때 필요한 협동 전략',
            category: 'strategy',
            icon: <Users className="w-6 h-6"/>,
            readTime: '7분',
            author: 'TeamLeader',
            views: 9500
        },
        {
            id: '6',
            title: '숨겨진 요소 찾기',
            description: '맵에 숨겨진 이스터에그와 보너스 요소들',
            category: 'tips',
            icon: <Target className="w-6 h-6"/>,
            readTime: '6분',
            author: 'SecretHunter',
            views: 11800
        }
    ]

    const categories = [
        {id: 'beginner', name: '초보자', icon: <Shield className="w-4 h-4"/>, color: 'success'},
        {id: 'advanced', name: '고급', icon: <Zap className="w-4 h-4"/>, color: 'danger'},
        {id: 'strategy', name: '전략', icon: <Brain className="w-4 h-4"/>, color: 'info'},
        {id: 'tips', name: '팁', icon: <Sparkles className="w-4 h-4"/>, color: 'warning'}
    ]

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || guide.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <>
            <PageHeader
                title="게임 가이드"
                description="전문가들이 작성한 상세한 게임 가이드로 실력을 향상시키세요"
                badge="50+ 가이드"
                icon={<BookOpen className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 카테고리 필터 */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="가이드 검색..."
                                icon={<Search className="w-5 h-5"/>}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                </div>

                {/* 가이드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides.map(guide => {
                        const category = categories.find(c => c.id === guide.category)

                        return (
                            <Link key={guide.id} href={`/community/guides/${guide.id}`}>
                                <Card hover className="h-full p-6 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                                                guide.category === 'beginner' ? 'from-green-600 to-green-700' :
                                                    guide.category === 'advanced' ? 'from-red-600 to-red-700' :
                                                        guide.category === 'strategy' ? 'from-blue-600 to-blue-700' :
                                                            'from-yellow-600 to-yellow-700'
                                            }`}>
                                            {guide.icon}
                                        </div>
                                        <Badge variant={category?.color as any} size="sm">
                                            {category?.name}
                                        </Badge>
                                    </div>

                                    <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">
                                        {guide.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {guide.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                          {guide.readTime}
                      </span>
                                            <span>{guide.views.toLocaleString()} 조회</span>
                                        </div>
                                        <ChevronRight
                                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>

                {/* 인기 가이드 섹션 */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">인기 가이드</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-8 h-8"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">완벽 공략집</h3>
                                    <p className="text-gray-400 mb-3">
                                        초보자부터 고수까지, 모든 레벨의 플레이어를 위한 종합 가이드
                                    </p>
                                    <Link href="/community/guides/complete-guide"
                                          className="text-green-400 hover:text-green-300 font-medium">
                                        지금 읽기 →
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/50">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-8 h-8"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">맵 제작 가이드</h3>
                                    <p className="text-gray-400 mb-3">
                                        나만의 창의적인 방탈출 맵을 만드는 방법을 배워보세요
                                    </p>
                                    <Link href="/community/guides/map-creation"
                                          className="text-purple-400 hover:text-purple-300 font-medium">
                                        지금 읽기 →
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}