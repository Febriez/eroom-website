'use client'

import {CreditCard, Gamepad2, Shield, Sparkles, Star, TrendingUp} from 'lucide-react'
import {useState} from 'react'
import Link from 'next/link'
import {useDevice} from '@/lib/hooks/useDevice'
import {Card} from '../ui/Card'
import {Button} from '../ui/Button'

interface CreditPack {
    name: string
    credits: number
    price: string
    bonus: string
    popular: boolean
    discount?: string
}

export default function StoreSection() {
    const [selectedPack, setSelectedPack] = useState<number | null>(null)
    const {isMobile} = useDevice()

    const creditPacks: CreditPack[] = [
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

    const shopItems = [
        {
            icon: <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12"/>,
            title: "맵 테마",
            description: "고대 유적, 우주 정거장, 사이버펑크 등 30+ 테마",
            price: "500 크레딧부터"
        },
        {
            icon: <Shield className="w-10 h-10 sm:w-12 sm:h-12"/>,
            title: "특수 도구",
            description: "힌트 부스터, 시간 연장, 마스터 키 등",
            price: "200 크레딧부터"
        },
        {
            icon: <Star className="w-10 h-10 sm:w-12 sm:h-12"/>,
            title: "캐릭터 스킨",
            description: "독특한 캐릭터 외형과 특수 이펙트",
            price: "800 크레딧부터"
        }
    ]

    return (
        <section id="store" className="py-16 sm:py-32 px-4 sm:px-8 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-1/2 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-green-600/10 rounded-full blur-3xl"></div>
                <div
                    className="absolute bottom-1/3 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-20">
                    <div className="inline-flex items-center gap-2 bg-green-900/20 px-6 py-2 rounded-full mb-6">
                        <Sparkles className="w-5 h-5 text-green-400"/>
                        <span className="text-green-400 font-medium">한정 기간 특별 할인</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-8 gradient-text">
                        크레딧 스토어
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        게임을 더욱 풍성하게 즐길 수 있는 프리미엄 아이템
                    </p>
                </div>

                {/* Credit Packs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-24">
                    {creditPacks.map((pack, index) => (
                        <Card
                            key={index}
                            hover
                            className={`relative p-6 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
                                pack.popular
                                    ? 'border-green-500 shadow-2xl shadow-green-900/50 sm:scale-105'
                                    : ''
                            } ${selectedPack === index ? 'ring-2 ring-green-400' : ''}`}
                            onClick={() => setSelectedPack(index)}
                            onMouseEnter={() => !isMobile && !pack.popular && setSelectedPack(index)}
                            onMouseLeave={() => !isMobile && !pack.popular && setSelectedPack(null)}
                        >
                            {/* Popular badge */}
                            {pack.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4"/>
                                        BEST VALUE
                                    </div>
                                </div>
                            )}

                            {/* Discount badge */}
                            {pack.discount && (
                                <div
                                    className="absolute top-4 right-4 bg-red-600 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                                    {pack.discount}
                                </div>
                            )}

                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-transform duration-300 hover:scale-110">
                                <CreditCard className="w-10 h-10 sm:w-12 sm:h-12"/>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold mb-3">{pack.name}</h3>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-3xl sm:text-5xl font-black text-green-400 mb-1">
                                    {pack.credits.toLocaleString()}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">크레딧</p>
                                {pack.bonus && (
                                    <p className="text-green-400 font-medium mt-2 text-sm">{pack.bonus}</p>
                                )}
                            </div>

                            <p className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{pack.price}</p>

                            <Button
                                variant={pack.popular ? 'primary' : 'secondary'}
                                fullWidth
                                onClick={(e) => {
                                    e.stopPropagation()
                                    // Handle purchase
                                }}
                            >
                                구매하기
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* What you can buy */}
                <Card className="p-8 sm:p-16 mb-12 sm:mb-20">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">
                        크레딧으로 구매 가능한 아이템
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                        {shopItems.map((item, index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="text-green-400">
                                        {item.icon}
                                    </div>
                                </div>
                                <h4 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-green-400 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400 mb-4 text-sm sm:text-base">{item.description}</p>
                                <p className="text-green-400 font-medium">{item.price}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Special Offers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <Card
                        className="p-6 sm:p-10 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800/50">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-400"/>
                            시즌 패스
                        </h3>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base">
                            3개월 동안 매주 독점 보상과 2배 경험치를 받으세요
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-400 mb-6">₩19,900</p>
                        <Link href="/store/season-pass">
                            <Button variant="primary" size="sm">
                                자세히 보기
                            </Button>
                        </Link>
                    </Card>

                    <Card
                        className="p-6 sm:p-10 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-800/50">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-3">
                            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400"/>
                            VIP 멤버십
                        </h3>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base">
                            영구적인 혜택과 독점 콘텐츠를 즐기세요
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-400 mb-6">₩99,900</p>
                        <Link href="/store/vip">
                            <Button variant="outline" size="sm">
                                VIP 되기
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </section>
    )
}