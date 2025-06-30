'use client'

import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {AlertCircle, CheckCircle, Cpu, Monitor, Shield, XCircle, Zap} from 'lucide-react'

export default function RequirementsPage() {
    const requirements = {
        minimum: {
            os: 'Windows 10 64-bit (버전 1903 이상)',
            processor: 'Intel Core i3-4340 / AMD FX-6300',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GTX 660 2GB / AMD Radeon HD 7850 2GB',
            directx: 'Version 11',
            network: '광대역 인터넷 연결',
            storage: '25 GB 사용 가능 공간',
            additional: '64비트 프로세서와 운영 체제 필요'
        },
        recommended: {
            os: 'Windows 11 64-bit',
            processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
            memory: '16 GB RAM',
            graphics: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB',
            directx: 'Version 12',
            network: '광대역 인터넷 연결',
            storage: '25 GB 사용 가능 공간 (SSD 권장)',
            additional: '64비트 프로세서와 운영 체제 필요'
        },
        optimal: {
            os: 'Windows 11 64-bit (최신 업데이트)',
            processor: 'Intel Core i7-10700K / AMD Ryzen 7 3700X',
            memory: '32 GB RAM',
            graphics: 'NVIDIA RTX 3070 / AMD RX 6700 XT',
            directx: 'Version 12 Ultimate',
            network: '광대역 인터넷 연결 (광섬유 권장)',
            storage: '25 GB NVMe SSD 공간',
            additional: '64비트 프로세서와 운영 체제 필요'
        }
    }

    const features = [
        {
            icon: <Cpu className="w-6 h-6"/>,
            title: 'AI 실시간 처리',
            description: 'AI가 맵을 생성하려면 충분한 CPU 성능이 필요합니다',
            minSupport: true,
            recSupport: true,
            optSupport: true
        },
        {
            icon: <Zap className="w-6 h-6"/>,
            title: '레이 트레이싱',
            description: '사실적인 조명과 반사 효과',
            minSupport: false,
            recSupport: false,
            optSupport: true
        },
        {
            icon: <Shield className="w-6 h-6"/>,
            title: 'DLSS 지원',
            description: 'NVIDIA DLSS를 통한 성능 향상',
            minSupport: false,
            recSupport: true,
            optSupport: true
        },
        {
            icon: <Monitor className="w-6 h-6"/>,
            title: '4K 해상도',
            description: '최고의 비주얼 경험',
            minSupport: false,
            recSupport: false,
            optSupport: true
        }
    ]

    const supportedOS = [
        {name: 'Windows 10 (64-bit)', version: '1903+', supported: true},
        {name: 'Windows 11 (64-bit)', version: '모든 버전', supported: true},
        {name: 'Windows 8.1', version: '-', supported: false},
        {name: 'macOS', version: '-', supported: false},
        {name: 'Linux', version: '-', supported: false}
    ]

    return (
        <>
            <PageHeader
                title="시스템 요구사항"
                description="EROOM을 원활하게 플레이하기 위한 PC 사양을 확인하세요"
                badge="PC 전용"
                icon={<Monitor className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 요구사항 비교 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* 최소 사양 */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">최소 사양</h3>
                            <Badge variant="default">기본 플레이 가능</Badge>
                        </div>

                        <dl className="space-y-4 text-sm">
                            {Object.entries(requirements.minimum).map(([key, value]) => (
                                <div key={key}>
                                    <dt className="text-gray-500 mb-1">{key.toUpperCase()}</dt>
                                    <dd className="font-medium">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    {/* 권장 사양 */}
                    <Card className="p-6 border-green-600/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-green-400">권장 사양</h3>
                            <Badge variant="success">최적 경험</Badge>
                        </div>

                        <dl className="space-y-4 text-sm">
                            {Object.entries(requirements.recommended).map(([key, value]) => (
                                <div key={key}>
                                    <dt className="text-gray-500 mb-1">{key.toUpperCase()}</dt>
                                    <dd className="font-medium">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    {/* 최고 사양 */}
                    <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-purple-400">최고 사양</h3>
                            <Badge variant="warning">울트라 설정</Badge>
                        </div>

                        <dl className="space-y-4 text-sm">
                            {Object.entries(requirements.optimal).map(([key, value]) => (
                                <div key={key}>
                                    <dt className="text-gray-500 mb-1">{key.toUpperCase()}</dt>
                                    <dd className="font-medium">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                </div>

                {/* 기능 지원 */}
                <Card className="p-8 mb-12">
                    <h3 className="text-2xl font-bold mb-6">사양별 기능 지원</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left py-4">기능</th>
                                <th className="text-center py-4 px-4">최소</th>
                                <th className="text-center py-4 px-4">권장</th>
                                <th className="text-center py-4 px-4">최고</th>
                            </tr>
                            </thead>
                            <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-800">
                                    <td className="py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="text-green-400 mt-1">{feature.icon}</div>
                                            <div>
                                                <p className="font-medium">{feature.title}</p>
                                                <p className="text-sm text-gray-400">{feature.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-4">
                                        {feature.minSupport ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto"/>
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                        )}
                                    </td>
                                    <td className="text-center py-4 px-4">
                                        {feature.recSupport ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto"/>
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                        )}
                                    </td>
                                    <td className="text-center py-4 px-4">
                                        {feature.optSupport ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto"/>
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-600 mx-auto"/>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* 운영체제 지원 */}
                <Card className="p-8">
                    <h3 className="text-2xl font-bold mb-6">운영체제 지원</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {supportedOS.map((os, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                    os.supported
                                        ? 'bg-green-900/20 border-green-700'
                                        : 'bg-gray-800 border-gray-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{os.name}</p>
                                        <p className="text-sm text-gray-400">{os.version}</p>
                                    </div>
                                    {os.supported ? (
                                        <CheckCircle className="w-5 h-5 text-green-400"/>
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-500"/>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 추가 정보 */}
                <Card className="p-6 mt-8 bg-yellow-900/20 border-yellow-700/50">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"/>
                        <div>
                            <h4 className="font-bold mb-2">중요 사항</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• 모든 사양은 1920x1080 해상도 기준입니다.</li>
                                <li>• 4K 게임플레이를 위해서는 최고 사양 이상을 권장합니다.</li>
                                <li>• 멀티플레이를 위해서는 안정적인 인터넷 연결이 필요합니다.</li>
                                <li>• AI 기능은 인터넷 연결이 필요하며, 오프라인에서는 제한됩니다.</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </Container>
        </>
    )
}