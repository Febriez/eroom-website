'use client'

import {useState} from 'react'
import {Brain, Key, Rocket, Shield, Sparkles, Users} from 'lucide-react'
import {Container} from '@/components/ui/Container'
import {PageHeader} from '@/components/layout/PageHeader'
import {CONSTANTS} from '@/lib/utils/constants'

const teamMembers = [
    {
        name: '김도형',
        role: '프론트엔드 개발자',
        description: 'EROOM의 첫인상을 책임지는 프론트엔드 개발자입니다. 최신 웹 기술을 활용하여 사용자가 EROOM의 세계를 쉽고 즐겁게 탐색할 수 있는 인터페이스를 구축합니다. 직관적이고 빠른 웹 경험을 제공하기 위해 항상 고민합니다',
        avatar: '👨‍💻'
    },
    {
        name: '우혜주',
        role: '프론트엔드 개발자',
        description: '플레이어의 상상력과 EROOM의 기술을 잇는 가장 중요한 관문을 만드는 개발자입니다. 코드를 통해 EROOM의 비전을 현실로 구현하고, 모든 사용자가 웹사이트에서부터 게임의 생동감을 느낄 수 있도록 하는 데 열정을 쏟고 있습니다.',
        avatar: '👩‍💻'
    },
    {
        name: '한준희',
        role: '프론트엔드 개발자',
        description: 'EROOM의 두뇌 역할을 하는 백엔드 시스템과 플레이어가 직접 마주하는 프론트엔드 사이의 견고한 다리를 놓는 개발자입니다. 복잡한 데이터를 안정적으로 전달하고, 양방향 통신을 완벽하게 구현하여 EROOM의 모든 기능이 유기적으로 작동하도록 만듭니다.',
        avatar: '🧑‍💻'
    },
    {
        name: '권채영',
        role: '3D 모델러',
        description: '플레이어가 탐험할 EROOM의 세계를 시각적으로 구현하는 아티스트입니다. 캐릭터, 소품, 배경 등 게임에 등장하는 모든 요소를 3D 모델링하여 가상 세계에 생동감과 현실감을 불어넣습니다. 상상 속의 공간을 눈앞의 현실로 만드는 일을 합니다.',
        avatar: '🎨'
    },
    {
        name: '옥병준',
        role: '백엔드 엔지니어',
        description: '보이지 않는 곳에서 EROOM의 모든 것을 움직이는 핵심 엔진을 만들고 관리합니다. 서버는 게임의 규칙을 실행하고, 모든 유저의 데이터를 안전하게 저장하며, 프론트엔드(웹사이트, 게임 클라이언트)에 필요한 정보를 빠르고 정확하게 전달하는 역할을 합니다. 플레이어들이 끊김 없이 안정적으로 EROOM의 세계에 몰입할 수 있도록, 서비스의 성능, 안정성, 보안을 책임지는 가장 중요한 기반을 구축합니다.',
        avatar: '🤖'
    },
    {
        name: '황혜원',
        role: '백엔드 엔지니어',
        description: 'EROOM의 상점과 결제 시스템을 설계하고 개발하여, 플레이어들이 안전하고 편리하게 상품을 구매할 수 있는 환경을 구축합니다. 민감한 금융 정보를 최고의 보안 수준으로 다루며, 단 하나의 오류도 없는 데이터 처리를 통해 사용자의 신뢰를 지킵니다. 원활한 구매 경험을 제공하여 플레이어들이 EROOM의 콘텐츠를 마음껏 즐길 수 있도록 돕습니다.',
        avatar: '👾'
    }
]

const milestones = [
    {
        year: '2025',
        title: '회사 설립',
        description: 'AI 기술과 인간의 창의력을 결합하여 세상에 없던 새로운 엔터테인먼트를 제공하겠다는 꿈을 안고, 주식회사 이룸(EROOM)이 공식 출범했습니다. 플레이할 때마다 살아 움직이는 듯한 새로운 방탈출, \'EROOM\'의 위대한 여정이 시작됩니다'
    }
]

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('mission')

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <PageHeader
                title="About Us"
                description="AI가 만드는 새로운 게임의 미래"
                badge={CONSTANTS.COMPANY.NAME}
                icon={<Key className="w-5 h-5"/>}
            />

            <Container className="py-16">
                {/* 회사 소개 Hero */}
                <div className="text-center mb-16">
                    <div
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-6 transform rotate-12">
                        <Key className="w-12 h-12 text-white transform -rotate-12"/>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{CONSTANTS.COMPANY.NAME}</h2>
                    <p className="text-xl text-gray-400 mb-4">{CONSTANTS.COMPANY.SLOGAN}</p>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        우리는 AI 기술과 창의적인 게임 디자인을 결합하여
                        플레이어에게 매번 새로운 경험을 선사하는 게임을 만듭니다.
                    </p>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-800 rounded-lg p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`px-6 py-3 rounded-md font-medium transition-all ${
                                activeTab === 'mission'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            미션
                        </button>
                        <button
                            onClick={() => setActiveTab('values')}
                            className={`px-6 py-3 rounded-md font-medium transition-all ${
                                activeTab === 'values'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            핵심 가치
                        </button>
                        <button
                            onClick={() => setActiveTab('team')}
                            className={`px-6 py-3 rounded-md font-medium transition-all ${
                                activeTab === 'team'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            팀
                        </button>
                    </div>
                </div>

                {/* 탭 콘텐츠 */}
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'mission' && (
                        <div className="space-y-16">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-6">우리의 미션</h3>
                                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                                    {CONSTANTS.COMPANY.NAME}은 AI 기술을 활용하여 무한한 가능성의 게임을 만듭니다.
                                    매번 플레이할 때마다 새로운 도전과 경험을 제공하며,
                                    플레이어의 창의성과 문제 해결 능력을 자극하는 게임을 개발합니다.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-gray-800 rounded-xl p-8 text-center">
                                    <Brain className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                                    <h4 className="text-xl font-bold mb-3">AI 혁신</h4>
                                    <p className="text-gray-400">
                                        최신 AI 기술로 끊임없이 진화하는 게임 경험
                                    </p>
                                </div>
                                <div className="bg-gray-800 rounded-xl p-8 text-center">
                                    <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                                    <h4 className="text-xl font-bold mb-3">무한한 창의성</h4>
                                    <p className="text-gray-400">
                                        플레이어의 상상력을 자극하는 독특한 게임플레이
                                    </p>
                                </div>
                                <div className="bg-gray-800 rounded-xl p-8 text-center">
                                    <Users className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                                    <h4 className="text-xl font-bold mb-3">커뮤니티 중심</h4>
                                    <p className="text-gray-400">
                                        플레이어와 함께 성장하는 게임 생태계
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'values' && (
                        <div className="space-y-12">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-6">핵심 가치</h3>
                                <p className="text-lg text-gray-300">
                                    우리가 추구하는 가치는 모든 결정의 기준이 됩니다
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div
                                        className="flex-shrink-0 w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center">
                                        <Rocket className="w-8 h-8 text-green-400"/>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-3">혁신</h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            기존의 게임 개발 방식에 안주하지 않고, AI 기술을 통해
                                            새로운 게임 경험을 창조합니다. 불가능을 가능으로 만드는
                                            도전 정신으로 게임 산업의 미래를 개척합니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div
                                        className="flex-shrink-0 w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center">
                                        <Shield className="w-8 h-8 text-green-400"/>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-3">신뢰</h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            플레이어와의 약속을 지키고, 투명한 소통을 통해
                                            신뢰받는 게임 스튜디오가 되고자 합니다. 공정한 게임 환경과
                                            안전한 커뮤니티를 만들어갑니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div
                                        className="flex-shrink-0 w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-green-400"/>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-3">재미</h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            게임의 본질은 재미입니다. 기술에만 매몰되지 않고,
                                            플레이어가 진정으로 즐길 수 있는 게임을 만듭니다.
                                            매 순간이 특별한 경험이 되도록 노력합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="space-y-12">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-6">우리 팀</h3>
                                <p className="text-lg text-gray-300">
                                    열정과 재능으로 가득한 {CONSTANTS.COMPANY.NAME} 멤버들
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {teamMembers.map((member, index) => (
                                    <div key={index} className="bg-gray-800 rounded-xl p-8 flex items-center gap-6">
                                        <div className="text-6xl">{member.avatar}</div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                                            <p className="text-green-400 mb-2">{member.role}</p>
                                            <p className="text-gray-400">{member.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 타임라인 */}
                <div className="mt-24">
                    <h3 className="text-3xl font-bold text-center mb-12">우리의 여정</h3>
                    <div className="relative">
                        <div
                            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`relative flex items-center mb-12 ${
                                index % 2 === 0 ? 'justify-start' : 'justify-end'
                            }`}>
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                    <div className="bg-gray-800 rounded-lg p-6">
                                        <span className="text-green-400 font-bold">{milestone.year}</span>
                                        <h4 className="text-xl font-bold mt-2">{milestone.title}</h4>
                                        <p className="text-gray-400 mt-2">{milestone.description}</p>
                                    </div>
                                </div>
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-24 py-16 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-2xl">
                    <h3 className="text-3xl font-bold mb-6">함께 미래를 만들어갈 당신을 기다립니다</h3>
                    <p className="text-lg text-gray-300 mb-8">
                        {CONSTANTS.COMPANY.NAME}과 함께 AI 게임의 새로운 역사를 써내려갈 인재를 찾고 있습니다
                    </p>
                    <button
                        onClick={() => window.location.href = '/company/careers'}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                        채용 정보 보기
                    </button>
                </div>
            </Container>
        </div>
    )
}