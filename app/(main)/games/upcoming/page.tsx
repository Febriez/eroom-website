'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {Bell, BellOff, Calendar, Gamepad2, Rocket, Sparkles, Star, Sword} from 'lucide-react'
import {useState} from 'react'

interface UpcomingGame {
    id: string
    title: string
    subtitle: string
    description: string
    releaseDate: string
    genre: string
    icon: React.ReactNode
    color: string
    features: string[]
}

export default function UpcomingGamesPage() {
    const [notifications, setNotifications] = useState<string[]>([])

    const upcomingGames: UpcomingGame[] = [
        {
            id: 'dungeon-ai',
            title: 'Dungeon AI',
            subtitle: 'AI 기반 던전 크롤러',
            description: '인공지능이 실시간으로 생성하는 무한한 던전을 탐험하세요. 매번 새로운 몬스터, 보물, 함정이 당신을 기다립니다.',
            releaseDate: '2025 Q4',
            genre: 'RPG / 로그라이크',
            icon: <Sword className="w-8 h-8"/>,
            color: 'from-purple-600 to-purple-800',
            features: [
                'AI 기반 던전 생성',
                '100+ 유니크 몬스터',
                '무작위 스킬 시스템',
                '온라인 협동 모드'
            ]
        },
        {
            id: 'space-architect',
            title: 'Space Architect',
            subtitle: '우주 기지 건설 시뮬레이션',
            description: 'AI와 함께 우주 정거장을 설계하고 관리하세요. 자원 관리부터 외계 생명체와의 교류까지!',
            releaseDate: '2026 Q1',
            genre: '시뮬레이션 / 전략',
            icon: <Rocket className="w-8 h-8"/>,
            color: 'from-blue-600 to-blue-800',
            features: [
                'AI 건축 도우미',
                '실시간 우주 경제',
                '외교 시스템',
                '모드 지원'
            ]
        },
        {
            id: 'mind-maze',
            title: 'Mind Maze',
            subtitle: '심리 스릴러 퍼즐',
            description: 'AI가 분석한 당신의 플레이 스타일에 맞춰 진화하는 심리 퍼즐 게임. 당신의 마음을 읽을 수 있을까요?',
            releaseDate: '2026 Q2',
            genre: '퍼즐 / 호러',
            icon: <Sparkles className="w-8 h-8"/>,
            color: 'from-red-600 to-red-800',
            features: [
                'AI 심리 분석',
                '적응형 난이도',
                'VR 지원',
                '멀티 엔딩'
            ]
        }
    ]

    const toggleNotification = (gameId: string) => {
        setNotifications(prev =>
            prev.includes(gameId)
                ? prev.filter(id => id !== gameId)
                : [...prev, gameId]
        )
    }

    return (
        <>
            <PageHeader
                title="출시 예정"
                description="BangtalBoyBand가 준비 중인 차세대 AI 게임들을 만나보세요"
                badge="Coming Soon"
                icon={<Gamepad2 className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 헤드라인 */}
                <Card
                    className="p-8 mb-12 bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-600/50 text-center">
                    <h2 className="text-3xl font-bold mb-4">AI가 만드는 새로운 게임의 미래</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto">
                        EROOM의 성공을 바탕으로, 더욱 혁신적이고 창의적인 AI 기반 게임들을 개발하고 있습니다.
                        각 게임은 플레이어의 행동을 학습하고 적응하여 완전히 개인화된 경험을 제공합니다.
                    </p>
                </Card>

                {/* 게임 목록 */}
                <div className="space-y-12">
                    {upcomingGames.map((game, index) => (
                        <Card key={game.id} className="overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                                {/* 게임 아트 */}
                                <div
                                    className={`bg-gradient-to-br ${game.color} p-12 flex items-center justify-center`}>
                                    <div className="text-white">
                                        {game.icon}
                                    </div>
                                </div>

                                {/* 게임 정보 */}
                                <div className="lg:col-span-2 p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                                            <p className="text-lg text-green-400 mb-1">{game.subtitle}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4"/>
                            {game.releaseDate}
                        </span>
                                                <Badge variant="info">{game.genre}</Badge>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleNotification(game.id)}
                                            className={`p-3 rounded-lg transition-colors ${
                                                notifications.includes(game.id)
                                                    ? 'bg-green-900/30 text-green-400'
                                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                            }`}
                                            title={notifications.includes(game.id) ? '알림 해제' : '출시 알림 받기'}
                                        >
                                            {notifications.includes(game.id) ? (
                                                <Bell className="w-5 h-5"/>
                                            ) : (
                                                <BellOff className="w-5 h-5"/>
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-gray-300 mb-6">{game.description}</p>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-3">주요 특징</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {game.features.map((feature, idx) => (
                                                <div key={idx}
                                                     className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Star className="w-4 h-4 text-yellow-400"/>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline">
                                            더 알아보기
                                        </Button>
                                        {notifications.includes(game.id) && (
                                            <span className="flex items-center gap-2 text-sm text-green-400">
                        <Bell className="w-4 h-4"/>
                        출시 알림 설정됨
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 뉴스레터 구독 */}
                <Card className="p-8 mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-4">새로운 소식을 가장 먼저 받아보세요</h3>
                    <p className="text-gray-400 mb-6">
                        이메일을 등록하시면 신작 게임 정보와 독점 혜택을 받으실 수 있습니다.
                    </p>
                    <form className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                        />
                        <Button variant="primary">
                            구독하기
                        </Button>
                    </form>
                </Card>
            </Container>
        </>
    )
}