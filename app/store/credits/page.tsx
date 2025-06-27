'use client'

import {CreditCard, Shield, Sparkles, TrendingUp, Zap} from 'lucide-react'
import {useState} from 'react'

interface CreditPack {
    id: number
    name: string
    credits: number
    price: number
    bonus: number
    popular: boolean
    discount?: number
}

export default function CreditsPage() {
    const [selectedPack, setSelectedPack] = useState<number | null>(null)

    const creditPacks: CreditPack[] = [
        {id: 1, name: '스타터 팩', credits: 1000, price: 5900, bonus: 0, popular: false},
        {id: 2, name: '밸류 팩', credits: 3000, price: 14900, bonus: 500, popular: false, discount: 17},
        {id: 3, name: '프리미엄 팩', credits: 6500, price: 27900, bonus: 1500, popular: true, discount: 30},
        {id: 4, name: '얼티밋 팩', credits: 15000, price: 49900, bonus: 5000, popular: false, discount: 40},
        {id: 5, name: '메가 팩', credits: 35000, price: 99900, bonus: 15000, popular: false, discount: 50}
    ]

    const benefits = [
        {icon: <Sparkles className="w-6 h-6"/>, title: "독점 맵 테마", desc: "크레딧으로만 구매 가능한 프리미엄 테마"},
        {icon: <Shield className="w-6 h-6"/>, title: "특수 도구", desc: "게임을 더 쉽고 재미있게 만드는 아이템"},
        {icon: <Zap className="w-6 h-6"/>, title: "경험치 부스터", desc: "더 빠른 레벨업과 보상 획득"}
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        크레딧 구매
                    </h1>
                    <p className="text-2xl text-gray-300">EROOM을 더욱 풍성하게 즐기세요</p>
                </div>

                {/* Credit Packs */}
                <div className="grid grid-cols-3 gap-6 mb-20">
                    {creditPacks.map((pack) => (
                        <div
                            key={pack.id}
                            className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border transition-all duration-300 cursor-pointer ${
                                pack.popular
                                    ? 'border-green-500 shadow-2xl shadow-green-900/50 scale-105'
                                    : 'border-gray-800 hover:border-green-600/50'
                            } ${selectedPack === pack.id ? 'ring-2 ring-green-400' : ''}`}
                            onClick={() => setSelectedPack(pack.id)}
                        >
                            {pack.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4"/>
                                        BEST VALUE
                                    </div>
                                </div>
                            )}

                            {pack.discount && (
                                <div
                                    className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                                    {pack.discount}% 할인
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
                                        {(pack.credits + pack.bonus).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">크레딧</p>
                                    {pack.bonus > 0 && (
                                        <p className="text-green-400 font-medium mt-2">
                                            +{pack.bonus.toLocaleString()} 보너스
                                        </p>
                                    )}
                                </div>

                                <p className="text-3xl font-bold mb-8">₩{pack.price.toLocaleString()}</p>

                                <button
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        pack.popular
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105'
                                            : 'bg-gray-800 hover:bg-gray-700'
                                    }`}>
                                    구매하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-12 border border-green-900/30 mb-20">
                    <h2 className="text-4xl font-bold mb-10 text-center">크레딧으로 할 수 있는 것들</h2>
                    <div className="grid grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <div className="text-green-400">{benefit.icon}</div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}