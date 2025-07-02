'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {Badge} from '@/components/ui/Badge'
import {Skeleton} from '@/components/ui/Skeleton'
import {BookOpen, Brain, ChevronRight, Clock, Eye, Search, Shield, Sparkles, Zap} from 'lucide-react'
import Link from 'next/link'
import {GuideService} from '@/lib/firebase/services/guide.service'
import type {Guide} from '@/lib/firebase/types/guide.types'

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([])
    const [filteredGuides, setFilteredGuides] = useState<Guide[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        loadGuides()
    }, [])

    useEffect(() => {
        filterGuides()
    }, [searchTerm, selectedCategory, guides])

    const loadGuides = async () => {
        try {
            setLoading(true)
            // 초기 데이터 시딩 (필요한 경우)
            await GuideService.seedGuides()

            // 모든 가이드 가져오기
            const allGuides = await GuideService.getAllGuides()
            setGuides(allGuides)
            setFilteredGuides(allGuides)
        } catch (error) {
            console.error('Error loading guides:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterGuides = () => {
        let filtered = guides

        // 검색어 필터
        if (searchTerm) {
            filtered = filtered.filter(guide =>
                guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // 카테고리 필터
        if (selectedCategory) {
            filtered = filtered.filter(guide => guide.category === selectedCategory)
        }

        setFilteredGuides(filtered)
    }

    const categories = [
        {id: 'beginner', name: '초보자', icon: <Shield className="w-4 h-4"/>, color: 'success'},
        {id: 'advanced', name: '고급', icon: <Zap className="w-4 h-4"/>, color: 'danger'},
        {id: 'map-creation', name: '맵 제작', icon: <Brain className="w-4 h-4"/>, color: 'info'},
        {id: 'tips', name: '팁', icon: <Sparkles className="w-4 h-4"/>, color: 'warning'}
    ]

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'beginner':
                return <Shield className="w-6 h-6"/>
            case 'advanced':
                return <Zap className="w-6 h-6"/>
            case 'map-creation':
                return <Brain className="w-6 h-6"/>
            case 'tips':
                return <Sparkles className="w-6 h-6"/>
            default:
                return <BookOpen className="w-6 h-6"/>
        }
    }

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'beginner':
                return 'from-green-600 to-green-700'
            case 'advanced':
                return 'from-red-600 to-red-700'
            case 'map-creation':
                return 'from-blue-600 to-blue-700'
            case 'tips':
                return 'from-yellow-600 to-yellow-700'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '쉬움'
            case 'medium':
                return '보통'
            case 'hard':
                return '어려움'
            default:
                return difficulty
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'success'
            case 'medium':
                return 'warning'
            case 'hard':
                return 'danger'
            default:
                return 'default'
        }
    }

    return (
        <>
            <PageHeader
                title="게임 가이드"
                description="전문가들이 작성한 상세한 게임 가이드로 실력을 향상시키세요"
                badge={`${guides.length}개의 가이드`}
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

                {/* 로딩 상태 */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Skeleton className="w-12 h-12 rounded-lg"/>
                                    <Skeleton className="w-16 h-6 rounded-full"/>
                                </div>
                                <Skeleton className="h-6 w-3/4 mb-2"/>
                                <Skeleton className="h-4 w-full mb-1"/>
                                <Skeleton className="h-4 w-2/3 mb-4"/>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20"/>
                                    <Skeleton className="h-4 w-16"/>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* 가이드 그리드 */}
                {!loading && filteredGuides.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map(guide => {
                            const category = categories.find(c => c.id === guide.category)

                            return (
                                <Link key={guide.id} href={`/guides/${guide.id}`}>
                                    <Card hover className="h-full p-6 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(guide.category)}`}
                                            >
                                                {getCategoryIcon(guide.category)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getDifficultyColor(guide.difficulty) as any} size="sm">
                                                    {getDifficultyLabel(guide.difficulty)}
                                                </Badge>
                                                {guide.metadata.featured && (
                                                    <Badge variant="warning" size="sm">
                                                        추천
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">
                                            {guide.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {guide.description}
                                        </p>

                                        {/* 태그 */}
                                        {guide.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {guide.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index}
                                                          className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3"/>
                                                    {guide.readTime}분
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3"/>
                                                    {guide.stats.views.toLocaleString()}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-500">
                                            by {guide.author.displayName}
                                        </div>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* 빈 상태 */}
                {!loading && filteredGuides.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">가이드를 찾을 수 없습니다</h3>
                        <p className="text-gray-400">
                            {searchTerm || selectedCategory
                                ? '다른 검색어나 카테고리를 시도해보세요'
                                : '아직 등록된 가이드가 없습니다'}
                        </p>
                    </div>
                )}

                {/* 인기 가이드 섹션 */}
                {!loading && guides.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">인기 가이드</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card
                                className="p-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50">
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
                                        <Link
                                            href="complete"
                                            className="text-green-400 hover:text-green-300 font-medium inline-flex items-center gap-1"
                                        >
                                            지금 읽기 <ChevronRight className="w-4 h-4"/>
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
                                        <Link
                                            href="map-creation"
                                            className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                                        >
                                            지금 읽기 <ChevronRight className="w-4 h-4"/>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 추천 가이드 */}
                        {guides.filter(g => g.metadata.featured).length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-4">추천 가이드</h3>
                                <div className="space-y-3">
                                    {guides.filter(g => g.metadata.featured).slice(0, 3).map(guide => (
                                        <Link key={guide.id} href={`/guides/${guide.id}`}>
                                            <Card hover className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(guide.category)} flex-shrink-0`}>
                                                        {getCategoryIcon(guide.category)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{guide.title}</h4>
                                                        <p className="text-sm text-gray-400">{guide.description}</p>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {guide.readTime}분 읽기
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </>
    )
}