// app/(main)/profile/[userId]/page.tsx
'use client'

import {useEffect, useState} from 'react'
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
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
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileStats from '@/components/profile/ProfileStats'
import NotificationSection from '@/components/profile/NotificationSection'
import SettingsModal from '@/components/profile/SettingsModal'
import {doc, serverTimestamp, updateDoc} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {formatRelativeTime} from '@/lib/utils'

type NotificationFilter = 'all' | 'read' | 'unread'

export default function ProfilePage() {
    // 라우팅 관련
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const username = params.userId as string
    const openChatId = searchParams.get('openChat')

    // 인증 및 훅
    const {user: currentUser, updateUserProfile} = useAuth()
    const {
        notifications,
        browserNotificationPermission,
        requestBrowserNotificationPermission,
        markAsRead
    } = useNotifications()
    const {conversations, createConversation} = useConversations()

    // 프로필 상태
    const [profileUser, setProfileUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // 소셜 관계 상태
    const [isFriend, setIsFriend] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false)

    // UI 상태
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showMessagesModal, setShowMessagesModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [showFollowersModal, setShowFollowersModal] = useState(false)
    const [showFollowingModal, setShowFollowingModal] = useState(false)
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all')

    // 폼 상태
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    // 메시지 관련
    const {messages, sendMessage} = useMessages(selectedConversationId)

    // 계산된 값들
    const isOwnProfile = currentUser?.uid === profileUser?.uid
    const isGoogleUser = currentUser?.email?.includes('@gmail.com') || false
    const canChangeUsername = (isGoogleUser && profileUser?.canChangeUsername) || false

    // 프로필 사용자 정보 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const user = await UserService.getUserByUsername(username)
                setProfileUser(user)
                setNewUsername(user!.username || '')
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        if (username) fetchUser()
    }, [username])

    // 소셜 관계 확인
    useEffect(() => {
        if (profileUser && currentUser && !isOwnProfile) {
            setIsFriend(profileUser.social.friends.includes(currentUser.uid))
            setIsFollowing(currentUser.social?.following?.includes(profileUser.uid) || false)
            setIsBlocked(currentUser.social?.blocked?.includes(profileUser.uid) || false)
        }
    }, [profileUser, currentUser, isOwnProfile])

    // 채팅 자동 열기
    useEffect(() => {
        if (openChatId && profileUser && currentUser) {
            setSelectedConversationId(openChatId)
            setShowChatModal(true)
        }
    }, [openChatId, profileUser, currentUser])

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
            router.replace(`/profile/${newUsername}`)
            setShowUsernameModal(false)
        } catch (e) {
            console.error(e)
        }
    }

    // 친구 추가/제거 핸들러
    const handleFriendToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return
        setSocialLoading(true)

        try {
            if (isFriend) {
                await SocialService.removeFriend(currentUser.uid, profileUser.uid)
                setIsFriend(false)
            } else {
                await SocialService.sendFriendRequest(
                    {
                        uid: currentUser.uid,
                        username: currentUser.username || '',
                        displayName: currentUser.displayName || ''
                    },
                    {
                        uid: profileUser.uid,
                        username: profileUser.username,
                        displayName: profileUser.displayName
                    }
                )
                alert('친구 요청을 보냈습니다.')
            }
        } catch (error: any) {
            console.error('Friend toggle error:', error)
            alert(error.message || '오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    // 팔로우/언팔로우 핸들러
    const handleFollowToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return
        setSocialLoading(true)

        try {
            if (isFollowing) {
                await SocialService.unfollowUser(currentUser.uid, profileUser.uid)
                setIsFollowing(false)
            } else {
                await SocialService.followUser(currentUser.uid, profileUser.uid)
                setIsFollowing(true)
            }
        } catch (error) {
            console.error('Follow toggle error:', error)
            alert('오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    // 차단/차단해제 핸들러
    const handleBlockToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return

        const confirmMessage = isBlocked
            ? '이 사용자를 차단 해제하시겠습니까?'
            : '이 사용자를 차단하시겠습니까? 차단하면 서로 메시지를 보낼 수 없습니다.'

        if (!confirm(confirmMessage)) return

        setSocialLoading(true)
        try {
            if (isBlocked) {
                await UserService.updateUser(currentUser.uid, {
                    social: {
                        ...currentUser.social,
                        blocked: currentUser.social.blocked.filter(id => id !== profileUser.uid)
                    }
                })
                setIsBlocked(false)
            } else {
                await UserService.updateUser(currentUser.uid, {
                    social: {
                        ...currentUser.social,
                        blocked: [...(currentUser.social.blocked || []), profileUser.uid]
                    }
                })
                setIsBlocked(true)
            }
        } catch (error) {
            console.error('Block toggle error:', error)
            alert('오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    // 메시지 버튼 클릭 핸들러
    const handleMessageClick = async () => {
        if (!currentUser || !profileUser) return

        if (isOwnProfile) {
            setShowMessagesModal(true)
        } else {
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
            } catch (e) {
                console.error(e)
            }
        }
    }

    // 대화 선택 핸들러
    const handleConversationSelect = (id: string) => {
        setSelectedConversationId(id)
        setShowMessagesModal(false)
        setShowChatModal(true)
    }

    // 대화 목록 포맷팅
    const formattedConversations = conversations.map(conv => {
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
        if (notificationFilter === 'read') return n.read
        if (notificationFilter === 'unread') return !n.read
        return true
    })

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
                    socialLoading={socialLoading}
                    onShowUsernameModal={() => setShowUsernameModal(true)}
                    onShowSettingsModal={() => setShowSettingsModal(true)}
                    onMessageClick={handleMessageClick}
                    onFriendToggle={handleFriendToggle}
                    onFollowToggle={handleFollowToggle}
                    onBlockToggle={handleBlockToggle}
                    onShowFollowers={() => setShowFollowersModal(true)}
                    onShowFollowing={() => setShowFollowingModal(true)}
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
        </div>
    )
}