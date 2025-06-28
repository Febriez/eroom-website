'use client'

import {Bug, Calendar, Sparkles, Users, Zap} from 'lucide-react'
import {useState} from 'react'

interface PatchNote {
    version: string
    date: string
    type: 'major' | 'minor' | 'hotfix'
    title: string
    description: string
    features?: string[]
    improvements?: string[]
    bugfixes?: string[]
    icon: React.ReactNode
}

export default function UpdatesPage() {
    const [selectedType, setSelectedType] = useState<string>('all')

    const allPatchNotes: PatchNote[] = [
        {
            version: "1.0.0",
            date: "2025.07.07",
            type: "major",
            title: "이룸(Eroom) 정식 출시",
            description: "이룸(Eroom) 방탈출 게임이 정식 출시되었습니다.",
            features: [
                "AI 기반 방탈출 맵 자동 생성 플랫폼 정식 출시",
                "Shap-E, Claude Sonnet 4를 활용한 3D 오브젝트 및 시나리오 자동 생성",
                "Unity 기반 실시간 방탈출 게임 플레이 지원"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        },
        {
            version: "0.9.0",
            date: "2025.06.28",
            type: "minor",
            title: "Beta v0.9 업데이트",
            description: "베타 버전 0.9 업데이트가 배포되었습니다.",
            features: [
                "키워드&입력 버튼 UI 생성",
                "프로젝트 웹사이트 제작",
                "클라이언트 플레이씬 구현 및 코드 리팩토링"
            ],
            improvements: [
                "파이어베이스 콜렉션 경로 변경",
                "효과음 모델 비교 및 선정",
                "Eroom 결제(크레딧 구매) 연동 완료"
            ],
            bugfixes: [
                "Firebase 연동 오류 수정",
                "코드 정리 및 디버깅 메시지 최적화"
            ],
            icon: <Users className="w-6 h-6"/>
        },
        {
            version: "0.8.0",
            date: "2025.06.26",
            type: "minor",
            title: "Beta v0.8 업데이트",
            description: "베타 버전 0.8 업데이트가 배포되었습니다.",
            features: [
                "실제 게임 컴포넌트와 roomsave 메서드 연동",
                "로딩창 팁 메시지 동적 변경 기능",
                "방생성 로컬/서버 저장 기능 구현"
            ],
            improvements: [
                "룸데이터 연결 작업 완료",
                "크레딧 버튼 결제창 연동"
            ],
            bugfixes: [
                "Unity와 Firestore 프로퍼티 연동 문제 해결",
                "JSON 파일 저장 시 무결성 검증 추가"
            ],
            icon: <Bug className="w-6 h-6"/>
        }
    ]

    const filteredNotes = selectedType === 'all'
        ? allPatchNotes
        : allPatchNotes.filter(note => note.type === selectedType)

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'major':
                return 'from-green-600 to-emerald-600'
            case 'minor':
                return 'from-blue-600 to-cyan-600'
            case 'hotfix':
                return 'from-orange-600 to-amber-600'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        패치 노트
                    </h1>
                    <p className="text-2xl text-gray-300">EROOM의 모든 업데이트 내역을 확인하세요</p>
                </div>

                {/* Filter */}
                <div className="flex gap-4 mb-12">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedType('major')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'major'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        메이저
                    </button>
                    <button
                        onClick={() => setSelectedType('minor')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'minor'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        마이너
                    </button>
                    <button
                        onClick={() => setSelectedType('hotfix')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            selectedType === 'hotfix'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        핫픽스
                    </button>
                </div>

                {/* Patch Notes */}
                <div className="space-y-8 mb-32">
                    {filteredNotes.map((note, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800"
                        >
                            <div className="flex items-start gap-6 mb-8">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(note.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    {note.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h2 className="text-3xl font-bold">v{note.version} - {note.title}</h2>
                                        <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/>
                                            {note.date}
                    </span>
                                    </div>
                                    <p className="text-gray-400 text-lg">{note.description}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {note.features && (
                                    <div>
                                        <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5"/>
                                            새로운 기능
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-green-500 mt-1">+</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {note.improvements && (
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                                            <Zap className="w-5 h-5"/>
                                            개선사항
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.improvements.map((improvement, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {note.bugfixes && (
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                                            <Bug className="w-5 h-5"/>
                                            버그 수정
                                        </h3>
                                        <ul className="space-y-2">
                                            {note.bugfixes.map((fix, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-orange-500 mt-1">-</span>
                                                    <span>{fix}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}