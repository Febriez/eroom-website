'use client'

import {
    Award,
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
    User
} from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import Link from 'next/link'

export default function ProfilePage() {
    const {user, logout} = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [nickname, setNickname] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
        } else {
            setNickname(user.displayName || 'Player')
            setBio('EROOM을 즐기고 있는 플레이어입니다.')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    // 더미 데이터 - 실제로는 Firestore에서 가져와야 함
    const stats = {
        level: 42,
        points: 128450,
        completedMaps: 324,
        createdMaps: 12,
        totalPlayTime: '256시간',
        winRate: '87.5%',
        avgClearTime: '18:32',
        friendsCount: 48
    }

    const achievements = [
        {id: 1, name: "첫 탈출", desc: "첫 번째 맵 클리어", icon: <Key className="w-6 h-6"/>, unlocked: true},
        {id: 2, name: "스피드러너", desc: "10분 이내 클리어", icon: <Clock className="w-6 h-6"/>, unlocked: true},
        {id: 3, name: "맵 제작자", desc: "첫 맵 제작", icon: <MapPin className="w-6 h-6"/>, unlocked: true},
        {id: 4, name: "인기 크리에이터", desc: "제작 맵 1000회 플레이", icon: <Star className="w-6 h-6"/>, unlocked: false},
        {id: 5, name: "마스터", desc: "레벨 100 달성", icon: <Trophy className="w-6 h-6"/>, unlocked: false},
        {id: 6, name: "완벽주의자", desc: "100개 맵 퍼펙트 클리어", icon: <Award className="w-6 h-6"/>, unlocked: false}
    ]

    const recentActivity = [
        {date: "2시간 전", action: "맵 클리어", detail: "사이버펑크 도시 탈출", points: "+450"},
        {date: "5시간 전", action: "맵 제작", detail: "미로 속의 비밀", points: "+200"},
        {date: "1일 전", action: "업적 달성", detail: "스피드러너", points: "+1000"},
        {date: "2일 전", action: "친구 추가", detail: "GameMaster와 친구가 되었습니다", points: "-"},
        {date: "3일 전", action: "맵 평가", detail: "우주 정거장 탈출에 5점", points: "+50"}
    ]

    const handleSaveProfile = () => {
        // 실제로는 여기서 Firebase 업데이트
        setIsEditing(false)
    }

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
                                    {stats.level}
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
                                    <h1 className="text-4xl font-bold mb-2">{nickname}</h1>
                                )}
                                <p className="text-gray-400 mb-4">{user.email}</p>
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-gray-900 px-3 py-2 rounded-lg border border-gray-700 text-gray-300"
                                        rows={2}
                                    />
                                ) : (
                                    <p className="text-gray-300">{bio}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isEditing ? (
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
                                        onClick={() => logout()}
                                        className="p-3 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors text-red-400"
                                    >
                                        <LogOut className="w-5 h-5"/>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mt-12">
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-green-400">{stats.points.toLocaleString()}</p>
                            <p className="text-gray-400 mt-1">포인트</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-blue-400">{stats.completedMaps}</p>
                            <p className="text-gray-400 mt-1">클리어한 맵</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-purple-400">{stats.createdMaps}</p>
                            <p className="text-gray-400 mt-1">제작한 맵</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-yellow-400">{stats.winRate}</p>
                            <p className="text-gray-400 mt-1">승률</p>
                        </div>
                    </div>
                </div>

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
                            <Link
                                href="/achievements"
                                className="inline-block mt-6 text-green-400 hover:text-green-300 transition-colors"
                            >
                                모든 업적 보기 →
                            </Link>
                        </div>

                        {/* Recent Activity */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 mt-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-green-400"/>
                                최근 활동
                            </h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index}
                                         className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">{activity.date}</span>
                                            <div>
                                                <p className="font-medium">{activity.action}</p>
                                                <p className="text-sm text-gray-400">{activity.detail}</p>
                                            </div>
                                        </div>
                                        {activity.points !== "-" && (
                                            <span className={`font-bold ${
                                                activity.points.startsWith('+') ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {activity.points}
                                            </span>
                                        )}
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
                                    <span className="font-medium">{stats.totalPlayTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">평균 클리어 시간</span>
                                    <span className="font-medium">{stats.avgClearTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">친구 수</span>
                                    <span className="font-medium">{stats.friendsCount}명</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">가입일</span>
                                    <span className="font-medium">2025년 1월 15일</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold mb-4">빠른 메뉴</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/community/maps"
                                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <MapPin className="w-5 h-5 text-green-400"/>
                                    <span>내가 만든 맵</span>
                                </Link>
                                <Link
                                    href="/store/credits"
                                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <Star className="w-5 h-5 text-green-400"/>
                                    <span>크레딧 구매</span>
                                </Link>
                                <Link
                                    href="/community/rankings"
                                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <Trophy className="w-5 h-5 text-green-400"/>
                                    <span>랭킹 확인</span>
                                </Link>
                            </div>
                        </div>

                        {/* Join Date Badge */}
                        <div
                            className="bg-gradient-to-br from-green-900/20 to-black rounded-2xl p-6 border border-green-800/50 text-center">
                            <Calendar className="w-12 h-12 text-green-400 mx-auto mb-3"/>
                            <h3 className="text-lg font-bold mb-2">Early Adopter</h3>
                            <p className="text-sm text-gray-400">2025년 1월부터 함께해주셨어요!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}