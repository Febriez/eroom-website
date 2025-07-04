'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Avatar} from '@/components/ui/Avatar'
import {
    Award,
    Book,
    Bookmark,
    BookmarkCheck,
    Calendar,
    ChevronLeft,
    Clock,
    Eye,
    Heart,
    Share2,
    Target
} from 'lucide-react'
import {GuideService} from '@/lib/firebase/services/guide.service'
import {useAuth} from '@/contexts/AuthContext'
import type {Guide} from '@/lib/firebase/types/guide.types'
import ReactMarkdown from 'react-markdown'
import {formatGuideDate, getCategoryLabel, getDifficultyColor, getDifficultyLabel} from '@/lib/utils/guide.utils'

export default function GuideDetailPage() {
    const params = useParams()
    const router = useRouter()
    const {user} = useAuth()
    const [guide, setGuide] = useState<Guide | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [relatedGuides, setRelatedGuides] = useState<Guide[]>([])

    const guideId = params.id as string

    // 가이드 데이터를 로드하는 공통 함수
    const loadGuideData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true)
            const guideData = await GuideService.getGuide(guideId)
            if (guideData) {
                setGuide(guideData)
                // 조회수 증가
                await GuideService.incrementViews(guideId)

                // 관련 가이드 로드
                const related = await GuideService.getRelatedGuides(guideData.category, guideId)
                setRelatedGuides(related.slice(0, 3))

                // TODO: 실제로는 유저의 좋아요/북마크 상태를 확인해야 함
                if (user) {
                    // const userLiked = await GuideService.hasUserLiked(guideId, user.uid)
                    // const userBookmarked = await GuideService.hasUserBookmarked(guideId, user.uid)
                    // setIsLiked(userLiked)
                    // setIsBookmarked(userBookmarked)
                }
            } else {
                // 가이드를 찾을 수 없는 경우
                router.push('/guides')
            }
        } catch (error) {
            console.error('Error loading guide:', error)
            router.push('/guides')
        } finally {
            if (showLoading) setLoading(false)
        }
    }, [guideId, router, user])

    useEffect(() => {
        if (guideId) {
            loadGuideData()
        }
    }, [guideId, loadGuideData])

    const handleLike = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsLiked(!isLiked)
        await GuideService.toggleLike(guideId, !isLiked)
        await loadGuideData(false) // 로딩 표시 없이 데이터만 새로고침
    }

    const handleBookmark = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsBookmarked(!isBookmarked)
        await GuideService.toggleBookmark(guideId, !isBookmarked)
        await loadGuideData(false) // 로딩 표시 없이 데이터만 새로고침
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
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('링크가 클립보드에 복사되었습니다!')
            })
        }
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

    // 목차 생성 (h2, h3 태그 기반)
    const tableOfContents = guide.content.match(/^##+ .+$/gm)?.map((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 2
        const text = heading.replace(/^#+\s+/, '')
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        return {level, text, id}
    }) || []

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
                                    <Calendar className="w-4 h-4"/>
                                    {formatGuideDate(guide.createdAt)}
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
                            </div>

                            {/* 태그 */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                                    <Target className="w-3 h-3 mr-1"/>
                                    {getDifficultyLabel(guide.difficulty)}
                                </Badge>
                                {guide.metadata.featured && (
                                    <Badge variant="warning">
                                        <Award className="w-3 h-3 mr-1"/>
                                        추천 가이드
                                    </Badge>
                                )}
                                {guide.tags.map((tag, index) => (
                                    <Badge key={index} variant="default">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* 콘텐츠 */}
                            <div className="prose prose-invert max-w-none prose-lg">
                                <ReactMarkdown
                                    components={{
                                        h1: ({children}) => <h1
                                            className="text-3xl font-bold mb-6 mt-8 text-white">{children}</h1>,
                                        h2: ({children}) => {
                                            const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                            return <h2 id={id}
                                                       className="text-2xl font-bold mb-4 mt-8 text-white scroll-mt-20">{children}</h2>
                                        },
                                        h3: ({children}) => {
                                            const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                            return <h3 id={id}
                                                       className="text-xl font-bold mb-3 mt-6 text-white scroll-mt-20">{children}</h3>
                                        },
                                        p: ({children}) => <p
                                            className="mb-4 leading-relaxed text-gray-300">{children}</p>,
                                        ul: ({children}) => <ul
                                            className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                                        ol: ({children}) => <ol
                                            className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                                        li: ({children}) => <li
                                            className="text-gray-300">{children}</li>,
                                        code: ({className, children}) => {
                                            const match = /language-\w+/.exec(className || '');
                                            const isInline = !match;
                                            return isInline
                                                ? <code
                                                    className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-sm">{children}</code>
                                                : <pre
                                                    className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-800"><code
                                                    className="text-sm font-mono">{children}</code></pre>;
                                        },
                                        blockquote: ({children}) =>
                                            <blockquote
                                                className="border-l-4 border-green-600 pl-4 italic text-gray-400 my-6">
                                                {children}
                                            </blockquote>,
                                        hr: () => <hr className="border-gray-700 my-8"/>,
                                        a: ({href, children}) =>
                                            <a href={href} className="text-green-400 hover:text-green-300 underline"
                                               target="_blank" rel="noopener noreferrer">
                                                {children}
                                            </a>,
                                        table: ({children}) =>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full divide-y divide-gray-700">
                                                    {children}
                                                </table>
                                            </div>,
                                        th: ({children}) =>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800">
                                                {children}
                                            </th>,
                                        td: ({children}) =>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {children}
                                            </td>,
                                    }}
                                >
                                    {guide.content}
                                </ReactMarkdown>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-800">
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
                    <div className="lg:col-span-1 space-y-6">
                        {/* 목차 */}
                        {tableOfContents.length > 0 && (
                            <Card className="p-6 sticky top-24">
                                <h3 className="font-bold mb-4">목차</h3>
                                <nav className="space-y-2">
                                    {tableOfContents.map((item, index) => (
                                        <a
                                            key={index}
                                            href={`#${item.id}`}
                                            className={`block text-sm hover:text-green-400 transition-colors ${
                                                item.level === 2 ? 'font-medium' : 'ml-4 text-gray-400'
                                            }`}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                            </Card>
                        )}

                        {/* 작성자 정보 */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">작성자</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar src={guide.author.avatarUrl} size="md"/>
                                <div>
                                    <p className="font-medium">{guide.author.displayName}</p>
                                    <p className="text-sm text-gray-400">@{guide.author.username}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">
                                {guide.author.bio || '게임 가이드 작성자'}
                            </p>
                            <Button
                                variant="outline"
                                fullWidth
                                size="sm"
                                onClick={() => router.push(`/profile/${guide.author.username}`)}
                            >
                                프로필 보기
                            </Button>
                        </Card>

                        {/* 관련 가이드 */}
                        {relatedGuides.length > 0 && (
                            <Card className="p-6">
                                <h3 className="font-bold mb-4">관련 가이드</h3>
                                <div className="space-y-3">
                                    {relatedGuides.map((related) => (
                                        <a
                                            key={related.id}
                                            href={`/guides/${related.id}`}
                                            className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <h4 className="font-medium text-sm mb-1">{related.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Badge variant={getDifficultyColor(related.difficulty) as any}
                                                       size="sm">
                                                    {getDifficultyLabel(related.difficulty)}
                                                </Badge>
                                                <span>•</span>
                                                <span>{related.readTime}분</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => router.push('/guides')}
                                >
                                    모든 가이드 보기
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </Container>
        </>
    )
}