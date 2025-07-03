// lib/utils/formatters.ts

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

/**
 * 초를 시간 형태로 포맷팅
 * @param seconds - 초
 * @returns 포맷된 문자열 (예: 1h 30m, 45s)
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

/**
 * 사용자명 포맷팅 (@username 형태로)
 * @param username - 사용자명
 * @returns 포맷된 사용자명
 */
export function formatUsername(username: string): string {
    return username.startsWith('@') ? username : `@${username}`
}

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 * @param size - 파일 크기 (바이트)
 * @returns 포맷된 문자열
 */
export function formatFileSize(size: number): string {
    return formatBytes(size)
}

// Re-export formatRelativeTime and formatMessageTime from formatTime.ts
export {formatRelativeTime, formatMessageTime, safeToDate} from './formatTime'