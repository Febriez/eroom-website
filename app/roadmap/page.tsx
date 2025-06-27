'use client'

import { useState } from 'react'
import { ChevronRight, Circle, CheckCircle2, Clock, Sparkles, Shield, MessageSquare, User } from 'lucide-react'

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState<number>(1)

  const phases = [
    {
      id: 1,
      title: '알파 릴리즈',
      status: 'completed',
      date: '2025년 5월',
      features: [
        { name: '회원가입 및 소셜 로그인', completed: true },
        { name: '기본 프로필 시스템', completed: true },
        { name: '친구 시스템 및 팔로우 기능', completed: true },
        { name: '알림 시스템', completed: true },
        { name: '기본 UI/UX 구현', completed: true }
      ]
    },
    {
      id: 2,
      title: '베타 릴리즈',
      status: 'inProgress',
      date: '2025년 7월',
      features: [
        { name: '맵 에디터 기본 기능', completed: true },
        { name: '방탈출 게임 기본 구현', completed: true },
        { name: '유저 제작 맵 공유 시스템', completed: false },
        { name: '리더보드 및 랭킹 시스템', completed: false },
        { name: '업적 시스템', completed: false }
      ]
    },
    {
      id: 3,
      title: '정식 출시',
      status: 'upcoming',
      date: '2025년 9월',
      features: [
        { name: '고급 맵 에디터 기능', completed: false },
        { name: 'AI 기반 퍼즐 생성 시스템', completed: false },
        { name: '커스텀 아이템 및 스킨 샵', completed: false },
        { name: '시즌 패스 및 프리미엄 콘텐츠', completed: false },
        { name: '멀티플레이어 모드', completed: false }
      ]
    },
    {
      id: 4,
      title: '미래 확장',
      status: 'upcoming',
      date: '2025년 12월 이후',
      features: [
        { name: '모바일 앱 출시', completed: false },
        { name: 'VR/AR 지원', completed: false },
        { name: '확장 게임 모드 및 이벤트', completed: false },
        { name: '콘텐츠 크리에이터 프로그램', completed: false },
        { name: '글로벌 토너먼트 및 대회', completed: false }
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case 'inProgress':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'upcoming':
        return <Circle className="w-6 h-6 text-gray-500" />
      default:
        return <Circle className="w-6 h-6 text-gray-500" />
    }
  }

  const getPhaseColor = (status: string) => {
    switch(status) {
      case 'completed': return 'border-green-500 bg-green-500/10'
      case 'inProgress': return 'border-yellow-500 bg-yellow-500/10'
      case 'upcoming': return 'border-gray-500 bg-gray-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">개발 로드맵</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            BangtalBoyBand 개발 계획과 일정을 확인해보세요. 앞으로 추가될 기능과 개선 사항들을 소개합니다.
          </p>
        </div>

        {/* 단계 선택 탭 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${activePhase === phase.id 
                ? 'bg-green-500 text-black font-medium'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
            >
              {getStatusIcon(phase.status)}
              <span>{phase.title}</span>
            </button>
          ))}
        </div>

        {/* 현재 단계 상세 정보 */}
        {phases.map((phase) => phase.id === activePhase && (
          <div key={phase.id} className="grid md:grid-cols-5 gap-8">
            {/* 왼쪽: 단계 설명 */}
            <div className="md:col-span-2 space-y-6">
              <div className={`border-l-4 ${getPhaseColor(phase.status)} pl-4 py-2`}>
                <h2 className="text-3xl font-bold mb-2">{phase.title}</h2>
                <div className="flex items-center gap-2 text-lg">
                  {getStatusIcon(phase.status)}
                  <span className="text-gray-400">{phase.date}</span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  주요 기능
                </h3>
                <ul className="space-y-3">
                  {phase.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.completed 
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                        : <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                      <span className={feature.completed ? 'text-white' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {phase.id === 2 && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                    <Clock className="w-5 h-5" />
                    현재 단계
                  </h3>
                  <p className="text-gray-300">
                    저희 팀은 현재 베타 릴리즈를 위해 열심히 개발 중입니다. 곧 더 많은 기능이 추가될 예정이니 기대해 주세요!
                  </p>
                </div>
              )}
            </div>

            {/* 오른쪽: 단계별 상세 내용 */}
            <div className="md:col-span-3 space-y-6">
              {phase.id === 1 && (
                <>
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      알파 릴리즈 완료
                    </h3>
                    <p className="text-gray-400 mb-4">
                      알파 릴리즈 단계에서는 BangtalBoyBand의 기본 기능과 인프라를 구축했습니다. 회원 시스템, 프로필, 친구 기능 등 기본적인 소셜 기능이 구현되었습니다.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                        <User className="w-8 h-8 text-green-400 bg-green-400/10 p-1.5 rounded-lg" />
                        <div>
                          <p className="text-sm text-gray-400">사용자</p>
                          <p className="font-semibold">1,000+</p>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-green-400 bg-green-400/10 p-1.5 rounded-lg" />
                        <div>
                          <p className="text-sm text-gray-400">피드백</p>
                          <p className="font-semibold">250+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {phase.id === 2 && (
                <>
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      베타 릴리즈 진행 중
                    </h3>
                    <p className="text-gray-400 mb-4">
                      베타 릴리즈에서는 AI 기반 방탈출 게임의 핵심 기능을 구현하고 있습니다. 맵 에디터와 기본 게임 기능이 이미 구현되었으며, 현재 맵 공유 시스템과 랭킹 시스템을 개발 중입니다.
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                      <h4 className="font-medium mb-2">현재 작업 중인 기능:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>유저 제작 맵 업로드 및 공유 시스템</li>
                        <li>게임 클리어 시간 및 점수 기록 시스템</li>
                        <li>리더보드 및 랭킹 시스템</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {phase.id === 3 && (
                <>
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      정식 출시 준비 중
                    </h3>
                    <p className="text-gray-400 mb-4">
                      정식 출시에서는 고급 게임 기능과 수익 모델을 도입할 예정입니다. AI 기반 퍼즐 생성 시스템으로 무한한 게임 경험을 제공하고, 커스텀 아이템과 시즌 패스를 통해 다양한 콘텐츠를 즐길 수 있습니다.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-400">AI 기반 퍼즐</h4>
                        <p className="text-sm text-gray-400">인공지능이 자동으로 생성하는 다양한 퍼즐과 문제로 매번 새로운 경험을 제공합니다.</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-400">멀티플레이어</h4>
                        <p className="text-sm text-gray-400">친구들과 함께 방탈출 게임을 즐기며 협력하거나 경쟁할 수 있습니다.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {phase.id === 4 && (
                <>
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      미래 확장 계획
                    </h3>
                    <p className="text-gray-400 mb-4">
                      정식 출시 이후에는 플랫폼 확장과 글로벌 진출을 목표로 하고 있습니다. 모바일 앱 출시, VR/AR 지원, 콘텐츠 크리에이터 프로그램 등을 통해 더 넓은 사용자층에게 서비스를 제공할 계획입니다.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4">
                      <h4 className="font-medium mb-2 text-purple-400">비전</h4>
                      <p className="text-gray-400">
                        BangtalBoyBand는 단순한 게임을 넘어 소셜 크리에이티브 플랫폼으로 성장하는 것을 목표로 합니다. 유저들이 직접 콘텐츠를 만들고 공유하며 수익을 창출할 수 있는 생태계를 구축하고자 합니다.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4 mt-8">
                {phase.id < phases.length && (
                  <button 
                    onClick={() => setActivePhase(phase.id + 1)}
                    className="flex items-center gap-1 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    다음 단계 <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
