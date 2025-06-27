'use client'

import {useAuth} from '../contexts/AuthContext'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export default function ProfileRedirectPage() {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push(`/profile/${user.uid}`)
            } else {
                router.push('/auth/login')
            }
        }
    }, [user, loading, router])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-2xl text-gray-400">리다이렉트 중...</div>
        </div>
    )
}