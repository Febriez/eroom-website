'use client'

import {Check, Lock, Star} from 'lucide-react'

export default function SeasonPassPage() {
    const tiers = Array.from({length: 50}, (_, i) => ({
        level: i + 1,
        free: i % 5 === 0 ? {type: 'credits', amount: 100} : null,
        premium: i % 2 === 0 ? {type: 'skin', name: `레벨 ${i + 1} 스킨`} : {type: 'credits', amount: 200}
    }))

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        시즌 패스
                    </h1>
                    <p className="text-2xl text-gray-300">시즌 1: AI의 각성 - 90일 남음</p>
                </div>

                {/* Season Pass Info */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 mb-16">
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">프리미엄 시즌 패스</h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-400"/>
                                    즉시 10레벨 부스트
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-400"/>
                                    독점 캐릭터 스킨 5종
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-400"/>
                                    경험치 2배 부스트
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-400"/>
                                    총 15,000 크레딧 획득 가능
                                </li>
                            </ul>
                            <button
                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all">
                                ₩19,900에 구매
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <Star className="w-32 h-32 text-green-400 mx-auto mb-4"/>
                                <p className="text-xl text-gray-400">현재 레벨</p>
                                <p className="text-6xl font-black text-green-400">12</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tier Rewards */}
                <div className="mb-32">
                    <h2 className="text-3xl font-bold mb-8">보상 목록</h2>
                    <div className="grid grid-cols-10 gap-4">
                        {tiers.slice(0, 30).map((tier) => (
                            <div key={tier.level}
                                 className={`bg-gradient-to-br from-gray-900/50 to-black rounded-lg p-4 border ${
                                     tier.level <= 12 ? 'border-green-600' : 'border-gray-800'
                                 } text-center`}>
                                <p className="text-sm text-gray-500 mb-2">Lv.{tier.level}</p>
                                {tier.premium && (
                                    <div className={`text-2xl mb-2 ${tier.level <= 12 ? '' : 'opacity-50'}`}>
                                        {tier.premium.type === 'skin' ? '👤' : '💰'}
                                    </div>
                                )}
                                {tier.level > 12 && <Lock className="w-4 h-4 text-gray-600 mx-auto"/>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}