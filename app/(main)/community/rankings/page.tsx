'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {UserService} from '@/lib/firebase/services/user.service'
import {MapService} from '@/lib/firebase/services/map.service'
import type {User} from '@/lib/firebase/types'
import {Avatar} from '@/components/ui/Avatar'
import {Crown, MapPin, Medal, Star, Trophy, Users, Zap} from 'lucide-react'

interface UserWithStats extends User {
    totalMapPlays?: number
    avgMapRating?: number
}

export default function RankingsPage() {
    const router = useRouter()
    const [users, setUsers] = useState<UserWithStats[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'level' | 'playCount' | 'mapsCreated' | 'avgRating'>('level')

    useEffect(() => {
        loadUsers(activeTab)
    }, [activeTab])

    const loadUsers = async (type: 'level' | 'playCount' | 'mapsCreated' | 'avgRating') => {
        setLoading(true)
        try {
            let userData: User[] = []

            // 모든 유저 가져오기
            userData = await UserService.getAllUsers()

            // 추가 통계 계산
            const usersWithStats: UserWithStats[] = await Promise.all(
                userData.map(async (user) => {
                    let totalMapPlays = 0
                    let avgMapRating = 0

                    if (user.stats.mapsCreated > 0) {
                        // 유저가 만든 맵들의 통계 가져오기
                        const userMaps = await MapService.getMapsByCreator(user.uid)

                        totalMapPlays = userMaps.reduce((sum: number, map) => sum + map.stats.playCount, 0)

                        const totalRating = userMaps.reduce((sum: number, map) => sum + ((map.stats.avgRating || 0) * map.stats.playCount), 0)
                        const totalRatingCount = userMaps.reduce((sum: number, map) => sum + map.stats.playCount, 0)
                        avgMapRating = totalRatingCount > 0 ? totalRating / totalRatingCount : 0
                    }

                    return {
                        ...user,
                        totalMapPlays,
                        avgMapRating
                    }
                })
            )

            // 정렬
            let sortedUsers = [...usersWithStats]
            switch (type) {
                case 'level':
                    sortedUsers.sort((a, b) => b.level - a.level)
                    break
                case 'playCount':
                    sortedUsers.sort((a, b) => (b.totalMapPlays || 0) - (a.totalMapPlays || 0))
                    break
                case 'mapsCreated':
                    sortedUsers.sort((a, b) => b.stats.mapsCreated - a.stats.mapsCreated)
                    break
                case 'avgRating':
                    sortedUsers.sort((a, b) => (b.avgMapRating || 0) - (a.avgMapRating || 0))
                    break
            }

            setUsers(sortedUsers.slice(0, 50)) // 상위 50명만 표시
        } catch (error) {
            console.error('Error loading users:', error)
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

    const getRankLabel = (type: string) => {
        switch (type) {
            case 'level':
                return '레벨'
            case 'playCount':
                return '플레이 횟수'
            case 'mapsCreated':
                return '제작한 맵'
            case 'avgRating':
                return '평균 평점'
            default:
                return ''
        }
    }

    const getRankValue = (user: UserWithStats, type: string) => {
        switch (type) {
            case 'level':
                return `Lv.${user.level}`
            case 'playCount':
                return formatCount(user.totalMapPlays || 0)
            case 'mapsCreated':
                return formatCount(user.stats.mapsCreated)
            case 'avgRating':
                return (user.avgMapRating || 0).toFixed(1) + ' ⭐'
            default:
                return '0'
        }
    }

    const getLevelBadgeColor = (level: number) => {
        if (level >= 50) return 'danger'
        if (level >= 30) return 'warning'
        if (level >= 10) return 'info'
        return 'success'
    }

    const handleUserClick = (username: string) => {
        router.push(`/profile/${username}`)
    }

    return (
        <>
            <PageHeader
                title="유저 랭킹"
                description="최고의 방탈출 마스터들을 확인하세요"
                badge="실시간 업데이트"
                icon={<Trophy className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 탭 메뉴 - 여백 추가 */}
                <div className="mb-12">
                    <Tabs<'level' | 'playCount' | 'mapsCreated' | 'avgRating'>
                        value={activeTab}
                        onValueChange={(val) => setActiveTab(val)}
                        defaultValue="level"
                    >
                        <TabsList>
                            <TabsTrigger value="level">
                                <Trophy className="w-4 h-4"/>
                                레벨
                            </TabsTrigger>
                            <TabsTrigger value="playCount">
                                <Users className="w-4 h-4"/>
                                플레이 횟수
                            </TabsTrigger>
                            <TabsTrigger value="mapsCreated">
                                <MapPin className="w-4 h-4"/>
                                맵 제작
                            </TabsTrigger>
                            <TabsTrigger value="avgRating">
                                <Star className="w-4 h-4"/>
                                평균 평점
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* 로딩 상태 */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">랭킹을 불러오는 중...</p>
                    </div>
                )}

                {/* 상위 3명 하이라이트 */}
                {!loading && users.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {users.slice(0, 3).map((user, index) => {
                                const rank = index + 1
                                return (
                                    <Card
                                        key={user.id}
                                        className={`p-6 ${getRankStyle(rank)} hover:scale-105 transition-transform cursor-pointer`}
                                        onClick={() => handleUserClick(user.username)}
                                    >
                                        <div className="text-center mb-4">
                                            {getRankIcon(rank)}
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <Avatar src={user.avatarUrl} size="lg" className="mb-4"/>

                                            <h3 className="text-xl font-bold mb-1 text-center">
                                                {user.displayName}
                                            </h3>

                                            <p className="text-sm text-gray-400 mb-3">@{user.username}</p>

                                            <Badge variant={getLevelBadgeColor(user.level) as any} className="mb-4">
                                                Lv.{user.level}
                                            </Badge>

                                            <div className="w-full space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className="text-sm text-gray-400">{getRankLabel(activeTab)}</span>
                                                    <span
                                                        className="font-bold text-lg">{getRankValue(user, activeTab)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">포인트</span>
                                                    <span>{formatCount(user.points)}</span>
                                                </div>
                                            </div>
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
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">유저</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">레벨</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">{getRankLabel(activeTab)}</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">포인트</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">승률</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                    {users.slice(3).map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-900/30 transition-colors cursor-pointer"
                                            onClick={() => handleUserClick(user.username)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-bold text-gray-500">
                                                    #{index + 4}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={user.avatarUrl} size="sm"/>
                                                    <div>
                                                        <p className="font-medium">{user.displayName}</p>
                                                        <p className="text-sm text-gray-400">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={getLevelBadgeColor(user.level) as any} size="sm">
                                                    Lv.{user.level}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold">{getRankValue(user, activeTab)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Zap className="w-4 h-4 text-yellow-400"/>
                                                    <span>{formatCount(user.points)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm">{user.stats.winRate}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}

                {/* 빈 상태 */}
                {!loading && users.length === 0 && (
                    <div className="text-center py-20">
                        <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">아직 랭킹 데이터가 없습니다</h3>
                        <p className="text-gray-400">유저들의 활동이 기록되면 여기에 표시됩니다</p>
                    </div>
                )}
            </Container>
        </>
    )
}