'use client'

import {CheckCircle, Cpu, HardDrive, Monitor, XCircle, Zap} from 'lucide-react'

export default function RequirementsPage() {
    const requirements = {
        minimum: {
            os: "Windows 10 64-bit (버전 1909 이상)",
            processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
            memory: "8 GB RAM",
            graphics: "NVIDIA GTX 1060 6GB / AMD RX 580 8GB",
            directx: "버전 12",
            network: "초고속 인터넷 연결",
            storage: "25 GB 사용 가능 공간",
            sound: "DirectX 호환 사운드 카드"
        },
        recommended: {
            os: "Windows 11 64-bit",
            processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
            memory: "16 GB RAM",
            graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
            directx: "버전 12",
            network: "초고속 인터넷 연결",
            storage: "25 GB SSD 공간",
            sound: "DirectX 호환 5.1 서라운드 사운드"
        },
        ultra: {
            os: "Windows 11 64-bit",
            processor: "Intel Core i9-12900K / AMD Ryzen 9 5900X",
            memory: "32 GB RAM",
            graphics: "NVIDIA RTX 4080 / AMD RX 7900 XTX",
            directx: "버전 12",
            network: "초고속 인터넷 연결",
            storage: "25 GB NVMe SSD 공간",
            sound: "DirectX 호환 7.1 서라운드 사운드"
        }
    }

    const features = [
        {name: "기본 게임플레이", minimum: true, recommended: true, ultra: true},
        {name: "고해상도 텍스처", minimum: false, recommended: true, ultra: true},
        {name: "레이 트레이싱", minimum: false, recommended: false, ultra: true},
        {name: "DLSS 3.0", minimum: false, recommended: true, ultra: true},
        {name: "144Hz+ 지원", minimum: false, recommended: true, ultra: true},
        {name: "4K 해상도", minimum: false, recommended: false, ultra: true},
        {name: "HDR 지원", minimum: false, recommended: true, ultra: true},
        {name: "스트리밍 최적화", minimum: false, recommended: true, ultra: true}
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        시스템 요구사항
                    </h1>
                    <p className="text-2xl text-gray-300">최적의 게임 경험을 위한 PC 사양</p>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-3 gap-6 mb-16">
                    {/* Minimum */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 text-gray-400">최소 사양</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">운영체제</span>
                                </div>
                                <p className="text-gray-300">{requirements.minimum.os}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Cpu className="w-5 h-5"/>
                                    <span className="font-medium">프로세서</span>
                                </div>
                                <p className="text-gray-300">{requirements.minimum.processor}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Zap className="w-5 h-5"/>
                                    <span className="font-medium">메모리</span>
                                </div>
                                <p className="text-gray-300">{requirements.minimum.memory}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">그래픽</span>
                                </div>
                                <p className="text-gray-300">{requirements.minimum.graphics}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <HardDrive className="w-5 h-5"/>
                                    <span className="font-medium">저장공간</span>
                                </div>
                                <p className="text-gray-300">{requirements.minimum.storage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recommended */}
                    <div
                        className="bg-gradient-to-br from-green-900/20 to-black rounded-2xl p-8 border-2 border-green-600 relative">
                        <div
                            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 px-4 py-1 rounded-full text-sm font-bold">
                            권장
                        </div>
                        <h2 className="text-2xl font-bold mb-6 text-green-400">권장 사양</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">운영체제</span>
                                </div>
                                <p className="text-gray-300">{requirements.recommended.os}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Cpu className="w-5 h-5"/>
                                    <span className="font-medium">프로세서</span>
                                </div>
                                <p className="text-gray-300">{requirements.recommended.processor}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Zap className="w-5 h-5"/>
                                    <span className="font-medium">메모리</span>
                                </div>
                                <p className="text-gray-300">{requirements.recommended.memory}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">그래픽</span>
                                </div>
                                <p className="text-gray-300">{requirements.recommended.graphics}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <HardDrive className="w-5 h-5"/>
                                    <span className="font-medium">저장공간</span>
                                </div>
                                <p className="text-gray-300">{requirements.recommended.storage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ultra */}
                    <div
                        className="bg-gradient-to-br from-purple-900/20 to-black rounded-2xl p-8 border border-purple-800">
                        <h2 className="text-2xl font-bold mb-6 text-purple-400">울트라 사양</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">운영체제</span>
                                </div>
                                <p className="text-gray-300">{requirements.ultra.os}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Cpu className="w-5 h-5"/>
                                    <span className="font-medium">프로세서</span>
                                </div>
                                <p className="text-gray-300">{requirements.ultra.processor}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Zap className="w-5 h-5"/>
                                    <span className="font-medium">메모리</span>
                                </div>
                                <p className="text-gray-300">{requirements.ultra.memory}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <Monitor className="w-5 h-5"/>
                                    <span className="font-medium">그래픽</span>
                                </div>
                                <p className="text-gray-300">{requirements.ultra.graphics}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                    <HardDrive className="w-5 h-5"/>
                                    <span className="font-medium">저장공간</span>
                                </div>
                                <p className="text-gray-300">{requirements.ultra.storage}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Comparison */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800 mb-32">
                    <h2 className="text-3xl font-bold mb-8">사양별 지원 기능</h2>
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-800">
                            <th className="text-left py-4">기능</th>
                            <th className="text-center py-4 text-gray-400">최소</th>
                            <th className="text-center py-4 text-green-400">권장</th>
                            <th className="text-center py-4 text-purple-400">울트라</th>
                        </tr>
                        </thead>
                        <tbody>
                        {features.map((feature, index) => (
                            <tr key={index} className="border-b border-gray-800/50">
                                <td className="py-4">{feature.name}</td>
                                <td className="text-center py-4">
                                    {feature.minimum ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto"/>
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                    )}
                                </td>
                                <td className="text-center py-4">
                                    {feature.recommended ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto"/>
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                    )}
                                </td>
                                <td className="text-center py-4">
                                    {feature.ultra ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto"/>
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}