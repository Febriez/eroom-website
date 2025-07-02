// lib/hooks/useConversations.ts
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {MessageService} from '@/lib/firebase/services/message.service'
import {UserService} from '@/lib/firebase/services/user.service'
import type {Conversation} from '@/lib/firebase/types'

interface ParticipantInfo {
    uid?: string
    username: string
    displayName: string
    avatarUrl?: string
    level?: number
}

interface ConversationWithParticipant extends Conversation {
    otherParticipant?: ParticipantInfo
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
                // 각 대화의 상대방 정보 추출
                const conversationsWithParticipants = await Promise.all(
                    convs.map(async (conv) => {
                        const otherParticipantId = conv.participants.find(p => p !== user.uid)

                        if (otherParticipantId) {
                            // participantInfo에 level이 없을 수도 있으므로, 필요시 사용자 정보 다시 가져오기
                            let participantData = conv.participantInfo?.[otherParticipantId] as ParticipantInfo | undefined;

                            // level 정보가 없으면 UserService에서 가져오기
                            if (participantData && !participantData.level) {
                                try {
                                    const fullUserData = await UserService.getUserById(otherParticipantId);
                                    if (fullUserData) {
                                        participantData = {
                                            ...participantData,
                                            level: fullUserData.level
                                        };
                                    }
                                } catch (error) {
                                    console.error('Error fetching user level:', error);
                                }
                            }

                            return {
                                ...conv,
                                otherParticipantId,
                                otherParticipant: participantData
                            } as ConversationWithParticipant
                        }

                        return {
                            ...conv,
                            otherParticipantId
                        } as ConversationWithParticipant
                    })
                );

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

        // MessageService가 이제 participantInfo를 자동으로 처리합니다
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