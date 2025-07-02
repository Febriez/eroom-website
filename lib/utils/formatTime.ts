// lib/utils/formatTime.ts

/**
 * Firestore Timestamp나 Date 객체를 한국어 상대 시간으로 변환
 * @param timestamp - Firestore Timestamp, Date 객체, 또는 날짜 문자열/숫자
 * @returns 포맷된 시간 문자열 (예: "5분 전", "어제", "2024년 1월 1일")
 */
export function formatRelativeTime(timestamp: any): string {
    if (!timestamp) return ''

    let date: Date;

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
 * Firestore Timestamp나 Date 객체를 메시지용 시간 포맷으로 변환
 * @param timestamp - Firestore Timestamp, Date 객체, 또는 날짜 문자열/숫자
 * @returns 포맷된 시간 문자열 (오늘이면 시간만, 다른 날이면 날짜와 시간)
 */
export function formatMessageTime(timestamp: any): string {
    if (!timestamp) return '';

    let date: Date;

    try {
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
    } catch (error) {
        return '';
    }

    // 오늘인지 확인
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
        // 오늘이면 시간만 표시
        return new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } else {
        // 다른 날이면 날짜와 시간 표시
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

/**
 * Date 객체를 안전하게 생성
 * @param timestamp - 어떤 형태의 날짜 데이터든
 * @returns Date 객체 또는 null
 */
export function safeToDate(timestamp: any): Date | null {
    if (!timestamp) return null;

    try {
        if (timestamp.toDate) {
            return timestamp.toDate();
        } else {
            const date = new Date(timestamp);
            // Invalid Date 체크
            if (isNaN(date.getTime())) {
                return null;
            }
            return date;
        }
    } catch (error) {
        return null;
    }
}