export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

export const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
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

export const getCategoryLabel = (category: string) => {
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

export const getCategoryGradient = (category: string) => {
    switch (category) {
        case 'beginner':
            return 'from-green-600 to-green-700'
        case 'advanced':
            return 'from-red-600 to-red-700'
        case 'map-creation':
            return 'from-blue-600 to-blue-700'
        case 'tips':
            return 'from-yellow-600 to-yellow-700'
        default:
            return 'from-gray-600 to-gray-700'
    }
}

export const formatGuideDate = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}