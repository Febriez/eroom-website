import {Timestamp} from 'firebase/firestore'

// 평점 인터페이스
export interface Rating {
    id: string
    roomId: string                    // 어떤 맵(룸)의 평점인지
    userId: string                    // 평가한 사용자 ID
    score: number                     // 평점 (1-5)
    review?: string                   // 리뷰 내용 (선택사항)
    createdAt: Timestamp
    updatedAt: Timestamp
}

// 평점 생성/업데이트 시 필요한 데이터
export interface CreateRatingData {
    roomId: string
    userId: string
    score: number
    review?: string
}

// 평점 통계
export interface RatingStats {
    averageScore: number              // 평균 평점
    totalCount: number                // 총 평가 수
    distribution: {                   // 점수별 분포
        1: number
        2: number
        3: number
        4: number
        5: number
    }
}

// UI에서 사용할 평점 타입 (사용자 정보 포함)
export interface RatingWithUser extends Rating {
    user: {
        uid: string
        displayName: string
        photoURL: string
        level: number
    }
}