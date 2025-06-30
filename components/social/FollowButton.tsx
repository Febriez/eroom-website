import {useState} from 'react';
import {Button} from '@/components/ui/Button';

interface FollowButtonProps {
    isFollowing: boolean;
    onToggle?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function FollowButton({
                                         isFollowing,
                                         onToggle,
                                         size = 'md'
                                     }: FollowButtonProps) {
    const [isHovering, setIsHovering] = useState(false);

    const handleClick = () => {
        if (onToggle) {
            onToggle();
        }
    };

    return (
        <Button
            variant={isFollowing ? 'outline' : 'primary'}
            size={size}
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {isFollowing
                ? (isHovering ? '언팔로우' : '팔로잉')
                : '팔로우'}
        </Button>
    );
}
