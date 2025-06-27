'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {useAuth} from '../../../contexts/AuthContext'
import {doc, getDoc, updateDoc} from 'firebase/firestore'
import {db} from '../../../lib/firebase'
import {AlertCircle, Save, User} from 'lucide-react'

export default function UserSettingsPage() {
    const {userId} = useParams()
    const {user} = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [profile, setProfile] = useState<any>(null)
    const [nickname, setNickname] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return

            try {
                setIsLoading(true)
                setError('')

                // userId로 사용자 정보 조회
                const userQuery = await getDoc(doc(db, 'User', userId as string));

                if (userQuery.exists()) {
                    const userData = userQuery.data();
                    setProfile(userData);
                    setNickname(userData.nickname || '');
                    setBio(userData.bio || '');
                } else {
                    setError('사용자 정보를 찾을 수 없습니다.')
                }
            } catch (err) {
                console.error('프로필 데이터 로드 오류:', err)
                setError('프로필을 불러오는 중 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserProfile()
    }, [userId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profile?.docId) {
            setError('사용자 정보가 올바르지 않습니다.')
            return
        }

        try {
            setIsSaving(true)
            setError('')
            setSuccess('')

            await updateDoc(doc(db, 'User', profile.docId), {
                nickname,
                bio
            })

            setSuccess('프로필이 성공적으로 업데이트되었습니다.')
        } catch (err) {
            console.error('프로필 업데이트 오류:', err)
            setError('프로필 업데이트 중 오류가 발생했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    // 권한 확인: 현재 로그인한 사용자의 프로필인지 확인
    const isCurrentUserProfile = user && profile && user.uid === profile.uid

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8">
                <div className="max-w-screen-lg mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-pulse text-green-400">설정 로딩 중...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (!isCurrentUserProfile) {
        return (
            <div className="min-h-screen bg-black pt-32 px-8">
                <div className="max-w-screen-lg mx-auto">
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0"/>
                        <div>
                            <h3 className="text-xl font-bold text-red-400">접근 권한이 없습니다</h3>
                            <p className="text-gray-300 mt-2">자신의 프로필 설정만 변경할 수 있습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8 pb-20">
            <div className="max-w-screen-lg mx-auto">
                <h1 className="text-4xl font-bold mb-8">계정 설정</h1>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"/>
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <Save className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"/>
                        <p className="text-green-400">{success}</p>
                    </div>
                )}

                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-green-400"/>
                        프로필 정보
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-400 mb-2">
                                닉네임
                            </label>
                            <input
                                id="nickname"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full max-w-md px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-1 focus:outline-none"
                                placeholder="닉네임"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">게임 및 커뮤니티에서 표시되는 이름입니다.</p>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-2">
                                자기소개
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-1 focus:outline-none"
                                placeholder="자기소개를 입력하세요..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? '저장 중...' : '변경사항 저장'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8">
                    <h2 className="text-2xl font-bold mb-6 text-red-400">위험 영역</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-medium mb-2">계정 탈퇴</h3>
                            <p className="text-gray-400 mb-4">계정을 탈퇴하면 모든 개인정보와 게임 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
                            <button
                                className="px-5 py-2 bg-red-600/30 text-red-400 border border-red-700 rounded-lg hover:bg-red-600/40 transition-colors">
                                계정 탈퇴
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
