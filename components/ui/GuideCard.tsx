import React from 'react'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {ChevronRight, Clock, Eye, Heart} from 'lucide-react'
import type {Guide} from '@/lib/firebase/types/guide.types'
import {getDifficultyColor, getDifficultyLabel} from '@/lib/utils/guide.utils'

interface GuideCardProps {
    guide: Guide
    variant?: 'grid' | 'list'
    onClick?: (guideId: string) => void
}

export function GuideCard({guide, variant = 'grid', onClick}: GuideCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(guide.id)
        }
    }

    if (variant === 'grid') {
        return (
            <Card
                hover
                className="p-6 cursor-pointer"
                onClick={handleClick}
            >
                <div className="flex items-start justify-between mb-4">
                    <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                        {getDifficultyLabel(guide.difficulty)}
                    </Badge>
                    <span className="text-sm text-gray-400">
                        {guide.readTime}분 읽기
                    </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                    {guide.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4"/>
                            {guide.stats.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4"/>
                            {guide.stats.likes}
                        </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-green-400"/>
                </div>
            </Card>
        )
    }

    // List variant
    return (
        <Card
            hover
            className="p-6 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-start gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{guide.title}</h3>
                        <Badge
                            variant={getDifficultyColor(guide.difficulty) as any}
                            size="sm"
                        >
                            {getDifficultyLabel(guide.difficulty)}
                        </Badge>
                    </div>
                    <p className="text-gray-400 mb-3">{guide.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4"/>
                            {guide.readTime}분
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4"/>
                            {guide.stats.views.toLocaleString()}
                        </span>
                        <span>by {guide.author.displayName}</span>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    읽기
                </Button>
            </div>
        </Card>
    )
}