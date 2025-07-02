'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {CheckCircle, Circle, Clock, Rocket, Star, Target, TrendingUp, Zap} from 'lucide-react'
import React from "react";

interface RoadmapItem {
    quarter: string
    year: string
    status: 'completed' | 'in-progress' | 'planned'
    features: {
        title: string
        description: string
        icon: React.ReactNode
        completed?: boolean
    }[]
}

export default function RoadmapPage() {
    const roadmapData: RoadmapItem[] = [
        {
            quarter: 'Q1',
            year: '2025',
            status: 'completed',
            features: [
                {
                    title: '정식 출시',
                    description: 'EROOM 게임 정식 버전 출시 및 안정화',
                    icon: <Rocket className="w-5 h-5"/>,
                    completed: true
                },
                {
                    title: '멀티플레이 시스템',
                    description: '최대 4인 실시간 협동 플레이 지원',
                    icon: <Star className="w-5 h-5"/>,
                    completed: true
                }
            ]
        },
        {
            quarter: 'Q2',
            year: '2025',
            status: 'in-progress',
            features: [
                {
                    title: 'AI 맵 에디터 2.0',
                    description: '더욱 강력해진 AI 기반 맵 생성 도구',
                    icon: <Zap className="w-5 h-5"/>,
                    completed: false
                },
                {
                    title: '시즌 2 업데이트',
                    description: '새로운 테마와 보상 시스템 도입',
                    icon: <TrendingUp className="w-5 h-5"/>,
                    completed: false
                }
            ]
        },
        {
            quarter: 'Q3',
            year: '2025',
            status: 'planned',
            features: [
                {
                    title: '모바일 버전',
                    description: 'iOS/Android 플랫폼 지원',
                    icon: <Target className="w-5 h-5"/>,
                    completed: false
                },
                {
                    title: '글로벌 토너먼트',
                    description: '전 세계 플레이어들과 경쟁하는 대회 시스템',
                    icon: <Star className="w-5 h-5"/>,
                    completed: false
                }
            ]
        },
        {
            quarter: 'Q4',
            year: '2025',
            status: 'planned',
            features: [
                {
                    title: 'VR 모드',
                    description: '가상현실에서의 몰입감 있는 방탈출 경험',
                    icon: <Rocket className="w-5 h-5"/>,
                    completed: false
                },
                {
                    title: '크리에이터 수익화',
                    description: '맵 제작자를 위한 수익 창출 시스템',
                    icon: <TrendingUp className="w-5 h-5"/>,
                    completed: false
                }
            ]
        }
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="success">완료</Badge>
            case 'in-progress':
                return <Badge variant="warning">진행 중</Badge>
            case 'planned':
                return <Badge variant="info">예정</Badge>
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-green-600 bg-green-900/10'
            case 'in-progress':
                return 'border-yellow-600 bg-yellow-900/10'
            case 'planned':
                return 'border-blue-600 bg-blue-900/10'
            default:
                return ''
        }
    }

    return (
        <>
            <PageHeader
                title="개발 로드맵"
                description="EROOM의 미래를 함께 만들어갑니다"
                badge="2025"
                icon={<Target className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 소개 카드 */}
                <Card className="p-8 mb-12 bg-gradient-to-br from-purple-900/20 to-purple-800/20">
                    <div className="flex items-start gap-4">
                        <Clock className="w-8 h-8 text-purple-400 flex-shrink-0"/>
                        <div>
                            <h2 className="text-xl font-bold mb-3">EROOM의 여정</h2>
                            <p className="text-gray-300 mb-4">
                                우리는 플레이어 여러분의 피드백을 바탕으로 지속적으로 발전하고 있습니다.
                                아래 로드맵은 앞으로의 계획을 보여주며, 상황에 따라 유동적으로 변경될 수 있습니다.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400"/>
                                    <span>완료된 기능</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-yellow-400"/>
                                    <span>개발 중</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-blue-400"/>
                                    <span>예정된 기능</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 타임라인 */}
                <div className="relative">
                    {/* 중앙 라인 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-800"></div>

                    {/* 로드맵 아이템 */}
                    <div className="space-y-12">
                        {roadmapData.map((item, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${
                                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                                }`}
                            >
                                {/* 타임라인 포인트 */}
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full z-10"></div>

                                {/* 콘텐츠 카드 */}
                                <Card
                                    className={`w-full md:w-5/12 p-6 ${getStatusColor(item.status)} ${
                                        index % 2 === 0 ? 'mr-auto md:mr-8' : 'ml-auto md:ml-8'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold">{item.quarter}</h3>
                                            <span className="text-gray-400">{item.year}</span>
                                        </div>
                                        {getStatusBadge(item.status)}
                                    </div>

                                    <div className="space-y-4">
                                        {item.features.map((feature, featureIndex) => (
                                            <div
                                                key={featureIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <div className={`p-2 rounded-lg flex-shrink-0 ${
                                                    feature.completed
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : 'bg-gray-800 text-gray-400'
                                                }`}>
                                                    {feature.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                                                    <p className="text-sm text-gray-400">{feature.description}</p>
                                                </div>
                                                {feature.completed && (
                                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0"/>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 추가 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <Card className="p-6 text-center">
                        <div
                            className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-green-400"/>
                        </div>
                        <h3 className="font-bold mb-2">12+ 기능 완료</h3>
                        <p className="text-sm text-gray-400">
                            출시 이후 지속적인 업데이트
                        </p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div
                            className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-6 h-6 text-yellow-400"/>
                        </div>
                        <h3 className="font-bold mb-2">4개 기능 개발 중</h3>
                        <p className="text-sm text-gray-400">
                            현재 활발히 개발 진행 중
                        </p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div
                            className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-blue-400"/>
                        </div>
                        <h3 className="font-bold mb-2">8+ 기능 예정</h3>
                        <p className="text-sm text-gray-400">
                            향후 추가될 흥미로운 기능들
                        </p>
                    </Card>
                </div>

                {/* CTA 섹션 */}
                <Card className="p-8 mt-12 text-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <h2 className="text-2xl font-bold mb-4">여러분의 의견을 들려주세요!</h2>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        EROOM의 미래는 플레이어 여러분과 함께 만들어갑니다.
                        추가되었으면 하는 기능이나 개선사항이 있다면 언제든지 제안해주세요.
                    </p>
                    <button
                        onClick={() => window.location.href = '/support/inquiry'}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                        제안하기
                    </button>
                </Card>
            </Container>
        </>
    )
}