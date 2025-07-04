// components/ui/RatingSection.tsx

import React, {useEffect, useState} from 'react'
import {Button} from '@/components/ui/Button'
import {Avatar} from '@/components/ui/Avatar'
import {Badge} from '@/components/ui/Badge'
import {RatingService} from '@/lib/firebase/services/rating.service'
import {useAuth} from '@/contexts/AuthContext'
import {Rating, RatingStats, RatingWithUser} from '@/lib/firebase/types/rating.types'
import {Award, BarChart3, Star} from 'lucide-react'
import {formatDistanceToNow} from 'date-fns'
import {ko} from 'date-fns/locale'

interface RatingSectionProps {
    roomId: string
}

export function RatingSection({roomId}: RatingSectionProps) {
    const {user} = useAuth()  // Firestore User with avatarUrl
    const [stats, setStats] = useState<RatingStats | null>(null)
    const [reviews, setReviews] = useState<RatingWithUser[]>([])
    const [userRating, setUserRating] = useState<Rating | null>(null)
    const [loading, setLoading] = useState(true)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [selectedScore, setSelectedScore] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [hoveredStar, setHoveredStar] = useState(0)

    useEffect(() => {
        loadRatingData()
    }, [roomId, user])

    const loadRatingData = async () => {
        try {
            // 평점 통계 가져오기
            const ratingStats = await RatingService.getRatingStats(roomId)
            setStats(ratingStats)

            // 리뷰가 있는 평점들 가져오기
            const ratingReviews = await RatingService.getRatingsWithReviews(roomId, 10)
            setReviews(ratingReviews)

            // 현재 사용자의 평점 가져오기
            if (user) {
                const myRating = await RatingService.getUserRating(roomId, user.uid)
                setUserRating(myRating)
                if (myRating) {
                    setSelectedScore(myRating.score)
                    setReviewText(myRating.review || '')
                }
            }
        } catch (error) {
            console.error('Error loading rating data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitRating = async () => {
        if (!user || selectedScore === 0) return

        setSubmitting(true)
        try {
            await RatingService.createOrUpdateRating({
                roomId,
                userId: user.uid,
                score: selectedScore,
                review: reviewText.trim()
            })
            setShowRatingModal(false)
            await loadRatingData()
        } catch (error) {
            console.error('Error submitting rating:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 4.5) return 'text-emerald-400'
        if (score >= 3.5) return 'text-blue-400'
        if (score >= 2.5) return 'text-yellow-400'
        if (score >= 1.5) return 'text-orange-400'
        return 'text-red-400'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 4.5) return '훌륭함'
        if (score >= 3.5) return '좋음'
        if (score >= 2.5) return '보통'
        if (score >= 1.5) return '별로'
        return '나쁨'
    }

    const StarRating = ({
                            score,
                            interactive = false,
                            size = 'md',
                            onSelect,
                            onHover
                        }: {
        score: number,
        interactive?: boolean,
        size?: 'sm' | 'md' | 'lg',
        onSelect?: (score: number) => void,
        onHover?: (score: number) => void
    }) => {
        const sizes = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-7 h-7'
        }

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => interactive && onSelect?.(star)}
                        onMouseEnter={() => interactive && onHover?.(star)}
                        onMouseLeave={() => interactive && onHover?.(0)}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200`}
                    >
                        <Star
                            className={`${sizes[size]} ${
                                star <= (hoveredStar || score)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600 fill-gray-600'
                            } transition-colors`}
                        />
                    </button>
                ))}
            </div>
        )
    }

    const RatingDistribution = () => {
        if (!stats) return null

        const maxCount = Math.max(...Object.values(stats.distribution))

        return (
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((score) => {
                    const count = stats.distribution[score as keyof typeof stats.distribution]
                    const percentage = stats.totalCount > 0
                        ? (count / stats.totalCount) * 100
                        : 0

                    return (
                        <div key={score} className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 w-14">
                                <span className="text-sm font-medium">{score}</span>
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500 ease-out"
                                    style={{width: `${percentage}%`}}
                                />
                            </div>
                            <span className="text-sm text-gray-400 w-14 text-right">
                                {count}명
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-700 rounded w-1/4"/>
                    <div className="h-32 bg-gray-700 rounded"/>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400"/>
                    평점
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 평균 평점 */}
                    <div className="text-center space-y-3">
                        <div className="text-6xl font-bold">
                            <span className={getScoreColor(stats?.averageScore || 0)}>
                                {stats?.averageScore.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-3xl text-gray-500">/5</span>
                        </div>
                        <StarRating score={Math.round(stats?.averageScore || 0)} size="lg"/>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">
                                {getScoreLabel(stats?.averageScore || 0)}
                            </p>
                            <p className="text-sm text-gray-400">
                                총 {stats?.totalCount || 0}개의 평가
                            </p>
                        </div>
                    </div>

                    {/* 평점 분포 */}
                    <div>
                        <RatingDistribution/>
                    </div>
                </div>

                {/* 평가하기 버튼 */}
                <div className="mt-8 text-center">
                    {user ? (
                        <Button
                            variant={userRating ? 'secondary' : 'primary'}
                            onClick={() => setShowRatingModal(true)}
                            className="px-8 py-3 text-lg"
                        >
                            <Star className="w-5 h-5 mr-2"/>
                            {userRating ? '평가 수정하기' : '평가하기'}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/login'}
                            className="px-8 py-3 text-lg"
                        >
                            로그인하고 평가하기
                        </Button>
                    )}
                </div>
            </div>

            {/* 리뷰 목록 */}
            {reviews.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 mt-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400"/>
                        리뷰
                        <Badge variant="secondary" className="ml-2">
                            {reviews.length}
                        </Badge>
                    </h3>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-start gap-4">
                                    <Avatar
                                        src={review.user.photoURL}
                                        alt={review.user.displayName}
                                        size="sm"
                                        className="ring-2 ring-gray-700"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">{review.user.displayName}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    Lv.{review.user.level}
                                                </Badge>
                                                <StarRating score={review.score} size="sm"/>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDistanceToNow(review.createdAt.toDate(), {
                                                    addSuffix: true,
                                                    locale: ko
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{review.review}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 평가 모달 */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">방 평가하기</h3>

                        <div className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-gray-400">이 방을 평가해주세요</p>
                                <div className="flex justify-center">
                                    <StarRating
                                        score={selectedScore}
                                        interactive
                                        size="lg"
                                        onSelect={setSelectedScore}
                                        onHover={setHoveredStar}
                                    />
                                </div>
                                <p className="text-lg font-medium h-6">
                                    {selectedScore > 0 && (
                                        <span className={getScoreColor(selectedScore)}>
                                            {getScoreLabel(selectedScore)}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    리뷰 작성 (선택사항)
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="이 방에 대한 의견을 남겨주세요..."
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                                    rows={4}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {reviewText.length}/500
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={handleSubmitRating}
                                    disabled={selectedScore === 0 || submitting}
                                >
                                    {userRating ? '수정하기' : '평가하기'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowRatingModal(false)
                                        setSelectedScore(userRating?.score || 0)
                                        setReviewText(userRating?.review || '')
                                        setHoveredStar(0)
                                    }}
                                >
                                    취소
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}