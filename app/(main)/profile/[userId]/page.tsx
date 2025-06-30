'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Avatar} from '@/components/ui/Avatar'
import {LoadingSpinner} from '@/components/common/LoadingSpinner'
import {UserService} from '@/lib/firebase/services'
import type {User} from '@/lib/firebase/types'
import {Clock, MapPin, Target, Trophy, Users} from 'lucide-react'

export default function ProfilePage() {
    const params = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await UserService.getUserByUsername(params.userId as string)
                setUser(userData)
            } catch (error) {
                console.error('Error loading user:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [params.userId])

    if (loading) return <LoadingSpinner size="lg"/>
    if (!user) return <div>사용자를 찾을 수 없습니다.</div>

    return (
        <>
            <PageHeader
                title={user.displayName}
                description={`@${user.username}`}
                badge={`Level ${user.level}`}
                icon={<Trophy className="w-5 h-5"/>}
            />

            <Container className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 프로필 정보 */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <div className="text-center">
                                <Avatar src={user.avatarUrl} size="lg" className="mx-auto mb-4"/>
                                <h2 className="text-2xl font-bold mb-2">{user.displayName}</h2>
                                <p className="text-gray-400 mb-4">@{user.username}</p>

                                {user.bio && (
                                    <p className="text-gray-300 mb-6">{user.bio}</p>
                                )}

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">{user.social.friendCount}</p>
                                        <p className="text-sm text-gray-400">친구</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">{user.social.followers.length}</p>
                                        <p className="text-sm text-gray-400">팔로워</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">{user.social.following.length}</p>
                                        <p className="text-sm text-gray-400">팔로잉</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="primary" fullWidth>
                                        <Users className="w-4 h-4"/>
                                        친구 추가
                                    </Button>
                                    <Button variant="outline" fullWidth>
                                        메시지 보내기
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* 통계 및 활동 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 게임 통계 */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-green-400"/>
                                게임 통계
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <Target className="w-6 h-6 mx-auto mb-2 text-green-400"/>
                                    <p className="text-2xl font-bold">{user.stats.mapsCompleted}</p>
                                    <p className="text-sm text-gray-400">클리어한 맵</p>
                                </div>
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <MapPin className="w-6 h-6 mx-auto mb-2 text-green-400"/>
                                    <p className="text-2xl font-bold">{user.stats.mapsCreated}</p>
                                    <p className="text-sm text-gray-400">제작한 맵</p>
                                </div>
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-green-400"/>
                                    <p className="text-2xl font-bold">{Math.floor(user.stats.totalPlayTime / 3600)}h</p>
                                    <p className="text-sm text-gray-400">플레이 시간</p>
                                </div>
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <Trophy className="w-6 h-6 mx-auto mb-2 text-green-400"/>
                                    <p className="text-2xl font-bold">{user.stats.winRate}%</p>
                                    <p className="text-sm text-gray-400">승률</p>
                                </div>
                            </div>
                        </Card>

                        {/* 업적 */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">최근 업적</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['초보 탈출가', '맵 제작자', '스피드러너', '팀 플레이어'].map((achievement) => (
                                    <Badge key={achievement} variant="success" size="md">
                                        {achievement}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    )
}