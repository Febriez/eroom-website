// components/messaging/ConversationList.tsx
import {useEffect, useMemo, useRef, useState} from 'react';
import {Calendar, Filter, MessageSquare, Search, Trophy, User} from 'lucide-react';
import {Input} from '@/components/ui/Input';
import {Avatar} from '@/components/ui/Avatar';

interface Participant {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    level?: number;
}

interface Conversation {
    id: string;
    participants: Participant[];
    lastMessage: {
        text: string;
        timestamp: string;
        read: boolean;
    };
    unreadCount: number;
}

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId?: string;
    onSelectConversation: (id: string) => void;
}

type SortType = 'recent' | 'name' | 'level';

export default function ConversationList({
                                             conversations,
                                             activeConversationId,
                                             onSelectConversation
                                         }: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState<SortType>('recent');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setShowSortMenu(false);
            }
        };

        if (showSortMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showSortMenu]);

    // 검색 필터링
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            const searchLower = searchQuery.toLowerCase();
            return conv.participants.some(p =>
                p.username?.toLowerCase().includes(searchLower) ||
                p.displayName?.toLowerCase().includes(searchLower)
            );
        });
    }, [conversations, searchQuery]);

    // 정렬
    const sortedConversations = useMemo(() => {
        const sorted = [...filteredConversations];

        switch (sortType) {
            case 'recent':
                // 이미 최신순으로 정렬되어 있다고 가정
                break;
            case 'name':
                sorted.sort((a, b) => {
                    const nameA = a.participants[0]?.displayName || a.participants[0]?.username || '';
                    const nameB = b.participants[0]?.displayName || b.participants[0]?.username || '';
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'level':
                sorted.sort((a, b) => {
                    const levelA = a.participants[0]?.level || 0;
                    const levelB = b.participants[0]?.level || 0;
                    return levelB - levelA; // 높은 레벨이 먼저
                });
                break;
        }

        return sorted;
    }, [filteredConversations, sortType]);

    const sortOptions = [
        {value: 'recent', label: '최신순', icon: Calendar},
        {value: 'name', label: '이름순', icon: User},
        {value: 'level', label: '레벨순', icon: Trophy}
    ];

    const currentSortOption = sortOptions.find(opt => opt.value === sortType);

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-lg">
            {/* 검색 바 & 필터 */}
            <div className="p-3 border-b border-gray-800 space-y-2">
                <div className="relative">
                    <Input
                        placeholder="이름 또는 사용자명으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-10 bg-gray-800 border-gray-700 focus:border-green-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>

                    {/* 정렬 버튼 */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2" ref={sortMenuRef}>
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors relative"
                            title="정렬"
                        >
                            <Filter className="w-4 h-4 text-gray-400"/>
                        </button>

                        {/* 정렬 드롭다운 */}
                        {showSortMenu && (
                            <div
                                className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                                {sortOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortType(option.value as SortType);
                                                setShowSortMenu(false);
                                            }}
                                            className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                                                sortType === option.value ? 'text-green-400' : 'text-gray-300'
                                            } ${option.value === 'recent' ? 'rounded-t-lg' : ''} ${
                                                option.value === 'level' ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            <Icon className="w-4 h-4"/>
                                            <span className="text-sm">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 현재 정렬 표시 */}
                {currentSortOption && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <currentSortOption.icon className="w-3 h-3"/>
                        <span>{currentSortOption.label}으로 정렬됨</span>
                    </div>
                )}
            </div>

            {/* 대화 목록 */}
            <div
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                style={{maxHeight: 'calc(100% - 88px)'}}
            >
                {sortedConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-600 mb-4"/>
                        <p className="text-gray-500 mb-2">
                            {searchQuery ? '검색 결과가 없습니다.' : '대화 내역이 없습니다.'}
                        </p>
                        {!searchQuery && (
                            <p className="text-sm text-gray-600">
                                새로운 대화를 시작해보세요!
                            </p>
                        )}
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {sortedConversations.map((conversation) => {
                            const otherParticipant = conversation.participants[0];
                            const isActive = activeConversationId === conversation.id;
                            const hasUnread = conversation.unreadCount > 0;

                            return (
                                <li key={conversation.id}>
                                    <button
                                        onClick={() => onSelectConversation(conversation.id)}
                                        className={`w-full text-left p-4 hover:bg-gray-800 transition-colors relative ${
                                            isActive ? 'bg-gray-800' : ''
                                        }`}
                                    >
                                        {/* 활성 표시 바 */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            {/* 아바타 */}
                                            <div className="relative flex-shrink-0">
                                                <Avatar
                                                    src={otherParticipant.avatar}
                                                    alt={otherParticipant.displayName || otherParticipant.username}
                                                    size="sm"
                                                    className="w-12 h-12"
                                                />
                                                {hasUnread && (
                                                    <span
                                                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-medium px-1">
                                                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>

                                            {/* 정보 */}
                                            <div className="flex-1 min-w-0">
                                                {/* 이름과 시간 */}
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-medium truncate ${
                                                            hasUnread ? 'text-white' : 'text-gray-200'
                                                        }`}>
                                                            {otherParticipant.displayName || otherParticipant.username}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            @{otherParticipant.username}
                                                            {otherParticipant.level && (
                                                                <span className="ml-2">
                                                                    Lv.{otherParticipant.level}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs whitespace-nowrap ml-2 flex-shrink-0 ${
                                                        hasUnread ? 'text-green-400' : 'text-gray-500'
                                                    }`}>
                                                        {conversation.lastMessage.timestamp}
                                                    </span>
                                                </div>

                                                {/* 마지막 메시지 */}
                                                <p className={`text-sm truncate ${
                                                    hasUnread ? 'font-medium text-gray-200' : 'text-gray-400'
                                                }`}>
                                                    {conversation.lastMessage.text}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}