'use client'

import {useEffect, useState} from 'react'
import {ArrowDownWideNarrow, Clock, Filter, Map, Search, Star, Users} from 'lucide-react'
import FileDownloader from '../../components/FileDownloader'
import Link from 'next/link'
import {collection, DocumentData, getDocs, limit, orderBy, query, where} from 'firebase/firestore'
import {db} from '../../lib/firebase'

interface GameMap {
    id: string
    title: string
    description: string
    creator: string
    creatorName: string
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
    rating: number
    playCount: number
    completionRate: number
    avgCompletionTime: string
    categories: string[]
    tags: string[]
    thumbnailUrl: string
    createdAt: any
    updatedAt: any
}

export default function MapsPage() {
    const [maps, setMaps] = useState<GameMap[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('newest')

    useEffect(() => {
        loadMaps()
    }, [sortBy, selectedDifficulty, selectedCategory])

    const loadMaps = async () => {
        setLoading(true)
        try {
            let mapsQuery = collection(db, 'maps')
            let constraints = []

            // 정렬 조건 적용
            if (sortBy === 'newest') {
                constraints.push(orderBy('createdAt', 'desc'))
            } else if (sortBy === 'popular') {
                constraints.push(orderBy('playCount', 'desc'))
            } else if (sortBy === 'rating') {
                constraints.push(orderBy('rating', 'desc'))
            }

            // 난이도 필터 적용
            if (selectedDifficulty !== 'all') {
                constraints.push(where('difficulty', '==', selectedDifficulty))
            }

            // 카테고리 필터 적용
            if (selectedCategory !== 'all') {
                constraints.push(where('categories', 'array-contains', selectedCategory))
            }

            // 최대 50개 항목으로 제한
            constraints.push(limit(50))

            const queryWithConstraints = query(mapsQuery, ...constraints)
            const querySnapshot = await getDocs(queryWithConstraints)

            const mapsList: GameMap[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data() as DocumentData
                mapsList.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as GameMap)
            })

            setMaps(mapsList)
        } catch (error) {
            console.error('Error loading maps:', error)
        } finally {
            setLoading(false)
        }
    }

    // 검색 기능
    const filteredMaps = maps.filter(map => {
        return searchQuery === '' ||
            map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            map.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

    // 난이도에 따른 색상 클래스 반환
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'hard':
                return 'bg-orange-500'
            case 'expert':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    // 난이도 텍스트 변환
    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '쉬움'
            case 'medium':
                return '보통'
            case 'hard':
                return '어려움'
            case 'expert':
                return '전문가'
            default:
                return '알 수 없음'
        }
    }

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">탈출 맵</h1>
                        <p className="text-gray-400">커뮤니티에서 제작한 다양한 탈출 맵을 플레이하세요.</p>
                    </div>

                    <FileDownloader
                        storagePath="gs://eroom-e6659.firebasestorage.app/pirate.jpg"
                        displayName="pirate.jpg"
                        buttonText="해적 이미지 다운로드"
                        className=""
                    />
                </div>

                {/* 필터 및 검색 */}
                <div className="bg-gray-900/50 rounded-2xl p-6 mb-10 border border-gray-800">
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        {/* 검색 */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    type="text"
                                    placeholder="맵 이름 또는 설명 검색"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-800 rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* 필터 - 난이도 */}
                        <div className="w-56">
                            <div className="flex items-center gap-2 mb-2">
                                <Filter className="w-4 h-4 text-gray-400"/>
                                <label className="text-sm text-gray-400">난이도</label>
                            </div>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                            >
                                <option value="all">모든 난이도</option>
                                <option value="easy">쉬움</option>
                                <option value="medium">보통</option>
                                <option value="hard">어려움</option>
                                <option value="expert">전문가</option>
                            </select>
                        </div>

                        {/* 필터 - 카테고리 */}
                        <div className="w-56">
                            <div className="flex items-center gap-2 mb-2">
                                <Map className="w-4 h-4 text-gray-400"/>
                                <label className="text-sm text-gray-400">카테고리</label>
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                            >
                                <option value="all">모든 카테고리</option>
                                <option value="puzzle">퍼즐</option>
                                <option value="horror">공포</option>
                                <option value="adventure">모험</option>
                                <option value="logic">논리</option>
                                <option value="action">액션</option>
                            </select>
                        </div>

                        {/* 정렬 */}
                        <div className="w-56">
                            <div className="flex items-center gap-2 mb-2">
                                <ArrowDownWideNarrow className="w-4 h-4 text-gray-400"/>
                                <label className="text-sm text-gray-400">정렬</label>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                            >
                                <option value="newest">최신순</option>
                                <option value="popular">인기순</option>
                                <option value="rating">평점순</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 맵 그리드 */}
                {loading ? (
                    <div className="text-center py-20">
                        <div
                            className="w-12 h-12 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">맵을 불러오는 중...</p>
                    </div>
                ) : filteredMaps.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        <Map className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-2xl font-bold mb-2">맵을 찾을 수 없습니다</h3>
                        <p className="text-gray-400">검색 조건을 변경하거나 필터를 초기화해보세요.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredMaps.map((map) => (
                            <Link href={`/community/maps/${map.id}`} key={map.id}>
                                <div
                                    className="bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-800 transition-all hover:border-green-700 hover:scale-[1.02] group">
                                    {/* 썸네일 */}
                                    <div className="h-48 bg-gray-800 relative overflow-hidden">
                                        {map.thumbnailUrl ? (
                                            <img
                                                src={map.thumbnailUrl}
                                                alt={map.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <Map className="w-12 h-12 text-gray-600"/>
                                            </div>
                                        )}

                                        {/* 난이도 배지 */}
                                        <div
                                            className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(map.difficulty)}`}>
                                            {getDifficultyText(map.difficulty)}
                                        </div>
                                    </div>

                                    {/* 컨텐츠 */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-1">{map.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{map.description}</p>

                                        {/* 태그 */}
                                        {map.tags && map.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {map.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index}
                                                          className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
                            {tag}
                          </span>
                                                ))}
                                                {map.tags.length > 3 && (
                                                    <span
                                                        className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
                            +{map.tags.length - 3}
                          </span>
                                                )}
                                            </div>
                                        )}

                                        {/* 통계 */}
                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500"/>
                                                <span>{map.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4"/>
                                                <span>{map.playCount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4"/>
                                                <span>{map.avgCompletionTime}</span>
                                            </div>
                                        </div>

                                        {/* 제작자 및 날짜 */}
                                        <div
                                            className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                                            <span>제작: {map.creatorName || '알 수 없음'}</span>
                                            <span>{new Date(map.createdAt).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}