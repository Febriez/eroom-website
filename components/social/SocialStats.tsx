import Link from 'next/link';

interface SocialStatsProps {
    followers: number;
    following: number;
    completedGames: number;
    userId?: string;
}

export default function SocialStats({
                                        followers,
                                        following,
                                        completedGames,
                                        userId
                                    }: SocialStatsProps) {
    const stats = [
        {label: '팔로워', value: followers, link: userId ? `/profile/${userId}/followers` : undefined},
        {label: '팔로잉', value: following, link: userId ? `/profile/${userId}/following` : undefined},
        {label: '완료한 게임', value: completedGames, link: userId ? `/profile/${userId}/games` : undefined},
    ];

    return (
        <div className="flex justify-between border-t pt-3">
            {stats.map((stat, index) => (
                <div key={index} className="text-center">
                    {stat.link ? (
                        <Link href={stat.link} className="hover:text-blue-600">
                            <p className="font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </Link>
                    ) : (
                        <>
                            <p className="font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
