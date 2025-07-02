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

    // 외부 클릭 감지 — 정렬 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setShowSortMenu(false);
            }
        };
        if (showSortMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSortMenu]);

    // 검색 필터링
    const filteredConversations = useMemo(() => {
        const lower = searchQuery.toLowerCase();
        return conversations.filter(conv =>
            conv.participants.some(p =>
                p.username.toLowerCase().includes(lower) ||
                p.displayName?.toLowerCase().includes(lower)
            )
        );
    }, [conversations, searchQuery]);

    // 정렬
    const sortedConversations = useMemo(() => {
        const list = [...filteredConversations];
        if (sortType === 'name') {
            list.sort((a, b) => {
                const aName = a.participants[0].displayName || a.participants[0].username;
                const bName = b.participants[0].displayName || b.participants[0].username;
                return aName.localeCompare(bName);
            });
        } else if (sortType === 'level') {
            list.sort((a, b) => (b.participants[0].level || 0) - (a.participants[0].level || 0));
        }
        // 'recent'는 기본 순서 유지
        return list;
    }, [filteredConversations, sortType]);

    const sortOptions = [
        {value: 'recent', label: '최신순', icon: Calendar},
        {value: 'name', label: '이름순', icon: User},
        {value: 'level', label: '레벨순', icon: Trophy}
    ];
    const currentSort = sortOptions.find(o => o.value === sortType);

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-lg">
            {/* 검색 바 & 정렬 */}
            <div className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 p-3 space-y-2">
                <div className="relative">
                    <Input
                        placeholder="이름 또는 사용자명으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-10 bg-gray-800 border-gray-700 focus:border-green-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>

                    <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={sortMenuRef}>
                        <button
                            onClick={() => setShowSortMenu(v => !v)}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                            title="정렬"
                        >
                            <Filter className="w-4 h-4 text-gray-400"/>
                        </button>
                        {showSortMenu && (
                            <div
                                className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-30">
                                {sortOptions.map(opt => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSortType(opt.value as SortType);
                                                setShowSortMenu(false);
                                            }}
                                            className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                                                sortType === opt.value ? 'text-green-400' : 'text-gray-300'
                                            } ${opt.value === 'recent' ? 'rounded-t-lg' : ''} ${
                                                opt.value === 'level' ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            <Icon className="w-4 h-4"/>
                                            <span className="text-sm">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {currentSort && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <currentSort.icon className="w-3 h-3"/>
                        <span>{currentSort.label}으로 정렬됨</span>
                    </div>
                )}
            </div>

            {/* 대화 목록 */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {sortedConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-600 mb-4"/>
                        <p className="text-gray-500 mb-2">
                            {searchQuery ? '검색 결과가 없습니다.' : '대화 내역이 없습니다.'}
                        </p>
                        {!searchQuery && (
                            <p className="text-sm text-gray-600">새로운 대화를 시작해보세요!</p>
                        )}
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {sortedConversations.map(conversation => {
                            const other = conversation.participants[0];
                            const isActive = conversation.id === activeConversationId;
                            const hasUnread = conversation.unreadCount > 0;

                            return (
                                <li key={conversation.id}>
                                    <button
                                        onClick={() => onSelectConversation(conversation.id)}
                                        className={`w-full text-left p-4 hover:bg-gray-800 transition-colors relative ${
                                            isActive ? 'bg-gray-800' : ''
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"/>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <div className="relative flex-shrink-0">
                                                <Avatar
                                                    src={other.avatar}
                                                    alt={other.displayName || other.username}
                                                    size="sm"
                                                    className="w-12 h-12"
                                                />
                                                {hasUnread && (
                                                    <span
                                                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs h-5 flex items-center justify-center rounded-full font-medium px-1 min-w-[20px]">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex-1 min-w-0">
                                                        <h4
                                                            className={`font-medium truncate ${
                                                                hasUnread ? 'text-white' : 'text-gray-200'
                                                            }`}
                                                        >
                                                            {other.displayName || other.username}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            @{other.username}
                                                            {other.level &&
                                                                <span className="ml-2">Lv.{other.level}</span>}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`text-xs whitespace-nowrap ml-2 flex-shrink-0 ${
                                                            hasUnread ? 'text-green-400' : 'text-gray-500'
                                                        }`}
                                                    >
                            {conversation.lastMessage.timestamp}
                          </span>
                                                </div>
                                                <p
                                                    className={`text-sm truncate ${
                                                        hasUnread ? 'font-medium text-gray-200' : 'text-gray-400'
                                                    }`}
                                                >
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
