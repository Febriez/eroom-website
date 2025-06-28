'use client'

import {Bug, Calendar, Sparkles, Users, Zap, ArrowLeft, Rocket, ClipboardCheck} from 'lucide-react'
import Link from 'next/link'
import {useParams} from 'next/navigation'

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

export default function PatchNotePage() {
    const params = useParams()
    const version = params.version as string

    // 실제 애플리케이션에서는 API에서 패치 노트 데이터를 가져오거나 데이터베이스에서 조회할 수 있습니다.
    // 여기서는 예시 데이터를 사용합니다.
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
        },
        {
            version: "0.7.0",
            date: "2025.06.25",
            type: "minor",
            title: "Beta v0.7 업데이트",
            description: "베타 버전 0.7 업데이트가 배포되었습니다.",
            features: [
                "BGM 및 나레이션 기능 추가",
                "프롬프트 엔지니어링으로 응답속도 개선 및 토큰 절약",
                "SHAP-E FastAPI 앱 객체 캐싱 및 프롬프트 정규화"
            ],
            improvements: [
                "서버 문서화 작업 (Wiki, Docs 분류)",
                "LLM 응답 스크립트 코드 포맷 오류 방지",
                "5% 확률 C# 코드 필드 변수형 오류 예외처리 추가"
            ],
            icon: <Zap className="w-6 h-6"/>
        },
        {
            version: "0.6.0",
            date: "2025.06.23",
            type: "minor",
            title: "Beta v0.6 업데이트",
            description: "베타 버전 0.6 업데이트가 배포되었습니다.",
            features: [
                "클로드 모델 성능 수치 비교 분석",
                "데코 오브젝트 인터렉션 추가",
                "Google 로그인 로딩 부분 수정"
            ],
            improvements: [
                "Unity 프로젝트 폴더구조 리팩토링",
                "Shap-e 모델 texture, materials 적용"
            ],
            bugfixes: [
                "로컬환경 Firebase.json 파일 인식 문제 해결",
                "무한 로딩 이슈 수정"
            ],
            icon: <Bug className="w-6 h-6"/>
        },
        {
            version: "0.5.0",
            date: "2025.06.20",
            type: "minor",
            title: "Beta v0.5 업데이트",
            description: "베타 버전 0.5 업데이트가 배포되었습니다.",
            features: [
                "방탈출용 오브젝트 Interact 기능 추가",
                "생성 오브젝트 상호작용 기능 (회전, 스케일, 하이라이트)",
                "텍스트-3D 생성 파이프라인 비교 분석"
            ],
            improvements: [
                "별점 시스템 UI 구현"
            ],
            bugfixes: [
                "FBX 머터리얼 호출 문제 해결",
                "Vercel 웹배포 404/500 오류 수정"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        },
        {
            version: "0.4.0",
            date: "2025.06.11",
            type: "minor",
            title: "Alpha v0.4 업데이트",
            description: "알파 버전 0.4 업데이트가 배포되었습니다.",
            features: [
                "방탈출 오브젝트 UI 썸네일 기능",
                "PyCharm & FastAPI Google Drive 연동",
                "Firestore 실제 방 구현 데이터 업로드"
            ],
            improvements: [
                "API 키 환경 변수 설정"
            ],
            bugfixes: [
                "Converter 오류 및 초기화 문제 해결"
            ],
            icon: <Bug className="w-6 h-6"/>
        },
        {
            version: "0.3.0",
            date: "2025.06.09",
            type: "minor",
            title: "Alpha v0.3 업데이트",
            description: "알파 버전 0.3 업데이트가 배포되었습니다.",
            features: [
                "런타임 중 오브젝트 호출 및 스크립트 생성 기능",
                "Server Response 변경으로 클라이언트 구조 개선",
                "REGEX를 통한 스크립트 컴파일 문제 해결"
            ],
            improvements: [
                "Nuget Package Code.Analysis.CSharp 추가",
                "RuntimeComplier 클래스 구현"
            ],
            icon: <Zap className="w-6 h-6"/>
        },
        {
            version: "0.2.0",
            date: "2025.06.05",
            type: "minor",
            title: "Alpha v0.2 업데이트",
            description: "알파 버전 0.2 업데이트가 배포되었습니다.",
            features: [
                "FBX 파일 런타임 호출 (TriLib 2 라이브러리)",
                "Unity HDRP 환경 설정",
                "방탈출 맵 제작 씬 작업"
            ],
            improvements: [
                "방 리스트 UI 개선"
            ],
            bugfixes: [
                "HDRP 머터리얼 사라짐 현상 해결"
            ],
            icon: <Bug className="w-6 h-6"/>
        },
        {
            version: "0.1.0",
            date: "2025.05.30",
            type: "minor",
            title: "Alpha v0.1 업데이트",
            description: "알파 버전 0.1 업데이트가 배포되었습니다.",
            features: [
                "LLM 프롬프트 작성 완료",
                "모델 작동 시간 단축 (알고리즘 수정)",
                "Unity 방목록 구현"
            ],
            improvements: [
                "클라이언트 매니저 클래스 정리",
                "프로젝트 빌드 및 테스트 환경 구성"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        },
        {
            version: "0.0.1",
            date: "2025.05.22",
            type: "minor",
            title: "프로젝트 시작",
            description: "이룸(Eroom) 프로젝트가 시작되었습니다.",
            features: [
                "팀 구성: 2조_방탈소년단",
                "프로젝트명 확정: 이룸(Eroom)",
                "기술 스택 선정: Shap-E, Claude Sonnet 4, Instant3D AI (meshy.ai)"
            ],
            improvements: [
                "개발 환경 구축 및 역할 분담 완료"
            ],
            icon: <Sparkles className="w-6 h-6"/>
        }
    ]

    const currentPatch = allPatchNotes.find(note => note.version === version)

    if (!currentPatch) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">패치 노트를 찾을 수 없습니다</h1>
                    <Link href="/news/updates" className="text-green-500 hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        모든 패치 노트로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

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

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'major':
                return '메이저 업데이트'
            case 'minor':
                return '마이너 업데이트'
            case 'hotfix':
                return '핫픽스'
            default:
                return '업데이트'
        }
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <Link href="/news/updates" className="text-green-500 hover:underline flex items-center gap-2 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        모든 패치 노트
                    </Link>

                    <div className="flex items-center gap-4 mb-2">
                        <span className={`px-4 py-1 bg-gradient-to-r ${getTypeColor(currentPatch.type)} rounded-full text-sm font-bold`}>
                            {getTypeBadge(currentPatch.type)}
                        </span>
                        <span className="text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4"/>
                            {currentPatch.date}
                        </span>
                    </div>

                    <h1 className="text-6xl font-black mb-6">
                        v{currentPatch.version} - {currentPatch.title}
                    </h1>

                    <p className="text-2xl text-gray-300 mb-12">{currentPatch.description}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 mb-16">
                    <div className="space-y-12">
                        {currentPatch.features && (
                            <div>
                                <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                                    <Sparkles className="w-6 h-6"/>
                                    새로운 기능
                                </h3>
                                <ul className="space-y-4">
                                    {currentPatch.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-xl">
                                            <span className="text-green-500 mt-1 text-2xl">+</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentPatch.improvements && (
                            <div>
                                <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                                    <Zap className="w-6 h-6"/>
                                    개선사항
                                </h3>
                                <ul className="space-y-4">
                                    {currentPatch.improvements.map((improvement, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-xl">
                                            <span className="text-blue-500 mt-1 text-2xl">•</span>
                                            <span>{improvement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentPatch.bugfixes && (
                            <div>
                                <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                                    <Bug className="w-6 h-6"/>
                                    버그 수정
                                </h3>
                                <ul className="space-y-4">
                                    {currentPatch.bugfixes.map((fix, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-xl">
                                            <span className="text-orange-500 mt-1 text-2xl">-</span>
                                            <span>{fix}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mb-32">
                    <Link href="/news/updates" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all duration-300">
                        <ArrowLeft className="w-6 h-6"/>
                        모든 업데이트 보기
                    </Link>
                </div>
            </div>
        </div>
    )
}
