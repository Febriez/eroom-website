import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {BaseService} from './base.service'
import {COLLECTIONS} from '../collections'
import {db} from '../config'
import {UserService} from './user.service'
import {RoomService} from './room.service'
import type {Comment, CommentWithAuthor, CreateCommentData, UpdateCommentData} from '@/lib/firebase/types/comment.types'

export class CommentService extends BaseService {
    /**
     * 특정 룸의 댓글 가져오기
     */
    static async getCommentsByRoom(roomId: string): Promise<CommentWithAuthor[]> {
        const q = query(
            collection(db, COLLECTIONS.COMMENTS),
            where('roomId', '==', roomId),
            where('isDeleted', '==', false),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        const comments: Comment[] = []

        snapshot.forEach((doc) => {
            comments.push({id: doc.id, ...doc.data()} as Comment)
        })

        // 작성자 정보 추가
        const commentsWithAuthors = await Promise.all(
            comments.map(async (comment) => {
                const author = await UserService.getUserById(comment.authorId)
                return {
                    ...comment,
                    author: author ? {
                        uid: author.uid,
                        displayName: author.displayName,
                        photoURL: author.avatarUrl || '',
                        level: author.level
                    } : {
                        uid: comment.authorId,
                        displayName: '탈퇴한 사용자',
                        photoURL: '',
                        level: 0
                    }
                } as CommentWithAuthor
            })
        )

        // 대댓글 구조화
        const parentComments = commentsWithAuthors.filter(c => !c.parentId)
        const childComments = commentsWithAuthors.filter(c => c.parentId)

        parentComments.forEach(parent => {
            parent.replies = childComments.filter(child => child.parentId === parent.id)
        })

        return parentComments
    }

    /**
     * 댓글 작성
     */
    static async createComment(data: CreateCommentData): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTIONS.COMMENTS), {
            ...data,
            isEdited: false,
            isDeleted: false,
            likeCount: 0,
            likedBy: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        // 룸의 댓글 작성자 목록에 추가
        await RoomService.addCommentAuthor(data.roomId, data.authorId)

        return docRef.id
    }

    /**
     * 댓글 수정
     */
    static async updateComment(
        commentId: string,
        data: UpdateCommentData
    ): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.COMMENTS, commentId), {
            ...data,
            isEdited: true,
            updatedAt: serverTimestamp()
        })
    }

    /**
     * 댓글 삭제 (soft delete)
     */
    static async deleteComment(commentId: string): Promise<void> {
        const commentDoc = await getDoc(doc(db, COLLECTIONS.COMMENTS, commentId))
        if (!commentDoc.exists()) return

        const comment = commentDoc.data() as Comment

        await updateDoc(doc(db, COLLECTIONS.COMMENTS, commentId), {
            isDeleted: true,
            content: '삭제된 댓글입니다.',
            updatedAt: serverTimestamp()
        })

        // 대댓글이 있는지 확인
        const q = query(
            collection(db, COLLECTIONS.COMMENTS),
            where('parentId', '==', commentId),
            where('isDeleted', '==', false)
        )
        const snapshot = await getDocs(q)

        // 대댓글이 없고 부모 댓글이 아닌 경우, 작성자 목록에서 제거 검토
        if (snapshot.empty && !comment.parentId) {
            // 해당 사용자가 다른 댓글을 작성했는지 확인
            const userCommentsQuery = query(
                collection(db, COLLECTIONS.COMMENTS),
                where('roomId', '==', comment.roomId),
                where('authorId', '==', comment.authorId),
                where('isDeleted', '==', false)
            )
            const userCommentsSnapshot = await getDocs(userCommentsQuery)

            if (userCommentsSnapshot.empty) {
                await RoomService.removeCommentAuthor(comment.roomId, comment.authorId)
            }
        }
    }

    /**
     * 댓글 좋아요 토글
     */
    static async toggleCommentLike(
        commentId: string,
        userId: string
    ): Promise<boolean> {
        const commentRef = doc(db, COLLECTIONS.COMMENTS, commentId)
        const commentDoc = await getDoc(commentRef)

        if (!commentDoc.exists()) {
            throw new Error('댓글을 찾을 수 없습니다.')
        }

        const comment = commentDoc.data() as Comment
        const isLiked = comment.likedBy.includes(userId)

        if (isLiked) {
            // 좋아요 취소
            await updateDoc(commentRef, {
                likedBy: arrayRemove(userId),
                likeCount: increment(-1)
            })
            return false
        } else {
            // 좋아요
            await updateDoc(commentRef, {
                likedBy: arrayUnion(userId),
                likeCount: increment(1)
            })
            return true
        }
    }

    /**
     * 특정 사용자가 작성한 댓글 수 가져오기
     */
    static async getUserCommentCount(userId: string): Promise<number> {
        const q = query(
            collection(db, COLLECTIONS.COMMENTS),
            where('authorId', '==', userId),
            where('isDeleted', '==', false)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
    }

    /**
     * 특정 사용자가 좋아요한 댓글인지 확인
     */
    static async isCommentLikedByUser(
        commentId: string,
        userId: string
    ): Promise<boolean> {
        const commentDoc = await getDoc(doc(db, COLLECTIONS.COMMENTS, commentId))
        if (!commentDoc.exists()) return false

        const comment = commentDoc.data() as Comment
        return comment.likedBy.includes(userId)
    }
}