import {useEffect, useState} from 'react'
import {Modal} from '@/components/ui/Modal'
import {Button} from '@/components/ui/Button'
import {Avatar} from '@/components/ui/Avatar'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {SocialService} from '@/lib/firebase/services'
import {formatRelativeTime} from '@/lib/utils'
import {Timestamp} from 'firebase/firestore'

interface FriendRequest {
    id: string
    from: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
        level?: number
    }
    to: {
        uid: string
        username: string
        displayName: string
    }
    status: 'pending' | 'accepted' | 'rejected'
    createdAt: Timestamp
}

interface FriendRequestModalProps {
    isOpen: boolean
    onClose: () => void
    currentUserId: string
}

export default function FriendRequestModal({isOpen, onClose, currentUserId}: FriendRequestModalProps) {
    const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen || !currentUserId) return

        setLoading(true)

        // 받은 요청 구독
        const unsubscribeReceived = SocialService.subscribeToReceivedFriendRequests(
            currentUserId,
            (requests) => {
                setReceivedRequests(requests)
                setLoading(false)
            }
        )

        // 보낸 요청 구독
        const unsubscribeSent = SocialService.subscribeToSentFriendRequests(
            currentUserId,
            (requests) => {
                setSentRequests(requests)
                setLoading(false)
            }
        )

        // 클린업 함수
        return () => {
            unsubscribeReceived()
            unsubscribeSent()
        }
    }, [isOpen, currentUserId])

    const handleAcceptRequest = async (request: FriendRequest) => {
        setActionLoading(request.id)
        try {
            await SocialService.acceptFriendRequest(request.id, currentUserId, request.from.uid)

            // 목록에서 제거
            setReceivedRequests(prev => prev.filter(r => r.id !== request.id))

            alert(`${request.from.displayName}님과 친구가 되었습니다!`)
        } catch (error) {
            console.error('Error accepting friend request:', error)
            alert('친구 요청 수락에 실패했습니다.')
        } finally {
            setActionLoading(null)
        }
    }

    const handleRejectRequest = async (request: FriendRequest) => {
        if (!confirm(`${request.from.displayName}님의 친구 요청을 거절하시겠습니까?`)) return

        setActionLoading(request.id)
        try {
            await SocialService.rejectFriendRequest(request.id)

            // 목록에서 제거
            setReceivedRequests(prev => prev.filter(r => r.id !== request.id))
        } catch (error) {
            console.error('Error rejecting friend request:', error)
            alert('친구 요청 거절에 실패했습니다.')
        } finally {
            setActionLoading(null)
        }
    }

    const handleCancelRequest = async (request: FriendRequest) => {
        if (!confirm('친구 요청을 취소하시겠습니까?')) return

        setActionLoading(request.id)
        try {
            await SocialService.cancelFriendRequest(request.id)

            // 목록에서 제거
            setSentRequests(prev => prev.filter(r => r.id !== request.id))
        } catch (error) {
            console.error('Error canceling friend request:', error)
            alert('친구 요청 취소에 실패했습니다.')
        } finally {
            setActionLoading(null)
        }
    }

    const handleUserClick = (username: string) => {
        window.open(`/profile/${username}`, '_blank')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="친구 요청" size="lg">
            <div className="h-[500px] flex flex-col">
                <Tabs defaultValue="received" className="flex-1 flex flex-col">
                    <TabsList className="mb-4">
                        <TabsTrigger value="received">
                            받은 요청 ({receivedRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="sent">
                            보낸 요청 ({sentRequests.length})
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"/>
                            </div>
                        ) : (
                            <>
                                <TabsContent value="received">
                                    <div className="space-y-3">
                                        {receivedRequests.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">받은 친구 요청이 없습니다</p>
                                        ) : (
                                            receivedRequests.map(request => (
                                                <div key={request.id}
                                                     className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleUserClick(request.from.username)}
                                                            className="hover:opacity-80 transition-opacity"
                                                        >
                                                            <Avatar
                                                                src={request.from.avatarUrl}
                                                                size="md"
                                                            />
                                                        </button>
                                                        <div>
                                                            <button
                                                                onClick={() => handleUserClick(request.from.username)}
                                                                className="hover:underline"
                                                            >
                                                                <p className="font-medium">{request.from.displayName}</p>
                                                                <p className="text-sm text-gray-400">@{request.from.username}</p>
                                                            </button>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatRelativeTime(request.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleAcceptRequest(request)}
                                                            disabled={actionLoading === request.id}
                                                        >
                                                            수락
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRejectRequest(request)}
                                                            disabled={actionLoading === request.id}
                                                        >
                                                            거절
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="sent">
                                    <div className="space-y-3">
                                        {sentRequests.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">보낸 친구 요청이 없습니다</p>
                                        ) : (
                                            sentRequests.map(request => (
                                                <div key={request.id}
                                                     className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleUserClick(request.to.username)}
                                                            className="hover:opacity-80 transition-opacity"
                                                        >
                                                            <Avatar
                                                                src={undefined} // 받는 사람의 아바타는 별도로 가져와야 함
                                                                size="md"
                                                            />
                                                        </button>
                                                        <div>
                                                            <button
                                                                onClick={() => handleUserClick(request.to.username)}
                                                                className="hover:underline"
                                                            >
                                                                <p className="font-medium">{request.to.displayName}</p>
                                                                <p className="text-sm text-gray-400">@{request.to.username}</p>
                                                            </button>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatRelativeTime(request.createdAt)} • 대기 중
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCancelRequest(request)}
                                                        disabled={actionLoading === request.id}
                                                    >
                                                        취소
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </div>
                </Tabs>
            </div>
        </Modal>
    )
}