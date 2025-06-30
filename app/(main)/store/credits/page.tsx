'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {CreditCard, Sparkles, TrendingUp, Users} from 'lucide-react'
import {Badge} from "@/components/ui/Badge";

export default function StoreCreditsPage() {
    const creditPacks = [
        {
            name: '스타터 팩',
            credits: 1000,
            price: '₩5,900',
            bonus: '',
            popular: false
        },
        {
            name: '밸류 팩',
            credits: 3000,
            price: '₩14,900',
            bonus: '+500 보너스',
            popular: false,
            discount: '17% 할인'
        },
        {
            name: '프리미엄 팩',
            credits: 6500,
            price: '₩27,900',
            bonus: '+1,500 보너스',
            popular: true,
            discount: '30% 할인'
        },
        {
            name: '얼티밋 팩',
            credits: 15000,
            price: '₩49,900',
            bonus: '+5,000 보너스',
            popular: false,
            discount: '40% 할인'
        }
    ]

    return (
        <>
            <PageHeader
                title="크레딧 구매"
                description="게임을 더욱 풍성하게 즐길 수 있는 크레딧을 구매하세요"
                badge="한정 기간 특별 할인"
                icon={<Sparkles className="w-5 h-5"/>}
            />

            <Container className="py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {creditPacks.map((pack, index) => (
                        <Card
                            key={index}
                            variant={pack.popular ? 'gradient' : 'default'}
                            className={`relative p-6 text-center ${
                                pack.popular ? 'border-green-500 shadow-2xl shadow-green-900/50' : ''
                            }`}
                        >
                            {pack.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge variant="success" size="md">
                                        <TrendingUp className="w-3 h-3"/>
                                        BEST VALUE
                                    </Badge>
                                </div>
                            )}

                            {pack.discount && (
                                <div className="absolute top-4 right-4">
                                    <Badge variant="danger">{pack.discount}</Badge>
                                </div>
                            )}

                            <div
                                className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-10 h-10"/>
                            </div>

                            <h3 className="text-xl font-bold mb-3">{pack.name}</h3>

                            <div className="mb-4">
                                <p className="text-4xl font-black text-green-400 mb-1">
                                    {pack.credits.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">크레딧</p>
                                {pack.bonus && (
                                    <p className="text-green-400 font-medium mt-2">{pack.bonus}</p>
                                )}
                            </div>

                            <p className="text-2xl font-bold mb-6">{pack.price}</p>

                            <Button
                                variant={pack.popular ? 'primary' : 'secondary'}
                                fullWidth
                            >
                                구매하기
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* 크레딧 사용처 */}
                <Card className="mt-12 p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">크레딧으로 무엇을 할 수 있나요?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-green-400"/>
                            </div>
                            <h3 className="font-semibold mb-2">프리미엄 테마</h3>
                            <p className="text-gray-400 text-sm">
                                독특한 비주얼과 분위기의 맵 테마를 잠금 해제하세요
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-green-400"/>
                            </div>
                            <h3 className="font-semibold mb-2">캐릭터 스킨</h3>
                            <p className="text-gray-400 text-sm">
                                나만의 개성을 표현할 수 있는 특별한 캐릭터 스킨
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-green-400"/>
                            </div>
                            <h3 className="font-semibold mb-2">부스터 아이템</h3>
                            <p className="text-gray-400 text-sm">
                                게임 플레이를 도와주는 특별한 도구와 힌트
                            </p>
                        </div>
                    </div>
                </Card>
            </Container>
        </>
    )
}