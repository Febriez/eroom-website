export const formatters = {
    // 숫자 포맷
    number: (num: number): string => {
        return new Intl.NumberFormat('ko-KR').format(num)
    },

    // 큰 숫자 축약 (1.2k, 3.4M 등)
    compactNumber: (num: number): string => {
        if (num < 1000) return num.toString()
        if (num < 1000000) return `${(num / 1000).toFixed(1)}k`
        if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
        return `${(num / 1000000000).toFixed(1)}B`
    },

    // 시간 포맷 (초 -> mm:ss)
    time: (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    },

    // 시간 포맷 (초 -> hh:mm:ss)
    longTime: (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    },

    // 날짜 포맷
    date: (date: Date | any): string => {
        if (!date) return ''

        // Firestore Timestamp 처리
        if (date.toDate) {
            date = date.toDate()
        } else if (typeof date === 'object' && date.seconds) {
            date = new Date(date.seconds * 1000)
        }

        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    },

    // 상대 시간 (1시간 전, 3일 전 등)
    relativeTime: (date: Date | any): string => {
        if (!date) return ''

        // Firestore Timestamp 처리
        if (date.toDate) {
            date = date.toDate()
        } else if (typeof date === 'object' && date.seconds) {
            date = new Date(date.seconds * 1000)
        }

        const now = new Date()
        const diff = now.getTime() - date.getTime()

        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(days / 365)

        if (seconds < 60) return '방금 전'
        if (minutes < 60) return `${minutes}분 전`
        if (hours < 24) return `${hours}시간 전`
        if (days < 30) return `${days}일 전`
        if (months < 12) return `${months}개월 전`
        return `${years}년 전`
    },

    // 파일 크기
    fileSize: (bytes: number): string => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`
    },

    // 백분율
    percentage: (value: number, total: number, decimals: number = 0): string => {
        if (total === 0) return '0%'
        const percentage = (value / total) * 100
        return `${percentage.toFixed(decimals)}%`
    }
}