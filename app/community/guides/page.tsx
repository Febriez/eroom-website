'use client'

import {Book, Clock, FileText, Search, Star, User, Video} from 'lucide-react'
import {useState} from 'react'

export default function GuidesPage() {
    const [selectedType, setSelectedType] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const guides = [
        {
            id: 1,
            title: "초보자를 위한 EROOM 완벽 가이드",
            author: "GameMaster",
            type: "text",
            difficulty: "초급",
            rating: 4.9,
            views: 45320,
            duration: "15분 읽기",
            tags: ["초보자", "기본", "튜토리얼"]
        },
        {
            id: 2,
            title: "고급 퍼즐 해결 전략",
            author: "PuzzleExpert",
            type: "video",
            difficulty: "고급",
            rating: 4.7,
            views: 23410,
            duration: "25분 영상",
            tags: ["고급", "전략", "팁"]
        },
        {
            id: 3,
            title: "맵 에디터 마스터하기",
            author: "CreatorPro",
            type: "text",
            difficulty: "중급",
            rating: 4.8,
            views: 31205,
            duration: "20분 읽기",
            tags: ["맵 제작", "에디터", "창작"]
        },
        {
            id: 4,
            title: "협동 플레이 필수 팁 10가지",
            author: "TeamPlayer",
            type: "video",
            difficulty: "중급",
            rating: 4.6,
            views: 18902,
            duration: "18분 영상",
            tags: ["멀티플레이", "협동", "소통"]
        }
    ]

    const filteredGuides = guides.filter(guide => {
        const matchesType = selectedType === 'all' || guide.type === selectedType
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
        return matchesType && matchesSearch
    })

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case '초급':
                return 'text-green-400 bg-green-900/30'
            case '중급':
                return 'text-yellow-400 bg-yellow-900/30'
            case '고급':
                return 'text-red-400 bg-red-900/30'
            default:
                return 'text-gray-400 bg-gray-900/30'
        }
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        게임 가이드
                    </h1>
                    <p className="text-2xl text-gray-300">전문가들이 공유하는 EROOM 공략법</p>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-12">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="가이드 검색..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 rounded-xl border border-gray-800 focus:border-green-600 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedType('all')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                selectedType === 'all' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setSelectedType('text')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                selectedType === 'text' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            <FileText className="w-4 h-4"/>
                            텍스트
                        </button>
                        <button
                            onClick={() => setSelectedType('video')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                selectedType === 'video' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            <Video className="w-4 h-4"/>
                            비디오
                        </button>
                    </div>
                </div>

                {/* Guides List */}
                <div className="space-y-6 mb-32">
                    {filteredGuides.map((guide) => (
                        <div key={guide.id}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 hover:border-green-600/50 transition-all">
                            <div className="flex items-start gap-8">
                                <div
                                    className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {guide.type === 'text' ? (
                                        <Book className="w-10 h-10 text-green-400"/>
                                    ) : (
                                        <Video className="w-10 h-10 text-green-400"/>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h3 className="text-2xl font-bold hover:text-green-400 transition-colors cursor-pointer">
                                            {guide.title}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                                    </div>

                                    <div className="flex items-center gap-6 text-gray-400 mb-4">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4"/>
                        {guide.author}
                    </span>
                                        <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4"/>
                                            {guide.duration}
                    </span>
                                        <span className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500"/>
                                            {guide.rating}
                    </span>
                                        <span>{guide.views.toLocaleString()} 조회</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {guide.tags.map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                        #{tag}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
                                    보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}