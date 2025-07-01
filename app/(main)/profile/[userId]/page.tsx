'use client'

import {useEffect, useState} from 'react'
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
import {useNotifications} from '@/lib/hooks/useNotifications'
import {useConversations} from '@/lib/hooks/useConversations'
import {useMessages} from '@/lib/hooks/useMessages'
import {UserService} from '@/lib/firebase/services'
import {Container} from '@/components/ui/Container'
import {Avatar} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Modal} from '@/components/ui/Modal'
import ConversationList from '@/components/messaging/ConversationList'
import MessageThread from '@/components/messaging/MessageThread'
import {Bell, Check, CheckCircle, Clock, Edit, MapPin, MessageSquare, Settings, Shield, Trophy, X} from 'lucide-react'
import {doc, updateDoc} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'

type NotificationFilter = 'all' | 'read' | 'unread'

export default function ProfilePage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const {user: currentUser, updateUserProfile} = useAuth()
    const {notifications} = useNotifications()
    const {conversations, createConversation} = useConversations()

    const [profileUser, setProfileUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showMessagesModal, setShowMessagesModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [editForm, setEditForm] = useState({
        displayName: '',
        bio: ''
    })
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all')
    const [savingSettings, setSavingSettings] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const [tempSettings, setTempSettings] = useState({
        privacy: {
            showProfile: true,
            showStats: true,
            showFriends: true,
            showActivity: true,
            allowMessages: true,
            allowFriendRequests: true
        },
        notifications: {
            friendRequests: true,
            messages: true,
            gameInvites: true,
            achievements: true,
            updates: true,
            marketing: false
        },
        preferences: {
            soundEnabled: true
        }
    })

    const {messages, sendMessage} = useMessages(selectedConversationId)

    // URL에서 username 가져오기
    const username = params.userId as string

    // 쿼리 파라미터에서 openChat 확인
    const openChatId = searchParams.get('openChat')

    // username으로 사용자 찾기
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                const user = await UserService.getUserByUsername(username)
                setProfileUser(user)
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchUser()
        }
    }, [username])

    // openChat 파라미터가 있으면 채팅 모달 열기
    useEffect(() => {
        if (openChatId && profileUser && currentUser) {
            setSelectedConversationId(openChatId)
            setShowChatModal(true)
        }
    }, [openChatId, profileUser, currentUser])

    const isOwnProfile = currentUser?.uid === profileUser?.uid
    const isGoogleUser = currentUser?.email?.includes('@gmail.com')
    const canChangeUsername = isGoogleUser && profileUser?.canChangeUsername

    useEffect(() => {
        if (profileUser) {
            setEditForm({
                displayName: profileUser.displayName || '',
                bio: profileUser.bio || ''
            })
            setNewUsername(profileUser.username || '')
            // 환경설정 초기화
            if (profileUser.settings) {
                setTempSettings({
                    privacy: profileUser.settings.privacy || tempSettings.privacy,
                    notifications: profileUser.settings.notifications || tempSettings.notifications,
                    preferences: {
                        soundEnabled: profileUser.settings.preferences?.soundEnabled ?? true
                    }
                })
            }
        }
    }, [profileUser])

    const handleSaveDisplayName = async () => {
        if (!profileUser || !currentUser) return

        try {
            await UserService.updateUser(profileUser.id, {
                displayName: editForm.displayName
            })

            // 프로필 유저 정보 즉시 업데이트
            setProfileUser({...profileUser, displayName: editForm.displayName})

            // 로그인한 유저의 정보도 업데이트
            if (isOwnProfile) {
                await updateUserProfile({displayName: editForm.displayName})
            }

            setIsEditingDisplayName(false)
        } catch (error) {
            console.error('Error updating display name:', error)
        }
    }

    const handleSaveBio = async () => {
        if (!profileUser || !currentUser) return

        try {
            await UserService.updateUser(profileUser.id, {
                bio: editForm.bio
            })

            // 프로필 유저 정보 즉시 업데이트
            setProfileUser({...profileUser, bio: editForm.bio})

            // 로그인한 유저의 정보도 업데이트
            if (isOwnProfile) {
                await updateUserProfile({bio: editForm.bio})
            }

            setIsEditingBio(false)
        } catch (error) {
            console.error('Error updating bio:', error)
        }
    }

    // 간단한 마크다운 렌더링 함수
    const renderMarkdown = (text: string) => {
        if (!text) return ''

        let html = text

        // HTML 이스케이프
        html = html.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

        // 인라인 코드 `code` (먼저 처리하여 다른 마크다운 처리에서 제외)
        html = html.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-green-400">$1</code>')

        // 굵은 글씨 **text** 또는 __text__
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

        // 기울임 *text* 또는 _text_ (굵은 글씨 처리 후)
        html = html.replace(/(?<!\*)\*(?!\*)([^\*]+)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        html = html.replace(/(?<!_)_(?!_)([^_]+)(?<!_)_(?!_)/g, '<em>$1</em>')

        // 취소선 ~~text~~
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')

        // 줄바꿈 처리
        html = html.replace(/\n/g, '<br/>')

        return html
    }

    const handleUsernameChange = async () => {
        if (!profileUser || !currentUser || !canChangeUsername) return

        // 유저네임 검증
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
        if (!usernameRegex.test(newUsername)) {
            setUsernameError('3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다')
            return
        }

        // 중복 체크
        const existingUser = await UserService.getUserByUsername(newUsername)
        if (existingUser && existingUser.id !== profileUser.id) {
            setUsernameError('이미 사용중인 사용자명입니다')
            return
        }

        try {
            await updateDoc(doc(db, COLLECTIONS.USERS, profileUser.id), {
                username: newUsername,
                canChangeUsername: false,
                usernameChangedAt: new Date()
            })

            // URL 변경
            router.replace(`/profile/${newUsername}`)

            setShowUsernameModal(false)
        } catch (error) {
            console.error('Error updating username:', error)
        }
    }

    const handleSaveSettings = async () => {
        if (!profileUser || !currentUser) return

        setSavingSettings(true)
        setSettingsSaved(false)

        try {
            const updatedSettings = {
                ...profileUser.settings,
                privacy: tempSettings.privacy,
                notifications: tempSettings.notifications,
                preferences: {
                    ...profileUser.settings.preferences,
                    soundEnabled: tempSettings.preferences.soundEnabled
                }
            }

            await UserService.updateUser(profileUser.id, {
                settings: updatedSettings
            })

            // 프로필 유저 정보 즉시 업데이트
            setProfileUser({...profileUser, settings: updatedSettings})

            // 로그인한 유저의 정보도 업데이트
            if (isOwnProfile) {
                await updateUserProfile({settings: updatedSettings})
            }

            setSettingsSaved(true)

            // 2초 후 모달 닫기
            setTimeout(() => {
                setShowSettingsModal(false)
                setSettingsSaved(false)
            }, 1500)

        } catch (error) {
            console.error('Error updating settings:', error)
        } finally {
            setSavingSettings(false)
        }
    }

    const handleMessageClick = async () => {
        if (!currentUser || !profileUser) return

        if (isOwnProfile) {
            // 자신의 프로필이면 메시지 목록 모달 표시
            setShowMessagesModal(true)
        } else {
            // 다른 사람의 프로필이면 대화 생성/이동
            try {
                const conversationId = await createConversation(
                    profileUser.uid,
                    {
                        username: profileUser.username,
                        displayName: profileUser.displayName,
                        avatarUrl: profileUser.avatarUrl
                    }
                )
                setSelectedConversationId(conversationId)
                setShowChatModal(true)
            } catch (error) {
                console.error('Error creating conversation:', error)
            }
        }
    }

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversationId(conversationId)
        setShowMessagesModal(false)
        setShowChatModal(true)
    }

    // ConversationList에 맞는 형식으로 변환
    const formattedConversations = conversations.map(conv => ({
        id: conv.id,
        participants: [{
            id: conv.otherParticipantId || '',
            username: conv.otherParticipant?.username || '',
            avatar: conv.otherParticipant?.avatarUrl
        }],
        lastMessage: {
            text: conv.lastMessage?.content || '대화를 시작하세요',
            timestamp: conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : '',
            read: (conv.unreadCount?.[currentUser?.uid || ''] || 0) === 0
        },
        unreadCount: conv.unreadCount?.[currentUser?.uid || ''] || 0
    }))

    // 선택된 대화의 참가자 정보
    const selectedConversation = conversations.find(c => c.id === selectedConversationId)
    const participants = selectedConversation && currentUser ? [
        {
            id: currentUser.uid,
            username: currentUser.username || '',
            avatar: currentUser.avatarUrl
        },
        {
            id: selectedConversation.otherParticipantId || '',
            username: selectedConversation.otherParticipant?.username || '',
            avatar: selectedConversation.otherParticipant?.avatarUrl
        }
    ] : []

    // Message 형식 변환
    const formattedMessages = messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        senderId: msg.sender.uid,
        timestamp: formatTime(msg.createdAt),
        read: msg.readBy?.includes(currentUser?.uid || '') || false
    }))

    const filteredNotifications = notifications.filter(notif => {
        if (notificationFilter === 'read') return notif.read
        if (notificationFilter === 'unread') return !notif.read
        return true
    })

    const formatTime = (timestamp: any) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
            </div>
        )
    }

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
                <div className="bg-gray-900 rounded-xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <Avatar src={profileUser.avatarUrl} size="lg"/>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {isEditingDisplayName && isOwnProfile ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editForm.displayName}
                                                onChange={(e) => setEditForm({
                                                    ...editForm,
                                                    displayName: e.target.value
                                                })}
                                                className="text-3xl font-bold bg-gray-800 border border-gray-700 rounded px-3 py-1 focus:outline-none focus:border-green-500 break-keep-all"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleSaveDisplayName}
                                                className="p-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
                                                title="저장"
                                            >
                                                <Check className="w-4 h-4"/>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingDisplayName(false)
                                                    setEditForm({...editForm, displayName: profileUser.displayName})
                                                }}
                                                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                                                title="취소"
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-3xl font-bold break-keep-all">{profileUser.displayName}</h1>
                                            {isOwnProfile && (
                                                <button
                                                    onClick={() => setIsEditingDisplayName(true)}
                                                    className="p-1.5 hover:bg-gray-800 rounded transition-all duration-200 group"
                                                    title="닉네임 수정"
                                                >
                                                    <Edit
                                                        className="w-4 h-4 text-white opacity-70 group-hover:opacity-100 transition-opacity"/>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 mb-3">
                                    <span>@{profileUser.username}</span>
                                    {isOwnProfile && canChangeUsername && (
                                        <button
                                            onClick={() => setShowUsernameModal(true)}
                                            className="p-1 hover:bg-gray-800 rounded transition-all duration-200 group"
                                            title="사용자명 수정 (1회만 가능)"
                                        >
                                            <Edit
                                                className="w-3.5 h-3.5 text-white opacity-70 group-hover:opacity-100 transition-opacity"/>
                                        </button>
                                    )}
                                    {isGoogleUser && (
                                        <div className="flex items-center gap-1 text-xs">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                                                <path fill="#4285F4"
                                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853"
                                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05"
                                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335"
                                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            <span>Google 계정</span>
                                        </div>
                                    )}
                                </div>
                                {/* 자기소개 */}
                                <div className="mb-4">
                                    {isEditingBio && isOwnProfile ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">자기소개는 마크다운 문법을 지원합니다</span>
                                            </div>
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        setIsEditingBio(false)
                                                        setEditForm({...editForm, bio: profileUser.bio || ''})
                                                    } else if (e.key === 'Enter' && e.ctrlKey) {
                                                        handleSaveBio()
                                                    }
                                                }}
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-green-500 text-gray-300 resize-none break-keep-all"
                                                rows={3}
                                                placeholder="자기소개를 입력하세요... (Ctrl+Enter로 저장, Esc로 취소)"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveBio}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingBio(false)
                                                        setEditForm({...editForm, bio: profileUser.bio || ''})
                                                    }}
                                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            {profileUser.bio ? (
                                                <p
                                                    className="text-gray-300 break-keep-all"
                                                    dangerouslySetInnerHTML={{__html: renderMarkdown(profileUser.bio)}}
                                                />
                                            ) : (
                                                <p className="text-gray-500 italic">자기소개가 없습니다</p>
                                            )}
                                            {isOwnProfile && (
                                                <button
                                                    onClick={() => setIsEditingBio(true)}
                                                    className="p-1 hover:bg-gray-800 rounded transition-all duration-200 group flex-shrink-0"
                                                    title="자기소개 수정"
                                                >
                                                    <Edit
                                                        className="w-3.5 h-3.5 text-white opacity-70 group-hover:opacity-100 transition-opacity"/>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span>레벨 {profileUser.level}</span>
                                    <span>{profileUser.points.toLocaleString()} 포인트</span>
                                    <span>{profileUser.social.friendCount} 친구</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {isOwnProfile && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowSettingsModal(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4"/>
                                    환경설정
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                onClick={handleMessageClick}
                                className="flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4"/>
                                {isOwnProfile ? '메시지함 열기' : '메시지 보내기'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                        <p className="text-2xl font-bold">{profileUser.stats.mapsCompleted}</p>
                        <p className="text-sm text-gray-400">클리어한 맵</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                        <p className="text-2xl font-bold">{profileUser.stats.mapsCreated}</p>
                        <p className="text-sm text-gray-400">제작한 맵</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2"/>
                        <p className="text-2xl font-bold">{Math.floor(profileUser.stats.totalPlayTime / 3600)}h</p>
                        <p className="text-sm text-gray-400">플레이 시간</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2"/>
                        <p className="text-2xl font-bold">{profileUser.stats.winRate}%</p>
                        <p className="text-sm text-gray-400">승률</p>
                    </div>
                </div>

                {/* 알림 목록 (자신의 프로필일 때만) */}
                {isOwnProfile && (
                    <div className="bg-gray-900 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5"/>
                                알림
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setNotificationFilter('all')}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        notificationFilter === 'all'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    전체
                                </button>
                                <button
                                    onClick={() => setNotificationFilter('unread')}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        notificationFilter === 'unread'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    읽지 않음
                                </button>
                                <button
                                    onClick={() => setNotificationFilter('read')}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        notificationFilter === 'read'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    읽음
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 rounded-lg border transition-colors ${
                                            notif.read
                                                ? 'bg-gray-800 border-gray-700'
                                                : 'bg-gray-800/50 border-green-600/50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium mb-1 break-keep-all">{notif.title}</h3>
                                                <p className="text-sm text-gray-400 break-keep-all">{notif.body}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatTime(notif.createdAt)}
                                                </p>
                                            </div>
                                            {!notif.read && (
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    {notificationFilter === 'unread'
                                        ? '새로운 알림이 없습니다'
                                        : notificationFilter === 'read'
                                            ? '읽은 알림이 없습니다'
                                            : '알림이 없습니다'
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* 사용자명 수정 모달 */}
                <Modal
                    isOpen={showUsernameModal}
                    onClose={() => setShowUsernameModal(false)}
                    title="사용자명 수정"
                >
                    <div className="space-y-4">
                        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ 사용자명은 단 한 번만 변경할 수 있습니다!
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">새 사용자명</label>
                            <Input
                                value={newUsername}
                                onChange={(e) => {
                                    setNewUsername(e.target.value)
                                    setUsernameError('')
                                }}
                                placeholder="새 사용자명을 입력하세요"
                                error={usernameError}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                3-20자의 영문, 숫자, 언더스코어(_)만 사용 가능
                            </p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowUsernameModal(false)}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={handleUsernameChange}>
                                변경하기
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* 환경설정 모달 */}
                <Modal
                    isOpen={showSettingsModal}
                    onClose={() => {
                        if (!savingSettings) {
                            setShowSettingsModal(false)
                            setSettingsSaved(false)
                            // 변경사항 취소 - 원래 값으로 복원
                            if (profileUser?.settings) {
                                setTempSettings({
                                    privacy: profileUser.settings.privacy || tempSettings.privacy,
                                    notifications: profileUser.settings.notifications || tempSettings.notifications,
                                    preferences: {
                                        soundEnabled: profileUser.settings.preferences?.soundEnabled ?? true
                                    }
                                })
                            }
                        }
                    }}
                    title="환경설정"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* 저장 완료 메시지 */}
                        {settingsSaved && (
                            <div
                                className="bg-green-900/20 border border-green-600/50 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0"/>
                                <p className="text-green-400 text-sm">설정이 저장되었습니다!</p>
                            </div>
                        )}

                        {/* 개인정보 설정 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">개인정보 설정</h3>
                            <div className="space-y-3">
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">내 프로필 공개</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.showProfile}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, showProfile: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">통계 공개</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.showStats}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, showStats: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">친구 목록 공개</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.showFriends}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, showFriends: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">활동 상태 표시</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.showActivity}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, showActivity: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">메시지 받기 허용</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.allowMessages}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, allowMessages: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">친구 요청 받기 허용</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.privacy.allowFriendRequests}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            privacy: {...tempSettings.privacy, allowFriendRequests: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 알림 설정 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">알림 설정</h3>
                            <div className="space-y-3">
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">친구 요청 알림</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.friendRequests}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {
                                                ...tempSettings.notifications,
                                                friendRequests: e.target.checked
                                            }
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">메시지 알림</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.messages}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {...tempSettings.notifications, messages: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">게임 초대 알림</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.gameInvites}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {
                                                ...tempSettings.notifications,
                                                gameInvites: e.target.checked
                                            }
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">업적 달성 알림</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.achievements}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {
                                                ...tempSettings.notifications,
                                                achievements: e.target.checked
                                            }
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">업데이트 알림</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.updates}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {...tempSettings.notifications, updates: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">마케팅 정보 수신</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.marketing}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            notifications: {...tempSettings.notifications, marketing: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 게임 설정 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">게임 설정</h3>
                            <div className="space-y-3">
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">사운드 활성화</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.preferences.soundEnabled}
                                        onChange={(e) => setTempSettings({
                                            ...tempSettings,
                                            preferences: {...tempSettings.preferences, soundEnabled: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!savingSettings) {
                                        setShowSettingsModal(false)
                                        setSettingsSaved(false)
                                        // 변경사항 취소
                                        if (profileUser?.settings) {
                                            setTempSettings({
                                                privacy: profileUser.settings.privacy || tempSettings.privacy,
                                                notifications: profileUser.settings.notifications || tempSettings.notifications,
                                                preferences: {
                                                    soundEnabled: profileUser.settings.preferences?.soundEnabled ?? true
                                                }
                                            })
                                        }
                                    }
                                }}
                                disabled={savingSettings}
                            >
                                취소
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSaveSettings}
                                disabled={savingSettings || settingsSaved}
                            >
                                {savingSettings ? '저장 중...' : settingsSaved ? '저장됨' : '적용'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* 메시지 목록 모달 */}
                <Modal
                    isOpen={showMessagesModal}
                    onClose={() => setShowMessagesModal(false)}
                    title="메시지"
                    size="lg"
                >
                    <div style={{height: '500px'}}>
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
                        // URL에서 openChat 파라미터 제거
                        const newUrl = new URL(window.location.href)
                        newUrl.searchParams.delete('openChat')
                        window.history.replaceState({}, '', newUrl)
                    }}
                    title={selectedConversation?.otherParticipant?.displayName || '메시지'}
                    size="xl"
                >
                    <div style={{height: '600px'}}>
                        {selectedConversationId && (
                            <MessageThread
                                conversationId={selectedConversationId}
                                messages={formattedMessages}
                                participants={participants}
                                currentUserId={currentUser?.uid || ''}
                                onSendMessage={sendMessage}
                            />
                        )}
                    </div>
                </Modal>
            </Container>
        </div>
    )
}