// lib/firebase/types/guide.types.ts
import {Timestamp} from 'firebase/firestore'

export interface Guide {
    id: string
    title: string
    description: string
    content: string // 마크다운 형식의 가이드 내용
    category: 'beginner' | 'map-creation' | 'advanced' | 'tips'
    tags: string[]
    difficulty: 'easy' | 'medium' | 'hard'
    readTime: number // 예상 읽기 시간 (분)
    author: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
    }
    stats: {
        views: number
        likes: number
        bookmarks: number
    }
    metadata: {
        featured: boolean
        status: 'draft' | 'published'
        lastUpdated: Timestamp
    }
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface GuideCategory {
    id: string
    name: string
    description: string
    icon: string
    color: string
    order: number
}