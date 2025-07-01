// lib/hooks/useConversations.ts
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {MessageService} from '@/lib/firebase/services/message.service'
import {UserService} from '@/lib/firebase/services/user.service'
import type {Conversation} from '@/lib/firebase/types'

interface ConversationWithParticipant extends Conversation {
    otherParticipant?: {
        uid: string
        username: string
        displayName: string
        avatarUrl?: string
    }
    otherParticipantId?: string
}

export function useConversations() {
    const {user} = useAuth()
    const [conversations, setConversations] = useState<ConversationWithParticipant[]>([])
    const [loading, setLoading] = useState(true)
    const [totalUnreadCount, setTotalUnreadCount] = useState(0)

    useEffect(() => {
        if (!user) {
            setConversations([])
            setLoading(false)
            return
        }

        // 실시간 대화 목록 구독
        const unsubscribe = MessageService.subscribeToConversations(
            user.uid,
            async (convs) => {
                // 각 대화의 상대방 정보 가져오기
                const conversationsWithParticipants = await Promise.all(
                    convs.map(async (conv) => {
                        const otherParticipantId = conv.participants.find(p => p !== user.uid)

                        if (otherParticipantId) {
                            const otherUser = await UserService.getUserById(otherParticipantId)

                            return {
                                ...conv,
                                otherParticipantId,
                                otherParticipant: otherUser ? {
                                    uid: otherUser.uid,
                                    username: otherUser.username,
                                    displayName: otherUser.displayName,
                                    avatarUrl: otherUser.avatarUrl
                                } : undefined
                            }
                        }

                        return conv
                    })
                )

                setConversations(conversationsWithParticipants)

                // 총 읽지 않은 메시지 수 계산
                const unreadTotal = conversationsWithParticipants.reduce(
                    (sum, conv) => sum + (conv.unreadCount?.[user.uid] || 0),
                    0
                )
                setTotalUnreadCount(unreadTotal)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user])

    const createConversation = async (
        targetUserId: string,
        targetUserInfo: {
            username: string
            displayName: string
            avatarUrl?: string
        }
    ): Promise<string> => {
        if (!user) throw new Error('User not authenticated')

        // 대화에 참가자 정보 업데이트
        // 실제로는 MessageService에서 처리하는 것이 좋지만,
        // 일단 여기서는 conversationId만 반환

        return await MessageService.createOrGetConversation(
            user.uid,
            targetUserId
        )
    }

    return {
        conversations,
        loading,
        totalUnreadCount,
        createConversation
    }
}