'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {AlertTriangle, ArrowLeft, Book, Clock, Link, Save} from 'lucide-react'
import {useAuth} from '@/app/contexts/AuthContext'
import {addDoc, collection, getDocs, query, serverTimestamp, where} from 'firebase/firestore'
import {db} from '@/app/lib/firebase'

export default function CreateGuidePage() {
    const router = useRouter()
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(false)
    const [userProfile, setUserProfile] = useState<any>(null)

    // 가이드 데이터
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('초보자 가이드')
    const [difficulty, setDifficulty] = useState('입문')
    const [readTime, setReadTime] = useState('5분')

    // 에러 상태
    const [error, setError] = useState('')

    // 사용자 정보 불러오기
    useEffect(() => {
        const loadUserProfile = async () => {
            if (!user) {
                // 로그인 페이지로 리다이렉트하는 대신 로그인 필요 메시지를 보여줌
                setError('이 기능은 로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.')
                return
            }

            try {
                const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                const querySnapshot = await getDocs(userQuery)

                if (!querySnapshot.empty) {
                    setUserProfile(querySnapshot.docs[0].data())
                } else {
                    console.error('User profile not found')
                    setError('사용자 정보를 찾을 수 없습니다.')
                }
            } catch (error) {
                console.error('Error loading user profile:', error)
                setError('사용자 정보를 불러오는 중 오류가 발생했습니다.')
            }
        }

        loadUserProfile()
    }, [user, router])

    // 가이드 저장
    const handleSaveGuide = async () => {
        // 유효성 검사
        if (!title.trim()) {
            setError('제목을 입력해주세요.')
            return
        }

        if (title.length < 5) {
            setError('제목은 5자 이상이어야 합니다.')
            return
        }

        if (!content.trim()) {
            setError('내용을 입력해주세요.')
            return
        }

        if (content.length < 100) {
            setError('내용은 100자 이상이어야 합니다.')
            return
        }

        if (!userProfile) {
            setError('사용자 정보를 불러올 수 없습니다.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const timestamp = serverTimestamp()
            const guideRef = await addDoc(collection(db, 'guides'), {
                title,
                author: userProfile.nickname || '익명',
                authorId: userProfile.userId,
                authorUid: user?.uid,
                createdAt: timestamp,
                updatedAt: timestamp,
                content,
                category,
                difficulty,
                readTime,
                likes: 0,
                views: 0
            })

            console.log('가이드가 성공적으로 저장되었습니다.', guideRef.id)
            router.push(`/community/guides/${guideRef.id}`)
        } catch (error) {
            console.error('가이드 저장 중 오류:', error)
            setError('가이드를 저장하는 중 오류가 발생했습니다.')
            setLoading(false)
        }
    }

    // 마크다운 미리보기 변환
    const renderMarkdown = (text: string) => {
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
            .replace(/\[(.+?)]\((.+?)\)/g, '<a href="$2" class="text-green-400 hover:underline">$1</a>')
            // 리스트
            .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
            // 코드
            .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-1 rounded text-green-300">$1</code>')
            // 문단
            .replace(/\n\n/g, '</p><p class="my-3">')

        return `<p class="my-3">${html}</p>`
    }

    const categories = ['초보자 가이드', '고급 테크닉', '전략 가이드', '퍼즐 해결법', '팀워크', '기타']
    const difficulties = ['입문', '초급', '중급', '고급', '전문가']
    const readTimes = ['3분', '5분', '8분', '10분', '15분', '20분 이상']

    if (!user) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8 pb-20">
                <div className="max-w-screen-xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => router.push('/community/guides')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                            가이드 목록으로 돌아가기
                        </button>
                        <h1 className="text-4xl font-bold mb-4">가이드 작성</h1>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                        <Book className="w-16 h-16 text-green-500 mx-auto mb-6"/>
                        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
                        <p className="text-gray-400 mb-8">
                            가이드 작성은 로그인이 필요한 서비스입니다.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/auth/login?redirect=/community/guides/create"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-lg transition-all"
                            >
                                로그인하기
                            </Link>
                            <Link
                                href="/community/guides"
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-lg transition-all"
                            >
                                가이드 목록으로
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8 pb-20">
            <div className="max-w-screen-xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/community/guides')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        가이드 목록으로 돌아가기
                    </button>
                    <h1 className="text-4xl font-bold mb-4">가이드 작성</h1>
                    <p className="text-gray-400">방탈출 노하우를 공유하고 커뮤니티에 기여해보세요.</p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5"/>
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* 편집/미리보기 토글 */}
                <div className="flex border-b border-gray-800 mb-6">
                    <button
                        onClick={() => setPreview(false)}
                        className={`px-4 py-2 ${!preview ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
                    >
                        편집
                    </button>
                    <button
                        onClick={() => setPreview(true)}
                        className={`px-4 py-2 ${preview ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
                    >
                        미리보기
                    </button>
                </div>

                {!preview ? (
                    /* 편집 모드 */
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-6">
                            {/* 제목 입력 */}
                            <div>
                                <label htmlFor="title"
                                       className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="가이드 제목을 입력하세요"
                                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-green-500 focus:outline-none"
                                />
                            </div>

                            {/* 내용 입력 */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">내용
                                    (마크다운 지원)</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="# 가이드 내용을 작성하세요\n\n방탈출에 대한 팁과 전략을 공유해보세요.\n\n## 소제목\n\n- 글머리 기호\n- **굵은 글씨**\n- *기울임체*"
                                    className="w-full h-96 px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-green-500 focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 카테고리 선택 */}
                            <div>
                                <label htmlFor="category"
                                       className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-green-500 focus:outline-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 난이도 선택 */}
                            <div>
                                <label htmlFor="difficulty"
                                       className="block text-sm font-medium text-gray-400 mb-2">난이도</label>
                                <select
                                    id="difficulty"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-green-500 focus:outline-none"
                                >
                                    {difficulties.map((diff) => (
                                        <option key={diff} value={diff}>{diff}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 읽는 시간 선택 */}
                            <div>
                                <label htmlFor="readTime" className="block text-sm font-medium text-gray-400 mb-2">읽는
                                    시간</label>
                                <select
                                    id="readTime"
                                    value={readTime}
                                    onChange={(e) => setReadTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-green-500 focus:outline-none"
                                >
                                    {readTimes.map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 작성자 정보 */}
                            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                                <h3 className="font-medium mb-2">작성자 정보</h3>
                                <p className="text-gray-400 text-sm mb-1">닉네임: {userProfile?.nickname || '로딩 중...'}</p>
                                <p className="text-gray-400 text-sm">ID: @{userProfile?.userId || '로딩 중...'}</p>
                            </div>

                            {/* 마크다운 도움말 */}
                            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                                <h3 className="font-medium mb-2">마크다운 도움말</h3>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li># 제목, ## 소제목</li>
                                    <li>- 또는 1. 목록</li>
                                    <li>**굵은 글씨**</li>
                                    <li>*기울임체*</li>
                                    <li>[링크](URL)</li>
                                    <li>`코드`</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 미리보기 모드 */
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        {/* 제목 및 메타 정보 */}
                        <div className="mb-8 pb-8 border-b border-gray-800">
                            <div className="flex gap-3 mb-2">
                                <span
                                    className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs">{category}</span>
                                <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs">{difficulty}</span>
                            </div>

                            <h1 className="text-3xl font-bold mb-4">{title || '제목을 입력해주세요'}</h1>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Book className="w-4 h-4"/>
                                    <span>{userProfile?.nickname || '작성자'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4"/>
                                    <span>{readTime} 소요</span>
                                </div>
                            </div>
                        </div>

                        {/* 내용 미리보기 */}
                        <div
                            className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-strong:font-bold"
                            dangerouslySetInnerHTML={{__html: renderMarkdown(content || '내용을 입력해주세요')}}
                        ></div>
                    </div>
                )}

                {/* 작성 버튼 */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSaveGuide}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div
                                    className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                저장 중...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5"/>
                                가이드 저장하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
