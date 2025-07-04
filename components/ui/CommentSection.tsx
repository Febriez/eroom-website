import React, {useEffect, useState} from 'react'
import {Button} from '@/components/ui/Button'
import {Avatar} from '@/components/ui/Avatar'
import {Badge} from '@/components/ui/Badge'
import {CommentService} from '@/lib/firebase/services/comment.service'
import {useAuth} from '@/contexts/AuthContext'
import {CommentWithAuthor} from '@/lib/firebase/types/comment.types'
import {ChevronDown, ChevronUp, Edit, Heart, MessageSquare, Trash2} from 'lucide-react'
import {formatDistanceToNow} from 'date-fns'
import {ko} from 'date-fns/locale'

interface CommentSectionProps {
    roomId: string
}

export function CommentSection({roomId}: CommentSectionProps) {
    const {user} = useAuth()
    const [comments, setComments] = useState<CommentWithAuthor[]>([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
    const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())

    useEffect(() => {
        loadComments()
    }, [roomId])

    const loadComments = async () => {
        try {
            const loadedComments = await CommentService.getCommentsByRoom(roomId)
            setComments(loadedComments)

            // 좋아요한 댓글 확인
            if (user) {
                const likedSet = new Set<string>()
                for (const comment of loadedComments) {
                    if (comment.likedBy.includes(user.uid)) {
                        likedSet.add(comment.id)
                    }
                    // 대댓글도 확인
                    if (comment.replies) {
                        for (const reply of comment.replies) {
                            if (reply.likedBy.includes(user.uid)) {
                                likedSet.add(reply.id)
                            }
                        }
                    }
                }
                setLikedComments(likedSet)
            }
        } catch (error) {
            console.error('Error loading comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitComment = async () => {
        if (!user || !newComment.trim()) return

        setSubmitting(true)
        try {
            await CommentService.createComment({
                roomId,
                authorId: user.uid,
                content: newComment.trim()
            })
            setNewComment('')
            await loadComments()
        } catch (error) {
            console.error('Error creating comment:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitReply = async () => {
        if (!user || !replyContent.trim() || !replyTo) return

        setSubmitting(true)
        try {
            await CommentService.createComment({
                roomId,
                authorId: user.uid,
                content: replyContent.trim(),
                parentId: replyTo
            })
            setReplyContent('')
            setReplyTo(null)
            await loadComments()
        } catch (error) {
            console.error('Error creating reply:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditComment = async (commentId: string) => {
        if (!editContent.trim()) return

        setSubmitting(true)
        try {
            await CommentService.updateComment(commentId, {
                content: editContent.trim()
            })
            setEditingId(null)
            setEditContent('')
            await loadComments()
        } catch (error) {
            console.error('Error updating comment:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return

        try {
            await CommentService.deleteComment(commentId)
            await loadComments()
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
    }

    const handleLikeComment = async (commentId: string) => {
        if (!user) {
            window.location.href = '/login'
            return
        }

        try {
            const isLiked = await CommentService.toggleCommentLike(commentId, user.uid)
            setLikedComments(prev => {
                const newSet = new Set(prev)
                if (isLiked) {
                    newSet.add(commentId)
                } else {
                    newSet.delete(commentId)
                }
                return newSet
            })
            await loadComments()
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    const toggleReplies = (commentId: string) => {
        setCollapsedComments(prev => {
            const newSet = new Set(prev)
            if (newSet.has(commentId)) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })
    }

    const CommentItem = ({comment, isReply = false}: { comment: CommentWithAuthor, isReply?: boolean }) => {
        const isAuthor = user?.uid === comment.authorId
        const isLiked = likedComments.has(comment.id)
        const hasReplies = comment.replies && comment.replies.length > 0
        const isCollapsed = collapsedComments.has(comment.id)

        return (
            <div className={`${isReply ? 'ml-12' : ''}`}>
                <div className="flex gap-3">
                    <Avatar
                        src={comment.author.photoURL}
                        alt={comment.author.displayName}
                        size="sm"
                        className="ring-2 ring-gray-700"
                    />
                    <div className="flex-1">
                        <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{comment.author.displayName}</span>
                                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                        Lv.{comment.author.level}
                                    </Badge>
                                    <span className="text-sm text-gray-400">
                                        {formatDistanceToNow(comment.createdAt.toDate(), {
                                            addSuffix: true,
                                            locale: ko
                                        })}
                                    </span>
                                    {comment.isEdited && (
                                        <span className="text-xs text-gray-500">(수정됨)</span>
                                    )}
                                </div>
                                {isAuthor && !comment.isDeleted && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(comment.id)
                                                setEditContent(comment.content)
                                            }}
                                            className="p-1 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        placeholder="댓글을 수정하세요..."
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleEditComment(comment.id)}
                                            disabled={submitting}
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingId(null)
                                                setEditContent('')
                                            }}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className={`text-gray-300 ${comment.isDeleted ? 'italic text-gray-500' : ''}`}>
                                    {comment.content}
                                </p>
                            )}
                        </div>

                        {!comment.isDeleted && (
                            <div className="flex items-center gap-4 mt-3 ml-4">
                                <button
                                    onClick={() => handleLikeComment(comment.id)}
                                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                                        isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}/>
                                    <span>{comment.likeCount > 0 ? comment.likeCount : '좋아요'}</span>
                                </button>
                                {!isReply && (
                                    <button
                                        onClick={() => {
                                            setReplyTo(comment.id)
                                            setReplyContent(`@${comment.author.displayName} `)
                                        }}
                                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        <MessageSquare className="w-4 h-4"/>
                                        답글
                                    </button>
                                )}
                                {hasReplies && !isReply && (
                                    <button
                                        onClick={() => toggleReplies(comment.id)}
                                        className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        {isCollapsed ? <ChevronDown className="w-4 h-4"/> :
                                            <ChevronUp className="w-4 h-4"/>}
                                        답글 {comment.replies!.length}개
                                    </button>
                                )}
                            </div>
                        )}

                        {/* 답글 입력 폼 */}
                        {replyTo === comment.id && (
                            <div className="mt-4 ml-4 flex gap-3">
                                <Avatar
                                    src={user?.avatarUrl || ''}
                                    alt={user?.displayName || ''}
                                    size="sm"
                                />
                                <div className="flex-1 space-y-2">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="답글을 입력하세요..."
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleSubmitReply}
                                            disabled={submitting}
                                        >
                                            답글 작성
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setReplyTo(null)
                                                setReplyContent('')
                                            }}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 대댓글 */}
                        {hasReplies && !isCollapsed && (
                            <div className="mt-4 space-y-4">
                                {comment.replies!.map((reply) => (
                                    <CommentItem key={reply.id} comment={reply} isReply/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-400"/>
                댓글
                <span className="text-gray-400 text-lg font-normal">
                    {comments.length}개
                </span>
            </h2>

            {/* 댓글 작성 폼 */}
            {user ? (
                <div className="flex gap-3">
                    <Avatar
                        src={user.avatarUrl || ''}
                        alt={user.displayName || ''}
                        size="sm"
                        className="ring-2 ring-gray-700"
                    />
                    <div className="flex-1 space-y-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim() || submitting}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                댓글 작성
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4"/>
                    <p className="text-gray-400 mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                        로그인하기
                    </Button>
                </div>
            )}

            {/* 댓글 목록 */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-gray-700 rounded-full"/>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-700 rounded w-1/4"/>
                                    <div className="h-20 bg-gray-700 rounded"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                    <p className="text-lg">아직 댓글이 없습니다.</p>
                    <p className="text-gray-500 mt-2">첫 번째 댓글을 작성해보세요!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment}/>
                    ))}
                </div>
            )}
        </div>
    )
}