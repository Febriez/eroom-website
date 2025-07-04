import {Clock, MapPin, Shield, Trophy} from 'lucide-react'

interface ProfileStatsProps {
    stats: {
        totalPlays: number
        createdRooms: number
        averageTime: number
        successRate: number
    }
}

export default function ProfileStats({stats}: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.totalPlays}</p>
                <p className="text-sm text-gray-400">플레이한 맵</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.createdRooms}</p>
                <p className="text-sm text-gray-400">제작한 맵</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{Math.floor(stats.averageTime / 3600)}h</p>
                <p className="text-sm text-gray-400">평균 클리어 시간</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2"/>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-sm text-gray-400">클리어률</p>
            </div>
        </div>
    )
}