import {Clock, MapPin, Shield, Trophy} from 'lucide-react'

interface ProfileStatsProps {
    stats: {
        mapsCompleted: number
        mapsCreated: number
        totalPlayTime: number
        winRate: number
    }
}

export default function ProfileStats({stats}: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.mapsCompleted}</p>
                <p className="text-sm text-gray-400">클리어한 맵</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.mapsCreated}</p>
                <p className="text-sm text-gray-400">제작한 맵</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{Math.floor(stats.totalPlayTime / 3600)}h</p>
                <p className="text-sm text-gray-400">플레이 시간</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.winRate}%</p>
                <p className="text-sm text-gray-400">승률</p>
            </div>
        </div>
    )
}