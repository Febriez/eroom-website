import {useEffect, useState} from 'react'
import {UserService} from '@/lib/firebase/services'
import type {User} from '@/lib/firebase/types'

export function useUser(uid: string | null) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!uid) {
            setUser(null)
            setLoading(false)
            return
        }

        setLoading(true)

        // Subscribe to user updates
        const unsubscribe = UserService.subscribeToUser(uid, (userData) => {
            setUser(userData)
            setLoading(false)
            setError(null)
        })

        return () => unsubscribe()
    }, [uid])

    return {user, loading, error}
}