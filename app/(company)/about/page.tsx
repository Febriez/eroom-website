'use client'

import {useState} from 'react'
import {Brain, Key, Rocket, Shield, Sparkles, Users} from 'lucide-react'
import {Container} from '@/components/ui/Container'
import {PageHeader} from '@/components/layout/PageHeader'

const teamMembers = [
    {
        name: '김도형 (방탈소년단 리더)',
        role: 'CEO & Unity Engineer',
        description: 'AI와 게임의 만남을 꿈꾸는 기획자',
        avatar: '👨‍💼'
    },
    {
        name: '옥병준 (개발 총괄)',
        role: 'CTO & Lead Developer',
        description: '혁신적인 기술로 게임의 미래를 만드는 개발자',
        avatar: '👩‍💻'
    },
    {
        name: '우혜주 (디자인 총괄)',
        role: 'Art Director',
        description: '독특한 비주얼로 몰입감을 선사하는 아티스트',
        avatar: '🎨'
    },
    {
        name: '권채영 (페르소나 그 자체)',
        role: 'Model Engineer',
        description: '보는 사람을 놀랍게 만드는 shap-e 모델 엔지니어',
        avatar: '🤖'
    },
    {
        name: '한준희 (행복조)',
        role: 'Happy Engineer',
        description: '레크레이션 강사',
        avatar: '👻'
    },
    {
        name: '황혜원 (춘식이)',
        role: 'Microservices Developer',
        description: '춘식이.',
        avatar: '👾'
    }
]

const milestones = [
    {
        year: '2023',
        title: '방탈소년단 설립',
        description: 'AI 게임 스튜디오의 시작'
    },
    {
        year: '2024',
        title: 'EROOM 알파 버전 출시',
        description: '첫 번째 AI 방탈출 게임 공개'
    },
    {
        year: '2025',
        title: 'EROOM 정식 출시',
        description: '글로벌 유저들과 함께하는 AI 게임'
    },
    {
        year: '미래',
        title: '더 많은 AI 게임',
        description: '새로운 장르의 AI 게임들 준비 중'
    }
]

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('mission')

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <PageHeader
                title="About Us"
                description="AI가 만드는 새로운 게임의 미래"
                badge="BANGTALBOYBAND"
                icon={<Key className="w-5 h-5"/>}
            />

            <Container className="py-16">
                {/* 회사 소개 Hero */}
                <div className="text-center mb-16">
                    <div
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-6 transform rotate-12">
                        <Key className="w-12 h-12 text-white transform -rotate-12"/>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">방탈소년단</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
                                    방탈소년단은 AI 기술을 활용하여 무한한 가능성의 게임을 만듭니다.
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
                                    열정과 재능으로 가득한 방탈소년단 멤버들
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
                        방탈소년단와 함께 AI 게임의 새로운 역사를 써내려갈 인재를 찾고 있습니다
                    </p>
                    <button
                        onClick={() => window.location.href = '/careers'}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                        채용 정보 보기
                    </button>
                </div>
            </Container>
        </div>
    )
}