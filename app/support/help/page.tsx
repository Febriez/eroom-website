'use client'

import {ChevronRight, FileText, HelpCircle, Mail, MessageCircle, Phone, Search} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'

export default function HelpPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const faqs = [
        {
            category: 'account',
            question: "계정을 어떻게 만드나요?",
            answer: "게임을 처음 실행하면 계정 생성 화면이 나타납니다. 이메일 주소와 비밀번호를 입력하고, 닉네임을 설정하면 계정이 생성됩니다."
        },
        {
            category: 'game',
            question: "AI가 생성한 맵이 너무 어려워요",
            answer: "설정 메뉴에서 난이도를 조절할 수 있습니다. AI는 플레이어의 실력을 학습하여 자동으로 난이도를 조절하지만, 수동 설정도 가능합니다."
        },
        {
            category: 'technical',
            question: "게임이 실행되지 않아요",
            answer: "먼저 시스템 요구사항을 확인해주세요. 그래픽 드라이버를 최신 버전으로 업데이트하고, 바이러스 백신 프로그램에서 게임을 예외로 추가해보세요."
        },
        {
            category: 'payment',
            question: "크레딧은 어떻게 구매하나요?",
            answer: "게임 내 상점에서 크레딧을 구매할 수 있습니다. 신용카드, 페이팔, 문화상품권 등 다양한 결제 수단을 지원합니다."
        },
        {
            category: 'game',
            question: "친구와 함께 플레이하려면?",
            answer: "메인 메뉴에서 '멀티플레이'를 선택하고, 친구를 초대하거나 친구의 방에 참가할 수 있습니다. 최대 4명까지 함께 플레이 가능합니다."
        }
    ]

    const categories = [
        {id: 'all', name: '전체', icon: <HelpCircle className="w-4 h-4"/>},
        {id: 'account', name: '계정', icon: <MessageCircle className="w-4 h-4"/>},
        {id: 'game', name: '게임플레이', icon: <MessageCircle className="w-4 h-4"/>},
        {id: 'technical', name: '기술 지원', icon: <MessageCircle className="w-4 h-4"/>},
        {id: 'payment', name: '결제', icon: <MessageCircle className="w-4 h-4"/>}
    ]

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        고객센터
                    </h1>
                    <p className="text-2xl text-gray-300">무엇을 도와드릴까요?</p>
                </div>

                {/* Search */}
                <div className="relative mb-12">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6"/>
                    <input
                        type="text"
                        placeholder="질문을 검색하세요..."
                        className="w-full pl-14 pr-4 py-5 bg-gray-900 rounded-xl border border-gray-800 focus:border-green-600 transition-colors text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-4 gap-6 mb-16">
                    <Link href="/support/download"
                          className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all text-center group">
                        <FileText
                            className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                        <h3 className="font-semibold mb-2">다운로드</h3>
                        <p className="text-sm text-gray-400">게임 다운로드 및 설치</p>
                    </Link>

                    <Link href="/support/requirements"
                          className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all text-center group">
                        <FileText
                            className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                        <h3 className="font-semibold mb-2">시스템 요구사항</h3>
                        <p className="text-sm text-gray-400">필요한 PC 사양 확인</p>
                    </Link>

                    <Link href="/community/guides"
                          className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all text-center group">
                        <FileText
                            className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                        <h3 className="font-semibold mb-2">게임 가이드</h3>
                        <p className="text-sm text-gray-400">플레이 팁과 공략</p>
                    </Link>

                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all text-center group cursor-pointer">
                        <MessageCircle
                            className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                        <h3 className="font-semibold mb-2">실시간 채팅</h3>
                        <p className="text-sm text-gray-400">상담원과 대화하기</p>
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="flex gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                selectedCategory === category.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {category.icon}
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4 mb-16">
                    {filteredFaqs.map((faq, index) => (
                        <details key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl border border-gray-800 hover:border-green-600/50 transition-all group">
                            <summary className="p-6 cursor-pointer flex items-center justify-between">
                                <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                                <ChevronRight
                                    className="w-5 h-5 text-gray-400 transform group-open:rotate-90 transition-transform"/>
                            </summary>
                            <div className="px-6 pb-6">
                                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>

                {/* Contact Options */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 mb-32">
                    <h2 className="text-3xl font-bold mb-8 text-center">추가 도움이 필요하신가요?</h2>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="text-center">
                            <Mail className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">이메일 문의</h3>
                            <p className="text-gray-400 mb-4">24시간 내 답변</p>
                            <a href="mailto:support@bangtalboyband.com" className="text-green-400 hover:text-green-300">
                                support@bangtalboyband.com
                            </a>
                        </div>

                        <div className="text-center">
                            <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">실시간 채팅</h3>
                            <p className="text-gray-400 mb-4">평일 09:00 - 18:00</p>
                            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                                채팅 시작
                            </button>
                        </div>

                        <div className="text-center">
                            <Phone className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">전화 상담</h3>
                            <p className="text-gray-400 mb-4">평일 10:00 - 17:00</p>
                            <p className="text-green-400">02-1234-5678</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}