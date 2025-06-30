import {useState} from 'react';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/Input';
import {Avatar} from '@/components/ui/Avatar';

interface Conversation {
    id: string;
    participants: {
        id: string;
        username: string;
        avatar?: string;
    }[];
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

export default function ConversationList({
                                             conversations,
                                             activeConversationId,
                                             onSelectConversation
                                         }: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(conv => {
        const participantNames = conv.participants.map(p => p.username.toLowerCase());
        return participantNames.some(name => name.includes(searchQuery.toLowerCase()));
    });

    return (
        <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-800">
                <div className="relative">
                    <Input
                        placeholder="대화 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-800 border-gray-700 focus:border-green-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                </div>
            </div>

            <div className="overflow-y-auto flex-grow">
                {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {searchQuery ? '검색 결과가 없습니다.' : '대화 내역이 없습니다.'}
                    </div>
                ) : (
                    <ul>
                        {filteredConversations.map((conversation) => {
                            const otherParticipant = conversation.participants[0]; // 간단한 예시를 위해 첫 번째 참가자만 표시
                            return (
                                <li key={conversation.id}>
                                    <button
                                        onClick={() => onSelectConversation(conversation.id)}
                                        className={`w-full text-left p-3 hover:bg-gray-800 flex items-start transition-colors ${
                                            activeConversationId === conversation.id ? 'bg-gray-800' : ''
                                        }`}
                                    >
                                        <div className="relative mr-3">
                                            <Avatar
                                                src={otherParticipant.avatar}
                                                alt={otherParticipant.username}
                                                size="sm"
                                            />
                                            {conversation.unreadCount > 0 && (
                                                <span
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-medium truncate text-white">{otherParticipant.username}</h4>
                                                <span
                                                    className="text-xs text-gray-500 whitespace-nowrap ml-1">{conversation.lastMessage.timestamp}</span>
                                            </div>
                                            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-300' : 'text-gray-500'}`}>
                                                {conversation.lastMessage.text}
                                            </p>
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