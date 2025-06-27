'use client'

import {Gamepad2, Shield, ShoppingCart, Sparkles, Star} from 'lucide-react'
import {useState} from 'react'

export default function ItemsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const items = [
        {
            id: 1,
            name: "사이버펑크 테마",
            category: "theme",
            price: 1200,
            image: "🌃",
            description: "네온 빛으로 가득한 미래 도시 테마"
        },
        {
            id: 2,
            name: "고대 유적 테마",
            category: "theme",
            price: 1000,
            image: "🏛️",
            description: "신비로운 고대 문명의 비밀을 담은 테마"
        },
        {
            id: 3,
            name: "우주 정거장 테마",
            category: "theme",
            price: 1500,
            image: "🚀",
            description: "무중력 상태의 독특한 퍼즐 경험"
        },
        {
            id: 4,
            name: "마스터 키",
            category: "tool",
            price: 500,
            image: "🗝️",
            description: "어려운 퍼즐을 한 번 건너뛸 수 있는 특수 도구"
        },
        {
            id: 5,
            name: "힌트 부스터",
            category: "tool",
            price: 300,
            image: "💡",
            description: "더 자세한 힌트를 제공받을 수 있습니다"
        },
        {
            id: 6,
            name: "시간 연장",
            category: "tool",
            price: 400,
            image: "⏰",
            description: "제한 시간을 30분 연장합니다"
        },
        {
            id: 7,
            name: "네온 캐릭터",
            category: "skin",
            price: 800,
            image: "👤",
            description: "형광색으로 빛나는 특별한 캐릭터 스킨"
        },
        {
            id: 8,
            name: "로봇 캐릭터",
            category: "skin",
            price: 1000,
            image: "🤖",
            description: "미래적인 로봇 외형의 캐릭터"
        }
    ]

    const filteredItems = selectedCategory === 'all'
        ? items
        : items.filter(item => item.category === selectedCategory)

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        아이템 샵
                    </h1>
                    <p className="text-2xl text-gray-300">게임을 더욱 특별하게 만들어줄 아이템들</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-4 mb-12">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedCategory === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedCategory('theme')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            selectedCategory === 'theme'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <Gamepad2 className="w-4 h-4"/>
                        맵 테마
                    </button>
                    <button
                        onClick={() => setSelectedCategory('tool')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            selectedCategory === 'tool'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <Shield className="w-4 h-4"/>
                        도구
                    </button>
                    <button
                        onClick={() => setSelectedCategory('skin')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            selectedCategory === 'skin'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <Star className="w-4 h-4"/>
                        캐릭터 스킨
                    </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-4 gap-6 mb-32">
                    {filteredItems.map((item) => (
                        <div key={item.id}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all group">
                            <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                                {item.image}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                            <div className="flex items-center justify-between">
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4"/>
                    {item.price}
                </span>
                                <button
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4"/>
                                    구매
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}