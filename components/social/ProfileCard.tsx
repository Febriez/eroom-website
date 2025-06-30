import Image from 'next/image';
import FollowButton from './FollowButton';
import SocialStats from './SocialStats';

interface ProfileCardProps {
  userId: string;
  username: string;
  avatar?: string;
  bio?: string;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  stats?: {
    followers: number;
    following: number;
    completedGames: number;
  }
}

export default function ProfileCard({
  userId,
  username,
  avatar,
  bio,
  isCurrentUser = false,
  isFollowing = false,
  onFollowToggle,
  stats = { followers: 0, following: 0, completedGames: 0 }
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 h-20" />
      <div className="p-6 pt-0 relative">
        <div className="relative -mt-10 mb-4">
          <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md">
            <div className="h-full w-full rounded-full bg-gray-200 relative overflow-hidden">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt={username} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold">{username}</h3>
            <p className="text-gray-500 text-sm">@{userId}</p>
          </div>

          {!isCurrentUser && (
            <FollowButton 
              isFollowing={isFollowing} 
              onToggle={onFollowToggle} 
            />
          )}
        </div>

        {bio && <p className="text-gray-700 mb-4">{bio}</p>}

        <SocialStats 
          followers={stats.followers} 
          following={stats.following} 
          completedGames={stats.completedGames} 
        />
      </div>
    </div>
  );
}
