'use client'

import {AlertCircle, CheckCircle, Cpu, Download, HardDrive, Monitor, Wifi} from 'lucide-react'
import {useState} from 'react'

export default function DownloadPage() {
    const [selectedPlatform, setSelectedPlatform] = useState('windows')

    const platforms = [
        {
            id: 'windows',
            name: 'Windows',
            icon: <Monitor className="w-8 h-8"/>,
            version: '2.0.0',
            size: '3.2 GB',
            requirements: {
                os: 'Windows 10 64-bit 이상',
                processor: 'Intel i5-8400 / AMD Ryzen 5 2600',
                memory: '8 GB RAM',
                graphics: 'GTX 1060 / RX 580',
                storage: '25 GB'
            }
        },
        {
            id: 'mac',
            name: 'macOS',
            icon: <Monitor className="w-8 h-8"/>,
            version: '곧 출시',
            size: '-',
            requirements: {
                os: 'macOS 12.0 이상',
                processor: 'Apple M1 이상',
                memory: '8 GB RAM',
                graphics: '내장 그래픽',
                storage: '25 GB'
            }
        }
    ]

    const downloadSteps = [
        "다운로드 버튼을 클릭하여 설치 파일을 받으세요",
        "다운로드된 파일을 실행하세요",
        "설치 마법사의 안내를 따라 진행하세요",
        "설치가 완료되면 EROOM을 실행하세요",
        "계정을 생성하거나 로그인하세요",
        "게임을 즐기세요!"
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        다운로드
                    </h1>
                    <p className="text-2xl text-gray-300">EROOM을 지금 바로 시작하세요</p>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`p-8 rounded-2xl border-2 transition-all ${
                                selectedPlatform === platform.id
                                    ? 'border-green-600 bg-green-900/20'
                                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center mb-4 text-green-400">
                                {platform.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                            <p className="text-gray-400">버전 {platform.version}</p>
                            {platform.size !== '-' &&
                                <p className="text-gray-500 text-sm mt-2">파일 크기: {platform.size}</p>}
                        </button>
                    ))}
                </div>

                {/* Download Section */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-12 border border-gray-800 mb-12">
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                {platforms.find(p => p.id === selectedPlatform)?.name} 버전
                            </h2>

                            {selectedPlatform === 'windows' ? (
                                <>
                                    <div className="mb-8">
                                        <p className="text-gray-400 mb-6">
                                            안정적인 최신 버전으로 모든 기능을 즐기실 수 있습니다.
                                        </p>
                                        <button
                                            className="px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-3">
                                            <Download className="w-6 h-6"/>
                                            다운로드 (3.2 GB)
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-green-400">
                                            <CheckCircle className="w-5 h-5"/>
                                            <span>Windows 10/11 완벽 지원</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-green-400">
                                            <CheckCircle className="w-5 h-5"/>
                                            <span>자동 업데이트 지원</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-green-400">
                                            <CheckCircle className="w-5 h-5"/>
                                            <span>한국어 완벽 지원</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className="bg-orange-900/20 border border-orange-800 rounded-xl p-6 mb-6">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5"/>
                                            <div>
                                                <p className="font-semibold text-orange-400 mb-2">준비 중</p>
                                                <p className="text-gray-400">
                                                    macOS 버전은 현재 개발 중이며, 곧 출시 예정입니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="px-10 py-5 bg-gray-800 rounded-xl font-bold text-xl cursor-not-allowed opacity-50">
                                        곧 출시 예정
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">시스템 요구사항</h3>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-gray-600"/>
                                    <span>{platforms.find(p => p.id === selectedPlatform)?.requirements.os}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Cpu className="w-5 h-5 text-gray-600"/>
                                    <span>{platforms.find(p => p.id === selectedPlatform)?.requirements.processor}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HardDrive className="w-5 h-5 text-gray-600"/>
                                    <span>{platforms.find(p => p.id === selectedPlatform)?.requirements.storage} 여유 공간</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Wifi className="w-5 h-5 text-gray-600"/>
                                    <span>인터넷 연결 필요</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Installation Steps */}
                <div className="mb-32">
                    <h2 className="text-3xl font-bold mb-8">설치 방법</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {downloadSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-gray-300">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}