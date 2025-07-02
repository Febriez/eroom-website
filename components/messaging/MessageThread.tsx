import {useEffect, useMemo, useRef, useState} from 'react';
import {Send} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {Avatar} from '@/components/ui/Avatar';
import type {Message as FirestoreMessage} from '@/lib/firebase/types';
import {formatMessageTime, safeToDate} from '@/lib/utils';

interface MessageThreadProps {
    conversationId: string;
    messages: FirestoreMessage[];
    participants: {
        id: string;
        username: string;
        avatar?: string;
    }[];
    currentUserId: string;
    onSendMessage: (text: string) => void;
}

export default function MessageThread({
                                          conversationId,
                                          messages,
                                          participants,
                                          currentUserId,
                                          onSendMessage
                                      }: MessageThreadProps) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    // 참가자 정보 맵 생성
    const participantsMap = participants.reduce((map, participant) => {
        map[participant.id] = participant;
        return map;
    }, {} as Record<string, typeof participants[0]>);

    // 스크롤 상태 확인
    const checkIfScrolledToBottom = () => {
        if (!scrollContainerRef.current) return;
        const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 50;
        setIsScrolledToBottom(isBottom);
    };

    // 스크롤을 맨 아래로
    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({behavior});
    };

    // 메시지가 변경될 때 스크롤
    useEffect(() => {
        // 첫 로드 시에는 즉시 스크롤
        if (messages.length > 0 && isScrolledToBottom) {
            scrollToBottom('auto');
        }
    }, [messages, isScrolledToBottom]);

    // 새 메시지가 추가될 때 스크롤
    useEffect(() => {
        // 맨 아래에 있었다면 새 메시지가 올 때 자동 스크롤
        if (isScrolledToBottom && messages.length > 0) {
            scrollToBottom('smooth');
        }
    }, [messages.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
            // 메시지 전송 시 즉시 스크롤
            setTimeout(() => scrollToBottom('smooth'), 100);
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';

        let date: Date;

        try {
            if (timestamp.toDate) {
                date = timestamp.toDate();
            } else {
                date = new Date(timestamp);
            }
        } catch (error) {
            return '';
        }

        // 오늘인지 확인
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            // 오늘이면 시간만 표시
            return new Intl.DateTimeFormat('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } else {
            // 다른 날이면 날짜와 시간 표시
            return new Intl.DateTimeFormat('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    };

    // 상대방 정보 가져오기
    const otherParticipant = participants.find(p => p.id !== currentUserId);

    // 메시지를 날짜별로 그룹화
    const groupMessagesByDate = (messages: FirestoreMessage[]) => {
        const groups: { [key: string]: FirestoreMessage[] } = {};

        messages.forEach(message => {
            const date = safeToDate(message.createdAt) || new Date();
            const dateKey = date.toDateString();

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(message);
        });

        return groups;
    };

    const messageGroups = useMemo(() => {
        return groupMessagesByDate([...messages].reverse());
    }, [messages]);

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* 헤더 */}
            {otherParticipant && (
                <div className="p-3 border-b border-gray-800 flex items-center bg-gray-900">
                    <Avatar
                        src={otherParticipant.avatar}
                        alt={otherParticipant.username}
                        size="sm"
                        className="mr-3"
                    />
                    <div>
                        <h3 className="font-medium text-white">{otherParticipant.username}</h3>
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
                        {Object.entries(messageGroups).map(([dateKey, dateMessages]) => {
                            const date = new Date(dateKey);
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);

                            let dateLabel = '';
                            if (date.toDateString() === today.toDateString()) {
                                dateLabel = '오늘';
                            } else if (date.toDateString() === yesterday.toDateString()) {
                                dateLabel = '어제';
                            } else {
                                dateLabel = new Intl.DateTimeFormat('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }).format(date);
                            }

                            return (
                                <div key={dateKey}>
                                    {/* 날짜 구분선 */}
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
                                            {dateLabel}
                                        </div>
                                    </div>

                                    {/* 해당 날짜의 메시지들 */}
                                    <div className="space-y-2">
                                        {dateMessages.map((message) => {
                                            const isMine = message.sender.uid === currentUserId;
                                            const isRead = message.readBy?.includes(otherParticipant?.id || '') || false;

                                            return (
                                                <div key={message.id}
                                                     className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    {!isMine && (
                                                        <Avatar
                                                            src={participantsMap[message.sender.uid]?.avatar}
                                                            alt={message.sender.displayName}
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
                                                            className={`text-xs text-gray-500 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                                            {formatMessageTime(message.createdAt)}
                                                            {isMine && (
                                                                <span className="ml-2">
                                                                    {isRead ? '읽음' : '전송됨'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div ref={messagesEndRef} className="h-1"/>
            </div>

            {/* 메시지 입력 영역 */}
            <div className="p-3 border-t border-gray-800 bg-gray-900">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지 입력..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 text-white placeholder-gray-500"
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
        </div>
    );
}