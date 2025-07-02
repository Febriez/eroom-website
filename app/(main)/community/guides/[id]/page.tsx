'use client'

import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Avatar} from '@/components/ui/Avatar'
import {Book, Bookmark, BookmarkCheck, ChevronLeft, Clock, Eye, Heart, Share2} from 'lucide-react'
import {GuideService} from '@/lib/firebase/services/guide.service'
import {useAuth} from '@/contexts/AuthContext'
import type {Guide} from '@/lib/firebase/types/guide.types'
import ReactMarkdown from 'react-markdown'

export default function GuideDetailPage() {
    const params = useParams()
    const router = useRouter()
    const {user} = useAuth()
    const [guide, setGuide] = useState<Guide | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const guideId = params.id as string

    useEffect(() => {
        if (guideId) {
            loadGuide()
        }
    }, [guideId])

    const loadGuide = async () => {
        try {
            setLoading(true)
            const guideData = await GuideService.getGuide(guideId)
            if (guideData) {
                setGuide(guideData)
                // TODO: 실제로는 유저의 좋아요/북마크 상태를 확인해야 함
                // 현재는 임시로 false로 설정
            } else {
                // 가이드를 찾을 수 없는 경우
                router.push('/community/guides')
            }
        } catch (error) {
            console.error('Error loading guide:', error)
            router.push('/community/guides')
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsLiked(!isLiked)
        await GuideService.toggleLike(guideId, !isLiked)

        // 가이드 데이터 새로고침
        const updatedGuide = await GuideService.getGuide(guideId)
        if (updatedGuide) {
            setGuide(updatedGuide)
        }
    }

    const handleBookmark = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsBookmarked(!isBookmarked)
        await GuideService.toggleBookmark(guideId, !isBookmarked)

        // 가이드 데이터 새로고침
        const updatedGuide = await GuideService.getGuide(guideId)
        if (updatedGuide) {
            setGuide(updatedGuide)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: guide?.title,
                text: guide?.description,
                url: window.location.href
            })
        } else {
            // 클립보드에 복사
            navigator.clipboard.writeText(window.location.href)
            alert('링크가 클립보드에 복사되었습니다!')
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

    const formatDate = (timestamp: any) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!guide) {
        return null
    }

    return (
        <>
            <PageHeader
                title={guide.title}
                description={guide.description}
                badge={getCategoryLabel(guide.category)}
                icon={<Book className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 뒤로가기 버튼 */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ChevronLeft className="w-4 h-4"/>
                    뒤로가기
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        <Card className="p-8">
                            {/* 메타 정보 */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Avatar src={guide.author.avatarUrl} size="sm"/>
                                    <span>{guide.author.displayName}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4"/>
                                    {guide.readTime}분 읽기
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4"/>
                                    {guide.stats.views.toLocaleString()}회 조회
                                </div>
                                <span>•</span>
                                <span>{formatDate(guide.createdAt)}</span>
                            </div>

                            {/* 태그 */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                                    {getDifficultyLabel(guide.difficulty)}
                                </Badge>
                                {guide.tags.map((tag, index) => (
                                    <Badge key={index} variant="default">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* 콘텐츠 */}
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h1: ({children, ...props}) => <h1
                                            className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                                        h2: ({children, ...props}) => <h2
                                            className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
                                        h3: ({children, ...props}) => <h3
                                            className="text-xl font-bold mb-3 mt-4">{children}</h3>,
                                        p: ({children, ...props}) => <p
                                            className="mb-4 leading-relaxed">{children}</p>,
                                        ul: ({children, ...props}) => <ul
                                            className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                                        ol: ({children, ...props}) => <ol
                                            className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                                        li: ({children, ...props}) => <li
                                            className="text-gray-300">{children}</li>,
                                        code: ({className, children, ...props}) => {
                                            const match = /language-\w+/.exec(className || '');
                                            const isInline = !match;
                                            return isInline
                                                ? <code
                                                    className="bg-gray-800 px-1 py-0.5 rounded text-green-400">{children}</code>
                                                : <pre
                                                    className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4"><code>{children}</code></pre>;
                                        },
                                        blockquote: ({children, ...props}) =>
                                            <blockquote
                                                className="border-l-4 border-green-600 pl-4 italic text-gray-400 my-4">
                                                {children}
                                            </blockquote>,
                                        hr: () => <hr className="border-gray-700 my-8"/>,
                                        a: ({href, children, ...props}) =>
                                            <a href={href} className="text-green-400 hover:text-green-300 underline"
                                               target="_blank" rel="noopener noreferrer">
                                                {children}
                                            </a>,
                                    }}
                                >
                                    {guide.content}
                                </ReactMarkdown>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-800">
                                <Button
                                    variant={isLiked ? "primary" : "outline"}
                                    onClick={handleLike}
                                    className="flex items-center gap-2"
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}/>
                                    {guide.stats.likes} 좋아요
                                </Button>
                                <Button
                                    variant={isBookmarked ? "primary" : "outline"}
                                    onClick={handleBookmark}
                                    className="flex items-center gap-2"
                                >
                                    {isBookmarked ? <BookmarkCheck className="w-4 h-4"/> :
                                        <Bookmark className="w-4 h-4"/>}
                                    북마크
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4"/>
                                    공유
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* 사이드바 */}
                    <div className="lg:col-span-1">
                        {/* 작성자 정보 */}
                        <Card className="p-6 mb-6 sticky top-24">
                            <h3 className="font-bold mb-4">작성자</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar src={guide.author.avatarUrl} size="md"/>
                                <div>
                                    <p className="font-medium">{guide.author.displayName}</p>
                                    <p className="text-sm text-gray-400">@{guide.author.username}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                size="sm"
                                onClick={() => router.push(`/profile/${guide.author.username}`)}
                            >
                                프로필 보기
                            </Button>
                        </Card>

                        {/* 관련 가이드 추천 */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">추천 가이드</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-400">
                                    비슷한 주제의 다른 가이드들을 확인해보세요
                                </p>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    onClick={() => router.push('/community/guides')}
                                >
                                    더 많은 가이드 보기
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}