'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {MapService} from '@/lib/firebase/services/map.service'
import type {GameMapCard} from '@/lib/firebase/types/game-map-card.types'
import {Crown, Eye, Heart, Medal, TrendingUp, Trophy, Users} from 'lucide-react'

export default function RankingsPage() {
    const router = useRouter()
    const [maps, setMaps] = useState<GameMapCard[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'popular' | 'liked' | 'recent'>('popular')

    useEffect(() => {
        loadMaps(activeTab)
    }, [activeTab])

    const loadMaps = async (type: 'popular' | 'liked' | 'recent') => {
        setLoading(true)
        try {
            let data: GameMapCard[] = []

            switch (type) {
                case 'popular':
                    data = await MapService.getPopularMaps(50)
                    break
                case 'liked':
                    data = await MapService.getFilteredMaps({
                        sortBy: 'liked',
                        limit: 50
                    })
                    break
                case 'recent':
                    data = await MapService.getRecentMaps(50)
                    break
            }

            setMaps(data)
        } catch (error) {
            console.error('Error loading maps:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400"/>
            case 2:
                return <Medal className="w-6 h-6 text-gray-300"/>
            case 3:
                return <Medal className="w-6 h-6 text-orange-400"/>
            default:
                return null
        }
    }

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-700/50'
            case 2:
                return 'bg-gradient-to-r from-gray-800/20 to-gray-700/20 border-gray-600/50'
            case 3:
                return 'bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-orange-700/50'
            default:
                return ''
        }
    }

    const formatCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'success'
            case 'medium':
                return 'info'
            case 'hard':
                return 'warning'
            case 'extreme':
                return 'danger'
            default:
                return 'default'
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '쉬움'
            case 'medium':
                return '보통'
            case 'hard':
                return '어려움'
            case 'extreme':
                return '극악'
            default:
                return difficulty
        }
    }

    const handleMapClick = (mapId: string) => {
        router.push(`/games/eroom?mapId=${mapId}`)
    }

    return (
        <>
            <PageHeader
                title="인기 맵 랭킹"
                description="가장 많이 플레이되고 사랑받는 맵들을 확인하세요"
                badge="실시간 업데이트"
                icon={<Trophy className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 탭 메뉴 */}
                <Tabs<'popular' | 'liked' | 'recent'>
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val)}
                    defaultValue="popular"
                >
                    <TabsList>
                        <TabsTrigger value="popular">
                            <Users className="w-4 h-4"/>
                            플레이 순위
                        </TabsTrigger>
                        <TabsTrigger value="liked">
                            <Heart className="w-4 h-4"/>
                            인기 순위
                        </TabsTrigger>
                        <TabsTrigger value="recent">
                            <TrendingUp className="w-4 h-4"/>
                            최신 맵
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* 로딩 상태 */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">랭킹을 불러오는 중...</p>
                    </div>
                )}

                {/* 상위 3개 맵 하이라이트 */}
                {!loading && maps.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {maps.slice(0, 3).map((map, index) => {
                                const rank = index + 1
                                return (
                                    <Card
                                        key={map.id}
                                        className={`p-6 ${getRankStyle(rank)} hover:scale-105 transition-transform cursor-pointer`}
                                        onClick={() => handleMapClick(map.id)}
                                    >
                                        <div className="text-center mb-4">
                                            {getRankIcon(rank)}
                                        </div>

                                        {/* 맵 썸네일 */}
                                        <div
                                            className="aspect-video bg-gradient-to-br from-green-600 to-green-800 rounded-lg mb-4 overflow-hidden">
                                            {map.thumbnail && (
                                                <img
                                                    src={map.thumbnail}
                                                    alt={map.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 text-center line-clamp-1">
                                            {map.name}
                                        </h3>

                                        <div className="text-center mb-3">
                                            <Badge variant={getDifficultyColor(map.difficulty) as any}>
                                                {getDifficultyLabel(map.difficulty)}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4 text-blue-400"/>
                                                    <span
                                                        className="font-bold">{formatCount(map.stats.playCount)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-4 h-4 text-red-400"/>
                                                    <span
                                                        className="font-bold">{formatCount(map.stats.likeCount)}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">by @{map.creator.username}</p>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* 전체 랭킹 리스트 */}
                        <Card className="overflow-hidden">
                            <div className="p-4 border-b border-gray-800">
                                <h2 className="text-xl font-bold">전체 순위</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">순위</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">맵 정보</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">난이도</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">플레이</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">좋아요</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">제작자</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                    {maps.slice(3).map((map, index) => (
                                        <tr
                                            key={map.id}
                                            className="hover:bg-gray-900/30 transition-colors cursor-pointer"
                                            onClick={() => handleMapClick(map.id)}
                                        >
                                            <td className="px-6 py-4">
                                                    <span className="text-2xl font-bold text-gray-500">
                                                        #{index + 4}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-16 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded overflow-hidden flex-shrink-0">
                                                        {map.thumbnail && (
                                                            <img
                                                                src={map.thumbnail}
                                                                alt={map.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium line-clamp-1">{map.name}</p>
                                                        <p className="text-sm text-gray-400 line-clamp-1">{map.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={getDifficultyColor(map.difficulty) as any} size="sm">
                                                    {getDifficultyLabel(map.difficulty)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Eye className="w-4 h-4 text-blue-400"/>
                                                    <span
                                                        className="font-bold">{formatCount(map.stats.playCount)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Heart className="w-4 h-4 text-red-400"/>
                                                    <span
                                                        className="font-bold">{formatCount(map.stats.likeCount)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm text-gray-400">@{map.creator.username}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 더보기 버튼 */}
                            {maps.length === 50 && (
                                <div className="p-4 border-t border-gray-800 text-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() => router.push('/community/maps')}
                                    >
                                        모든 맵 보기
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </>
                )}

                {/* 빈 상태 */}
                {!loading && maps.length === 0 && (
                    <div className="text-center py-20">
                        <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">아직 랭킹 데이터가 없습니다</h3>
                        <p className="text-gray-400">맵이 등록되면 여기에 표시됩니다</p>
                    </div>
                )}
            </Container>
        </>
    )
}