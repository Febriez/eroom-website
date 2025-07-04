import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Heart, MessageSquare, Play, Users} from 'lucide-react'
import type {RoomCard} from "@/lib/firebase/types/room.types"

interface RoomCardProps {
    room: RoomCard
    onClick?: () => void
}

export function RoomCard({room, onClick}: RoomCardProps) {
    const getDifficultyVariant = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'success'
            case 'normal':
                return 'info'
            case 'hard':
                return 'warning'
            default:
                return 'default'
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '쉬움'
            case 'normal':
                return '보통'
            case 'hard':
                return '어려움'
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
                {room.thumbnail && (
                    <img
                        src={room.thumbnail}
                        alt={room.title}
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
                    {room.title}
                </h3>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2 break-keep">
                    {room.description}
                </p>

                {/* 난이도 및 통계 */}
                <div className="flex items-center justify-between mb-3">
                    <Badge variant={getDifficultyVariant(room.difficulty) as any}>
                        {getDifficultyLabel(room.difficulty)}
                    </Badge>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4"/>
                            {formatCount(room.stats.playCount)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-400"/>
                            {formatCount(room.stats.likeCount)}
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-blue-400"/>
                            {formatCount(room.stats.commentCount)}
                        </div>
                    </div>
                </div>

                {/* 제작자 및 테마 */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="truncate">by @{room.creator.username}</span>
                    <span>{room.theme}</span>
                </div>

                {/* 태그 */}
                {room.tags && room.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {room.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400"
                            >
                                #{tag}
                            </span>
                        ))}
                        {room.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                                +{room.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}