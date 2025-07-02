'use client'

import React, {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {CheckCircle, Clock, Crown, Gift, Lock, Sparkles, Star, Trophy, Zap} from 'lucide-react'
import {useAuth} from '@/contexts/AuthContext'

interface SeasonReward {
    level: number
    freeReward?: {
        name: string
        icon: React.ReactNode
        rarity: 'common' | 'rare' | 'epic'
    }
    premiumReward: {
        name: string
        icon: React.ReactNode
        rarity: 'common' | 'rare' | 'epic' | 'legendary'
    }
    claimed: boolean
    locked: boolean
}

export default function SeasonPassPage() {
    const {user} = useAuth()
    const [hasPremium, setHasPremium] = useState(false)
    const currentLevel = user?.level || 1
    const seasonDaysLeft = 45

    // 레벨별 보상 설정 - 실제 유저 레벨과 연동
    const rewards: SeasonReward[] = [
        {
            level: 1,
            freeReward: {name: '100 크레딧', icon: <Star className="w-6 h-6"/>, rarity: 'common'},
            premiumReward: {name: '500 크레딧', icon: <Star className="w-6 h-6"/>, rarity: 'rare'},
            claimed: currentLevel >= 1,
            locked: currentLevel < 1
        },
        {
            level: 5,
            freeReward: {name: '힌트 부스터 x3', icon: <Zap className="w-6 h-6"/>, rarity: 'common'},
            premiumReward: {name: '우주 테마', icon: <Sparkles className="w-6 h-6"/>, rarity: 'epic'},
            claimed: currentLevel >= 5,
            locked: currentLevel < 5
        },
        {
            level: 10,
            freeReward: {name: '200 크레딧', icon: <Star className="w-6 h-6"/>, rarity: 'common'},
            premiumReward: {name: '네온 사무라이 스킨', icon: <Crown className="w-6 h-6"/>, rarity: 'epic'},
            claimed: currentLevel >= 10,
            locked: currentLevel < 10
        },
        {
            level: 15,
            premiumReward: {name: '황금 마스터키', icon: <Trophy className="w-6 h-6"/>, rarity: 'legendary'},
            claimed: currentLevel >= 15,
            locked: currentLevel < 15
        },
        {
            level: 20,
            freeReward: {name: '기본 스킨 팩', icon: <Gift className="w-6 h-6"/>, rarity: 'common'},
            premiumReward: {name: '1000 크레딧', icon: <Star className="w-6 h-6"/>, rarity: 'rare'},
            claimed: currentLevel >= 20,
            locked: currentLevel < 20
        },
        {
            level: 25,
            premiumReward: {name: '드래곤 테마', icon: <Sparkles className="w-6 h-6"/>, rarity: 'legendary'},
            claimed: currentLevel >= 25,
            locked: currentLevel < 25
        },
        {
            level: 30,
            freeReward: {name: '힌트 부스터 x5', icon: <Zap className="w-6 h-6"/>, rarity: 'rare'},
            premiumReward: {name: '사이버펑크 스킨', icon: <Crown className="w-6 h-6"/>, rarity: 'legendary'},
            claimed: currentLevel >= 30,
            locked: currentLevel < 30
        },
        {
            level: 40,
            freeReward: {name: '500 크레딧', icon: <Star className="w-6 h-6"/>, rarity: 'rare'},
            premiumReward: {name: '홀로그램 테마', icon: <Sparkles className="w-6 h-6"/>, rarity: 'legendary'},
            claimed: currentLevel >= 40,
            locked: currentLevel < 40
        },
        {
            level: 50,
            premiumReward: {name: '전설의 탈출 아티스트 칭호', icon: <Trophy className="w-6 h-6"/>, rarity: 'legendary'},
            claimed: currentLevel >= 50,
            locked: currentLevel < 50
        }
    ]

    // 사용자의 프리미엄 상태 확인 (실제로는 DB에서 가져와야 함)
    useEffect(() => {
        if (user) {
            // TODO: 실제 프리미엄 상태 확인 로직
            // setHasPremium(user.hasPremiumPass || false)
        }
    }, [user])

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-600 to-gray-700'
            case 'rare':
                return 'from-blue-600 to-blue-700'
            case 'epic':
                return 'from-purple-600 to-purple-700'
            case 'legendary':
                return 'from-orange-600 to-orange-700'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    const progressPercentage = (currentLevel / 50) * 100

    const handleClaimReward = (level: number, isPremium: boolean) => {
        // TODO: 실제 보상 수령 로직 구현
        console.log(`Claiming ${isPremium ? 'premium' : 'free'} reward for level ${level}`)
    }

    return (
        <>
            <PageHeader
                title="시즌 패스"
                description="시즌 1: 사이버 리프트"
                badge={`${seasonDaysLeft}일 남음`}
                icon={<Trophy className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 시즌 정보 */}
                <Card className="p-8 mb-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">시즌 1: 사이버 리프트</h2>
                            <p className="text-gray-400 mb-4">
                                미래 도시를 배경으로 한 특별한 보상들을 획득하세요
                            </p>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400"/>
                                    <span>{seasonDaysLeft}일 남음</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-purple-400"/>
                                    <span>레벨 {currentLevel}/50</span>
                                </div>
                            </div>
                        </div>

                        {!hasPremium && (
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-400 mb-2">₩19,900</p>
                                <Button
                                    variant="primary"
                                    onClick={() => setHasPremium(true)}
                                >
                                    프리미엄 패스 구매
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 진행도 바 */}
                    <div className="mt-8">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>레벨 {currentLevel}</span>
                            <span>레벨 50</span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                                style={{width: `${progressPercentage}%`}}
                            />
                        </div>
                    </div>
                </Card>

                {/* 프리미엄 혜택 */}
                {!hasPremium && (
                    <Card className="p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">프리미엄 패스 혜택</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Gift className="w-6 h-6 text-purple-400"/>
                                </div>
                                <h4 className="font-semibold mb-1">독점 보상</h4>
                                <p className="text-sm text-gray-400">프리미엄 전용 아이템</p>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Zap className="w-6 h-6 text-purple-400"/>
                                </div>
                                <h4 className="font-semibold mb-1">2배 경험치</h4>
                                <p className="text-sm text-gray-400">빠른 레벨업</p>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Crown className="w-6 h-6 text-purple-400"/>
                                </div>
                                <h4 className="font-semibold mb-1">VIP 지위</h4>
                                <p className="text-sm text-gray-400">특별한 프로필 장식</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* 보상 트랙 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">시즌 보상</h3>

                    {rewards.map((reward) => (
                        <Card
                            key={reward.level}
                            className={`p-6 ${reward.level === currentLevel ? 'border-purple-600' : ''}`}
                        >
                            <div className="flex items-center gap-6">
                                {/* 레벨 */}
                                <div className="text-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                                            reward.level <= currentLevel
                                                ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                                                : 'bg-gray-800'
                                        }`}>
                                        {reward.level}
                                    </div>
                                    {reward.level === currentLevel && (
                                        <p className="text-xs text-purple-400 mt-1">현재</p>
                                    )}
                                </div>

                                {/* 무료 보상 */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-2">무료 보상</p>
                                    {reward.freeReward ? (
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(reward.freeReward.rarity)} rounded-lg flex items-center justify-center`}>
                                                {reward.freeReward.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium">{reward.freeReward.name}</p>
                                            </div>
                                            {reward.claimed && (
                                                <CheckCircle className="w-5 h-5 text-green-400 ml-auto"/>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-600">-</div>
                                    )}
                                </div>

                                {/* 프리미엄 보상 */}
                                <div className="flex-1">
                                    <p className="text-sm text-purple-400 mb-2">프리미엄 보상</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(reward.premiumReward.rarity)} rounded-lg flex items-center justify-center ${
                                                !hasPremium && reward.locked ? 'opacity-50' : ''
                                            }`}>
                                            {!hasPremium && reward.locked ? (
                                                <Lock className="w-6 h-6"/>
                                            ) : (
                                                reward.premiumReward.icon
                                            )}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${!hasPremium ? 'text-gray-500' : ''}`}>
                                                {reward.premiumReward.name}
                                            </p>
                                        </div>
                                        {hasPremium && reward.claimed && (
                                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto"/>
                                        )}
                                    </div>
                                </div>

                                {/* 보상 받기 버튼 */}
                                {!reward.locked && !reward.claimed && (
                                    <div className="flex flex-col gap-2">
                                        {reward.freeReward && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleClaimReward(reward.level, false)}
                                            >
                                                무료 보상
                                            </Button>
                                        )}
                                        {hasPremium && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleClaimReward(reward.level, true)}
                                            >
                                                프리미엄 보상
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 더 많은 레벨 안내 */}
                <div className="text-center mt-8 text-gray-400">
                    <p>더 많은 보상은 레벨업을 통해 잠금 해제됩니다!</p>
                    <p className="text-sm mt-1">게임을 플레이하고 경험치를 획득하세요.</p>
                </div>
            </Container>
        </>
    )
}