'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Brain, Download, Globe, Key, Play, Shield, Sparkles, Star, Users, Zap} from 'lucide-react'
import Link from 'next/link'
import {useDevice} from '@/lib/hooks/useDevice'
import {useState} from 'react'
import {Modal} from '@/components/ui/Modal'

export default function EroomGamePage() {
    const {isMobile} = useDevice()
    const [showPCModal, setShowPCModal] = useState(false)

    const features = [
        {
            icon: <Brain className="w-8 h-8"/>,
            title: 'AI 기반 무한 콘텐츠',
            description: '매번 새로운 퍼즐과 스토리가 생성되어 끝없는 재미를 제공합니다'
        },
        {
            icon: <Users className="w-8 h-8"/>,
            title: '최대 4인 협동 플레이',
            description: '친구들과 함께 복잡한 퍼즐을 해결하고 함께 탈출하세요'
        },
        {
            icon: <Globe className="w-8 h-8"/>,
            title: '글로벌 맵 공유',
            description: '전 세계 플레이어들이 만든 창의적인 맵을 플레이하세요'
        },
        {
            icon: <Sparkles className="w-8 h-8"/>,
            title: '시즌 이벤트',
            description: '매 시즌 새로운 테마와 보상으로 지속적인 재미를 선사합니다'
        }
    ]

    const requirements = {
        minimum: {
            os: 'Windows 10 64-bit',
            processor: 'Intel Core i3-4340 / AMD FX-6300',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GTX 660 2GB / AMD Radeon HD 7850 2GB',
            directx: 'Version 11',
            storage: '25 GB 사용 가능 공간'
        },
        recommended: {
            os: 'Windows 11 64-bit',
            processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
            memory: '16 GB RAM',
            graphics: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB',
            directx: 'Version 12',
            storage: '25 GB 사용 가능 공간 (SSD 권장)'
        }
    }

    const handleDownload = () => {
        if (isMobile) {
            setShowPCModal(true)
        } else {
            window.location.href = '/support/download'
        }
    }

    return (
        <>
            <PageHeader
                title="EROOM"
                description="AI가 만드는 무한한 방탈출 세계"
                badge="정식 출시"
                icon={<Key className="w-5 h-5"/>}
                actions={
                    <>
                        <Button variant="primary" size="lg" onClick={handleDownload}>
                            <Download className="w-5 h-5"/>
                            무료 다운로드
                        </Button>
                        <Button variant="outline" size="lg">
                            <Play className="w-5 h-5"/>
                            트레일러 보기
                        </Button>
                    </>
                }
            />

            <Container className="py-12">
                {/* 게임 소개 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2">
                        <Card
                            className="aspect-video bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-20 h-20 text-white/80"/>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">게임 정보</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">개발사</dt>
                                    <dd>BangtalBoyBand</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">장르</dt>
                                    <dd>퍼즐 / 어드벤처</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">출시일</dt>
                                    <dd>2025.07.07</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">플랫폼</dt>
                                    <dd>Windows PC</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">가격</dt>
                                    <dd className="text-green-400 font-bold">무료</dd>
                                </div>
                            </dl>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">평점</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-green-400">4.8</div>
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 text-sm text-gray-400">
                                    <p>15,234 리뷰</p>
                                    <p className="text-green-400">매우 긍정적</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 주요 특징 */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">주요 특징</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} hover className="p-6 text-center">
                                <div
                                    className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-400">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 시스템 요구사항 */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">시스템 요구사항</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-gray-400"/>
                                최소 사양
                            </h3>
                            <dl className="space-y-3 text-sm">
                                {Object.entries(requirements.minimum).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-4">
                                        <dt className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                                        <dd className="col-span-2">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>

                        <Card className="p-6 border-green-600/50">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-green-400"/>
                                권장 사양
                            </h3>
                            <dl className="space-y-3 text-sm">
                                {Object.entries(requirements.recommended).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-4">
                                        <dt className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                                        <dd className="col-span-2">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <Card
                    className="p-8 bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-600/50 text-center">
                    <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요!</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        AI가 만드는 무한한 방탈출 세계에서 당신의 창의력과 문제 해결 능력을 시험해보세요.
                        매번 새로운 도전이 기다리고 있습니다.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button variant="primary" size="lg" onClick={handleDownload}>
                            <Download className="w-5 h-5"/>
                            지금 다운로드
                        </Button>
                        <Link href="/community/guides">
                            <Button variant="outline" size="lg">
                                게임 가이드 보기
                            </Button>
                        </Link>
                    </div>
                </Card>
            </Container>

            {/* PC 전용 모달 */}
            <Modal
                isOpen={showPCModal}
                onClose={() => setShowPCModal(false)}
                title="PC에서 이용해주세요"
                size="sm"
            >
                <div className="text-center py-6">
                    <div
                        className="w-20 h-20 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Key className="w-10 h-10 text-green-400"/>
                    </div>
                    <p className="text-gray-300 mb-6">
                        EROOM은 PC 전용 게임입니다.<br/>
                        Windows PC에서 다운로드해주세요.
                    </p>
                    <Button variant="primary" fullWidth onClick={() => setShowPCModal(false)}>
                        확인
                    </Button>
                </div>
            </Modal>
        </>
    )
}