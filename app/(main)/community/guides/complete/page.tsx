'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Button} from '@/components/ui/Button'
import {Book, Search, Star, TrendingUp} from 'lucide-react'
import {GuideService} from '@/lib/firebase/services/guide.service'
import type {Guide} from '@/lib/firebase/types/guide.types'
import {useRouter} from 'next/navigation'
import {GuideCard} from '@/components/ui/GuideCard'

export default function CompleteGuidePage() {
    const router = useRouter()
    const [guides, setGuides] = useState<Guide[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
    const [hasSeeded, setHasSeeded] = useState(false)

    useEffect(() => {
        loadGuides()
    }, [])

    const loadGuides = async () => {
        try {
            setLoading(true)
            setError(null)

            const allGuides = await GuideService.getAllGuides()

            if (allGuides.length === 0 && !hasSeeded) {
                const seedSuccess = await GuideService.seedGuides()
                setHasSeeded(true)

                if (seedSuccess) {
                    const seededGuides = await GuideService.getAllGuides()
                    setGuides(seededGuides)
                } else {
                    setGuides([])
                }
            } else {
                setGuides(allGuides)
            }
        } catch (error) {
            console.error('Error in loadGuides:', error)
            setError('가이드를 불러오는 중 오류가 발생했습니다.')
            setGuides([])
        } finally {
            setLoading(false)
        }
    }

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = !searchTerm ||
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty

        return matchesSearch && matchesDifficulty
    })

    const featuredGuides = filteredGuides.filter(g => g.metadata?.featured === true)
    const beginnerGuides = filteredGuides.filter(g => g.category === 'beginner')
    const advancedGuides = filteredGuides.filter(g => g.category === 'advanced')
    const mapCreationGuides = filteredGuides.filter(g => g.category === 'map-creation')
    const tipsGuides = filteredGuides.filter(g => g.category === 'tips')

    const handleGuideClick = (guideId: string) => {
        router.push(`/community/guides/${guideId}`)
    }

    return (
        <>
            <PageHeader
                title="완벽 공략집"
                description="EROOM 마스터가 되기 위한 모든 가이드와 전략"
                badge="가이드"
                icon={<Book className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="가이드 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                        >
                            <option value="">모든 난이도</option>
                            <option value="easy">초급</option>
                            <option value="medium">중급</option>
                            <option value="hard">고급</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">가이드를 불러오는 중...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={loadGuides} variant="outline">
                            다시 시도
                        </Button>
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="text-center py-20">
                        <Search className="w-20 h-20 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">가이드가 없습니다</h3>
                        <p className="text-gray-400 mb-4">
                            {searchTerm ? '다른 검색어를 시도해보세요' : '아직 등록된 가이드가 없습니다'}
                        </p>
                        {!searchTerm && guides.length === 0 && (
                            <Button onClick={() => {
                                setHasSeeded(false)
                                loadGuides()
                            }} variant="outline">
                                샘플 데이터 생성
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* 추천 가이드 */}
                        {featuredGuides.length > 0 && !searchTerm && !selectedDifficulty && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-400"/>
                                    추천 가이드
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="grid"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 맵 제작 가이드 */}
                        {mapCreationGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-green-400"/>
                                    맵 제작 가이드
                                </h2>
                                <div className="space-y-4">
                                    {mapCreationGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="list"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 팁 & 트릭 */}
                        {tipsGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-400"/>
                                    팁 & 트릭
                                </h2>
                                <div className="space-y-4">
                                    {tipsGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="list"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 초보자 가이드 */}
                        {beginnerGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-blue-400"/>
                                    초보자 가이드
                                </h2>
                                <div className="space-y-4">
                                    {beginnerGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="list"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 고급 전략 */}
                        {advancedGuides.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-purple-400"/>
                                    고급 전략
                                </h2>
                                <div className="space-y-4">
                                    {advancedGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            variant="list"
                                            onClick={handleGuideClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </Container>
        </>
    )
}