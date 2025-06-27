'use client'

import {
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
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore'
import {db} from '../../lib/firebase'

interface UserProfile {
    uid: string
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
    const uid = params.uid as string

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [nickname, setNickname] = useState('')
    const [bio, setBio] = useState('')

    // 관계 상태
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [friendRequestSent, setFriendRequestSent] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)

    // 알림
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const isOwnProfile = user?.uid === uid

    useEffect(() => {
        loadProfile()
        if (user) {
            loadRelationshipStatus()
            loadNotifications()
        }
    }, [uid, user])

    const loadProfile = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid))

            if (!userDoc.exists()) {
                setNotFound(true)
                setLoading(false)
                return
            }

            const userData = userDoc.data() as UserProfile
            setProfile(userData)
            setNickname(userData.nickname || '')
            setBio(userData.bio || '')
            setLoading(false)
        } catch (error) {
            console.error('Error loading profile:', error)
            setNotFound(true)
            setLoading(false)
        }
    }

    const loadRelationshipStatus = async () => {
        if (!user || user.uid === uid) return

        try {
            const currentUserDoc = await getDoc(doc(db, 'users', user.uid))
            const currentUserData = currentUserDoc.data()

            setIsFollowing(currentUserData?.following?.includes(uid) || false)
            setIsFriend(currentUserData?.friends?.includes(uid) || false)
            setIsBlocked(currentUserData?.blocked?.includes(uid) || false)

            // 친구 요청 확인
            const friendRequestQuery = query(
                collection(db, 'friendRequests'),
                where('from', '==', user.uid),
                where('to', '==', uid),
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

    const handleSaveProfile = async () => {
        if (!user || !profile) return

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                nickname,
                bio
            })

            setProfile({...profile, nickname, bio})
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleFollow = async () => {
        if (!user) return

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                following: isFollowing ? arrayRemove(uid) : arrayUnion(uid)
            })

            await updateDoc(doc(db, 'users', uid), {
                followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid)
            })

            setIsFollowing(!isFollowing)
        } catch (error) {
            console.error('Error updating follow status:', error)
        }
    }

    const handleFriendRequest = async () => {
        if (!user || !profile) return

        try {
            await addDoc(collection(db, 'friendRequests'), {
                from: user.uid,
                to: uid,
                status: 'pending',
                createdAt: serverTimestamp()
            })

            // 알림 생성
            await addDoc(collection(db, 'notifications'), {
                type: 'friend_request',
                title: '친구 요청',
                message: `${user.displayName || '사용자'}님이 친구 요청을 보냈습니다.`,
                from: user.uid,
                fromNickname: user.displayName,
                to: uid,
                createdAt: serverTimestamp(),
                read: false
            })

            setFriendRequestSent(true)
        } catch (error) {
            console.error('Error sending friend request:', error)
        }
    }

    const handleBlock = async () => {
        if (!user) return

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                blocked: isBlocked ? arrayRemove(uid) : arrayUnion(uid)
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
                        href="/public"
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
                                isEditing ? (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}