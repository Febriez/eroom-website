'use client'

import {
    AlertTriangle,
    Award,
    Bell,
    Calendar,
    Clock,
    Edit2,
    Key,
    LogOut,
    MapPin,
    Settings,
    Star,
    TrendingUp,
    Trophy,
    User,
    UserMinus,
    UserPlus,
    UserX
} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'
import {useParams, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import Link from 'next/link'
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {db} from '../../lib/firebase'

interface UserProfile {
    docId: string
    uid: string
    userId: string
    email: string
    nickname: string
    bio: string
    level: number
    points: number
    completedMaps: number
    createdMaps: number
    totalPlayTime: string
    winRate: string
    avgClearTime: string
    friendsCount: number
    createdAt: string
    followers?: string[]
    following?: string[]
    friends?: string[]
    blocked?: string[]
    userIdChangedAt?: string | null
    canChangeUserId?: boolean
}

interface Notification {
    id: string
    type: 'friend_request' | 'game_update' | 'bug_report_response'
    title: string
    message: string
    from?: string
    fromNickname?: string
    createdAt: any
    read: boolean
}

export default function ProfilePage() {
    const {user} = useAuth()
    const router = useRouter()
    const params = useParams()
    const userId = params.uid as string

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingUserId, setIsEditingUserId] = useState(false)
    const [nickname, setNickname] = useState('')
    const [bio, setBio] = useState('')
    const [newUserId, setNewUserId] = useState('')
    const [checkingNewUserId, setCheckingNewUserId] = useState(false)
    const [newUserIdAvailable, setNewUserIdAvailable] = useState<boolean | null>(null)
    const [showUserIdWarning, setShowUserIdWarning] = useState(false)
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null)

    // 관계 상태
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [friendRequestSent, setFriendRequestSent] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)

    // 알림
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const isOwnProfile = currentUserProfile?.userId === userId

    useEffect(() => {
        loadProfile()
    }, [userId, user])

    useEffect(() => {
        if (user && profile) {
            loadCurrentUserProfile()
            loadRelationshipStatus()
            if (isOwnProfile) {
                loadNotifications()
            }
        }
    }, [user, profile])

    const loadCurrentUserProfile = async () => {
        if (!user) return

        try {
            const usersQuery = query(collection(db, 'users'), where('uid', '==', user.uid))
            const querySnapshot = await getDocs(usersQuery)

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]
                setCurrentUserProfile({id: userDoc.id, ...userDoc.data()} as unknown as UserProfile)
            }
        } catch (error) {
            console.error('Error loading current user profile:', error)
        }
    }

    const loadProfile = async () => {
        try {
            console.log('Loading profile for uid param:', userId);
            console.log('Current user:', user?.uid);
            console.log('Params received:', params);
            if (!userId) {
                console.error('Invalid userId parameter');
                setNotFound(true);
                setLoading(false);
                return;
            }

            // userId로 사용자 검색
            const usersQuery = query(collection(db, 'users'), where('userId', '==', userId))

            // 5초 타임아웃 설정 (네트워크 지연 방지)
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Firebase query timeout')), 5000)
            );

            const fetchData = async () => {
                return await getDocs(usersQuery);
            };

            // Promise.race로 타임아웃 처리
            const querySnapshot = await Promise.race([fetchData(), timeoutPromise]) as any;

            if (querySnapshot.empty) {
                console.error('User document not found for userId:', userId);
                setNotFound(true);
                setLoading(false);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = {id: userDoc.id, ...userDoc.data()} as unknown as UserProfile;

            // 필수 필드 확인
            if (!userData.uid || !userData.userId) {
                console.error('User document is missing required fields');
                setNotFound(true);
                setLoading(false);
                return;
            }

            console.log('User profile loaded successfully');
            setProfile(userData);
            setNickname(userData.nickname || '');
            setBio(userData.bio || '');
            setNewUserId(userData.userId);
            setLoading(false);
        } catch (error) {
            console.error('Error loading profile:', error);
            setNotFound(true);
            setLoading(false);
        }
    }

    const loadRelationshipStatus = async () => {
        if (!currentUserProfile || currentUserProfile.userId === userId) return

        try {
            setIsFollowing(currentUserProfile.following?.includes(profile!.uid) || false)
            setIsFriend(currentUserProfile.friends?.includes(profile!.uid) || false)
            setIsBlocked(currentUserProfile.blocked?.includes(profile!.uid) || false)

            // 친구 요청 확인
            const friendRequestQuery = query(
                collection(db, 'friendRequests'),
                where('from', '==', currentUserProfile.uid),
                where('to', '==', profile!.uid),
                where('status', '==', 'pending')
            )
            const friendRequestSnapshot = await getDocs(friendRequestQuery)
            setFriendRequestSent(!friendRequestSnapshot.empty)
        } catch (error) {
            console.error('Error loading relationship status:', error)
        }
    }

    const loadNotifications = async () => {
        if (!user) return

        try {
            const notificationsQuery = query(
                collection(db, 'notifications'),
                where('to', '==', user.uid)
            )
            const snapshot = await getDocs(notificationsQuery)
            const notificationsList: Notification[] = []

            snapshot.forEach((doc) => {
                notificationsList.push({id: doc.id, ...doc.data()} as Notification)
            })

            notificationsList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            setNotifications(notificationsList)
            setUnreadCount(notificationsList.filter(n => !n.read).length)
        } catch (error) {
            console.error('Error loading notifications:', error)
        }
    }

    const validateUserId = (id: string) => {
        const regex = /^[a-zA-Z0-9_]{3,20}$/
        return regex.test(id)
    }

    const checkUserIdAvailability = async (id: string) => {
        if (id === profile?.userId) return true // 현재 ID와 같으면 사용 가능

        try {
            const usersQuery = query(collection(db, 'users'), where('userId', '==', id))
            const querySnapshot = await getDocs(usersQuery)
            return querySnapshot.empty
        } catch (error) {
            console.error('Error checking userId:', error)
            return false
        }
    }

    const handleUserIdChange = async (value: string) => {
        setNewUserId(value)
        setNewUserIdAvailable(null)

        if (value.length >= 3 && validateUserId(value)) {
            setCheckingNewUserId(true)
            try {
                const available = await checkUserIdAvailability(value)
                setNewUserIdAvailable(available)
            } catch (error) {
                console.error('Error checking userId:', error)
            } finally {
                setCheckingNewUserId(false)
            }
        }
    }

    const handleSaveProfile = async () => {
        if (!currentUserProfile || !profile) return

        try {
            await updateDoc(doc(db, 'users', profile.docId), {
                nickname,
                bio
            })

            setProfile({...profile, nickname, bio})
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleSaveUserId = async () => {
        if (!currentUserProfile || !profile || !newUserIdAvailable) return

        try {
            await updateDoc(doc(db, 'users', profile.docId), {
                userId: newUserId,
                userIdChangedAt: serverTimestamp(),
                canChangeUserId: false
            })

            // 프로필 페이지로 리다이렉트
            router.push(`/profile/${newUserId}`)
        } catch (error) {
            console.error('Error updating userId:', error)
        }
    }

    const handleFollow = async () => {
        if (!user || !currentUserProfile || !profile) return

        try {
            await updateDoc(doc(db, 'users', currentUserProfile.docId), {
                following: isFollowing ? arrayRemove(profile.uid) : arrayUnion(profile.uid)
            })

            await updateDoc(doc(db, 'users', profile.docId), {
                followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid)
            })

            setIsFollowing(!isFollowing)
        } catch (error) {
            console.error('Error updating follow status:', error)
        }
    }

    const handleFriendRequest = async () => {
        if (!user || !profile || !currentUserProfile) return

        try {
            await addDoc(collection(db, 'friendRequests'), {
                from: user.uid,
                to: profile.uid,
                status: 'pending',
                createdAt: serverTimestamp()
            })

            // 알림 생성
            await addDoc(collection(db, 'notifications'), {
                type: 'friend_request',
                title: '친구 요청',
                message: `${currentUserProfile.nickname || '사용자'}님이 친구 요청을 보냈습니다.`,
                from: user.uid,
                fromNickname: currentUserProfile.nickname,
                to: profile.uid,
                createdAt: serverTimestamp(),
                read: false
            })

            setFriendRequestSent(true)
        } catch (error) {
            console.error('Error sending friend request:', error)
        }
    }

    const handleBlock = async () => {
        if (!user || !currentUserProfile || !profile) return

        try {
            await updateDoc(doc(db, 'users', currentUserProfile.docId), {
                blocked: isBlocked ? arrayRemove(profile.uid) : arrayUnion(profile.uid)
            })

            setIsBlocked(!isBlocked)
        } catch (error) {
            console.error('Error updating block status:', error)
        }
    }

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await updateDoc(doc(db, 'notifications', notificationId), {
                read: true
            })
            loadNotifications()
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-2xl text-gray-400">로딩 중...</div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-black mb-4 text-gray-600">404</h1>
                    <p className="text-2xl text-gray-400 mb-8">사용자를 찾을 수 없습니다</p>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

    if (!profile) return null

    const achievements = [
        {id: 1, name: "첫 탈출", desc: "첫 번째 맵 클리어", icon: <Key className="w-6 h-6"/>, unlocked: true},
        {id: 2, name: "스피드러너", desc: "10분 이내 클리어", icon: <Clock className="w-6 h-6"/>, unlocked: true},
        {id: 3, name: "맵 제작자", desc: "첫 맵 제작", icon: <MapPin className="w-6 h-6"/>, unlocked: true},
        {id: 4, name: "인기 크리에이터", desc: "제작 맵 1000회 플레이", icon: <Star className="w-6 h-6"/>, unlocked: false},
        {id: 5, name: "마스터", desc: "레벨 100 달성", icon: <Trophy className="w-6 h-6"/>, unlocked: false},
        {id: 6, name: "완벽주의자", desc: "100개 맵 퍼펙트 클리어", icon: <Award className="w-6 h-6"/>, unlocked: false}
    ]

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Profile Header */}
                <div
                    className="bg-gradient-to-br from-gray-900/50 to-black rounded-3xl p-12 border border-gray-800 mb-12">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-8">
                            {/* Avatar */}
                            <div className="relative">
                                <div
                                    className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center">
                                    <User className="w-16 h-16"/>
                                </div>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                    {profile.level}
                                </div>
                            </div>

                            {/* User Info */}
                            <div>
                                {/* User ID */}
                                {isOwnProfile && profile.canChangeUserId && !isEditingUserId ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-gray-400">@{profile.userId}</span>
                                        <button
                                            onClick={() => setIsEditingUserId(true)}
                                            className="text-green-400 hover:text-green-300 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ) : isEditingUserId ? (
                                    <div className="mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">@</span>
                                            <input
                                                type="text"
                                                value={newUserId}
                                                onChange={(e) => handleUserIdChange(e.target.value.toLowerCase())}
                                                className="bg-gray-900 px-2 py-1 rounded border border-gray-700 text-sm"
                                                placeholder="새 사용자 ID"
                                            />
                                            {checkingNewUserId &&
                                                <span className="text-gray-400 text-sm">확인 중...</span>}
                                            {!checkingNewUserId && newUserIdAvailable === true && newUserId.length >= 3 && (
                                                <span className="text-green-400 text-sm">사용 가능</span>
                                            )}
                                            {!checkingNewUserId && newUserIdAvailable === false && (
                                                <span className="text-red-400 text-sm">사용 불가</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">3-20자의 영문, 숫자, 언더스코어(_)만 사용 가능</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mb-2">@{profile.userId}</p>
                                )}

                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="text-4xl font-bold mb-2 bg-gray-900 px-3 py-1 rounded-lg border border-gray-700"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-bold mb-2">{profile.nickname}</h1>
                                )}
                                <p className="text-gray-400 mb-4">{profile.email}</p>
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-gray-900 px-3 py-2 rounded-lg border border-gray-700 text-gray-300"
                                        rows={2}
                                    />
                                ) : (
                                    <p className="text-gray-300">{profile.bio || 'EROOM을 즐기고 있는 플레이어입니다.'}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isOwnProfile ? (
                                // 본인 프로필
                                isEditing || isEditingUserId ? (
                                    <>
                                        {isEditingUserId ? (
                                            <>
                                                <button
                                                    onClick={() => setShowUserIdWarning(true)}
                                                    disabled={!newUserIdAvailable || newUserId === profile.userId}
                                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    ID 변경
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingUserId(false)
                                                        setNewUserId(profile.userId)
                                                    }}
                                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5"/>
                                        </button>
                                        <button
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Settings className="w-5 h-5"/>
                                        </button>
                                        <button
                                            onClick={() => router.push('/auth/logout')}
                                            className="p-3 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors text-red-400"
                                        >
                                            <LogOut className="w-5 h-5"/>
                                        </button>
                                    </>
                                )
                            ) : (
                                // 다른 사용자 프로필
                                <>
                                    {!isFriend && !friendRequestSent && (
                                        <button
                                            onClick={handleFriendRequest}
                                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <UserPlus className="w-5 h-5"/>
                                            친구 추가
                                        </button>
                                    )}
                                    {friendRequestSent && (
                                        <button
                                            disabled
                                            className="px-6 py-3 bg-gray-700 rounded-lg font-medium cursor-not-allowed"
                                        >
                                            요청 전송됨
                                        </button>
                                    )}
                                    <button
                                        onClick={handleFollow}
                                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                            isFollowing
                                                ? 'bg-gray-800 hover:bg-gray-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        <UserMinus className="w-5 h-5"/>
                                        {isFollowing ? '팔로우 취소' : '팔로우'}
                                    </button>
                                    <button
                                        onClick={handleBlock}
                                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                            isBlocked
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                    >
                                        <UserX className="w-5 h-5"/>
                                        {isBlocked ? '차단 해제' : '차단하기'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mt-12">
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-green-400">{profile.points?.toLocaleString() || 0}</p>
                            <p className="text-gray-400 mt-1">포인트</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-blue-400">{profile.completedMaps || 0}</p>
                            <p className="text-gray-400 mt-1">클리어한 맵</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-purple-400">{profile.createdMaps || 0}</p>
                            <p className="text-gray-400 mt-1">제작한 맵</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-yellow-400">{profile.winRate || '0%'}</p>
                            <p className="text-gray-400 mt-1">승률</p>
                        </div>
                    </div>
                </div>

                {/* UserID Change Warning Modal */}
                {showUserIdWarning && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-8">
                        <div className="bg-gray-900 rounded-2xl p-8 max-w-md border border-gray-800">
                            <div className="flex items-center gap-4 mb-6">
                                <AlertTriangle className="w-12 h-12 text-yellow-500"/>
                                <h3 className="text-2xl font-bold">사용자 ID 변경 경고</h3>
                            </div>
                            <p className="text-gray-300 mb-6">
                                사용자 ID는 <span className="text-yellow-400 font-bold">단 한 번만</span> 변경할 수 있습니다.
                                변경 후에는 다시 변경할 수 없으니 신중하게 결정해주세요.
                            </p>
                            <p className="text-gray-400 mb-8">
                                새 사용자 ID: <span className="text-green-400 font-bold">@{newUserId}</span>
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        handleSaveUserId()
                                        setShowUserIdWarning(false)
                                    }}
                                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
                                >
                                    확인
                                </button>
                                <button
                                    onClick={() => setShowUserIdWarning(false)}
                                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications - Only show on own profile */}
                {isOwnProfile && notifications.length > 0 && (
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 mb-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Bell className="w-6 h-6 text-green-400"/>
                            알림 목록 ({notifications.length})
                        </h2>
                        <div className="space-y-3">
                            {notifications.slice(0, 5).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                        notification.read
                                            ? 'bg-gray-900/30 border-gray-800'
                                            : 'bg-green-900/20 border-green-800/50'
                                    }`}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{notification.title}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {notifications.length > 5 && (
                            <button className="mt-4 text-green-400 hover:text-green-300 transition-colors">
                                모든 알림 보기 →
                            </button>
                        )}
                    </div>
                )}

                {/* No notifications */}
                {isOwnProfile && notifications.length === 0 && (
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Bell className="w-6 h-6 text-gray-400"/>
                            알림 없음 (0)
                        </h2>
                        <p className="text-gray-500">새로운 알림이 없습니다.</p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8">
                    {/* Achievements */}
                    <div className="col-span-2">
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-green-400"/>
                                업적
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 rounded-xl border text-center transition-all ${
                                            achievement.unlocked
                                                ? 'bg-green-900/20 border-green-800 text-white'
                                                : 'bg-gray-900/50 border-gray-800 text-gray-500'
                                        }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                                                achievement.unlocked
                                                    ? 'bg-green-600/30 text-green-400'
                                                    : 'bg-gray-800 text-gray-600'
                                            }`}>
                                            {achievement.icon}
                                        </div>
                                        <h3 className="font-semibold mb-1">{achievement.name}</h3>
                                        <p className="text-sm opacity-75">{achievement.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Game Stats */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400"/>
                                게임 통계
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">총 플레이 시간</span>
                                    <span className="font-medium">{profile.totalPlayTime || '0시간'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">평균 클리어 시간</span>
                                    <span className="font-medium">{profile.avgClearTime || '00:00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">친구 수</span>
                                    <span className="font-medium">{profile.friendsCount || 0}명</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">팔로워</span>
                                    <span className="font-medium">{profile.followers?.length || 0}명</span>
                                </div>
                            </div>
                        </div>

                        {/* Join Date Badge */}
                        <div
                            className="bg-gradient-to-br from-green-900/20 to-black rounded-2xl p-6 border border-green-800/50 text-center">
                            <Calendar className="w-12 h-12 text-green-400 mx-auto mb-3"/>
                            <h3 className="text-lg font-bold mb-2">Early Adopter</h3>
                            <p className="text-sm text-gray-400">
                                {new Date(profile.createdAt).toLocaleDateString('ko-KR')}부터 함께해주셨어요!
                            </p>
                            {profile.userIdChangedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                    ID 변경: {new Date(profile.userIdChangedAt).toLocaleDateString('ko-KR')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}