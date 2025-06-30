import {useEffect, useState} from 'react'
import {MessageService} from '@/lib/firebase/services'
import type {Conversation} from '@/lib/firebase/types'
import {useAuth} from '@/contexts/AuthContext'
import {collection, onSnapshot, orderBy, query, where} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'

export interface ConversationWithLastMessage extends Conversation {
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
    const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!user) {
            setConversations([])
            setLoading(false)
            return
        }

        try {
            // 대화 목록 실시간 구독
            const conversationsQuery = query(
                collection(db, COLLECTIONS.CONVERSATIONS),
                where('participants', 'array-contains', user.uid),
                orderBy('updatedAt', 'desc')
            )

            const unsubscribe = onSnapshot(
                conversationsQuery,
                (snapshot) => {
                    const conversationList = snapshot.docs.map(doc => {
                        const data = doc.data() as Conversation
                        const conversation: ConversationWithLastMessage = {
                            ...data,
                            id: doc.id
                        }

                        // 상대방 정보 추가
                        const otherParticipantId = data.participants.find(p => p !== user.uid)
                        if (otherParticipantId && data.participantInfo) {
                            const participantData = data.participantInfo[otherParticipantId]
                            if (participantData) {
                                conversation.otherParticipant = {
                                    uid: otherParticipantId,
                                    username: participantData.username,
                                    displayName: participantData.displayName,
                                    avatarUrl: participantData.avatarUrl
                                }
                            }
                            conversation.otherParticipantId = otherParticipantId
                        }

                        return conversation
                    })

                    setConversations(conversationList)
                    setLoading(false)
                    setError(null)
                },
                (err) => {
                    console.error('Error fetching conversations:', err)
                    setError(err as Error)
                    setLoading(false)
                }
            )

            return () => unsubscribe()
        } catch (err) {
            console.error('Error setting up conversations listener:', err)
            setError(err as Error)
            setLoading(false)
        }
    }, [user])

    const createConversation = async (targetUserId: string, targetUserInfo: {
        username: string
        displayName: string
        avatarUrl?: string
    }) => {
        if (!user) throw new Error('User not authenticated')

        try {
            const conversationId = await MessageService.createConversation(
                {
                    uid: user.uid,
                    username: user.username || '',
                    displayName: user.displayName || ''
                },
                {
                    uid: targetUserId,
                    username: targetUserInfo.username,
                    displayName: targetUserInfo.displayName
                }
            )
            return conversationId
        } catch (err) {
            console.error('Error creating conversation:', err)
            throw err
        }
    }

    const getTotalUnreadCount = () => {
        if (!user) return 0

        return conversations.reduce((total, conv) => {
            return total + (conv.unreadCount?.[user.uid] || 0)
        }, 0)
    }

    return {
        conversations,
        loading,
        error,
        createConversation,
        totalUnreadCount: getTotalUnreadCount()
    }
}