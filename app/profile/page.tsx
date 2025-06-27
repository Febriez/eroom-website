'use client'

import {useAuth} from '../contexts/AuthContext'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {collection, getDocs, query, where} from 'firebase/firestore'
import {db} from '../lib/firebase'

export default function ProfileRedirectPage() {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkAndRedirect = async () => {
            console.log('Profile redirect page - Auth state:', { user: user?.uid, loading });
            if (!loading) {
                if (user) {
                    try {
                        // 5초 타임아웃 설정 (네트워크 지연 방지)
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Firebase query timeout')), 5000)
                        );

                        // uid로 사용자 문서 찾기
                        const fetchUserData = async () => {
                            try {
                                const usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                                console.log('Searching for user with uid:', user.uid)
                            const querySnapshot = await getDocs(usersQuery)
                            return querySnapshot;
                        };

                        // Promise.race로 타임아웃 처리
                        const querySnapshot = await Promise.race([fetchUserData(), timeoutPromise]) as any;

                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0]
                            const userData = userDoc.data()
                            if (userData && userData.userId) {
                                console.log('Redirecting to profile with userId:', userData.userId);
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
                    router.push('/auth/login')
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