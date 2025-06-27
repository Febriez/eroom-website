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
            if (!loading) {
                if (user) {
                    try {
                        // uid로 사용자 문서 찾기
                        const usersQuery = query(collection(db, 'users'), where('uid', '==', user.uid))
                        const querySnapshot = await getDocs(usersQuery)

                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0]
                            const userData = userDoc.data()
                            router.push(`/profile/${userData.userId}`)
                        } else {
                            // 사용자 문서가 없으면 홈으로
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