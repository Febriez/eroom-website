import {useEffect, useState} from 'react'
import {MessageService} from '@/lib/firebase/services'
import type {Message} from '@/lib/firebase/types'
import {useAuth} from '@/contexts/AuthContext'

export function useMessages(conversationId: string | null) {
    const {user} = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

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
                setMessages(messageList)
                setLoading(false)
                setError(null)
            }
        )

        // 메시지 읽음 처리
        MessageService.markMessagesAsRead(conversationId, user.uid).catch(console.error)

        return () => unsubscribe()
    }, [conversationId, user])

    const sendMessage = async (content: string) => {
        if (!user || !conversationId) {
            throw new Error('User not authenticated or no conversation selected')
        }

        try {
            await MessageService.sendMessage(
                conversationId,
                {
                    uid: user.uid,
                    username: user.username || '',
                    displayName: user.displayName || ''
                },
                content
            )
        } catch (err) {
            console.error('Error sending message:', err)
            throw err
        }
    }

    return {
        messages,
        loading,
        error,
        sendMessage
    }
}