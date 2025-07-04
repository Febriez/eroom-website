// ==================== 숫자 포맷팅 ====================

/**
 * 숫자를 천 단위로 포맷팅
 * @param num - 포맷할 숫자
 * @returns 포맷된 문자열 (예: 1,000)
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('ko-KR').format(num)
}

/**
 * 큰 숫자를 축약형으로 포맷팅
 * @param num - 포맷할 숫자
 * @returns 축약된 문자열 (예: 1.2k, 3.4M)
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
}

/**
 * 백분율 포맷팅
 * @param value - 0-100 사이의 값
 * @param decimals - 소수점 자리수
 * @returns 포맷된 문자열 (예: 85.5%)
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * 바이트를 읽기 쉬운 형태로 포맷팅
 * @param bytes - 바이트 수
 * @returns 포맷된 문자열 (예: 1.5 MB)
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ==================== 시간/날짜 포맷팅 ====================

/**
 * Date 객체를 안전하게 생성
 * @param timestamp - 어떤 형태의 날짜 데이터든
 * @returns Date 객체 또는 null
 */
export function safeToDate(timestamp: any): Date | null {
    if (!timestamp) return null

    try {
        if (timestamp.toDate) {
            return timestamp.toDate()
        } else {
            const date = new Date(timestamp)
            // Invalid Date 체크
            if (isNaN(date.getTime())) {
                return null
            }
            return date
        }
    } catch (error) {
        return null
    }
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date - Date 객체 또는 타임스탬프
 * @param includeTime - 시간 포함 여부
 * @returns 포맷된 문자열
 */
export function formatDate(date: Date | any, includeTime: boolean = false): string {
    let dateObj: Date

    if (date?.toDate) {
        dateObj = date.toDate()
    } else {
        dateObj = new Date(date)
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    if (includeTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    return new Intl.DateTimeFormat('ko-KR', options).format(dateObj)
}

/**
 * Firestore Timestamp나 Date 객체를 한국어 상대 시간으로 변환
 * @param timestamp - Firestore Timestamp, Date 객체, 또는 날짜 문자열/숫자
 * @returns 포맷된 시간 문자열 (예: "5분 전", "어제", "2024년 1월 1일")
 */
export function formatRelativeTime(timestamp: any): string {
    if (!timestamp) return ''

    let date: Date

    try {
        if (timestamp.toDate) {
            date = timestamp.toDate()
        } else {
            date = new Date(timestamp)
        }
    } catch (error) {
        return ''
    }

    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 1분 미만
    if (diff < 60000) {
        return '방금 전'
    }

    // 1시간 미만
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000)
        return `${minutes}분 전`
    }

    // 24시간 미만
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000)
        return `${hours}시간 전`
    }

    // 7일 미만
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000)
        return `${days}일 전`
    }

    // 그 이상
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}

/**
 * 현재 시간으로부터의 거리를 포맷팅
 * @param date - Date 객체
 * @param options - 옵션 (addSuffix: true면 "전/후" 추가)
 * @returns 포맷된 문자열 (예: "5분", "5분 전")
 */
export function formatDistanceToNow(date: Date | any, options?: { addSuffix?: boolean }): string {
    const dateObj = safeToDate(date)
    if (!dateObj) return ''

    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()

    const seconds = Math.floor(Math.abs(diff) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    let result = ''

    if (years > 0) {
        result = `${years}년`
    } else if (months > 0) {
        result = `${months}개월`
    } else if (days > 0) {
        result = `${days}일`
    } else if (hours > 0) {
        result = `${hours}시간`
    } else if (minutes > 0) {
        result = `${minutes}분`
    } else {
        result = '방금'
    }

    if (options?.addSuffix && result !== '방금') {
        result += diff > 0 ? ' 전' : ' 후'
    }

    return result
}

/**
 * Firestore Timestamp나 Date 객체를 메시지용 시간 포맷으로 변환
 * @param timestamp - Firestore Timestamp, Date 객체, 또는 날짜 문자열/숫자
 * @returns 포맷된 시간 문자열 (오늘이면 시간만, 다른 날이면 날짜와 시간)
 */
export function formatMessageTime(timestamp: any): string {
    if (!timestamp) return ''

    let date: Date

    try {
        if (timestamp.toDate) {
            date = timestamp.toDate()
        } else {
            date = new Date(timestamp)
        }
    } catch (error) {
        return ''
    }

    // 오늘인지 확인
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
        // 오늘이면 시간만 표시
        return new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    } else {
        // 다른 날이면 날짜와 시간 표시
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }
}

/**
 * 초를 시간 형태로 포맷팅
 * @param seconds - 초
 * @returns 포맷된 문자열 (예: 1시간 30분, 45초)
 */
export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}초`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}시간`)
    if (minutes > 0) parts.push(`${minutes}분`)
    if (secs > 0 && hours === 0) parts.push(`${secs}초`)

    return parts.join(' ')
}

// ==================== 문자열 포맷팅 ====================

/**
 * 사용자명 포맷팅 (@username 형태로)
 * @param username - 사용자명
 * @returns 포맷된 사용자명
 */
export function formatUsername(username: string): string {
    return username.startsWith('@') ? username : `@${username}`
}

/**
 * 난이도를 한국어로 변환
 * @param difficulty - 영문 난이도
 * @returns 한국어 난이도
 */
export function formatDifficulty(difficulty: string): string {
    const difficultyMap: Record<string, string> = {
        'easy': '쉬움',
        'normal': '보통',
        'hard': '어려움',
        'extreme': '극악'
    }

    return difficultyMap[difficulty.toLowerCase()] || difficulty
}

// ==================== 별칭 함수 ====================

/**
 * formatBytes의 별칭
 */
export const formatFileSize = formatBytes