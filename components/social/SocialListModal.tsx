import {useEffect, useState} from 'react'
import {Clock, MessageSquare, Users} from 'lucide-react'
import {Modal} from '@/components/ui/Modal'
import {Avatar} from '@/components/ui/Avatar'
import {UserService} from '@/lib/firebase/services'
import type {User} from '@/lib/firebase/types'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
import {useConversations} from '@/lib/hooks/useConversations'

interface SocialListModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'followers' | 'following'
    userIds: string[]
    currentUserId: string
}

type SortBy = 'username' | 'followers' | 'time'
type SortOrder = 'asc' | 'desc'

interface UserWithTime extends User {
    followTime?: Date
}

export default function SocialListModal({
                                            isOpen,
                                            onClose,
                                            type,
                                            userIds,
                                            currentUserId
                                        }: SocialListModalProps) {
    const [users, setUsers] = useState<UserWithTime[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState<SortBy>('time')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const router = useRouter()
    const {user: currentUser} = useAuth()
    const {createConversation} = useConversations()
    const [messageLoading, setMessageLoading] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            if (!isOpen || userIds.length === 0) {
                setUsers([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const userPromises = userIds.map(async (uid) => {
                    return await UserService.getUserById(uid)
                })

                const fetchedUsers = await Promise.all(userPromises)
                const validUsers = fetchedUsers.filter((u): u is User => u !== null)

                // 임시로 followTime을 추가 (실제로는 follow 관계 데이터에서 가져와야 함)
                const usersWithTime = validUsers.map((user, index) => ({
                    ...user,
                    followTime: new Date(Date.now() - index * 86400000) // 임시 데이터
                }))

                setUsers(usersWithTime)
            } catch (error) {
                console.error('Error fetching users:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [isOpen, userIds])

    const handleSort = (newSortBy: SortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        let compareValue = 0

        switch (sortBy) {
            case 'username':
                compareValue = a.username.localeCompare(b.username)
                break
            case 'followers':
                compareValue = a.social.followers.length - b.social.followers.length
                break
            case 'time':
                compareValue = (a.followTime?.getTime() || 0) - (b.followTime?.getTime() || 0)
                break
        }

        return sortOrder === 'asc' ? compareValue : -compareValue
    })

    const handleProfileClick = (username: string) => {
        router.push(`/profile/${username}`)
        onClose()
    }

    const handleMessageClick = async (user: User) => {
        if (!currentUser) return

        setMessageLoading(user.uid)
        try {
            const conversationId = await createConversation(user.uid, {
                username: user.username,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl
            })

            router.push(`/profile/${currentUser.username}?openChat=${conversationId}`)
            onClose()
        } catch (error) {
            console.error('Error creating conversation:', error)
        } finally {
            setMessageLoading(null)
        }
    }

    const formatFollowTime = (date?: Date) => {
        if (!date) return ''

        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / 86400000)
        const hours = Math.floor(diff / 3600000)
        const minutes = Math.floor(diff / 60000)

        if (days > 0) return `${days}일 전`
        if (hours > 0) return `${hours}시간 전`
        if (minutes > 0) return `${minutes}분 전`
        return '방금 전'
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'followers' ? '팔로워' : '팔로잉'}
            size="lg"
        >
            <div className="h-[600px] flex flex-col">
                {/* 정렬 옵션 */}
                <div className="p-4 border-b border-gray-800 flex items-center gap-4">
                    <span className="text-sm text-gray-400">정렬:</span>
                    <button
                        onClick={() => handleSort('time')}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                            sortBy === 'time'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => handleSort('username')}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                            sortBy === 'username'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        이름순
                    </button>
                    <button
                        onClick={() => handleSort('followers')}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                            sortBy === 'followers'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        팔로워순
                    </button>
                </div>

                {/* 사용자 목록 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"/>
                        </div>
                    ) : sortedUsers.length > 0 ? (
                        <div className="grid gap-3">
                            {sortedUsers.map((user) => (
                                <div
                                    key={user.uid}
                                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-3 flex-1 cursor-pointer"
                                            onClick={() => handleProfileClick(user.username)}
                                        >
                                            <Avatar
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                size="md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white">
                                                    {user.displayName}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    @{user.username}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3"/>
                                                        {user.social.followers.length} 팔로워
                                                    </span>
                                                    {user.followTime && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3"/>
                                                            {formatFollowTime(user.followTime)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 메시지 버튼 */}
                                        {currentUser && user.uid !== currentUser.uid && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleMessageClick(user)
                                                }}
                                                disabled={messageLoading === user.uid}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                                                title="메시지 보내기"
                                            >
                                                {messageLoading === user.uid ? (
                                                    <div
                                                        className="animate-spin rounded-full h-4 w-4 border-t-2 border-green-500"/>
                                                ) : (
                                                    <MessageSquare className="w-4 h-4 text-green-400"/>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Users className="w-12 h-12 mb-2 opacity-50"/>
                            <p>{type === 'followers' ? '팔로워가 없습니다' : '팔로잉이 없습니다'}</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}