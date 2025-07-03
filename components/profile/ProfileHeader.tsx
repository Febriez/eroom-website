import {useState} from 'react'
import {Avatar} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {Check, Edit, MessageSquare, Settings, Shield, Users, X} from 'lucide-react'
import {useProfile} from '@/contexts/ProfileContext'
import {validateDisplayName} from '@/lib/utils/validators'
import type {User} from '@/lib/firebase/types'

interface ProfileHeaderProps {
    profileUser: User
    isOwnProfile: boolean
    isGoogleUser: boolean | undefined
    canChangeUsername: boolean | undefined
    isFriend: boolean
    isFollowing: boolean
    isBlocked: boolean
    hasPendingRequest?: boolean
    receivedRequest?: boolean
    socialLoading: boolean
    friendRequestCount?: number
    onShowUsernameModal: () => void
    onShowSettingsModal: () => void
    onShowFriendRequests?: () => void
    onMessageClick: () => void
    onFriendToggle: () => void
    onFollowToggle: () => void
    onBlockToggle: () => void
    onShowFollowers: () => void
    onShowFollowing: () => void
    onShowFriends?: () => void
}

export default function ProfileHeader({
                                          profileUser,
                                          isOwnProfile,
                                          isGoogleUser,
                                          canChangeUsername,
                                          isFriend,
                                          isFollowing,
                                          isBlocked,
                                          hasPendingRequest,
                                          receivedRequest,
                                          socialLoading,
                                          friendRequestCount = 0,
                                          onShowUsernameModal,
                                          onShowSettingsModal,
                                          onShowFriendRequests,
                                          onMessageClick,
                                          onFriendToggle,
                                          onFollowToggle,
                                          onBlockToggle,
                                          onShowFollowers,
                                          onShowFollowing,
                                          onShowFriends
                                      }: ProfileHeaderProps) {
    const {updateUserProfile} = useProfile()
    const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [editForm, setEditForm] = useState({
        displayName: profileUser.displayName || '',
        bio: profileUser.bio || ''
    })

    const handleSaveDisplayName = async () => {
        if (!profileUser || !isOwnProfile) return

        // 닉네임 검증
        const validation = validateDisplayName(editForm.displayName)
        if (!validation.isValid) {
            alert(validation.error)
            return
        }

        try {
            await updateUserProfile({displayName: editForm.displayName})
            setIsEditingDisplayName(false)
        } catch (e) {
            console.error(e)
            alert('닉네임 변경에 실패했습니다.')
        }
    }

    const handleSaveBio = async () => {
        if (!profileUser || !isOwnProfile) return
        try {
            await updateUserProfile({bio: editForm.bio})
            setIsEditingBio(false)
        } catch (e) {
            console.error(e)
            alert('자기소개 변경에 실패했습니다.')
        }
    }

    const renderMarkdown = (text: string) => {
        if (!text) return ''
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-green-400">$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
            .replace(/(?<!_)_(?!_)([^_]+)(?<!_)_(?!_)/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/\n/g, '<br/>')
    }

    return (
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 flex-1">
                    <Avatar src={profileUser.avatarUrl} size="lg" className="flex-shrink-0"/>
                    <div className="flex-1 w-full sm:w-auto">
                        {/* 디스플레이 네임 */}
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {isEditingDisplayName && isOwnProfile ? (
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        value={editForm.displayName}
                                        onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                                        className="flex-1 max-w-md text-2xl sm:text-3xl font-bold bg-gray-800 border border-gray-700 rounded px-3 py-1 focus:outline-none focus:border-green-500"
                                        maxLength={32}
                                        placeholder="닉네임 입력"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveDisplayName}
                                        className="p-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
                                    >
                                        <Check className="w-4 h-4"/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingDisplayName(false)
                                            setEditForm({...editForm, displayName: profileUser.displayName})
                                        }}
                                        className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4"/>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl sm:text-3xl font-bold break-words">{profileUser.displayName}</h1>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => setIsEditingDisplayName(true)}
                                            className="p-1.5 hover:bg-gray-800 rounded transition-all duration-200"
                                        >
                                            <Edit className="w-4 h-4 text-white opacity-70 group-hover:opacity-100"/>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 사용자명 */}
                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <span>@{profileUser.username}</span>
                            {isOwnProfile && canChangeUsername && (
                                <button
                                    onClick={onShowUsernameModal}
                                    className="p-1 hover:bg-gray-800 rounded transition-all duration-200"
                                >
                                    <Edit className="w-3.5 h-3.5 text-white opacity-70 group-hover:opacity-100"/>
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
                                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                        onKeyDown={e => {
                                            if (e.key === 'Escape') {
                                                setIsEditingBio(false)
                                                setEditForm({...editForm, bio: profileUser.bio || ''})
                                            } else if (e.key === 'Enter' && e.ctrlKey) {
                                                handleSaveBio()
                                            }
                                        }}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-green-500 text-gray-300 resize-none whitespace-pre-wrap break-words"
                                        rows={3}
                                        maxLength={200}
                                        placeholder="자기소개를 입력하세요 (Ctrl+Enter로 저장)"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveBio}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                                            저장
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingBio(false)
                                                setEditForm({...editForm, bio: profileUser.bio || ''})
                                            }}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2 w-full">
                                    {profileUser.bio ? (
                                        <p className="text-gray-300 break-words whitespace-pre-wrap flex-1"
                                           dangerouslySetInnerHTML={{__html: renderMarkdown(profileUser.bio)}}/>
                                    ) : (
                                        <p className="text-gray-500 italic">자기소개가 없습니다</p>
                                    )}
                                    {isOwnProfile && (
                                        <button onClick={() => setIsEditingBio(true)}
                                                className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                                            <Edit className="w-3.5 h-3.5 text-white opacity-70"/>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 소셜 통계 */}
                        <div className="flex items-center gap-2 sm:gap-4 text-sm text-gray-400">
                            <div className="flex flex-col items-center">
                                <span>레벨 {profileUser.level}</span>
                                <span className="text-xs">{profileUser.points.toLocaleString()} 포인트</span>
                            </div>

                            <div className="h-8 w-px bg-gray-700"></div>

                            {isOwnProfile ? (
                                <>
                                    <button
                                        onClick={onShowFollowers}
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        팔로워 {profileUser.social.followers.length}
                                    </button>

                                    <div className="h-8 w-px bg-gray-700"></div>

                                    <button
                                        onClick={onShowFollowing}
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        팔로잉 {profileUser.social.following.length}
                                    </button>

                                    <div className="h-8 w-px bg-gray-700"></div>

                                    <button
                                        onClick={onShowFriends}
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        친구 {profileUser.social.friendCount}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>팔로워 {profileUser.social.followers.length}</span>
                                    <div className="h-8 w-px bg-gray-700"></div>
                                    <span>팔로잉 {profileUser.social.following.length}</span>
                                    <div className="h-8 w-px bg-gray-700"></div>
                                    <span>친구 {profileUser.social.friendCount}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start lg:justify-end">
                    {isOwnProfile ? (
                        <>
                            <Button variant="secondary" onClick={onShowSettingsModal}
                                    className="flex items-center gap-2">
                                <Settings className="w-4 h-4"/>
                                환경설정
                            </Button>
                            <Button variant="outline" onClick={onShowFriendRequests}
                                    className="flex items-center gap-2 relative">
                                <Users className="w-4 h-4"/>
                                <span>친구 요청 관리</span>
                                {friendRequestCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {friendRequestCount}
                    </span>
                                )}
                            </Button>
                            <Button variant="primary" onClick={onMessageClick} className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4"/>
                                메시지함 열기
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* 차단 상태면 차단 해제 버튼만 표시 */}
                            {isBlocked ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={onBlockToggle}
                                        disabled={socialLoading}
                                        className="flex items-center gap-2 text-red-500 hover:text-red-400"
                                    >
                                        <Shield className="w-4 h-4"/>
                                        차단해제
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant={isFriend ? "secondary" : receivedRequest ? "primary" : hasPendingRequest ? "secondary" : "outline"}
                                        onClick={onFriendToggle}
                                        disabled={socialLoading}
                                        className="flex items-center gap-2"
                                    >
                                        {isFriend ? '친구' : receivedRequest ? '친구 요청 받음' : hasPendingRequest ? '요청 대기중' : '친구 추가'}
                                    </Button>

                                    <Button
                                        variant={isFollowing ? "secondary" : "outline"}
                                        onClick={onFollowToggle}
                                        disabled={socialLoading}
                                        className="flex items-center gap-2"
                                    >
                                        {isFollowing ? '팔로잉' : '팔로우'}
                                    </Button>

                                    <Button
                                        variant="primary"
                                        onClick={onMessageClick}
                                        className="flex items-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4"/>
                                        메시지 보내기
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={onBlockToggle}
                                        disabled={socialLoading}
                                        className="flex items-center gap-2"
                                    >
                                        <Shield className="w-4 h-4"/>
                                        차단
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}