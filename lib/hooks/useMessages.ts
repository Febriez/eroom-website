import {useEffect, useState} from 'react'
import type {Message} from '@/lib/firebase/services/message.service'
import {MessageService} from '@/lib/firebase/services/message.service'
import {useAuth} from '@/contexts/AuthContext'
import {useNotifications} from './useNotifications'

export function useMessages(conversationId: string | null) {
    const {user} = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const {markNotificationsByConversation} = useNotifications()

    useEffect(() => {
        if (!conversationId || !user) {
            setMessages([])
            setLoading(false)
            return
        }

        setLoading(true)
        const unsubscribe = MessageService.subscribeToMessages(
            conversationId,
            (messageList) => {
                const blockedIds = user.social.blocked || []
                // 역순 처리 **없음**: MessageThread 에서 한 번만 reverse
                const filtered = messageList.filter(
                    (msg) => !blockedIds.includes(msg.sender.uid)
                )
                setMessages(filtered)
                setLoading(false)
                setError(null)
            }
        )

        // 읽음 처리
        MessageService.markMessagesAsRead(conversationId, user.uid).catch(console.error)
        markNotificationsByConversation(conversationId).catch(console.error)

        return () => unsubscribe()
    }, [conversationId, user])

    const sendMessage = async (content: string) => {
        if (!user || !conversationId) {
            throw new Error('User not authenticated or no conversation selected')
        }
        await MessageService.sendMessage(
            conversationId,
            {
                uid: user.uid,
                username: user.username || '',
                displayName: user.displayName || ''
            },
            content
        )
    }

    return {messages, loading, error, sendMessage}
}
