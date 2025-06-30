'use client'

import {useAuth} from '../contexts/AuthContext'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {collection, DocumentData, getDocs, query, QuerySnapshot, where} from 'firebase/firestore'
import {db} from '../lib/firebase'

export default function ProfileRedirectPage() {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkAndRedirect = async () => {
            console.log('Profile redirect page - Auth state:', {user: user?.uid, loading})
            if (!loading) {
                if (user) {
                    try {
                        // 5초 타임아웃 설정 (네트워크 지연 방지)
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Firebase query timeout')), 5000)
                        )

                        // uid로 사용자 문서 찾기
                        const fetchUserData = async (): Promise<QuerySnapshot<DocumentData>> => {
                            try {
                                // 먼저 User 컬렉션에서 검색
                                let usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                                console.log('Searching for user with uid:', user.uid, 'in User collection')
                                let querySnapshot = await getDocs(usersQuery)

                                // User 컬렉션에 없으면 users 컬렉션에서 검색 (이전 데이터 호환성)
                                if (querySnapshot.empty) {
                                    console.log('User not found in User collection, checking users collection')
                                    usersQuery = query(collection(db, 'users'), where('uid', '==', user.uid))
                                    querySnapshot = await getDocs(usersQuery)

                                    // users 컬렉션에서 찾았다면 마이그레이션 필요성 기록
                                    if (!querySnapshot.empty) {
                                        console.log('User found in users collection, needs migration')
                                    }
                                }

                                return querySnapshot
                            } catch (error) {
                                console.error('Error in fetchUserData:', error)
                                throw error
                            }
                        }

                        // Promise.race로 타임아웃 처리
                        const querySnapshot = await Promise.race([fetchUserData(), timeoutPromise]) as QuerySnapshot<DocumentData>

                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0]
                            const userData = userDoc.data()
                            console.log('Found user data:', userData)
                            if (userData && userData.userId) {
                                console.log('Redirecting to profile with userId:', userData.userId)
                                router.push(`/profile/${userData.userId}`)
                            } else {
                                console.error('User document found but userId is missing')
                                router.push('/')
                            }
                        } else {
                            console.error('User document not found in Firestore for uid:', user.uid)
                            router.push('/')
                        }
                    } catch (error) {
                        console.error('Error finding user:', error)
                        router.push('/')
                    }
                } else {
                    // 로그인 페이지로 리다이렉트하는 대신 로그인 필요 메시지를 표시하기 위해 프로필 페이지로 이동
                    router.push('/profile/login-required')
                }
                setChecking(false)
            }
        }

        checkAndRedirect()
    }, [user, loading, router])

    if (loading || checking) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-2xl text-gray-400">리다이렉트 중...</div>
            </div>
        )
    }

    return null
}