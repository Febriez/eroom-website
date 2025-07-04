// lib/hooks/useConversations.ts
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {MessageService} from '@/lib/firebase/services/message.service'
import {UserService} from '@/lib/firebase/services/user.service'
import type {Conversation} from '@/lib/firebase/types'
import {doc, writeBatch} from 'firebase/firestore'
import {db} from '@/lib/firebase/config'
import {COLLECTIONS} from '@/lib/firebase/collections'

interface ParticipantInfo {
    uid?: string
    username?: string
    displayName: string
    avatarUrl?: string
    level?: number
}

interface ConversationWithParticipant extends Conversation {
    otherParticipant?: ParticipantInfo
    otherParticipantId?: string
    isBlocked?: boolean
}

export function useConversations() {
    const {user} = useAuth()
    const [conversations, setConversations] = useState<ConversationWithParticipant[]>([])
    const [loading, setLoading] = useState(true)
    const [totalUnreadCount, setTotalUnreadCount] = useState(0)
    const [dismissedConversations, setDismissedConversations] = useState<Set<string>>(new Set())

    // localStorage에서 닫은 대화 목록 불러오기
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`dismissedMessages_${user.uid}`)
            if (saved) {
                setDismissedConversations(new Set(JSON.parse(saved)))
            }
        }
    }, [user])

    // 닫은 대화 목록을 localStorage에 저장
    const saveDismissedConversations = (dismissed: Set<string>) => {
        if (user) {
            localStorage.setItem(`dismissedMessages_${user.uid}`, JSON.stringify(Array.from(dismissed)))
        }
    }

    useEffect(() => {
        if (!user) {
            setConversations([])
            setLoading(false)
            return
        }

        // 실시간 대화 목록 구독 (차단된 대화 자동 필터링됨)
        const unsubscribe = MessageService.subscribeToConversations(
            user.uid,
            async (convs) => {
                // 사용자 정보 가져오기 (차단 목록 확인용)
                const currentUser = await UserService.getUserById(user.uid)
                if (!currentUser) return

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

                            // 차단 상태 확인 (새로운 User 타입의 social.blockedUsers 사용)
                            const isBlocked = currentUser.social.blockedUsers?.includes(otherParticipantId) || false

                            return {
                                ...conv,
                                otherParticipantId,
                                otherParticipant: participantData,
                                isBlocked
                            } as ConversationWithParticipant
                        }

                        return {
                            ...conv,
                            otherParticipantId
                        } as ConversationWithParticipant
                    })
                );

                // 새로운 메시지가 있으면 닫기 상태 해제 (차단된 대화 제외)
                conversationsWithParticipants.forEach(conv => {
                    if (conv.lastMessage &&
                        conv.lastMessage.senderId !== user.uid &&
                        dismissedConversations.has(conv.id) &&
                        !conv.isBlocked) {
                        // 이전에 닫았던 대화에 새 메시지가 왔으면 다시 표시
                        const newDismissed = new Set(dismissedConversations)
                        newDismissed.delete(conv.id)
                        setDismissedConversations(newDismissed)
                        saveDismissedConversations(newDismissed)
                    }
                })

                setConversations(conversationsWithParticipants)

                // 총 읽지 않은 메시지 수 계산 (차단된 대화 제외)
                const unreadTotal = conversationsWithParticipants
                    .filter(conv => !conv.isBlocked)
                    .reduce(
                        (sum, conv) => sum + (conv.unreadCount?.[user.uid] || 0),
                        0
                    )
                setTotalUnreadCount(unreadTotal)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user, dismissedConversations])

    const createConversation = async (
        targetUserId: string,
        targetUserInfo: {
            username?: string
            displayName: string
            avatarUrl?: string
        }
    ): Promise<string> => {
        if (!user) throw new Error('User not authenticated')

        try {
            // MessageService가 차단 확인을 자동으로 처리
            return await MessageService.createOrGetConversation(
                user.uid,
                targetUserId
            )
        } catch (error: any) {
            if (error.message?.includes('blocked')) {
                throw new Error('차단된 사용자와는 대화를 시작할 수 없습니다.')
            }
            throw error
        }
    }

    const markAllConversationsAsRead = async () => {
        if (!user || conversations.length === 0) return

        try {
            const batch = writeBatch(db)

            // 현재 읽지 않은 메시지가 있는 대화들만 처리 (차단된 대화 제외)
            const unreadConversations = conversations.filter(
                conv => (conv.unreadCount?.[user.uid] || 0) > 0 && !conv.isBlocked
            )

            unreadConversations.forEach((conv) => {
                const convRef = doc(db, COLLECTIONS.CONVERSATIONS, conv.id)
                batch.update(convRef, {
                    [`unreadCount.${user.uid}`]: 0
                })
            })

            await batch.commit()
        } catch (error) {
            console.error('Error marking all conversations as read:', error)
        }
    }


    // 대화 닫기
    const dismissConversation = (conversationId: string) => {
        const newDismissed = new Set(dismissedConversations)
        newDismissed.add(conversationId)
        setDismissedConversations(newDismissed)
        saveDismissedConversations(newDismissed)
    }

    // 닫은 대화 다시 열기
    const undismissConversation = (conversationId: string) => {
        const newDismissed = new Set(dismissedConversations)
        newDismissed.delete(conversationId)
        setDismissedConversations(newDismissed)
        saveDismissedConversations(newDismissed)
    }

    // 모든 닫은 대화 초기화
    const clearDismissedConversations = () => {
        setDismissedConversations(new Set())
        if (user) {
            localStorage.removeItem(`dismissedMessages_${user.uid}`)
        }
    }

    return {
        conversations,
        loading,
        totalUnreadCount,
        dismissedConversations,
        createConversation,
        markAllConversationsAsRead,
        dismissConversation,
        undismissConversation,
        clearDismissedConversations
    }
}