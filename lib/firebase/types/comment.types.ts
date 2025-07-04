import {Timestamp} from 'firebase/firestore'

// 댓글 인터페이스
export interface Comment {
    id: string
    roomId: string                    // 어떤 맵(룸)의 댓글인지
    authorId: string                  // 작성자 ID
    content: string                   // 댓글 내용
    parentId?: string                 // 대댓글인 경우 부모 댓글 ID
    isEdited: boolean                 // 수정 여부
    isDeleted: boolean                // 삭제 여부 (soft delete)
    likeCount: number                 // 좋아요 수
    likedBy: string[]                 // 좋아요한 사용자 ID 목록
    createdAt: Timestamp
    updatedAt: Timestamp
}

// 댓글 생성 시 필요한 데이터
export interface CreateCommentData {
    roomId: string
    authorId: string
    content: string
    parentId?: string
}

// 댓글 업데이트 시 필요한 데이터
export interface UpdateCommentData {
    content: string
}

// UI에서 사용할 댓글 타입 (작성자 정보 포함)
export interface CommentWithAuthor extends Comment {
    author: {
        uid: string
        displayName: string
        photoURL: string
        level: number
    }
    replies?: CommentWithAuthor[]     // 대댓글 목록
}