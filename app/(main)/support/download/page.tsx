// app/(main)/support/download/page.tsx
'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {AlertCircle, CheckCircle, Download, ExternalLink, HardDrive, Monitor, Shield, Zap} from 'lucide-react'
import {useDevice} from '@/lib/hooks/useDevice'
import {getDownloadURL, ref} from 'firebase/storage'
import {storage} from '@/lib/firebase/config'

export default function DownloadPage() {
    const router = useRouter()
    const {isMobile} = useDevice()
    const [selectedVersion, setSelectedVersion] = useState<'stable' | 'beta'>('stable')
    const [downloading, setDownloading] = useState(false)

    const versions = {
        stable: {
            version: '1.0.0',
            releaseDate: '2025.07.07',
            size: '3.2 GB',
            changelog: [
                '정식 출시 버전',
                'AI 맵 생성 시스템 안정화',
                '멀티플레이 지원',
                '50+ 공식 맵 포함'
            ]
        },
        beta: {
            version: '1.1.0-beta',
            releaseDate: '2025.07.21',
            size: '3.5 GB',
            changelog: [
                '새로운 테마 추가',
                '성능 개선',
                '실험적 기능 포함',
                '버그 수정'
            ]
        }
    }

    const downloadSteps = [
        {
            step: 1,
            title: '다운로드',
            description: '위의 다운로드 버튼을 클릭하여 설치 파일을 받으세요'
        },
        {
            step: 2,
            title: '설치',
            description: '다운로드한 파일을 실행하고 안내에 따라 설치하세요'
        },
        {
            step: 3,
            title: '계정 생성',
            description: '게임을 실행하고 계정을 만들거나 로그인하세요'
        },
        {
            step: 4,
            title: '플레이',
            description: 'AI가 생성한 방탈출 맵을 즐기세요!'
        }
    ]

    const handleDownload = async () => {
        setDownloading(true)

        try {
            // Firebase Storage에서 파일 다운로드 URL 가져오기
            const fileRef = ref(storage, 'pirate.jpg') // 실제로는 게임 설치 파일 경로
            const downloadUrl = await getDownloadURL(fileRef)

            // 다운로드 시작
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'eroom-installer.exe' // 다운로드될 파일명
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } catch (error) {
            console.error('Download error:', error)
            alert('다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setTimeout(() => {
                setDownloading(false)
            }, 2000)
        }
    }

    if (isMobile) {
        return (
            <>
                <PageHeader
                    title="다운로드"
                    description="EROOM 게임 다운로드"
                    badge="PC 전용"
                    icon={<Download className="w-5 h-5"/>}
                />

                <Container className="py-12">
                    <Card className="p-8 text-center">
                        <div
                            className="w-20 h-20 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Monitor className="w-10 h-10 text-red-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">PC에서 다운로드해주세요</h2>
                        <p className="text-gray-400 mb-6">
                            EROOM은 Windows PC 전용 게임입니다.<br/>
                            PC에서 이 페이지에 접속하여 다운로드해주세요.
                        </p>
                        <Badge variant="danger" size="md">
                            모바일 미지원
                        </Badge>
                    </Card>
                </Container>
            </>
        )
    }

    return (
        <>
            <PageHeader
                title="다운로드"
                description="EROOM 게임을 다운로드하고 AI가 만드는 무한한 방탈출을 경험하세요"
                badge="무료"
                icon={<Download className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 버전 선택 */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">버전 선택</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card
                            className={`p-6 cursor-pointer transition-all ${
                                selectedVersion === 'stable'
                                    ? 'border-green-600 shadow-lg shadow-green-900/30'
                                    : 'hover:border-gray-700'
                            }`}
                            onClick={() => setSelectedVersion('stable')}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green-400"/>
                                </div>
                                {selectedVersion === 'stable' && (
                                    <CheckCircle className="w-5 h-5 text-green-400"/>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">정식 버전</h3>
                            <p className="text-gray-400 text-sm mb-4">안정적이고 검증된 버전</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">버전</span>
                                    <span>{versions.stable.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">크기</span>
                                    <span>{versions.stable.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">출시일</span>
                                    <span>{versions.stable.releaseDate}</span>
                                </div>
                            </div>
                        </Card>

                        <Card
                            className={`p-6 cursor-pointer transition-all ${
                                selectedVersion === 'beta'
                                    ? 'border-green-600 shadow-lg shadow-green-900/30'
                                    : 'hover:border-gray-700'
                            }`}
                            onClick={() => setSelectedVersion('beta')}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-yellow-400"/>
                                </div>
                                {selectedVersion === 'beta' && (
                                    <CheckCircle className="w-5 h-5 text-green-400"/>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">베타 버전</h3>
                            <p className="text-gray-400 text-sm mb-4">최신 기능을 먼저 체험</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">버전</span>
                                    <span>{versions.beta.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">크기</span>
                                    <span>{versions.beta.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">출시일</span>
                                    <span>{versions.beta.releaseDate}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 변경사항 */}
                <Card className="p-8 mb-12 max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">
                        {selectedVersion === 'stable' ? '정식 버전' : '베타 버전'} 변경사항
                    </h3>
                    <ul className="space-y-2">
                        {versions[selectedVersion].changelog.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"/>
                                <span className="text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* 다운로드 버튼 */}
                <div className="text-center mb-12">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleDownload}
                        loading={downloading}
                        disabled={downloading}
                        className="min-w-[200px]"
                    >
                        <Download className="w-5 h-5"/>
                        {downloading ? '다운로드 중...' : `${selectedVersion === 'stable' ? '정식' : '베타'} 버전 다운로드`}
                    </Button>

                    {selectedVersion === 'beta' && (
                        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg max-w-md mx-auto">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
                                <div className="text-left">
                                    <p className="text-yellow-400 font-medium mb-1">베타 버전 주의사항</p>
                                    <p className="text-sm text-gray-400">
                                        베타 버전은 불안정할 수 있으며 예기치 않은 버그가 발생할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 설치 가이드 */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">설치 가이드</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {downloadSteps.map((item) => (
                            <Card key={item.step} className="p-6 text-center">
                                <div
                                    className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl font-bold text-green-400">{item.step}</span>
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 추가 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <HardDrive className="w-5 h-5 text-green-400"/>
                            시스템 요구사항
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Windows 10 64-bit 이상</li>
                            <li>• 8GB RAM</li>
                            <li>• GTX 1050 / RX 560 이상</li>
                            <li>• 25GB 저장 공간</li>
                        </ul>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => router.push('/support/requirements')}
                        >
                            <ExternalLink className="w-4 h-4"/>
                            상세 사양 보기
                        </Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-400"/>
                            문제 해결
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• 설치 오류 해결법</li>
                            <li>• 실행 문제 해결</li>
                            <li>• 네트워크 연결 문제</li>
                            <li>• 그래픽 설정 가이드</li>
                        </ul>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => router.push('/support/faq')}
                        >
                            <ExternalLink className="w-4 h-4"/>
                            FAQ 보기
                        </Button>
                    </Card>
                </div>
            </Container>
        </>
    )
}