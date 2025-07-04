'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Skeleton} from '@/components/ui/Skeleton'
import {RoomService} from '@/lib/firebase/services/room.service'
import {Clock, Heart, Search, TrendingUp, Users} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'
import type {RoomCard as RoomCardType} from "@/lib/firebase/types/room.types";
import {RoomCard} from "@/components/ui/RoomCard";

export default function CommunityRoomsPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [rooms, setRooms] = useState<RoomCardType[]>([])
    const [filteredRooms, setFilteredRooms] = useState<RoomCardType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<'popular' | 'liked' | 'recent'>('popular')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
    const [selectedTheme, setSelectedTheme] = useState<string>('')
    const [currentLimit, setCurrentLimit] = useState(24)

    // 난이도 변환 함수
    const getDifficultyLabel = (difficulty: string) => {
        const difficultyMap: Record<string, string> = {
            'easy': '쉬움',
            'normal': '보통',
            'hard': '어려움'
        }
        return difficultyMap[difficulty.toLowerCase()] || difficulty
    }

    // 필터 변경 시 limit 초기화
    useEffect(() => {
        setCurrentLimit(24)
    }, [filter, selectedDifficulty, selectedTheme])

    // 초기 데이터 로드
    useEffect(() => {
        loadRooms()
    }, [filter, selectedDifficulty, selectedTheme, currentLimit])

    // 검색어 변경 시 필터링
    useEffect(() => {
        if (searchTerm) {
            const filtered = rooms.filter(room =>
                room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            setFilteredRooms(filtered)
        } else {
            setFilteredRooms(rooms)
        }
    }, [searchTerm, rooms])

    const loadRooms = async () => {
        setLoading(true)
        try {
            let cardData: RoomCardType[] = []

            // 필터 옵션 구성
            const filters = {
                difficulty: selectedDifficulty as 'easy' | 'normal' | 'hard' | undefined,
                theme: selectedTheme || undefined,
                sortBy: filter,
                limit: currentLimit
            }

            // 필터링된 룸 가져오기
            cardData = await RoomService.getFilteredRooms(filters)

            // 한국어 난이도 적용
            const roomsWithKoreanDifficulty = cardData.map(room => ({
                ...room,
                difficulty: getDifficultyLabel(room.difficulty)
            }))

            setRooms(roomsWithKoreanDifficulty)
            setFilteredRooms(roomsWithKoreanDifficulty)
        } catch (error) {
            console.error('Error loading rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMoreRooms = () => {
        setCurrentLimit(prev => prev + 24)
    }

    const handleRoomClick = (room: RoomCardType) => {
        // 정확한 경로로 네비게이션
        console.log('Navigating to room:', room.id)

        // 먼저 정확한 ID 값 확인
        if (!room.id) {
            console.error('Room ID is missing:', room)
            return
        }

        try {
            // Next.js 라우터 사용
            router.push(`/community/rooms/${room.id}`)
        } catch (error) {
            console.error('Navigation error:', error)
            // 대안으로 window.location 사용
            window.location.href = `/community/rooms/${room.id}`
        }
    }

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            setLoading(true)
            setCurrentLimit(24)
            try {
                // 검색 기능 구현
                const searchResults = await RoomService.searchRooms(searchTerm)

                // Room[]을 RoomCard[]로 변환
                const cardData = searchResults.map(room => ({
                    id: room.RoomId,
                    title: room.RoomTitle,
                    description: room.RoomDescription,
                    thumbnail: room.Thumbnail || undefined,
                    difficulty: room.Difficulty.toLowerCase(),
                    theme: room.Theme,
                    tags: room.Keywords || [],
                    creator: {
                        id: room.CreatorId,
                        username: room.CreatorId // 실제로는 User 컬렉션에서 조회 필요
                    },
                    stats: {
                        playCount: room.PlayCount || 0,
                        likeCount: room.LikeCount || 0,
                        commentCount: room.CommentAuthorIds?.length || 0
                    },
                    createdAt: room.CreatedDate
                }))

                const resultsWithKoreanDifficulty = cardData.map(room => ({
                    ...room,
                    difficulty: getDifficultyLabel(room.difficulty)
                }))

                setRooms(resultsWithKoreanDifficulty)
                setFilteredRooms(resultsWithKoreanDifficulty)
            } catch (error) {
                console.error('Error searching rooms:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // 난이도 옵션
    const difficulties = [
        {value: '', label: '모든 난이도'},
        {value: 'easy', label: '쉬움'},
        {value: 'normal', label: '보통'},
        {value: 'hard', label: '어려움'}
    ]

    // 테마 옵션
    const themes = [
        {value: '', label: '모든 테마'},
        {value: 'asylum', label: '정신병동'},
        {value: 'lab', label: '연구소'},
        {value: 'horror', label: '공포'},
        {value: 'fantasy', label: '판타지'},
        {value: 'sf', label: 'SF'},
        {value: 'mystery', label: '미스터리'},
        {value: 'adventure', label: '어드벤처'}
    ]

    return (
        <>
            <PageHeader
                title="커뮤니티 룸"
                description="전 세계 플레이어들이 만든 창의적인 방탈출 룸을 플레이해보세요"
                badge={`${filteredRooms.length}개의 룸`}
                icon={<Users className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="space-y-4 mb-8">
                    {/* 검색바 */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="룸 이름, 제작자, 태그, 테마로 검색..."
                            icon={<Search className="w-5 h-5"/>}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} variant="primary">
                            검색
                        </Button>
                    </div>

                    {/* 필터 버튼 및 드롭다운 */}
                    <div className="flex flex-wrap gap-2">
                        {/* 정렬 필터 */}
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'popular' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('popular')}
                                size="sm"
                            >
                                <TrendingUp className="w-4 h-4"/>
                                인기
                            </Button>
                            <Button
                                variant={filter === 'liked' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('liked')}
                                size="sm"
                            >
                                <Heart className="w-4 h-4"/>
                                좋아요
                            </Button>
                            <Button
                                variant={filter === 'recent' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('recent')}
                                size="sm"
                            >
                                <Clock className="w-4 h-4"/>
                                최신
                            </Button>
                        </div>

                        <div className="h-8 w-px bg-gray-700"/>

                        {/* 난이도 필터 */}
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        >
                            {difficulties.map(diff => (
                                <option key={diff.value} value={diff.value}>
                                    {diff.label}
                                </option>
                            ))}
                        </select>

                        {/* 테마 필터 */}
                        <select
                            value={selectedTheme}
                            onChange={(e) => setSelectedTheme(e.target.value)}
                            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        >
                            {themes.map(theme => (
                                <option key={theme.value} value={theme.value}>
                                    {theme.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 로딩 상태 */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                                <Skeleton className="aspect-video"/>
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-6 w-3/4"/>
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-4 w-1/2"/>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 룸 그리드 */}
                {!loading && filteredRooms.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRooms.map((room) => (
                            <div
                                key={room.id}
                                className="cursor-pointer transform transition-transform hover:scale-105"
                                onClick={() => handleRoomClick(room)}
                            >
                                <RoomCard
                                    room={room}
                                    onClick={() => handleRoomClick(room)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* 빈 상태 */}
                {!loading && filteredRooms.length === 0 && (
                    <div className="text-center py-20">
                        <div
                            className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-600"/>
                        </div>
                        <h3 className="text-xl font-bold mb-2">룸을 찾을 수 없습니다</h3>
                        <p className="text-gray-400">
                            {searchTerm ? '다른 검색어를 시도해보세요' : '아직 등록된 룸이 없습니다'}
                        </p>
                        {!searchTerm && user && (
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={() => router.push('/support/download')}
                            >
                                첫 번째 룸 만들기
                            </Button>
                        )}
                    </div>
                )}

                {/* 더 보기 버튼 */}
                {!loading && rooms.length >= currentLimit && filteredRooms.length === rooms.length && (
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={loadMoreRooms}>
                            더 많은 룸 보기
                        </Button>
                    </div>
                )}
            </Container>
        </>
    )
}