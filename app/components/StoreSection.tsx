'use client'

import {CreditCard, Gamepad2, Shield, Sparkles, Star, TrendingUp} from 'lucide-react'
import {useState} from 'react'
import Link from 'next/link'

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
            icon: <Gamepad2 className="w-12 h-12"/>,
            title: "맵 테마",
            description: "고대 유적, 우주 정거장, 사이버펑크 등 30+ 테마",
            price: "500 크레딧부터"
        },
        {
            icon: <Shield className="w-12 h-12"/>,
            title: "특수 도구",
            description: "힌트 부스터, 시간 연장, 마스터 키 등",
            price: "200 크레딧부터"
        },
        {
            icon: <Star className="w-12 h-12"/>,
            title: "캐릭터 스킨",
            description: "독특한 캐릭터 외형과 특수 이펙트",
            price: "800 크레딧부터"
        }
    ]

    return (
        <section id="store" className="py-32 px-8 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-screen-xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-green-900/20 px-6 py-2 rounded-full mb-6">
                        <Sparkles className="w-5 h-5 text-green-400"/>
                        <span className="text-green-400 font-medium">한정 기간 특별 할인</span>
                    </div>
                    <h2 className="text-7xl font-black mb-8 gradient-text">
                        크레딧 스토어
                    </h2>
                    <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        게임을 더욱 풍성하게 즐길 수 있는 프리미엄 아이템
                    </p>
                </div>

                {/* Credit Packs */}
                <div className="grid grid-cols-4 gap-6 mb-24">
                    {creditPacks.map((pack, index) => (
                        <div
                            key={index}
                            className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border transition-all duration-300 cursor-pointer ${
                                pack.popular
                                    ? 'border-green-500 shadow-2xl shadow-green-900/50 scale-105'
                                    : 'border-green-900/30 hover:border-green-600/50'
                            } ${selectedPack === index ? 'ring-2 ring-green-400' : ''}`}
                            onClick={() => setSelectedPack(index)}
                            onMouseEnter={() => !pack.popular && setSelectedPack(index)}
                            onMouseLeave={() => !pack.popular && setSelectedPack(null)}
                        >
                            {/* Popular badge */}
                            {pack.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4"/>
                                        BEST VALUE
                                    </div>
                                </div>
                            )}

                            {/* Discount badge */}
                            {pack.discount && (
                                <div
                                    className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                                    {pack.discount}
                                </div>
                            )}

                            <div className="p-10 text-center">
                                <div
                                    className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 hover:scale-110">
                                    <CreditCard className="w-12 h-12"/>
                                </div>

                                <h3 className="text-2xl font-bold mb-3">{pack.name}</h3>

                                <div className="mb-6">
                                    <p className="text-5xl font-black text-green-400 mb-1">
                                        {pack.credits.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">크레딧</p>
                                    {pack.bonus && (
                                        <p className="text-green-400 font-medium mt-2">{pack.bonus}</p>
                                    )}
                                </div>

                                <p className="text-3xl font-bold mb-8">{pack.price}</p>

                                <Link
                                    href="/store/checkout"
                                    className={`block w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        pack.popular
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105'
                                            : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                                >
                                    구매하기
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* What you can buy */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-16 border border-green-900/30 mb-20">
                    <h3 className="text-4xl font-bold mb-12 text-center">
                        크레딧으로 구매 가능한 아이템
                    </h3>
                    <div className="grid grid-cols-3 gap-12">
                        {shopItems.map((item, index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div
                                    className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="text-green-400">
                                        {item.icon}
                                    </div>
                                </div>
                                <h4 className="text-2xl font-semibold mb-3 group-hover:text-green-400 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400 mb-4">{item.description}</p>
                                <p className="text-green-400 font-medium">{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Special Offers */}
                <div className="grid grid-cols-2 gap-8">
                    <div
                        className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-10 border border-green-800/50">
                        <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-green-400"/>
                            시즌 패스
                        </h3>
                        <p className="text-gray-300 mb-6">
                            3개월 동안 매주 독점 보상과 2배 경험치를 받으세요
                        </p>
                        <p className="text-2xl font-bold text-green-400 mb-6">₩19,900</p>
                        <Link href="/store/season-pass"
                              className="inline-block px-8 py-3 bg-green-700 hover:bg-green-600 rounded-lg font-bold transition-colors">
                            자세히 보기
                        </Link>
                    </div>

                    <div
                        className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-10 border border-purple-800/50">
                        <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <Star className="w-8 h-8 text-purple-400"/>
                            VIP 멤버십
                        </h3>
                        <p className="text-gray-300 mb-6">
                            영구적인 혜택과 독점 콘텐츠를 즐기세요
                        </p>
                        <p className="text-2xl font-bold text-purple-400 mb-6">₩99,900</p>
                        <Link href="/store/vip"
                              className="inline-block px-8 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg font-bold transition-colors">
                            VIP 되기
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .gradient-text {
          background: linear-gradient(to right, #10b981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
        </section>
    )
}