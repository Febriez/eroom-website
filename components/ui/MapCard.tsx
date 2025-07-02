import {GameMapCard} from '@/lib/firebase/types/game-map-card.types'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Heart, Play, Users} from 'lucide-react'

interface MapCardProps {
    map: GameMapCard
    onClick?: () => void
}

export function MapCard({map, onClick}: MapCardProps) {
    const getDifficultyVariant = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'success'
            case 'medium':
                return 'info'
            case 'hard':
                return 'warning'
            case 'extreme':
                return 'danger'
            default:
                return 'default'
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '쉬움'
            case 'medium':
                return '보통'
            case 'hard':
                return '어려움'
            case 'extreme':
                return '극악'
            default:
                return difficulty
        }
    }

    const formatCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }

    return (
        <Card
            hover
            className="overflow-hidden group cursor-pointer"
            onClick={onClick}
        >
            {/* 썸네일 */}
            <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 relative">
                {map.thumbnail && (
                    <img
                        src={map.thumbnail}
                        alt={map.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"/>

                {/* 플레이 버튼 (호버 시) */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors">
                        <Play className="w-6 h-6 text-white fill-white"/>
                    </div>
                </div>
            </div>

            {/* 카드 내용 */}
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-1 break-keep">
                    {map.name}
                </h3>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2 break-keep">
                    {map.description}
                </p>

                {/* 난이도 및 통계 */}
                <div className="flex items-center justify-between mb-3">
                    <Badge variant={getDifficultyVariant(map.difficulty) as any}>
                        {getDifficultyLabel(map.difficulty)}
                    </Badge>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4"/>
                            {formatCount(map.stats.playCount)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-400"/>
                            {formatCount(map.stats.likeCount)}
                        </div>
                    </div>
                </div>

                {/* 제작자 및 테마 */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="truncate">by @{map.creator.username}</span>
                    <span>{map.theme}</span>
                </div>

                {/* 태그 */}
                {map.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {map.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400"
                            >
                                #{tag}
                            </span>
                        ))}
                        {map.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                                +{map.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}