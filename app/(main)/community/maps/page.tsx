'use client'

import {useEffect, useState} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Input} from '@/components/ui/Input'
import type {GameMap} from '@/lib/firebase/types'
import {Clock, Search, Star, TrendingUp, Users} from 'lucide-react'

export default function CommunityMapsPage() {
    const [maps, setMaps] = useState<GameMap[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<'featured' | 'popular' | 'new'>('featured')

    useEffect(() => {
        // Load maps based on filter
        const loadMaps = async () => {
            // Implementation would go here
            setLoading(false)
        }
        loadMaps()
    }, [filter])

    return (
        <>
            <PageHeader
                title="커뮤니티 맵"
                description="전 세계 플레이어들이 만든 창의적인 방탈출 맵을 플레이해보세요"
                badge="50,000+ 맵"
                icon={<Users className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="맵 이름, 제작자, 태그로 검색..."
                            icon={<Search className="w-5 h-5"/>}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'featured' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('featured')}
                        >
                            <TrendingUp className="w-4 h-4"/>
                            추천
                        </Button>
                        <Button
                            variant={filter === 'popular' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('popular')}
                        >
                            <Star className="w-4 h-4"/>
                            인기
                        </Button>
                        <Button
                            variant={filter === 'new' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('new')}
                        >
                            <Clock className="w-4 h-4"/>
                            최신
                        </Button>
                    </div>
                </div>

                {/* 맵 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} hover className="overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800"/>
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-2">미스터리 맨션 #{i}</h3>
                                <p className="text-gray-400 text-sm mb-3">
                                    어둠 속에 숨겨진 비밀을 찾아 탈출하세요
                                </p>

                                <div className="flex items-center justify-between mb-3">
                                    <Badge variant="success">Normal</Badge>
                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <Star className="w-4 h-4 text-yellow-400"/>
                                        4.8
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>by @creator{i}</span>
                                    <span>1.2k plays</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </>
    )
}