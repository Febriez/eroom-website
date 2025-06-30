import Link from 'next/link';
import Image from 'next/image';

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastActive?: string;
}

interface FriendsListProps {
  friends: Friend[];
  isLoading?: boolean;
}

export default function FriendsList({ friends, isLoading = false }: FriendsListProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-500">아직 친구가 없습니다.</p>
        <Link href="/community/maps" className="mt-3 inline-block text-blue-600 hover:text-blue-800">
          다른 플레이어 찾기
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">내 친구 ({friends.length})</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="border-b last:border-b-0">
            <Link 
              href={`/profile/${friend.id}`}
              className="flex items-center p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="relative mr-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 relative overflow-hidden">
                  {friend.avatar ? (
                    <Image 
                      src={friend.avatar} 
                      alt={friend.username} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span 
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                ></span>
              </div>
              <div>
                <h4 className="font-medium">{friend.username}</h4>
                <p className="text-xs text-gray-500">
                  {friend.isOnline ? '온라인' : `마지막 접속: ${friend.lastActive || '알 수 없음'}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
