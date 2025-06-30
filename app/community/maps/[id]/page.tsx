'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Heart, Share, Star, User } from 'lucide-react'
import Link from 'next/link'

export default function MapDetailPage() {
    const router = useRouter()
    const params = useParams()
    const mapId = params.id as string
    const [map, setMap] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 실제 구현에서는 API 호출로 맵 데이터를 가져옵니다
        // 지금은 목업 데이터를 사용합니다
        const mockMaps = [
            {
                id: '1',
                title: "사이버 도시 탈출",
                author: "NeonMaster",
                authorId: "neonmaster",
                rating: 4.8,
                plays: 15420,
                likes: 3821,
                difficulty: "어려움",
                time: "45분",
                createdAt: new Date('2024-05-15'),
                tags: ["사이버펑크", "퍼즐", "스토리"],
                description: "네온 불빛이 가득한 미래 도시에서 AI 감시 시스템을 피해 탈출하세요. 고난이도 퍼즐과 스토리 중심의 게임플레이가 특징입니다.",
                features: ["다중 엔딩", "음성 나레이션", "동적 조명 효과"],
                minPlayers: 1,
                maxPlayers: 4
            },
            {
                id: '2',
                title: "마법사의 탑",
                author: "WizardKing",
                authorId: "wizardking",
                rating: 4.6,
                plays: 12350,
                likes: 2910,
                difficulty: "보통",
                time: "30분",
                createdAt: new Date('2024-06-01'),
                tags: ["판타지", "마법", "모험"],
                description: "고대 마법사의 탑을 탐험하며 잃어버린 마법의 비밀을 찾아내세요. 다양한 마법 퍼즐과 함정이 여러분을 기다립니다.",
                features: ["마법 시스템", "숨겨진 보물", "NPC와의 대화"],
                minPlayers: 1,
                maxPlayers: 3
            },
            {
                id: '3',
                title: "우주선 수리공",
                author: "SpaceEngineer",
                authorId: "spaceengineer",
                rating: 4.9,
                plays: 18720,
                likes: 4523,
                difficulty: "매우 어려움",
                time: "60분",
                createdAt: new Date('2024-05-20'),
                tags: ["SF", "기술", "생존"],
                description: "손상된 우주선에 갇힌 당신은 제한된 자원으로 시스템을 복구하고 귀환해야 합니다. 실시간 위험 요소와 산소 관리에 주의하세요.",
                features: ["물리 기반 퍼즐", "실시간 위험 요소", "도구 제작"],
                minPlayers: 1,
                maxPlayers: 2
            }
        ]

        const foundMap = mockMaps.find(m => m.id === mapId)
        if (foundMap) {
            setMap(foundMap)
        }
        setLoading(false)
    }, [mapId])

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8 flex justify-center">
                <div className="text-2xl text-gray-400">로딩 중...</div>
            </div>
        )
    }

    if (!map) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8">
                <div className="max-w-screen-xl mx-auto">
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-bold mb-4">맵을 찾을 수 없습니다</h2>
                        <p className="text-gray-400 mb-8">요청하신 맵이 존재하지 않거나 삭제되었을 수 있습니다.</p>
                        <Link href="/community/maps" className="px-6 py-3 bg-green-600 rounded-lg font-bold">
                            맵 목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* 뒤로 가기 버튼 */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    맵 목록으로 돌아가기
                </button>

                {/* 맵 헤더 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
                    {/* 맵 이미지/프리뷰 */}
                    <div className="col-span-2">
                        <div className="aspect-video bg-gradient-to-br from-green-900/30 to-black rounded-2xl overflow-hidden border border-gray-800">
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">맵 미리보기 이미지</p>
                            </div>
                        </div>
                    </div>

                    {/* 맵 정보 */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-800">
                        <h1 className="text-2xl font-bold mb-2">{map.title}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <Link 
                                href={`/profile/${map.authorId}`}
                                className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                            >
                                <User className="w-4 h-4" />
                                {map.author}
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    <Star className="w-4 h-4" />
                                    <span className="font-bold">{map.rating}</span>
                                </div>
                                <p className="text-xs text-gray-400">평점</p>
                            </div>

                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 text-red-400 mb-1">
                                    <Heart className="w-4 h-4" />
                                    <span className="font-bold">{map.likes.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-400">좋아요</p>
                            </div>

                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="font-bold">{map.time}</span>
                                </div>
                                <p className="text-xs text-gray-400">평균 시간</p>
                            </div>

                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span className="font-bold">{map.createdAt.toLocaleDateString('ko-KR')}</span>
                                </div>
                                <p className="text-xs text-gray-400">등록일</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {map.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-400">난이도</span>
                                <span className="font-medium">{map.difficulty}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">플레이어</span>
                                <span className="font-medium">{map.minPlayers}-{map.maxPlayers}명</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">플레이 횟수</span>
                                <span className="font-medium">{map.plays.toLocaleString()}회</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-bold">
                                플레이하기
                            </button>
                            <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Share className="w-4 h-4" />
                                공유하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* 맵 상세 정보 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-32">
                    <div className="col-span-1 lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* 설명 */}
                        <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">맵 설명</h2>
                            <p className="text-gray-300 leading-relaxed">{map.description}</p>
                        </div>

                        {/* 특징 */}
                        <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">주요 특징</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {map.features.map((feature: string, idx: number) => (
                                    <li key={idx} className="text-gray-300">{feature}</li>
                                ))}
                            </ul>
                        </div>

                        {/* 리뷰 섹션 - 여기에 리뷰 컴포넌트 추가 가능 */}
                    </div>

                    {/* 사이드바 - 제작자 정보, 관련 맵 등 */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-lg font-bold mb-4">제작자 정보</h3>
                            <Link 
                                href={`/profile/${map.authorId}`}
                                className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    {map.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{map.author}</p>
                                    <p className="text-sm text-gray-400">맵 제작자</p>
                                </div>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-lg font-bold mb-4">필요 사항</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">최소 레벨</span>
                                    <span className="font-medium">없음</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">필수 아이템</span>
                                    <span className="font-medium">없음</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">추천 스킬</span>
                                    <span className="font-medium">퍼즐 해결</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
