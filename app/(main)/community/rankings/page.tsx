'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Avatar} from '@/components/ui/Avatar'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {GameService} from '@/lib/firebase/services'
import type {LeaderboardEntry} from '@/lib/firebase/types'
import {Clock, Crown, Medal, Target, TrendingUp, Trophy} from 'lucide-react'

export default function RankingsPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'monthly'>('global')

    useEffect(() => {
        loadLeaderboard(activeTab)
    }, [activeTab])

    const loadLeaderboard = async (type: 'global' | 'weekly' | 'monthly') => {
        setLoading(true)
        try {
            const data = await GameService.getLeaderboard(type, undefined, {limit: 100})
            setLeaderboard(data)
        } catch (error) {
            console.error('Error loading leaderboard:', error)
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <>
            <PageHeader
                title="글로벌 랭킹"
                description="최고의 플레이어들과 경쟁하고 정상에 도전하세요"
                badge="실시간 업데이트"
                icon={<Trophy className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 탭 메뉴 */}
                <Tabs<'global' | 'weekly' | 'monthly'>
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val)}
                    defaultValue="global"
                >
                    <TabsList>
                        <TabsTrigger value="global">전체 랭킹</TabsTrigger>
                        <TabsTrigger value="weekly">주간 랭킹</TabsTrigger>
                        <TabsTrigger value="monthly">월간 랭킹</TabsTrigger>
                    </TabsList>
                </Tabs>


                {/* 상위 3명 하이라이트 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[1, 2, 3].map((rank) => {
                        const player = leaderboard[rank - 1]
                        if (!player) return null

                        return (
                            <Card
                                key={rank}
                                className={`p-6 text-center ${getRankStyle(rank)} hover:scale-105 transition-transform`}
                            >
                                <div className="mb-4">
                                    {getRankIcon(rank)}
                                </div>
                                <Avatar
                                    src={player.player.avatarUrl}
                                    size="lg"
                                    className="mx-auto mb-4"
                                />
                                <h3 className="text-xl font-bold mb-1">{player.player.displayName}</h3>
                                <p className="text-gray-400 mb-4">@{player.player.username}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <Target className="w-4 h-4 text-green-400"/>
                                        <span className="text-2xl font-bold">{player.score.toLocaleString()}</span>
                                    </div>
                                    {player.clearTime && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                            <Clock className="w-4 h-4"/>
                                            <span>{formatTime(player.clearTime)}</span>
                                        </div>
                                    )}
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
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">플레이어</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">점수</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">클리어 타임</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">변동</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {leaderboard.slice(3).map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-gray-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-500">
                          #{entry.rank}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={entry.player.avatarUrl} size="sm"/>
                                            <div>
                                                <p className="font-medium">{entry.player.displayName}</p>
                                                <p className="text-sm text-gray-400">@{entry.player.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-bold">{entry.score.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {entry.clearTime ? (
                                            <span className="text-gray-300">{formatTime(entry.clearTime)}</span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="success" size="sm">
                                            <TrendingUp className="w-3 h-3"/>
                                            +{Math.floor(Math.random() * 5) + 1}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 더보기 버튼 */}
                    <div className="p-4 border-t border-gray-800 text-center">
                        <Button variant="secondary">
                            더 많은 순위 보기
                        </Button>
                    </div>
                </Card>
            </Container>
        </>
    )
}