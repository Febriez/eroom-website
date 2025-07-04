'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Award, Book, ChevronRight, Clock, Eye, Heart, Lightbulb, Map, Star, Target, TrendingUp} from 'lucide-react'
import {GuideService} from '@/lib/firebase/services/guide.service'
import type {Guide} from '@/lib/firebase/types/guide.types'
import {useRouter} from 'next/navigation'
import {GuideCard} from '@/components/ui/GuideCard'
import {getDifficultyColor, getDifficultyLabel} from '@/lib/utils/guide.utils'

interface GuideCategory {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    color: string
    href: string
    count?: number
}

export default function GuidesMainPage() {
    const router = useRouter()
    const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([])
    const [popularGuides, setPopularGuides] = useState<Guide[]>([])
    const [recentGuides, setRecentGuides] = useState<Guide[]>([])
    const [loading, setLoading] = useState(true)

    const categories: GuideCategory[] = [
        {
            id: 'complete',
            title: '완벽 공략집',
            description: 'EROOM의 모든 것을 마스터하는 종합 가이드',
            icon: <Book className="w-6 h-6"/>,
            color: 'from-green-600 to-green-700',
            href: '/community/guides/complete'
        },
        {
            id: 'map-creation',
            title: '맵 제작 가이드',
            description: '나만의 독창적인 방탈출 맵 만들기',
            icon: <Map className="w-6 h-6"/>,
            color: 'from-blue-600 to-blue-700',
            href: '/community/guides/map-creation'
        },
        {
            id: 'beginner',
            title: '초보자 가이드',
            description: 'EROOM을 처음 시작하는 플레이어를 위한 기초',
            icon: <Target className="w-6 h-6"/>,
            color: 'from-purple-600 to-purple-700',
            href: '/community/guides/complete?category=beginner'
        },
        {
            id: 'tips',
            title: '팁 & 트릭',
            description: '게임을 더 재미있게 즐기는 꿀팁 모음',
            icon: <Lightbulb className="w-6 h-6"/>,
            color: 'from-yellow-600 to-yellow-700',
            href: '/community/guides/complete?category=tips'
        }
    ]

    useEffect(() => {
        loadGuides()
    }, [])

    const loadGuides = async () => {
        try {
            setLoading(true)

            // 병렬로 가이드 데이터 로드
            const [featured, popular, all] = await Promise.all([
                GuideService.getFeaturedGuides(3),
                GuideService.getPopularGuides(3),
                GuideService.getAllGuides()
            ])

            setFeaturedGuides(featured)
            setPopularGuides(popular)
            setRecentGuides(all.slice(0, 3)) // 최신 3개
        } catch (error) {
            console.error('Error loading guides:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleGuideClick = (guideId: string) => {
        router.push(`/community/guides/${guideId}`)
    }

    return (
        <>
            <PageHeader
                title="가이드"
                description="EROOM을 완벽하게 즐기는 방법을 알아보세요"
                badge="학습"
                icon={<Book className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 카테고리 그리드 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8">가이드 카테고리</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                hover
                                className="relative overflow-hidden cursor-pointer group"
                                onClick={() => router.push(category.href)}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}/>
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className={`p-3 bg-gradient-to-br ${category.color} rounded-lg text-white`}>
                                            {category.icon}
                                        </div>
                                        <ChevronRight
                                            className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"/>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                                    <p className="text-gray-400">{category.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">가이드를 불러오는 중...</p>
                    </div>
                ) : (
                    <>
                        {/* 추천 가이드 */}
                        {featuredGuides.length > 0 && (
                            <section className="mb-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Award className="w-6 h-6 text-yellow-400"/>
                                        추천 가이드
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.push('/community/guides/complete?featured=true')}
                                    >
                                        모두 보기
                                        <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {featuredGuides.map((guide) => (
                                        <Card
                                            key={guide.id}
                                            hover
                                            className="p-6 cursor-pointer"
                                            onClick={() => handleGuideClick(guide.id)}
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="warning" size="sm">
                                                    <Award className="w-3 h-3 mr-1"/>
                                                    추천
                                                </Badge>
                                                <Badge variant={getDifficultyColor(guide.difficulty) as any} size="sm">
                                                    {getDifficultyLabel(guide.difficulty)}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold mb-2 line-clamp-2">{guide.title}</h3>
                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                                {guide.description}
                                            </p>
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
                                                <ChevronRight className="w-4 h-4 text-green-400"/>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 인기 가이드 */}
                        {popularGuides.length > 0 && (
                            <section className="mb-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-green-400"/>
                                        인기 가이드
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.push('/community/guides/complete?sort=popular')}
                                    >
                                        모두 보기
                                        <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {popularGuides.map((guide, index) => (
                                        <Card
                                            key={guide.id}
                                            hover
                                            className="p-4 cursor-pointer"
                                            onClick={() => handleGuideClick(guide.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-bold text-green-400 w-8">
                                                    #{index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold mb-1">{guide.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span>{guide.author.displayName}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3"/>
                                                            {guide.stats.views.toLocaleString()}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3"/>
                                                            {guide.stats.likes}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400"/>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 최신 가이드 */}
                        {recentGuides.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Star className="w-6 h-6 text-blue-400"/>
                                        최신 가이드
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.push('/community/guides/complete')}
                                    >
                                        모두 보기
                                        <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {recentGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="list"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* CTA 섹션 */}
                <Card className="mt-16 p-8 bg-gradient-to-br from-green-900/20 to-green-800/20 text-center">
                    <h3 className="text-2xl font-bold mb-4">가이드를 작성하고 싶으신가요?</h3>
                    <p className="text-gray-400 mb-6">
                        당신의 지식과 경험을 다른 플레이어들과 공유해보세요
                    </p>
                    <Button variant="primary">
                        가이드 작성하기
                    </Button>
                </Card>
            </Container>
        </>
    )
}