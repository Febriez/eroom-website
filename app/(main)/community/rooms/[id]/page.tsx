'use client'

import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Button} from '@/components/ui/Button'
import {Badge} from '@/components/ui/Badge'
import {Skeleton} from '@/components/ui/Skeleton'
import {Avatar} from '@/components/ui/Avatar'
import {CommentSection} from '@/components/ui/CommentSection'
import {RatingSection} from '@/components/ui/RatingSection'
import {RoomService} from '@/lib/firebase/services/room.service'
import {UserService} from '@/lib/firebase/services/user.service'
import {useAuth} from '@/contexts/AuthContext'
import {Room} from '@/lib/firebase/types/room.types'
import {User} from '@/lib/firebase/types/user.types'
import {
    Calendar,
    Clock,
    Download,
    Edit,
    Eye,
    Flag,
    Heart,
    MessageSquare,
    Share2,
    Sparkles,
    Star,
    TrendingUp,
    Trophy
} from 'lucide-react'
import {formatDistanceToNow} from 'date-fns'
import {ko} from 'date-fns/locale'

export default function RoomDetailPage() {
    const params = useParams()
    const router = useRouter()
    const {user: currentUser} = useAuth()
    const roomId = params.id as string

    const [room, setRoom] = useState<Room | null>(null)
    const [creator, setCreator] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [likingInProgress, setLikingInProgress] = useState(false)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        if (roomId) {
            loadRoomData()
        }
    }, [roomId])

    useEffect(() => {
        // 현재 사용자가 이 방을 좋아요 했는지 확인
        if (currentUser && room) {
            checkIfLiked()
        }
    }, [currentUser, room])

    const loadRoomData = async () => {
        try {
            // 방 정보 가져오기
            const roomData = await RoomService.getRoom(roomId)
            if (!roomData) {
                router.push('/community/rooms')
                return
            }
            setRoom(roomData)

            // 제작자 정보 가져오기
            const creatorData = await UserService.getUserById(roomData.CreatorId)
            setCreator(creatorData)
        } catch (error) {
            console.error('Error loading room:', error)
            router.push('/community/rooms')
        } finally {
            setLoading(false)
        }
    }

    const checkIfLiked = async () => {
        if (!currentUser || !room) {
            setIsLiked(false)
            return
        }

        try {
            const liked = await RoomService.isRoomLikedByUser(roomId, currentUser.uid)
            setIsLiked(liked)
        } catch (error) {
            console.error('Error checking like status:', error)
            setIsLiked(false)
        }
    }

    const handleLike = async () => {
        if (!currentUser) {
            router.push('/login')
            return
        }

        if (likingInProgress || !room) return

        setLikingInProgress(true)
        try {
            const newLikedState = await RoomService.toggleLike(roomId, currentUser.uid)
            setIsLiked(newLikedState)

            // 로컬 상태 업데이트
            if (newLikedState) {
                setRoom({...room, LikeCount: room.LikeCount + 1})
            } else {
                setRoom({...room, LikeCount: Math.max(0, room.LikeCount - 1)})
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // 에러 발생 시 상태 재확인
            checkIfLiked()
        } finally {
            setLikingInProgress(false)
        }
    }

    const handleDownload = () => {
        // 다운로드 페이지로 이동
        router.push('/support/download')
    }

    const handleShare = async () => {
        try {
            // 공유 기능
            if (navigator.share) {
                await navigator.share({
                    title: room?.RoomTitle,
                    text: room?.RoomDescription,
                    url: window.location.href
                })
            } else {
                // 클립보드에 복사
                await navigator.clipboard.writeText(window.location.href)
                alert('링크가 복사되었습니다!')
            }
        } catch (error) {
            console.error('Error sharing:', error)
        }
    }

    const handleReport = () => {
        // 신고 페이지로 이동
        if (!currentUser) {
            router.push('/login')
            return
        }
        router.push('/support/inquiry')
    }

    const handleEdit = () => {
        // 수정 페이지로 이동
        router.push(`/community/rooms/${roomId}/edit`)
    }

    const getDifficultyConfig = (difficulty: string) => {
        const configs: Record<string, { color: string; label: string; icon: string }> = {
            'easy': {
                color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                label: '쉬움',
                icon: '🌱'
            },
            'normal': {
                color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                label: '보통',
                icon: '💎'
            },
            'hard': {
                color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
                label: '어려움',
                icon: '🔥'
            }
        }
        // 대소문자 구분 없이 처리하고, 기본값도 설정
        const normalizedDifficulty = difficulty?.toLowerCase() || 'normal'
        return configs[normalizedDifficulty] || configs['normal']
    }

    const handleCreatorClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (creator) {
            router.push(`/profile/${creator.uid}`)
        }
    }

    if (loading) {
        return (
            <>
                <PageHeader title="" description=""/>
                <Container className="py-12">
                    <div className="max-w-7xl mx-auto">
                        <Skeleton className="aspect-[21/9] mb-8 rounded-2xl"/>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Skeleton className="h-32 rounded-xl"/>
                                <Skeleton className="h-48 rounded-xl"/>
                                <Skeleton className="h-64 rounded-xl"/>
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-48 rounded-xl"/>
                                <Skeleton className="h-32 rounded-xl"/>
                            </div>
                        </div>
                    </div>
                </Container>
            </>
        )
    }

    if (!room) {
        return null
    }

    const difficultyConfig = getDifficultyConfig(room.Difficulty)

    return (
        <>
            <PageHeader
                title={room.RoomTitle}
                description={`${creator?.displayName || '알 수 없는 제작자'} 제작`}
                badge={
                    <Badge
                        variant="outline"
                        className={`${difficultyConfig.color} border px-3 py-1`}
                    >
                        <span className="mr-1">{difficultyConfig.icon}</span>
                        {difficultyConfig.label}
                    </Badge>
                }
            />

            <Container className="py-12">
                <div className="max-w-7xl mx-auto">
                    {/* 썸네일 섹션 */}
                    <div
                        className="relative aspect-[21/9] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                        {room.Thumbnail && !imageError ? (
                            <img
                                src={room.Thumbnail}
                                alt={room.RoomTitle}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                                <div className="text-center">
                                    <div
                                        className="w-32 h-32 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <Download className="w-16 h-16 text-gray-500"/>
                                    </div>
                                    <p className="text-gray-400 text-lg">썸네일 없음</p>
                                </div>
                            </div>
                        )}

                        {/* 그라데이션 오버레이 */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>

                        {/* 통계 오버레이 */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-center gap-6 text-white">
                                <div
                                    className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                    <Eye className="w-5 h-5"/>
                                    <span className="font-semibold">{room.PlayCount.toLocaleString()}</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                    <Heart className="w-5 h-5"/>
                                    <span className="font-semibold">{room.LikeCount.toLocaleString()}</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                    <MessageSquare className="w-5 h-5"/>
                                    <span className="font-semibold">{room.CommentAuthorIds.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 왼쪽: 방 정보 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 설명 */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-yellow-400"/>
                                    설명
                                </h2>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                                    {room.RoomDescription || '설명이 없습니다.'}
                                </p>
                            </div>

                            {/* 태그 */}
                            {room.Keywords && room.Keywords.length > 0 && (
                                <div
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
                                    <h2 className="text-2xl font-bold mb-4">태그</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {room.Keywords.map((keyword, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                            >
                                                #{keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 평점 섹션 */}
                            <RatingSection roomId={roomId}/>

                            {/* 댓글 섹션 */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
                                <CommentSection roomId={roomId}/>
                            </div>
                        </div>

                        {/* 오른쪽: 액션 및 제작자 정보 */}
                        <div className="space-y-6">
                            {/* 액션 버튼들 */}
                            <div
                                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 space-y-4">
                                <Button
                                    variant="primary"
                                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    onClick={handleDownload}
                                >
                                    <Download className="w-6 h-6 mr-2"/>
                                    게임 다운로드
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={isLiked ? "secondary" : "outline"}
                                        onClick={handleLike}
                                        disabled={likingInProgress}
                                        className="h-12"
                                    >
                                        <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-current' : ''}`}/>
                                        {isLiked ? '좋아요!' : '좋아요'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleShare}
                                        className="h-12"
                                    >
                                        <Share2 className="w-5 h-5 mr-1"/>
                                        공유
                                    </Button>
                                </div>

                                {currentUser?.uid === room.CreatorId ? (
                                    <Button
                                        variant="outline"
                                        className="w-full h-12"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="w-5 h-5 mr-2"/>
                                        수정하기
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-red-400 hover:text-red-300 hover:bg-red-400/10 hover:border-red-400"
                                        onClick={handleReport}
                                    >
                                        <Flag className="w-5 h-5 mr-2"/>
                                        신고하기
                                    </Button>
                                )}
                            </div>

                            {/* 제작자 정보 */}
                            {creator && (
                                <div
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h3 className="text-lg font-semibold mb-4">제작자</h3>
                                    <div
                                        className="flex items-center gap-4 cursor-pointer hover:bg-gray-700/30 rounded-lg p-3 -m-3 transition-colors"
                                        onClick={handleCreatorClick}
                                    >
                                        <Avatar
                                            src={creator.avatarUrl}
                                            alt={creator.displayName}
                                            size="lg"
                                            className="ring-2 ring-gray-700"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">{creator.displayName}</p>
                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4"/>
                                                    Lv.{creator.level}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4"/>
                                                    {creator.points.toLocaleString()}P
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 방 정보 */}
                            <div
                                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold mb-4">방 정보</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <span className="text-2xl">🎭</span>
                                            테마
                                        </span>
                                        <span className="font-medium">{room.Theme}</span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <span className="text-2xl">{difficultyConfig.icon}</span>
                                            난이도
                                        </span>
                                        <span className={`font-medium ${difficultyConfig.color.split(' ')[0]}`}>
                                            {difficultyConfig.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <Download className="w-5 h-5"/>
                                            버전
                                        </span>
                                        <span className="font-medium">v{room.Version}</span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-5 h-5"/>
                                            생성일
                                        </span>
                                        <span className="font-medium">
                                            {formatDistanceToNow(room.CreatedDate.toDate(), {
                                                addSuffix: true,
                                                locale: ko
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <Clock className="w-5 h-5"/>
                                            업데이트
                                        </span>
                                        <span className="font-medium">
                                            {formatDistanceToNow(room.LastUpdated.toDate(), {
                                                addSuffix: true,
                                                locale: ko
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 통계 카드 */}
                            <div
                                className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-400"/>
                                    통계
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-400">
                                            {room.PlayCount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">플레이</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-400">
                                            {room.LikeCount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">좋아요</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">
                                            {room.CommentAuthorIds.length}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">댓글</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}