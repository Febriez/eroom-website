'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {Book, ChevronRight, Clock, Eye, Heart, Search, Star, TrendingUp} from 'lucide-react'
import {GuideService} from '@/lib/firebase/services/guide.service'
import type {Guide} from '@/lib/firebase/types/guide.types'
import {useRouter} from 'next/navigation'

export default function CompleteGuidePage() {
    const router = useRouter()
    const [guides, setGuides] = useState<Guide[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

    useEffect(() => {
        loadGuides()
    }, [])

    const loadGuides = async () => {
        try {
            setLoading(true)
            // 초기 데이터 시딩
            await GuideService.seedGuides()

            const allGuides = await GuideService.getAllGuides()
            setGuides(allGuides)
        } catch (error) {
            console.error('Error loading guides:', error)
        } finally {
            setLoading(false)
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

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '초급'
            case 'medium':
                return '중급'
            case 'hard':
                return '고급'
            default:
                return difficulty
        }
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'beginner':
                return '초보자 가이드'
            case 'map-creation':
                return '맵 제작'
            case 'advanced':
                return '고급 전략'
            case 'tips':
                return '팁 & 트릭'
            default:
                return category
        }
    }

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = !searchTerm ||
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty

        return matchesSearch && matchesDifficulty
    })

    const featuredGuides = guides.filter(g => g.metadata.featured)
    const beginnerGuides = guides.filter(g => g.category === 'beginner')
    const advancedGuides = guides.filter(g => g.category === 'advanced')

    const handleGuideClick = (guideId: string) => {
        router.push(`/guides/${guideId}`)
    }

    return (
        <>
            <PageHeader
                title="완벽 공략집"
                description="EROOM 마스터가 되기 위한 모든 가이드와 전략"
                badge="가이드"
                icon={<Book className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="가이드 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                        >
                            <option value="">모든 난이도</option>
                            <option value="easy">초급</option>
                            <option value="medium">중급</option>
                            <option value="hard">고급</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">가이드를 불러오는 중...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* 추천 가이드 */}
                        {featuredGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-400"/>
                                    추천 가이드
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredGuides.map((guide) => (
                                        <Card
                                            key={guide.id}
                                            hover
                                            className="p-6 cursor-pointer"
                                            onClick={() => handleGuideClick(guide.id)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                                                    {getDifficultyLabel(guide.difficulty)}
                                                </Badge>
                                                <span className="text-sm text-gray-400">
                                                    {guide.readTime}분 읽기
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                                            <p className="text-gray-400 mb-4 line-clamp-2">
                                                {guide.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4"/>
                                                        {guide.stats.views.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4"/>
                                                        {guide.stats.likes}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-green-400"/>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 초보자 가이드 */}
                        {beginnerGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-400"/>
                                    초보자 가이드
                                </h2>
                                <div className="space-y-4">
                                    {beginnerGuides.map((guide) => (
                                        <Card
                                            key={guide.id}
                                            hover
                                            className="p-6 cursor-pointer"
                                            onClick={() => handleGuideClick(guide.id)}
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold">{guide.title}</h3>
                                                        <Badge variant={getDifficultyColor(guide.difficulty) as any}
                                                               size="sm">
                                                            {getDifficultyLabel(guide.difficulty)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-400 mb-3">{guide.description}</p>
                                                    <div className="flex items-center gap-6 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4"/>
                                                            {guide.readTime}분
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4"/>
                                                            {guide.stats.views.toLocaleString()}
                                                        </span>
                                                        <span>by {guide.author.displayName}</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    읽기
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 고급 전략 */}
                        {advancedGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-purple-400"/>
                                    고급 전략
                                </h2>
                                <div className="space-y-4">
                                    {advancedGuides.map((guide) => (
                                        <Card
                                            key={guide.id}
                                            hover
                                            className="p-6 cursor-pointer"
                                            onClick={() => handleGuideClick(guide.id)}
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold">{guide.title}</h3>
                                                        <Badge variant={getDifficultyColor(guide.difficulty) as any}
                                                               size="sm">
                                                            {getDifficultyLabel(guide.difficulty)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-400 mb-3">{guide.description}</p>
                                                    <div className="flex items-center gap-6 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4"/>
                                                            {guide.readTime}분
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4"/>
                                                            {guide.stats.views.toLocaleString()}
                                                        </span>
                                                        <span>by {guide.author.displayName}</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    읽기
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 검색 결과 */}
                        {searchTerm && filteredGuides.length === 0 && (
                            <div className="text-center py-20">
                                <Search className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold mb-2">검색 결과가 없습니다</h3>
                                <p className="text-gray-400">다른 검색어를 시도해보세요</p>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </>
    )
}