'use client'

import {useEffect, useState} from 'react'
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
import {ProfileProvider, useProfile} from '@/contexts/ProfileContext'
import {useNotifications} from '@/lib/hooks/useNotifications'
import {useConversations} from '@/lib/hooks/useConversations'
import {useMessages} from '@/lib/hooks/useMessages'
import {SocialService, UserService} from '@/lib/firebase/services'
import {Container} from '@/components/ui/Container'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Modal} from '@/components/ui/Modal'
import ConversationList from '@/components/messaging/ConversationList'
import MessageThread from '@/components/messaging/MessageThread'
import SocialListModal from '@/components/social/SocialListModal'
import FriendRequestModal from '@/components/social/FriendRequestModal'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileStats from '@/components/profile/ProfileStats'
import NotificationSection from '@/components/profile/NotificationSection'
import SettingsModal from '@/components/profile/SettingsModal'
import {doc, serverTimestamp, updateDoc} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {formatRelativeTime} from '@/lib/utils'
import type {NotificationCategory} from '@/lib/firebase/types'

type NotificationFilter = NotificationCategory

function ProfilePageContent() {
    // 라우팅 관련
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const username = params.userId as string
    const openChatId = searchParams.get('openChat')

    // 인증 및 훅
    const {user: currentUser, updateUserProfile} = useAuth()
    const {
        profileUser,
        loading,
        isOwnProfile,
        isFriend,
        isFollowing,
        isBlocked,
        hasPendingRequest,
        receivedRequest,
        socialLoading,
        updateProfileUser,
        handleFollowToggle: contextHandleFollowToggle,
        handleFriendToggle: contextHandleFriendToggle,
        handleBlockToggle: contextHandleBlockToggle
    } = useProfile()

    const {
        notifications,
        browserNotificationPermission,
        requestBrowserNotificationPermission,
        markAsRead
    } = useNotifications()
    const {conversations, createConversation} = useConversations()

    // UI 상태
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showMessagesModal, setShowMessagesModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [showFollowersModal, setShowFollowersModal] = useState(false)
    const [showFollowingModal, setShowFollowingModal] = useState(false)
    const [showFriendsModal, setShowFriendsModal] = useState(false)
    const [showFriendRequestsModal, setShowFriendRequestsModal] = useState(false)
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all')

    // 폼 상태
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    // 메시지 관련
    const {messages, sendMessage} = useMessages(selectedConversationId)

    // 계산된 값들
    const isGoogleUser = currentUser?.email?.includes('@gmail.com') || false
    const canChangeUsername = (isGoogleUser && profileUser?.canChangeUsername) || false

    // 프로필 사용자 정보 가져오기 (ProfileContext 사용)
    useEffect(() => {
        if (username) {
            updateProfileUser(username)
        }
    }, [username]) // updateProfileUser를 의존성에서 제거

    // username 초기값 설정
    useEffect(() => {
        if (profileUser) {
            setNewUsername(profileUser.username || '')
        }
    }, [profileUser])

    // 채팅 자동 열기
    useEffect(() => {
        if (openChatId && profileUser && currentUser) {
            // 차단 상태가 아닌 경우에만 채팅 열기
            if (!isBlocked) {
                setSelectedConversationId(openChatId)
                setShowChatModal(true)
            } else {
                // 차단된 상태면 URL에서 openChat 파라미터 제거
                const u = new URL(window.location.href)
                u.searchParams.delete('openChat')
                window.history.replaceState({}, '', u)
            }
        }
    }, [openChatId, profileUser, currentUser, isBlocked])

    // 사용자명 변경 핸들러
    const handleUsernameChange = async () => {
        if (!profileUser || !currentUser || !canChangeUsername) return

        const regex = /^[a-zA-Z0-9_]{3,20}$/
        if (!regex.test(newUsername)) {
            setUsernameError('3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다')
            return
        }

        const existing = await UserService.getUserByUsername(newUsername)
        if (existing && existing.id !== profileUser.id) {
            setUsernameError('이미 사용중인 사용자명입니다')
            return
        }

        try {
            await updateDoc(doc(db, COLLECTIONS.USERS, profileUser.id), {
                username: newUsername,
                canChangeUsername: false,
                usernameChangedAt: serverTimestamp()
            })

            // AuthContext 업데이트
            if (isOwnProfile) {
                await updateUserProfile({
                    username: newUsername,
                    canChangeUsername: false
                })
            }

            router.replace(`/profile/${newUsername}`)
            setShowUsernameModal(false)
        } catch (e) {
            console.error(e)
        }
    }

    // 메시지 버튼 클릭 핸들러
    const handleMessageClick = async () => {
        if (!currentUser || !profileUser) return

        if (isOwnProfile) {
            setShowMessagesModal(true)
        } else {
            // 차단 상태 확인
            if (isBlocked) {
                alert('차단한 사용자에게는 메시지를 보낼 수 없습니다.')
                return
            }

            try {
                const id = await createConversation(profileUser.uid, {
                    username: profileUser.username,
                    displayName: profileUser.displayName,
                    avatarUrl: profileUser.avatarUrl
                })
                setSelectedConversationId(id)
                setShowChatModal(true)
                const u = new URL(window.location.href)
                u.searchParams.set('openChat', id)
                window.history.replaceState({}, '', u)
            } catch (error: any) {
                if (error.message?.includes('차단')) {
                    alert('차단된 사용자와는 대화를 시작할 수 없습니다.')
                } else {
                    console.error(error)
                    alert('대화 시작 중 오류가 발생했습니다.')
                }
            }
        }
    }

    // 대화 선택 핸들러
    const handleConversationSelect = (id: string) => {
        setSelectedConversationId(id)
        setShowMessagesModal(false)
        setShowChatModal(true)
    }

    // 차단 토글 핸들러 (확인 메시지 추가)
    const handleBlockToggle = async () => {
        if (!currentUser || !profileUser) return

        const confirmMessage = isBlocked
            ? `${profileUser.displayName}님의 차단을 해제하시겠습니까?`
            : `${profileUser.displayName}님을 차단하시겠습니까?\n\n차단하면:\n- 서로 친구 관계가 해제됩니다\n- 서로 팔로우가 해제됩니다\n- 상대방은 회원님에게 메시지를 보낼 수 없습니다\n- 상대방은 차단 사실을 알 수 없습니다`

        if (!confirm(confirmMessage)) return

        try {
            await contextHandleBlockToggle()

            // 차단 시 열려있는 채팅 모달 닫기
            if (!isBlocked && showChatModal) {
                setShowChatModal(false)
                setSelectedConversationId(null)
                const u = new URL(window.location.href)
                u.searchParams.delete('openChat')
                window.history.replaceState({}, '', u)
            }
        } catch (error) {
            console.error('Error toggling block:', error)
            alert('차단 상태 변경 중 오류가 발생했습니다.')
        }
    }

    // 팔로우 토글 핸들러 (차단 상태 확인)
    const handleFollowToggle = async () => {
        if (isBlocked) {
            alert('차단한 사용자를 팔로우할 수 없습니다.')
            return
        }

        try {
            await contextHandleFollowToggle()
        } catch (error: any) {
            if (error.message?.includes('blocked')) {
                alert('차단된 사용자를 팔로우할 수 없습니다.')
            } else {
                console.error('Error toggling follow:', error)
                alert('팔로우 상태 변경 중 오류가 발생했습니다.')
            }
        }
    }

    // 친구 토글 핸들러 (차단 상태 확인)
    const handleFriendToggle = async () => {
        if (isBlocked) {
            alert('차단한 사용자에게 친구 요청을 보낼 수 없습니다.')
            return
        }

        try {
            await contextHandleFriendToggle()
        } catch (error: any) {
            if (error.message?.includes('blocked')) {
                alert('차단된 사용자에게 친구 요청을 보낼 수 없습니다.')
            } else {
                console.error('Error toggling friend:', error)
                alert('친구 상태 변경 중 오류가 발생했습니다.')
            }
        }
    }

    // 대화 목록 포맷팅 (차단된 대화 표시 제외)
    const formattedConversations = conversations
        .filter(conv => !conv.isBlocked) // 차단된 대화 제외
        .map(conv => {
            const time = conv.lastMessage?.timestamp ? formatRelativeTime(conv.lastMessage.timestamp) : ''
            const other = conv.otherParticipant
            return {
                id: conv.id,
                participants: [{
                    id: conv.otherParticipantId || '',
                    username: other?.username || '',
                    displayName: other?.displayName || '',
                    avatar: other?.avatarUrl,
                    level: other?.level || 1
                }],
                lastMessage: {
                    text: conv.lastMessage?.content || '대화를 시작하세요',
                    timestamp: time,
                    read: (conv.unreadCount?.[currentUser?.uid || ''] || 0) === 0
                },
                unreadCount: conv.unreadCount?.[currentUser?.uid || ''] || 0
            }
        })

    // 선택된 대화 정보
    const selectedConv = conversations.find(c => c.id === selectedConversationId)
    const participants = selectedConv && currentUser ? [
        {id: currentUser.uid, username: currentUser.username || '', avatar: currentUser.avatarUrl},
        {
            id: selectedConv.otherParticipantId || '',
            username: selectedConv.otherParticipant?.username || '',
            avatar: selectedConv.otherParticipant?.avatarUrl
        }
    ] : []

    // 필터링된 알림
    const filteredNotifications = notifications.filter(n => {
        if (notificationFilter === 'all') return true
        return n.category === notificationFilter
    })

    // 친구 요청 상태 관리
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [friendRequestCount, setFriendRequestCount] = useState(0)

    // 친구 요청 개수 가져오기
    useEffect(() => {
        if (!isOwnProfile || !currentUser) return

        const unsubscribe = SocialService.subscribeToReceivedFriendRequests(
            currentUser.uid,
            (requests) => {
                setFriendRequests(requests)
                setFriendRequestCount(requests.length)
            }
        )

        return () => unsubscribe()
    }, [isOwnProfile, currentUser])

    // 로딩 상태
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"/>
            </div>
        )
    }

    // 사용자를 찾을 수 없음
    if (!profileUser) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">사용자를 찾을 수 없습니다</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            <Container className="py-8">
                {/* 프로필 헤더 */}
                <ProfileHeader
                    profileUser={profileUser}
                    isOwnProfile={isOwnProfile}
                    isGoogleUser={isGoogleUser}
                    canChangeUsername={canChangeUsername}
                    isFriend={isFriend}
                    isFollowing={isFollowing}
                    isBlocked={isBlocked}
                    hasPendingRequest={hasPendingRequest}
                    receivedRequest={receivedRequest}
                    socialLoading={socialLoading}
                    friendRequestCount={friendRequestCount}
                    onShowUsernameModal={() => setShowUsernameModal(true)}
                    onShowSettingsModal={() => setShowSettingsModal(true)}
                    onShowFriendRequests={() => setShowFriendRequestsModal(true)}
                    onMessageClick={handleMessageClick}
                    onFriendToggle={handleFriendToggle}
                    onFollowToggle={handleFollowToggle}
                    onBlockToggle={handleBlockToggle}
                    onShowFollowers={() => setShowFollowersModal(true)}
                    onShowFollowing={() => setShowFollowingModal(true)}
                    onShowFriends={() => setShowFriendsModal(true)}
                />

                {/* 통계 카드 */}
                <ProfileStats stats={profileUser.stats}/>

                {/* 알림 섹션 (본인 프로필만) */}
                {isOwnProfile && (
                    <NotificationSection
                        notifications={filteredNotifications}
                        notificationFilter={notificationFilter}
                        onFilterChange={setNotificationFilter}
                        onMarkAsRead={markAsRead}
                        onOpenFriendRequests={() => setShowFriendRequestsModal(true)}
                        currentUser={currentUser}
                        router={router}
                    />
                )}

                {/* 사용자명 변경 모달 */}
                <Modal
                    isOpen={showUsernameModal}
                    onClose={() => setShowUsernameModal(false)}
                    title="사용자명 수정"
                >
                    <div className="space-y-4">
                        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                            <p className="text-yellow-400 text-sm">⚠️ 사용자명은 단 한 번만 변경할 수 있습니다!</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">새 사용자명</label>
                            <Input
                                value={newUsername}
                                onChange={e => {
                                    setNewUsername(e.target.value)
                                    setUsernameError('')
                                }}
                                placeholder="새 사용자명을 입력하세요"
                                error={usernameError}
                            />
                            <p className="text-xs text-gray-400 mt-1">3-20자의 영문, 숫자, 언더스코어(_)만 사용 가능</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowUsernameModal(false)}>취소</Button>
                            <Button variant="primary" onClick={handleUsernameChange}>변경하기</Button>
                        </div>
                    </div>
                </Modal>

                {/* 환경설정 모달 */}
                <SettingsModal
                    isOpen={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                    profileUser={profileUser}
                    browserNotificationPermission={browserNotificationPermission}
                    onRequestPermission={requestBrowserNotificationPermission}
                />

                {/* 메시지 목록 모달 */}
                <Modal
                    isOpen={showMessagesModal}
                    onClose={() => setShowMessagesModal(false)}
                    title="메시지"
                    size="lg"
                >
                    <div className="h-[500px]">
                        <ConversationList
                            conversations={formattedConversations}
                            activeConversationId={selectedConversationId || undefined}
                            onSelectConversation={handleConversationSelect}
                        />
                    </div>
                </Modal>

                {/* 채팅 모달 */}
                <Modal
                    isOpen={showChatModal}
                    onClose={() => {
                        setShowChatModal(false)
                        setSelectedConversationId(null)
                        const u = new URL(window.location.href)
                        u.searchParams.delete('openChat')
                        window.history.replaceState({}, '', u)
                    }}
                    title={selectedConv?.otherParticipant?.displayName || '메시지'}
                    size="xl"
                >
                    <div className="h-[600px]">
                        {selectedConversationId && currentUser && (
                            <MessageThread
                                conversationId={selectedConversationId}
                                messages={messages}
                                participants={participants}
                                currentUserId={currentUser.uid}
                                onSendMessage={sendMessage}
                            />
                        )}
                    </div>
                </Modal>
            </Container>

            {/* 팔로워 목록 모달 */}
            <SocialListModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                type="followers"
                userIds={profileUser?.social.followers || []}
                currentUserId={currentUser?.uid || ''}
            />

            {/* 팔로잉 목록 모달 */}
            <SocialListModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                type="following"
                userIds={profileUser?.social.following || []}
                currentUserId={currentUser?.uid || ''}
            />

            {/* 친구 목록 모달 */}
            <SocialListModal
                isOpen={showFriendsModal}
                onClose={() => setShowFriendsModal(false)}
                type="friends"
                userIds={profileUser?.social.friends || []}
                currentUserId={currentUser?.uid || ''}
            />

            {/* 친구 요청 모달 */}
            {isOwnProfile && (
                <FriendRequestModal
                    isOpen={showFriendRequestsModal}
                    onClose={() => setShowFriendRequestsModal(false)}
                    currentUserId={currentUser?.uid || ''}
                />
            )}
        </div>
    )
}

export default function ProfilePage() {
    return (
        <ProfileProvider>
            <ProfilePageContent/>
        </ProfileProvider>
    )
}