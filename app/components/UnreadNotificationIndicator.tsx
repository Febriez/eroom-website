'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface UnreadNotificationIndicatorProps {
    userId: string
}

export default function UnreadNotificationIndicator({ userId }: UnreadNotificationIndicatorProps) {
    const [hasUnread, setHasUnread] = useState(false)

    useEffect(() => {
        if (!userId) return

        // 실시간으로 읽지 않은 알림 확인
        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('to', '==', userId),
            where('read', '==', false)
        )

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            setHasUnread(!snapshot.empty)
        })

        return () => unsubscribe()
    }, [userId])

    if (!hasUnread) return null

    return (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
    )
}
