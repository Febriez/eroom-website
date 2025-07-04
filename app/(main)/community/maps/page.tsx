'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Skeleton} from '@/components/ui/Skeleton'
import {MapCard} from '@/components/ui/MapCard'
import {RoomService} from '@/lib/firebase/services/room.service'
import {Clock, Search, Star, TrendingUp, Users} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'
import {RoomCard} from "@/lib/firebase/types";

export default function CommunityMapsPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [maps, setMaps] = useState<RoomCard[]>([])
    const [filteredMaps, setFilteredMaps] = useState<RoomCard[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<'featured' | 'popular' | 'new'>('featured')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
    const [selectedTheme, setSelectedTheme] = useState<string>('')
    const [currentLimit, setCurrentLimit] = useState(24)

    // 필터 변경 시 limit 초기화
    useEffect(() => {
        setCurrentLimit(24)
    }, [filter, selectedDifficulty, selectedTheme])

    // 초기 데이터 로드
    useEffect(() => {
        loadMaps()
    }, [filter, selectedDifficulty, selectedTheme, currentLimit])

    // 검색어 변경 시 필터링
    useEffect(() => {
        if (searchTerm) {
            const filtered = maps.filter(map =>
                map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                map.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                map.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            setFilteredMaps(filtered)
        } else {
            setFilteredMaps(maps)
        }
    }, [searchTerm, maps])

    const loadMaps = async () => {
        setLoading(true)
        try {
            let loadedMaps: RoomCard[] = []

            // 필터 조합이 있는 경우
            if (selectedDifficulty || selectedTheme) {
                loadedMaps = await RoomService.getFilteredMaps({
                    difficulty: selectedDifficulty,
                    theme: selectedTheme,
                    sortBy: filter === 'popular' ? 'popular' : filter === 'new' ? 'recent' : 'popular',
                    limit: currentLimit
                })
            } else {
                // 기본 필터만 사용
                switch (filter) {
                    case 'featured':
                        loadedMaps = await RoomService.getFeaturedMaps(currentLimit)
                        break
                    case 'popular':
                        loadedMaps = await RoomService.getPopularMaps(currentLimit)
                        break
                    case 'new':
                        loadedMaps = await RoomService.getRecentMaps(currentLimit)
                        break
                }
            }

            setMaps(loadedMaps)
            setFilteredMaps(loadedMaps)
        } catch (error) {
            console.error('Error loading maps:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMoreMaps = () => {
        setCurrentLimit(prev => prev + 24)
    }

    const handleMapClick = (map: RoomCard) => {
        // 맵 상세 페이지로 이동 (또는 다운로드 페이지)
        router.push(`/main/games/eroom?mapId=${map.id}`)
    }

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            setLoading(true)
            setCurrentLimit(24) // 검색 시 limit 초기화
            try {
                const searchResults = await RoomService.searchMaps(searchTerm)
                setMaps(searchResults)
                setFilteredMaps(searchResults)
            } catch (error) {
                console.error('Error searching maps:', error)
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
        {value: 'medium', label: '보통'},
        {value: 'hard', label: '어려움'},
        {value: 'extreme', label: '극악'}
    ]

    // 테마 옵션 (실제 데이터에 맞게 조정 필요)
    const themes = [
        {value: '', label: '모든 테마'},
        {value: '연구소', label: '연구소'},
        {value: 'horror', label: '공포'},
        {value: 'fantasy', label: '판타지'},
        {value: 'scifi', label: 'SF'}
    ]

    return (
        <>
            <PageHeader
                title="커뮤니티 맵"
                description="전 세계 플레이어들이 만든 창의적인 방탈출 맵을 플레이해보세요"
                badge={`${filteredMaps.length}개의 맵`}
                icon={<Users className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="space-y-4 mb-8">
                    {/* 검색바 */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="맵 이름, 제작자, 태그로 검색..."
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
                                variant={filter === 'featured' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('featured')}
                                size="sm"
                            >
                                <TrendingUp className="w-4 h-4"/>
                                추천
                            </Button>
                            <Button
                                variant={filter === 'popular' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('popular')}
                                size="sm"
                            >
                                <Star className="w-4 h-4"/>
                                인기
                            </Button>
                            <Button
                                variant={filter === 'new' ? 'primary' : 'secondary'}
                                onClick={() => setFilter('new')}
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

                {/* 맵 그리드 */}
                {!loading && filteredMaps.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMaps.map((map) => (
                            <MapCard
                                key={map.id}
                                map={map}
                                onClick={() => handleMapClick(map)}
                            />
                        ))}
                    </div>
                )}

                {/* 빈 상태 */}
                {!loading && filteredMaps.length === 0 && (
                    <div className="text-center py-20">
                        <div
                            className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-600"/>
                        </div>
                        <h3 className="text-xl font-bold mb-2">맵을 찾을 수 없습니다</h3>
                        <p className="text-gray-400">
                            {searchTerm ? '다른 검색어를 시도해보세요' : '아직 등록된 맵이 없습니다'}
                        </p>
                        {!searchTerm && user && (
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={() => router.push('/support/download')}
                            >
                                첫 번째 맵 만들기
                            </Button>
                        )}
                    </div>
                )}

                {/* 더 보기 버튼 */}
                {!loading && maps.length >= currentLimit && filteredMaps.length === maps.length && (
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={loadMoreMaps}>
                            더 많은 맵 보기
                        </Button>
                    </div>
                )}
            </Container>
        </>
    )
}