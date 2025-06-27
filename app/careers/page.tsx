'use client'

import {Briefcase, Check, Code, Coffee, Gamepad2, Heart, MapPin, Monitor, Palette, Users} from 'lucide-react'
import {useState} from 'react'

export default function CareersPage() {
    const [selectedTeam, setSelectedTeam] = useState('all')

    const positions = [
        {
            id: 1,
            title: "Senior AI Engineer",
            team: "engineering",
            type: "정규직",
            location: "서울",
            experience: "5년 이상",
            description: "GPT-4 기반 게임 AI 시스템 개발",
            requirements: ["딥러닝 프레임워크 경험", "Python/C++ 능숙", "게임 개발 경험 우대"]
        },
        {
            id: 2,
            title: "Unity Game Developer",
            team: "engineering",
            type: "정규직",
            location: "서울",
            experience: "3년 이상",
            description: "EROOM 클라이언트 개발 및 최적화",
            requirements: ["Unity 3D 개발 경험", "멀티플레이어 게임 개발", "성능 최적화 경험"]
        },
        {
            id: 3,
            title: "Game Designer",
            team: "design",
            type: "정규직",
            location: "서울",
            experience: "3년 이상",
            description: "AI 기반 퍼즐 및 게임플레이 디자인",
            requirements: ["퍼즐 게임 디자인 경험", "레벨 디자인 툴 사용", "창의적 문제 해결"]
        },
        {
            id: 4,
            title: "UI/UX Designer",
            team: "design",
            type: "정규직",
            location: "서울/원격",
            experience: "2년 이상",
            description: "게임 인터페이스 및 사용자 경험 디자인",
            requirements: ["Figma/Adobe XD 능숙", "게임 UI 디자인 경험", "프로토타이핑"]
        },
        {
            id: 5,
            title: "Community Manager",
            team: "marketing",
            type: "정규직",
            location: "원격",
            experience: "2년 이상",
            description: "글로벌 커뮤니티 관리 및 유저 소통",
            requirements: ["영어 능통", "SNS 운영 경험", "게임 커뮤니티 이해"]
        }
    ]

    const benefits = [
        {icon: <Coffee className="w-6 h-6"/>, title: "자유로운 근무", desc: "재택근무 및 유연근무제"},
        {icon: <Heart className="w-6 h-6"/>, title: "건강한 삶", desc: "건강검진 및 의료비 지원"},
        {icon: <Gamepad2 className="w-6 h-6"/>, title: "게임 지원", desc: "게임 구매비 및 장비 지원"},
        {icon: <Users className="w-6 h-6"/>, title: "성장 기회", desc: "교육비 지원 및 컨퍼런스 참가"}
    ]

    const culture = [
        {
            title: "실패를 두려워하지 않는 문화",
            description: "새로운 시도와 실험을 장려하며, 실패에서 배우는 것을 중요하게 생각합니다."
        },
        {
            title: "수평적인 조직 문화",
            description: "직급에 관계없이 자유롭게 의견을 나누고, 서로를 존중합니다."
        },
        {
            title: "워라밸 중시",
            description: "일과 삶의 균형을 중요하게 생각하며, 개인의 시간을 존중합니다."
        },
        {
            title: "지속적인 학습",
            description: "끊임없이 배우고 성장하는 것을 지원합니다."
        }
    ]

    const filteredPositions = selectedTeam === 'all'
        ? positions
        : positions.filter(pos => pos.team === selectedTeam)

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        Join Our Team
                    </h1>
                    <p className="text-3xl text-gray-300 mb-4">게임의 미래를 함께 만들어갈 인재를 찾습니다</p>
                    <p className="text-xl text-gray-400">BangtalBoyBand에서 당신의 열정을 펼쳐보세요</p>
                </div>

                {/* Benefits Section */}
                <div className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-12">왜 BangtalBoyBand인가?</h2>
                    <div className="grid grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-8 border border-gray-800 text-center hover:border-green-600/50 transition-all">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <div className="text-green-400">{benefit.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Culture Section */}
                <div className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-12">우리의 문화</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {culture.map((item, index) => (
                            <div key={index}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-8 border border-gray-800">
                                <h3 className="text-2xl font-bold mb-3 text-green-400">{item.title}</h3>
                                <p className="text-gray-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-12">채용 중인 포지션</h2>

                    {/* Filter */}
                    <div className="flex justify-center gap-4 mb-12">
                        <button
                            onClick={() => setSelectedTeam('all')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                selectedTeam === 'all' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setSelectedTeam('engineering')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                selectedTeam === 'engineering' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            <Code className="w-4 h-4"/>
                            엔지니어링
                        </button>
                        <button
                            onClick={() => setSelectedTeam('design')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                selectedTeam === 'design' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            <Palette className="w-4 h-4"/>
                            디자인
                        </button>
                        <button
                            onClick={() => setSelectedTeam('marketing')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                selectedTeam === 'marketing' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            <Briefcase className="w-4 h-4"/>
                            마케팅
                        </button>
                    </div>

                    {/* Positions List */}
                    <div className="space-y-6">
                        {filteredPositions.map((position) => (
                            <div key={position.id}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 hover:border-green-600/50 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-3">{position.title}</h3>
                                        <div className="flex items-center gap-6 text-gray-400 mb-4">
                                            <span className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4"/>
                                                {position.type}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4"/>
                                                {position.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Monitor className="w-4 h-4"/>
                                                {position.experience}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-4">{position.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {position.requirements.map((req, idx) => (
                                                <span key={idx}
                                                      className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg text-sm">
                                                    <Check className="w-3 h-3 text-green-400"/>
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors ml-8">
                                        지원하기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Process */}
                <div className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-12">채용 프로세스</h2>
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                        {['서류 전형', '1차 면접', '과제 전형', '2차 면접', '최종 합격'].map((step, index) => (
                            <div key={index} className="flex items-center">
                                <div className="text-center">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-xl font-bold mb-3">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-gray-400">{step}</p>
                                </div>
                                {index < 4 && (
                                    <div className="w-20 h-1 bg-gray-800 mx-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div
                    className="text-center bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-16 border border-green-800/50 mb-16">
                    <h2 className="text-4xl font-bold mb-6">원하는 포지션이 없나요?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        열정적인 인재는 언제나 환영합니다. 자유롭게 지원해주세요!
                    </p>
                    <a href="mailto:careers@bangtalboyband.com"
                       className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105">
                        careers@bangtalboyband.com
                    </a>
                </div>
            </div>
        </div>
    )
}