'use client'

import {Clock, Download, Heart, Search, Star} from 'lucide-react'
import {useState} from 'react'

export default function MapsPage() {
    const [filter, setFilter] = useState('popular')
    const [searchTerm, setSearchTerm] = useState('')

    const maps = [
        {
            id: 1,
            title: "사이버 도시 탈출",
            author: "NeonMaster",
            rating: 4.8,
            plays: 15420,
            likes: 3821,
            difficulty: "어려움",
            time: "45분",
            tags: ["사이버펑크", "퍼즐", "스토리"]
        },
        {
            id: 2,
            title: "마법사의 탑",
            author: "WizardKing",
            rating: 4.6,
            plays: 12350,
            likes: 2910,
            difficulty: "보통",
            time: "30분",
            tags: ["판타지", "마법", "모험"]
        },
        {
            id: 3,
            title: "우주선 수리공",
            author: "SpaceEngineer",
            rating: 4.9,
            plays: 18720,
            likes: 4523,
            difficulty: "매우 어려움",
            time: "60분",
            tags: ["SF", "기술", "생존"]
        }
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        커뮤니티 맵
                    </h1>
                    <p className="text-2xl text-gray-300">전 세계 플레이어들이 만든 창의적인 맵들</p>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-12">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="맵 검색..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 rounded-xl border border-gray-800 focus:border-green-600 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('popular')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'popular' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            인기순
                        </button>
                        <button
                            onClick={() => setFilter('recent')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'recent' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => setFilter('rating')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'rating' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            평점순
                        </button>
                    </div>
                </div>

                {/* Maps Grid */}
                <div className="grid grid-cols-3 gap-8 mb-32">
                    {maps.map((map) => (
                        <div key={map.id}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-green-600/50 transition-all group">
                            <div className="aspect-video bg-gradient-to-br from-green-900/20 to-black relative">
                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                                    <button className="px-6 py-3 bg-green-600 rounded-lg font-bold">플레이</button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{map.title}</h3>
                                <p className="text-gray-400 mb-4">제작: {map.author}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500"/>
                                        <span>{map.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-4 h-4 text-red-500"/>
                                        <span>{map.likes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400"/>
                                        <span>{map.time}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    {map.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                      {tag}
                    </span>
                                    ))}
                                </div>

                                <button
                                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4"/>
                                    다운로드
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}