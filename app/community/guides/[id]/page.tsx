'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Book, Clock, Edit, Eye, Heart, Share, ThumbsUp, User } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { doc, getDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

interface GuideData {
    id: string;
    title: string;
    author: string;
    authorId: string;
    authorUid?: string;
    createdAt: any;
    updatedAt: any;
    content: string;
    category: string;
    difficulty: string;
    readTime: string;
    likes: number;
    views: number;
}

export default function GuidePage() {
    const router = useRouter()
    const { user } = useAuth()
    const params = useParams()
    const guideId = params.id as string

    const [guide, setGuide] = useState<GuideData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [liked, setLiked] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    // 가이드 데이터 불러오기
    useEffect(() => {
        const fetchGuide = async () => {
            if (!guideId) return

            setLoading(true)
            try {
                const guideRef = doc(db, 'guides', guideId)
                const guideSnap = await getDoc(guideRef)

                if (guideSnap.exists()) {
                    const data = guideSnap.data()
                    setGuide({
                        id: guideSnap.id,
                        title: data.title,
                        author: data.author,
                        authorId: data.authorId,
                        authorUid: data.authorUid,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        content: data.content,
                        category: data.category,
                        difficulty: data.difficulty,
                        readTime: data.readTime,
                        likes: data.likes,
                        views: data.views
                    })

                    // 조회수 증가
                    await updateDoc(guideRef, {
                        views: increment(1)
                    })
                } else {
                    setError('가이드를 찾을 수 없습니다.')
                }
            } catch (error) {
                console.error('가이드 불러오기 오류:', error)
                setError('가이드를 불러오는 중 오류가 발생했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchGuide()
    }, [guideId])

    // 좋아요 처리
    const handleLike = async () => {
        if (!guide || !user) return

        try {
            const guideRef = doc(db, 'guides', guide.id)
            await updateDoc(guideRef, {
                likes: increment(1)
            })

            setGuide(prev => prev ? {...prev, likes: prev.likes + 1} : null)
            setLiked(true)
        } catch (error) {
            console.error('좋아요 오류:', error)
        }
    }

    // 가이드 삭제
    const handleDelete = async () => {
        if (!guide || !user) return

        // 본인 확인
        if (guide.authorUid !== user.uid) {
            alert('본인이 작성한 가이드만 삭제할 수 있습니다.')
            return
        }

        try {
            await deleteDoc(doc(db, 'guides', guide.id))
            router.push('/community/guides')
        } catch (error) {
            console.error('가이드 삭제 오류:', error)
            alert('가이드 삭제 중 오류가 발생했습니다.')
        }
    }

    // 마크다운 렌더링
    const renderMarkdown = (text: string) => {
        if (!text) return ''

        // 간단한 마크다운 변환 (실제로는 marked.js 같은 라이브러리 사용 권장)
        let html = text
            // 제목
            .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
            // 굵은 글씨
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // 기울임체
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // 링크
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green-400 hover:underline">$1</a>')
            // 리스트
            .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
            // 코드
            .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-1 rounded text-green-300">$1</code>')
            // 문단
            .replace(/\n\n/g, '</p><p class="my-3">')

        return `<p class="my-3">${html}</p>`
    }

    // 날짜 포맷팅 함수
    const formatDate = (date: any) => {
        if (!date) return ''

        if (date.toDate) {
            date = date.toDate()
        } else if (typeof date === 'object' && date.seconds) {
            date = new Date(date.seconds * 1000)
        }

        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-xl text-gray-400">가이드를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    if (error || !guide) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8 flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4 text-red-500">오류 발생</h1>
                    <p className="text-xl text-gray-400 mb-8">{error || '가이드를 찾을 수 없습니다.'}</p>
                    <button
                        onClick={() => router.push('/community/guides')}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        가이드 목록으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8 pb-20">
            <div className="max-w-screen-lg mx-auto">
                {/* 상단 네비게이션 */}
                <div className="mb-8">
                    <button 
                        onClick={() => router.push('/community/guides')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        가이드 목록으로 돌아가기
                    </button>
                </div>

                {/* 가이드 헤더 */}
                <div className="mb-12 pb-8 border-b border-gray-800">
                    <div className="flex gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs">{guide.category}</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs">{guide.difficulty}</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-6">{guide.title}</h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4"/>
                                <span 
                                    className="hover:text-green-400 cursor-pointer"
                                    onClick={() => router.push(`/profile/${guide.authorId}`)}
                                >
                                    {guide.author}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4"/>
                                <span>{guide.readTime} 소요</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Book className="w-4 h-4"/>
                                <span>{formatDate(guide.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-400">
                                <Eye className="w-4 h-4"/>
                                <span>{guide.views}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-400">
                                <Heart className="w-4 h-4"/>
                                <span>{guide.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 가이드 본문 */}
                <div className="mb-12">
                    <div 
                        className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-strong:font-bold"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }}
                    ></div>
                </div>

                {/* 좋아요 버튼 */}
                <div className="flex justify-center mb-12">
                    <button
                        onClick={handleLike}
                        disabled={liked}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${liked ? 'bg-red-900/30 text-red-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-red-900/30 hover:text-red-400'}`}
                    >
                        <ThumbsUp className="w-5 h-5" />
                        {liked ? '좋아요 완료' : '이 가이드가 도움이 되었나요?'}
                    </button>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="flex justify-between">
                    <div className="flex gap-3">
                        {user && guide.authorUid === user.uid && (
                            <>
                                <button
                                    onClick={() => router.push(`/community/guides/edit/${guide.id}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    수정하기
                                </button>
                                {confirmDelete ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                                        >
                                            삭제 확인
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(false)}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors text-sm"
                                    >
                                        삭제하기
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('링크가 클립보드에 복사되었습니다.');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    >
                        <Share className="w-4 h-4" />
                        공유하기
                    </button>
                </div>
            </div>
        </div>
    )
}
