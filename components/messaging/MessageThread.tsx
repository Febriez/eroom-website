import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

interface Participant {
  id: string;
  username: string;
  avatar?: string;
}

interface MessageThreadProps {
  conversationId: string;
  messages: Message[];
  participants: Participant[];
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

  // 참가자 정보 맵 생성
  const participantsMap = participants.reduce((map, participant) => {
    map[participant.id] = participant;
    return map;
  }, {} as Record<string, Participant>);

  // 스크롤을 항상 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // 상대방 정보 가져오기
  const otherParticipant = participants.find(p => p.id !== currentUserId);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      {otherParticipant && (
        <div className="p-3 border-b flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 relative overflow-hidden mr-3">
            {otherParticipant.avatar ? (
              <Image 
                src={otherParticipant.avatar} 
                alt={otherParticipant.username} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                {otherParticipant.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{otherParticipant.username}</h3>
            <p className="text-xs text-green-500">온라인</p> {/* 상태 표시는 실제 데이터에 맞게 수정 필요 */}
          </div>
        </div>
      )}

      {/* 메시지 목록 */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            대화를 시작하세요.
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId;
            const sender = participantsMap[message.senderId];

            return (
              <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                {!isMine && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 relative overflow-hidden mr-2 flex-shrink-0">
                    {sender?.avatar ? (
                      <Image 
                        src={sender.avatar} 
                        alt={sender.username} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        {sender?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div 
                    className={`rounded-lg px-4 py-2 inline-block break-words ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp}
                    {isMine && (message.read ? ' • 읽음' : ' • 전송됨')}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지 입력..."
            className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary" className="ml-2">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
