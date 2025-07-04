import {Timestamp} from 'firebase/firestore'

/**
 * 가이드 날짜 포맷팅
 */
export const formatGuideDate = (timestamp: Timestamp | Date | any): string => {
    if (!timestamp) return ''

    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

/**
 * 난이도별 색상 반환
 */
export const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'success'
        case 'medium':
            return 'warning'
        case 'hard':
            return 'danger'
        default:
            return 'default'
    }
}

/**
 * 난이도 라벨 반환
 */
export const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return '초급'
        case 'medium':
            return '중급'
        case 'hard':
            return '고급'
        default:
            return difficulty
    }
}

/**
 * 카테고리 라벨 반환
 */
export const getCategoryLabel = (category: string): string => {
    switch (category) {
        case 'beginner':
            return '초보자 가이드'
        case 'map-creation':
            return '맵 제작'
        case 'advanced':
            return '고급 전략'
        case 'tips':
            return '팁 & 트릭'
        default:
            return category
    }
}

/**
 * 카테고리 색상 반환
 */
export const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'beginner':
            return 'info'
        case 'map-creation':
            return 'success'
        case 'advanced':
            return 'warning'
        case 'tips':
            return 'default'
        default:
            return 'default'
    }
}

/**
 * 읽기 시간 계산 (단어 수 기반)
 */
export const calculateReadTime = (content: string): number => {
    // 평균 읽기 속도: 분당 200-250 단어 (한국어 기준)
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return Math.max(readTime, 1) // 최소 1분
}

/**
 * 검색어 하이라이팅
 */
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-400 text-black">$1</mark>')
}

/**
 * 태그 정규화
 */
export const normalizeTag = (tag: string): string => {
    return tag.toLowerCase().trim().replace(/\s+/g, '-')
}

/**
 * 조회수 포맷팅
 */
export const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
}