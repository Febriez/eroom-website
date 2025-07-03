import {useEffect, useMemo, useRef, useState} from 'react'
import {Send} from 'lucide-react'
import {Button} from '@/components/ui/Button'
import {Avatar} from '@/components/ui/Avatar'
import type {Message as FirestoreMessage} from '@/lib/firebase/services/message.service'
import {formatMessageTime, safeToDate} from '@/lib/utils'

interface MessageThreadProps {
    conversationId: string
    messages: FirestoreMessage[]
    participants: {
        id: string
        username: string
        avatar?: string
        displayName?: string
    }[]
    currentUserId: string
    onSendMessage: (text: string) => void
}

export default function MessageThread({
                                          conversationId,
                                          messages,
                                          participants,
                                          currentUserId,
                                          onSendMessage
                                      }: MessageThreadProps) {
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

    // 참가자 정보 맵 생성
    const participantsMap = participants.reduce((map, p) => {
        map[p.id] = p
        return map
    }, {} as Record<string, typeof participants[0]>)

    // 스크롤 위치 체크
    const checkIfScrolledToBottom = () => {
        const el = scrollContainerRef.current
        if (!el) return
        const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
        setIsScrolledToBottom(isBottom)
    }

    // 맨 아래로 스크롤
    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({behavior})
    }

    // 메시지 배열 변경 시 초기/자동 스크롤
    useEffect(() => {
        if (messages.length > 0 && isScrolledToBottom) {
            scrollToBottom('auto')
        }
    }, [messages, isScrolledToBottom])

    useEffect(() => {
        if (isScrolledToBottom && messages.length > 0) {
            scrollToBottom('smooth')
        }
    }, [messages.length])

    // 메시지 전송 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const text = newMessage.trim()
        if (!text) return
        onSendMessage(text)
        setNewMessage('')
        setTimeout(() => scrollToBottom('smooth'), 100)
    }

    // 상대방 정보
    const otherParticipant = participants.find(p => p.id !== currentUserId)

    // 날짜별 그룹화 (UI에서 한 번만 reverse)
    const messageGroups = useMemo(() => {
        const ordered = [...messages].reverse()  // 오름차순 쿼리 결과를 역순으로
        const groups: Record<string, FirestoreMessage[]> = {}
        ordered.forEach(msg => {
            const d = safeToDate(msg.createdAt) || new Date()
            const key = d.toDateString()
            if (!groups[key]) groups[key] = []
            groups[key].push(msg)
        })
        return groups
    }, [messages])

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* 헤더 */}
            {otherParticipant && (
                <div className="p-3 border-b border-gray-800 bg-gray-900 flex items-center">
                    <Avatar
                        src={otherParticipant.avatar}
                        alt={otherParticipant.username}
                        size="sm"
                        className="mr-3"
                    />
                    <div>
                        <h3 className="font-medium text-white">
                            {otherParticipant.displayName || otherParticipant.username}
                        </h3>
                        <p className="text-xs text-green-500">온라인</p>
                    </div>
                </div>
            )}

            {/* 메시지 목록 */}
            <div
                ref={scrollContainerRef}
                onScroll={checkIfScrolledToBottom}
                className="flex-1 overflow-y-auto p-4 bg-gray-950 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                style={{height: 'calc(100% - 120px)'}}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        대화를 시작하세요.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(messageGroups).map(([dateKey, msgs]) => {
                            const date = new Date(dateKey)
                            const today = new Date()
                            const yesterday = new Date(today)
                            yesterday.setDate(today.getDate() - 1)

                            let label = ''
                            if (date.toDateString() === today.toDateString()) {
                                label = '오늘'
                            } else if (date.toDateString() === yesterday.toDateString()) {
                                label = '어제'
                            } else {
                                label = new Intl.DateTimeFormat('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }).format(date)
                            }

                            return (
                                <div key={dateKey}>
                                    {/* 날짜 구분선 */}
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
                                            {label}
                                        </div>
                                    </div>

                                    {/* 해당 날짜 메시지들 */}
                                    <div className="space-y-2">
                                        {msgs.map(message => {
                                            const isMine = message.sender.uid === currentUserId
                                            const isRead = otherParticipant
                                                ? message.readBy.includes(otherParticipant.id)
                                                : false

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        isMine ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    {!isMine && (
                                                        <Avatar
                                                            src={participantsMap[message.sender.uid]?.avatar}
                                                            alt={participantsMap[message.sender.uid]?.displayName}
                                                            size="sm"
                                                            className="mr-2 flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="max-w-[70%]">
                                                        <div
                                                            className={`rounded-2xl px-4 py-2 inline-block break-words ${
                                                                isMine
                                                                    ? 'bg-green-600 text-white rounded-br-sm'
                                                                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                                                            }`}
                                                        >
                                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                                        </div>
                                                        <div
                                                            className={`text-xs mt-1 ${
                                                                isMine ? 'text-right' : 'text-left'
                                                            } text-gray-500`}
                                                        >
                                                            {formatMessageTime(message.createdAt)}
                                                            {isMine && (
                                                                <span className="ml-2">
                                  {isRead ? '읽음' : '전송됨'}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                <div ref={messagesEndRef} className="h-1"/>
            </div>

            {/* 메시지 입력 */}
            <form
                onSubmit={handleSubmit}
                className="p-3 border-t border-gray-800 bg-gray-900 flex items-center gap-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!newMessage.trim()}
                    className="px-3 py-2"
                >
                    <Send size={18}/>
                </Button>
            </form>
        </div>
    )
}
