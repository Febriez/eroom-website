'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {UserService} from '@/lib/firebase/services/user.service'
import {RoomService} from '@/lib/firebase/services/room.service'
import type {User} from '@/lib/firebase/types'
import {Avatar} from '@/components/ui/Avatar'
import {Crown, MapPin, Medal, Trophy, Users, Zap} from 'lucide-react'

interface UserWithStats extends User {
    totalMapPlays?: number
    avgMapRating?: number
}

export default function RankingsPage() {
    const router = useRouter()
    const [users, setUsers] = useState<UserWithStats[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'level' | 'totalPlays' | 'createdRooms' | 'points'>('level')

    useEffect(() => {
        loadUsers(activeTab)
    }, [activeTab])

    const loadUsers = async (type: 'level' | 'totalPlays' | 'createdRooms' | 'points') => {
        setLoading(true)
        try {
            let userData: User[]

            // 유저 서비스의 getRankings 메서드 사용
            switch (type) {
                case 'level':
                    userData = await UserService.getRankings('level', 100)
                    break
                case 'totalPlays':
                    userData = await UserService.getRankings('totalPlays', 100)
                    break
                case 'createdRooms':
                    userData = await UserService.getRankings('createdRooms', 100)
                    break
                case 'points':
                    userData = await UserService.getRankings('points', 100)
                    break
                default:
                    userData = await UserService.getRankings('level', 100)
            }

            // 추가 통계 계산
            const usersWithStats: UserWithStats[] = await Promise.all(
                userData.map(async (user) => {
                    let totalMapPlays = 0
                    let avgMapRating = 0

                    if (user.stats.createdRooms > 0) {
                        try {
                            // 유저가 만든 룸들의 통계 가져오기 (메서드명 수정)
                            const userRooms = await RoomService.getRoomsByCreator(user.uid)

                            totalMapPlays = userRooms.reduce((sum: number, room) => sum + (room.PlayCount || 0), 0)

                            // 평균 평점 계산 (PlayCount가 있는 경우에만)
                            const totalRating = userRooms.reduce((sum: number, room) => sum + ((room.avgRating || 0) * (room.PlayCount || 0)), 0)
                            const totalRatingCount = userRooms.reduce((sum: number, room) => sum + (room.PlayCount || 0), 0)
                            avgMapRating = totalRatingCount > 0 ? totalRating / totalRatingCount : 0
                        } catch (error) {
                            console.error('Error fetching user rooms:', error)
                        }
                    }

                    return {
                        ...user,
                        totalMapPlays,
                        avgMapRating
                    }
                })
            )

            // 복잡한 정렬 로직: 메인 수치 → 레벨 → 포인트 → 이름
            let sortedUsers = [...usersWithStats]
            switch (type) {
                case 'level':
                    sortedUsers.sort((a, b) => {
                        // 1. 레벨로 정렬
                        if (b.level !== a.level) return b.level - a.level
                        // 2. 레벨이 같으면 포인트로 정렬
                        if (b.points !== a.points) return b.points - a.points
                        // 3. 포인트도 같으면 이름순
                        return a.displayName.localeCompare(b.displayName)
                    })
                    break
                case 'totalPlays':
                    sortedUsers.sort((a, b) => {
                        // 1. 총 플레이 횟수로 정렬
                        const totalPlaysDiff = (b.stats?.totalPlays || 0) - (a.stats?.totalPlays || 0)
                        if (totalPlaysDiff !== 0) return totalPlaysDiff
                        // 2. 플레이 횟수가 같으면 레벨로 정렬
                        if (b.level !== a.level) return b.level - a.level
                        // 3. 레벨도 같으면 포인트로 정렬
                        if (b.points !== a.points) return b.points - a.points
                        // 4. 포인트도 같으면 이름순
                        return a.displayName.localeCompare(b.displayName)
                    })
                    break
                case 'createdRooms':
                    sortedUsers.sort((a, b) => {
                        // 1. 제작한 룸 수로 정렬
                        if (b.stats.createdRooms !== a.stats.createdRooms) return b.stats.createdRooms - a.stats.createdRooms
                        // 2. 룸 수가 같으면 레벨로 정렬
                        if (b.level !== a.level) return b.level - a.level
                        // 3. 레벨도 같으면 포인트로 정렬
                        if (b.points !== a.points) return b.points - a.points
                        // 4. 포인트도 같으면 이름순
                        return a.displayName.localeCompare(b.displayName)
                    })
                    break
                case 'points':
                    sortedUsers.sort((a, b) => {
                        // 1. 포인트로 정렬
                        if (b.points !== a.points) return b.points - a.points
                        // 2. 포인트가 같으면 레벨로 정렬
                        if (b.level !== a.level) return b.level - a.level
                        // 3. 레벨도 같으면 이름순
                        return a.displayName.localeCompare(b.displayName)
                    })
                    break
            }

            setUsers(sortedUsers)
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
                return <Medal className="w-6 h-6 text-amber-700"/>
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
                return 'bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-700/50'
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
            case 'totalPlays':
                return '총 플레이'
            case 'createdRooms':
                return '제작한 룸'
            case 'points':
                return '포인트'
            default:
                return ''
        }
    }

    const getRankValue = (user: UserWithStats, type: string) => {
        switch (type) {
            case 'level':
                return `Lv.${user.level}`
            case 'totalPlays':
                return formatCount(user.stats?.totalPlays || 0)
            case 'createdRooms':
                return formatCount(user.stats.createdRooms)
            case 'points':
                return formatCount(user.points)
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

    const handleUserClick = (username: string | undefined) => {
        if (username) {
            router.push(`/profile/${username}`)
        }
    }

    // Get unique identifier for each user (uid or username)
    const getUserKey = (user: UserWithStats) => {
        return user.uid || user.username || Math.random().toString()
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
                {/* 탭 메뉴 */}
                <div className="mb-12">
                    <Tabs<'level' | 'totalPlays' | 'createdRooms' | 'points'>
                        value={activeTab}
                        onValueChange={(val) => setActiveTab(val)}
                        defaultValue="level"
                    >
                        <TabsList>
                            <TabsTrigger value="level">
                                <Trophy className="w-4 h-4"/>
                                레벨
                            </TabsTrigger>
                            <TabsTrigger value="totalPlays">
                                <Users className="w-4 h-4"/>
                                총 플레이
                            </TabsTrigger>
                            <TabsTrigger value="createdRooms">
                                <MapPin className="w-4 h-4"/>
                                룸 제작
                            </TabsTrigger>
                            <TabsTrigger value="points">
                                <Zap className="w-4 h-4"/>
                                포인트
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
                                        key={getUserKey(user)}
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
                                                {activeTab === 'level' ? (
                                                    // 레벨 탭에서는 포인트 표시
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">포인트</span>
                                                        <span>{formatCount(user.points)}</span>
                                                    </div>
                                                ) : (
                                                    // 다른 탭에서는 레벨 표시
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">레벨</span>
                                                        <span>Lv.{user.level}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* 전체 랭킹 리스트 */}
                        <Card className="overflow-hidden">
                            <div className="p-4 border-b border-gray-800">
                                <h2 className="text-xl font-bold">전체 순위 ({users.length}명)</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">순위</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">유저</th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">
                                            {activeTab === 'level' ? '레벨' : getRankLabel(activeTab)}
                                        </th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">
                                            {activeTab === 'level' ? '포인트' : '레벨'}
                                        </th>
                                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">승률</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                    {users.map((user, index) => (
                                        <tr
                                            key={getUserKey(user)}
                                            className="hover:bg-gray-900/30 transition-colors cursor-pointer"
                                            onClick={() => handleUserClick(user.username)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-bold text-gray-500">
                                                    #{index + 1}
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
                                                {activeTab === 'level' ? (
                                                    <Badge variant={getLevelBadgeColor(user.level) as any} size="sm">
                                                        Lv.{user.level}
                                                    </Badge>
                                                ) : (
                                                    <span className="font-bold">{getRankValue(user, activeTab)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {activeTab === 'level' ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Zap className="w-4 h-4 text-yellow-400"/>
                                                        <span>{formatCount(user.points)}</span>
                                                    </div>
                                                ) : (
                                                    <Badge variant={getLevelBadgeColor(user.level) as any} size="sm">
                                                        Lv.{user.level}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm">{user.stats?.successRate || 0}%</span>
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