'use client'

import {Clock, Star, Target, Trophy} from 'lucide-react'
import {useEffect, useState} from 'react'

interface BasePlayer {
    rank: number
    player: string
    level: number
    points: number
    completedMaps: number
    avgTime: string
    winRate: string
    badge: string
}

interface CreativePlayer extends BasePlayer {
    createdMaps: number
    totalPlays: number
}

type Player = BasePlayer | CreativePlayer

// 타입 가드 함수
function isCreativePlayer(player: Player): player is CreativePlayer {
    return 'createdMaps' in player && 'totalPlays' in player
}

export default function RankingsPage() {
    const [selectedCategory, setSelectedCategory] = useState('overall')
    const [selectedPeriod, setSelectedPeriod] = useState('weekly')
    const [isLoading, setIsLoading] = useState(false)

    // 카테고리나 기간 변경시 로딩 효과
    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [selectedCategory, selectedPeriod])

    // 종합 랭킹 데이터
    const overallRankings: Record<string, BasePlayer[]> = {
        daily: [
            {
                rank: 1,
                player: "DailyChamp",
                level: 89,
                points: 12840,
                completedMaps: 47,
                avgTime: "15:22",
                winRate: "89.4%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "QuickSolver",
                level: 76,
                points: 11230,
                completedMaps: 41,
                avgTime: "14:15",
                winRate: "87.8%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "PuzzleAce",
                level: 82,
                points: 10920,
                completedMaps: 38,
                avgTime: "16:33",
                winRate: "86.8%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "BrainPower",
                level: 71,
                points: 9876,
                completedMaps: 35,
                avgTime: "17:45",
                winRate: "85.7%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "SmartEscape",
                level: 68,
                points: 8734,
                completedMaps: 32,
                avgTime: "18:20",
                winRate: "84.4%",
                badge: "⭐"
            }
        ],
        weekly: [
            {
                rank: 1,
                player: "EscapeMaster",
                level: 142,
                points: 98420,
                completedMaps: 247,
                avgTime: "12:34",
                winRate: "94.2%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "PuzzleKing",
                level: 138,
                points: 95310,
                completedMaps: 239,
                avgTime: "13:21",
                winRate: "92.8%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "SpeedRunner",
                level: 135,
                points: 93102,
                completedMaps: 226,
                avgTime: "11:45",
                winRate: "91.5%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "BrainStorm",
                level: 131,
                points: 89234,
                completedMaps: 218,
                avgTime: "14:02",
                winRate: "90.1%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "LogicMaster",
                level: 128,
                points: 87421,
                completedMaps: 207,
                avgTime: "13:55",
                winRate: "89.7%",
                badge: "⭐"
            }
        ],
        monthly: [
            {
                rank: 1,
                player: "MonthlyLegend",
                level: 156,
                points: 342100,
                completedMaps: 892,
                avgTime: "11:23",
                winRate: "95.6%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "ConsistentPro",
                level: 151,
                points: 328900,
                completedMaps: 847,
                avgTime: "12:05",
                winRate: "94.1%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "EliteSolver",
                level: 148,
                points: 315600,
                completedMaps: 812,
                avgTime: "12:48",
                winRate: "93.2%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "MasterMind",
                level: 145,
                points: 298700,
                completedMaps: 778,
                avgTime: "13:15",
                winRate: "92.5%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "PuzzleGuru",
                level: 143,
                points: 287400,
                completedMaps: 745,
                avgTime: "13:42",
                winRate: "91.8%",
                badge: "⭐"
            }
        ],
        all: [
            {
                rank: 1,
                player: "AllTimeGreat",
                level: 189,
                points: 1247800,
                completedMaps: 3241,
                avgTime: "10:45",
                winRate: "96.8%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "VeteranPro",
                level: 184,
                points: 1198600,
                completedMaps: 3102,
                avgTime: "11:12",
                winRate: "95.9%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "LegendaryEscape",
                level: 181,
                points: 1156700,
                completedMaps: 2987,
                avgTime: "11:38",
                winRate: "95.2%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "GrandMaster",
                level: 178,
                points: 1098500,
                completedMaps: 2834,
                avgTime: "12:05",
                winRate: "94.5%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "UltimatePlayer",
                level: 175,
                points: 1067200,
                completedMaps: 2756,
                avgTime: "12:28",
                winRate: "93.9%",
                badge: "⭐"
            }
        ]
    }

    // 스피드런 랭킹 데이터
    const speedRankings: Record<string, BasePlayer[]> = {
        daily: [
            {
                rank: 1,
                player: "SpeedDemon",
                level: 92,
                points: 14560,
                completedMaps: 52,
                avgTime: "8:45",
                winRate: "88.5%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "RushHour",
                level: 87,
                points: 13420,
                completedMaps: 48,
                avgTime: "9:12",
                winRate: "86.3%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "QuickFinish",
                level: 84,
                points: 12890,
                completedMaps: 45,
                avgTime: "9:38",
                winRate: "85.1%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "FastTrack",
                level: 81,
                points: 11760,
                completedMaps: 42,
                avgTime: "10:05",
                winRate: "83.9%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "TurboEscape",
                level: 78,
                points: 10540,
                completedMaps: 39,
                avgTime: "10:32",
                winRate: "82.7%",
                badge: "⭐"
            }
        ],
        weekly: [
            {
                rank: 1,
                player: "SpeedRunner",
                level: 135,
                points: 105680,
                completedMaps: 312,
                avgTime: "7:32",
                winRate: "91.5%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "QuicksilverX",
                level: 131,
                points: 98760,
                completedMaps: 298,
                avgTime: "8:15",
                winRate: "89.7%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "RapidEscape",
                level: 128,
                points: 92340,
                completedMaps: 281,
                avgTime: "8:48",
                winRate: "88.2%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "VelocityKing",
                level: 125,
                points: 87920,
                completedMaps: 267,
                avgTime: "9:22",
                winRate: "86.8%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "BlitzMaster",
                level: 122,
                points: 81500,
                completedMaps: 253,
                avgTime: "9:55",
                winRate: "85.4%",
                badge: "⭐"
            }
        ],
        monthly: [
            {
                rank: 1,
                player: "MonthlySpeed",
                level: 148,
                points: 378900,
                completedMaps: 1124,
                avgTime: "6:58",
                winRate: "93.2%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "TimeTrial",
                level: 144,
                points: 356700,
                completedMaps: 1067,
                avgTime: "7:25",
                winRate: "91.8%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "RaceRunner",
                level: 141,
                points: 334500,
                completedMaps: 1012,
                avgTime: "7:52",
                winRate: "90.5%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "SwiftSolver",
                level: 138,
                points: 312300,
                completedMaps: 958,
                avgTime: "8:19",
                winRate: "89.1%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "QuickDraw",
                level: 135,
                points: 290100,
                completedMaps: 903,
                avgTime: "8:46",
                winRate: "87.8%",
                badge: "⭐"
            }
        ],
        all: [
            {
                rank: 1,
                player: "SpeedLegend",
                level: 172,
                points: 1389600,
                completedMaps: 4218,
                avgTime: "6:12",
                winRate: "94.8%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "TimeChampion",
                level: 168,
                points: 1324700,
                completedMaps: 4012,
                avgTime: "6:38",
                winRate: "93.5%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "FlashRunner",
                level: 165,
                points: 1267800,
                completedMaps: 3856,
                avgTime: "7:05",
                winRate: "92.3%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "SpeedForce",
                level: 162,
                points: 1198900,
                completedMaps: 3689,
                avgTime: "7:32",
                winRate: "91.1%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "QuickMaster",
                level: 159,
                points: 1145000,
                completedMaps: 3523,
                avgTime: "7:58",
                winRate: "89.9%",
                badge: "⭐"
            }
        ]
    }

    // 완성도 랭킹 데이터
    const completionRankings: Record<string, BasePlayer[]> = {
        daily: [
            {
                rank: 1,
                player: "PerfectClear",
                level: 95,
                points: 15680,
                completedMaps: 42,
                avgTime: "18:45",
                winRate: "100%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "NoMistake",
                level: 91,
                points: 14320,
                completedMaps: 39,
                avgTime: "19:32",
                winRate: "97.5%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "FlawlessRun",
                level: 88,
                points: 13780,
                completedMaps: 37,
                avgTime: "20:15",
                winRate: "94.6%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "CleanSweep",
                level: 85,
                points: 12940,
                completedMaps: 35,
                avgTime: "21:08",
                winRate: "91.4%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "Perfectionist",
                level: 82,
                points: 11820,
                completedMaps: 33,
                avgTime: "22:03",
                winRate: "87.9%",
                badge: "⭐"
            }
        ],
        weekly: [
            {
                rank: 1,
                player: "CompletionKing",
                level: 139,
                points: 112340,
                completedMaps: 234,
                avgTime: "16:22",
                winRate: "98.7%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "AllStarClear",
                level: 135,
                points: 105670,
                completedMaps: 221,
                avgTime: "17:15",
                winRate: "96.8%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "PerfectScore",
                level: 132,
                points: 98900,
                completedMaps: 208,
                avgTime: "18:08",
                winRate: "94.2%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "MasterComplete",
                level: 129,
                points: 92130,
                completedMaps: 195,
                avgTime: "19:01",
                winRate: "91.8%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "FullClear",
                level: 126,
                points: 85360,
                completedMaps: 182,
                avgTime: "19:54",
                winRate: "89.6%",
                badge: "⭐"
            }
        ],
        monthly: [
            {
                rank: 1,
                player: "MonthlyPerfect",
                level: 152,
                points: 398700,
                completedMaps: 845,
                avgTime: "15:30",
                winRate: "99.2%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "CompleteChamp",
                level: 148,
                points: 376500,
                completedMaps: 802,
                avgTime: "16:18",
                winRate: "97.5%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "FlawlessMonth",
                level: 145,
                points: 354300,
                completedMaps: 759,
                avgTime: "17:06",
                winRate: "95.1%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "PerfectRun",
                level: 142,
                points: 332100,
                completedMaps: 716,
                avgTime: "17:54",
                winRate: "92.8%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "CleanMaster",
                level: 139,
                points: 309900,
                completedMaps: 673,
                avgTime: "18:42",
                winRate: "90.5%",
                badge: "⭐"
            }
        ],
        all: [
            {
                rank: 1,
                player: "CompleteLegend",
                level: 178,
                points: 1456700,
                completedMaps: 3089,
                avgTime: "14:15",
                winRate: "99.6%",
                badge: "🏆"
            },
            {
                rank: 2,
                player: "PerfectLegacy",
                level: 174,
                points: 1387800,
                completedMaps: 2945,
                avgTime: "15:02",
                winRate: "98.2%",
                badge: "🥈"
            },
            {
                rank: 3,
                player: "FlawlessForever",
                level: 171,
                points: 1324900,
                completedMaps: 2812,
                avgTime: "15:49",
                winRate: "96.7%",
                badge: "🥉"
            },
            {
                rank: 4,
                player: "MasterfulClear",
                level: 168,
                points: 1256000,
                completedMaps: 2678,
                avgTime: "16:36",
                winRate: "94.3%",
                badge: "⭐"
            },
            {
                rank: 5,
                player: "UltimateComplete",
                level: 165,
                points: 1192100,
                completedMaps: 2545,
                avgTime: "17:23",
                winRate: "92.1%",
                badge: "⭐"
            }
        ]
    }

    // 맵 제작 랭킹 데이터
    const creativeRankings: Record<string, CreativePlayer[]> = {
        daily: [
            {
                rank: 1,
                player: "DailyCreator",
                level: 87,
                points: 8920,
                completedMaps: 12,
                avgTime: "-",
                winRate: "-",
                badge: "🏆",
                createdMaps: 12,
                totalPlays: 892
            },
            {
                rank: 2,
                player: "MapArtist",
                level: 83,
                points: 7650,
                completedMaps: 10,
                avgTime: "-",
                winRate: "-",
                badge: "🥈",
                createdMaps: 10,
                totalPlays: 765
            },
            {
                rank: 3,
                player: "QuickBuilder",
                level: 80,
                points: 6890,
                completedMaps: 9,
                avgTime: "-",
                winRate: "-",
                badge: "🥉",
                createdMaps: 9,
                totalPlays: 689
            },
            {
                rank: 4,
                player: "PuzzleMaker",
                level: 77,
                points: 5670,
                completedMaps: 8,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 8,
                totalPlays: 567
            },
            {
                rank: 5,
                player: "DailyDesign",
                level: 74,
                points: 4890,
                completedMaps: 7,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 7,
                totalPlays: 489
            }
        ],
        weekly: [
            {
                rank: 1,
                player: "CreatorMaster",
                level: 124,
                points: 67890,
                completedMaps: 87,
                avgTime: "-",
                winRate: "-",
                badge: "🏆",
                createdMaps: 87,
                totalPlays: 6789
            },
            {
                rank: 2,
                player: "MapGenius",
                level: 120,
                points: 58760,
                completedMaps: 76,
                avgTime: "-",
                winRate: "-",
                badge: "🥈",
                createdMaps: 76,
                totalPlays: 5876
            },
            {
                rank: 3,
                player: "DesignPro",
                level: 117,
                points: 49230,
                completedMaps: 65,
                avgTime: "-",
                winRate: "-",
                badge: "🥉",
                createdMaps: 65,
                totalPlays: 4923
            },
            {
                rank: 4,
                player: "BuildMaster",
                level: 114,
                points: 41560,
                completedMaps: 54,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 54,
                totalPlays: 4156
            },
            {
                rank: 5,
                player: "CreativeKing",
                level: 111,
                points: 34780,
                completedMaps: 43,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 43,
                totalPlays: 3478
            }
        ],
        monthly: [
            {
                rank: 1,
                player: "MonthlyArchitect",
                level: 143,
                points: 234560,
                completedMaps: 312,
                avgTime: "-",
                winRate: "-",
                badge: "🏆",
                createdMaps: 312,
                totalPlays: 23456
            },
            {
                rank: 2,
                player: "MapMaestro",
                level: 139,
                points: 198700,
                completedMaps: 276,
                avgTime: "-",
                winRate: "-",
                badge: "🥈",
                createdMaps: 276,
                totalPlays: 19870
            },
            {
                rank: 3,
                player: "DesignLegend",
                level: 136,
                points: 167890,
                completedMaps: 241,
                avgTime: "-",
                winRate: "-",
                badge: "🥉",
                createdMaps: 241,
                totalPlays: 16789
            },
            {
                rank: 4,
                player: "CreativeGenius",
                level: 133,
                points: 142340,
                completedMaps: 206,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 206,
                totalPlays: 14234
            },
            {
                rank: 5,
                player: "BuilderPro",
                level: 130,
                points: 118760,
                completedMaps: 171,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 171,
                totalPlays: 11876
            }
        ],
        all: [
            {
                rank: 1,
                player: "CreatorLegend",
                level: 167,
                points: 892340,
                completedMaps: 1234,
                avgTime: "-",
                winRate: "-",
                badge: "🏆",
                createdMaps: 1234,
                totalPlays: 89234
            },
            {
                rank: 2,
                player: "MapGod",
                level: 163,
                points: 756890,
                completedMaps: 1098,
                avgTime: "-",
                winRate: "-",
                badge: "🥈",
                createdMaps: 1098,
                totalPlays: 75689
            },
            {
                rank: 3,
                player: "DesignMaster",
                level: 160,
                points: 634560,
                completedMaps: 962,
                avgTime: "-",
                winRate: "-",
                badge: "🥉",
                createdMaps: 962,
                totalPlays: 63456
            },
            {
                rank: 4,
                player: "BuildLegend",
                level: 157,
                points: 523780,
                completedMaps: 826,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 826,
                totalPlays: 52378
            },
            {
                rank: 5,
                player: "CreativeIcon",
                level: 154,
                points: 418900,
                completedMaps: 690,
                avgTime: "-",
                winRate: "-",
                badge: "⭐",
                createdMaps: 690,
                totalPlays: 41890
            }
        ]
    }

    // 현재 선택된 카테고리와 기간에 따른 데이터 가져오기
    const getRankingData = (): Player[] => {
        let data: Record<string, Player[]> = overallRankings

        switch (selectedCategory) {
            case 'speed':
                data = speedRankings
                break
            case 'completion':
                data = completionRankings
                break
            case 'creative':
                data = creativeRankings as Record<string, Player[]>
                break
            default:
                data = overallRankings
        }

        return data[selectedPeriod as keyof typeof data] || data.weekly
    }

    const currentRankings: Player[] = getRankingData()

    const categories = [
        {id: 'overall', name: '종합', icon: <Trophy className="w-4 h-4"/>, color: 'green'},
        {id: 'speed', name: '스피드런', icon: <Clock className="w-4 h-4"/>, color: 'blue'},
        {id: 'completion', name: '완성도', icon: <Target className="w-4 h-4"/>, color: 'purple'},
        {id: 'creative', name: '맵 제작', icon: <Star className="w-4 h-4"/>, color: 'yellow'}
    ]

    const getCategoryColor = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId)
        return category?.color || 'green'
    }

    const getColorClasses = (color: string) => {
        const colorMap = {
            green: 'bg-green-600 border-green-600 text-green-400',
            blue: 'bg-blue-600 border-blue-600 text-blue-400',
            purple: 'bg-purple-600 border-purple-600 text-purple-400',
            yellow: 'bg-yellow-600 border-yellow-600 text-yellow-400'
        }
        return colorMap[color as keyof typeof colorMap] || colorMap.green
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        랭킹
                    </h1>
                    <p className="text-2xl text-gray-300">최고의 EROOM 플레이어들</p>

                    {/* 현재 선택된 카테고리 설명 */}
                    <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                        <p className="text-gray-400">
                            {selectedCategory === 'overall' && '종합 랭킹 - 모든 게임 활동을 종합한 순위입니다'}
                            {selectedCategory === 'speed' && '스피드런 랭킹 - 가장 빠르게 맵을 클리어한 플레이어들의 순위입니다'}
                            {selectedCategory === 'completion' && '완성도 랭킹 - 높은 승률과 완벽한 클리어를 기록한 플레이어들의 순위입니다'}
                            {selectedCategory === 'creative' && '맵 제작 랭킹 - 인기 있는 맵을 제작한 크리에이터들의 순위입니다'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {selectedPeriod === 'daily' && '오늘 하루 동안의 기록'}
                            {selectedPeriod === 'weekly' && '이번 주 동안의 기록'}
                            {selectedPeriod === 'monthly' && '이번 달 동안의 기록'}
                            {selectedPeriod === 'all' && '전체 기간 누적 기록'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                    selectedCategory === category.id
                                        ? getColorClasses(category.color).split(' ')[0]
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {category.icon}
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedPeriod('daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'daily'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            일간
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('weekly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'weekly'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            주간
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'monthly'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            월간
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'all'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            전체
                        </button>
                    </div>
                </div>

                {/* Top 3 */}
                <div
                    className={`grid grid-cols-3 gap-6 mb-12 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {currentRankings.slice(0, 3).map((player) => (
                        <div key={player.rank}
                             className={`bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-8 border ${
                                 player.rank === 1 ? 'border-yellow-600' : player.rank === 2 ? 'border-gray-400' : 'border-orange-600'
                             } text-center transform transition-all duration-500 hover:scale-105`}>
                            <div className="text-6xl mb-4">{player.badge}</div>
                            <h3 className="text-2xl font-bold mb-2">{player.player}</h3>
                            <p className="text-gray-400 mb-4">Level {player.level}</p>
                            <p className="text-3xl font-bold text-green-400">{player.points.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">포인트</p>
                            {selectedCategory === 'creative' && isCreativePlayer(player) && (
                                <div className="mt-4">
                                    <p className="text-lg font-semibold text-blue-400">{player.createdMaps}개 맵 제작</p>
                                    <p className="text-sm text-gray-400">{player.totalPlays.toLocaleString()}회 플레이됨</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Rankings Table */}
                <div
                    className={`bg-gradient-to-br from-gray-900/50 to-black rounded-2xl border border-gray-800 overflow-hidden mb-32 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-800">
                            <th className="px-6 py-4 text-left">순위</th>
                            <th className="px-6 py-4 text-left">플레이어</th>
                            <th className="px-6 py-4 text-center">레벨</th>
                            <th className="px-6 py-4 text-center">포인트</th>
                            <th className="px-6 py-4 text-center">
                                {selectedCategory === 'creative' ? '제작한 맵' : '완료한 맵'}
                            </th>
                            <th className="px-6 py-4 text-center">
                                {selectedCategory === 'creative' ? '총 플레이 수' : '평균 시간'}
                            </th>
                            <th className="px-6 py-4 text-center">
                                {selectedCategory === 'creative' ? '평균 평점' : '승률'}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentRankings.map((player) => (
                            <tr key={player.rank}
                                className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                                <td className="px-6 py-4 font-bold">#{player.rank}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{player.badge}</span>
                                        <span className="font-medium">{player.player}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">{player.level}</td>
                                <td className="px-6 py-4 text-center font-bold text-green-400">
                                    {player.points.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {selectedCategory === 'creative' && isCreativePlayer(player)
                                        ? player.createdMaps
                                        : player.completedMaps}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {selectedCategory === 'creative' && isCreativePlayer(player)
                                        ? player.totalPlays.toLocaleString()
                                        : player.avgTime}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {selectedCategory === 'creative' ? (
                                        <span className="px-3 py-1 bg-blue-900/30 rounded-lg text-blue-400">
                                            ⭐ 4.8
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-900/30 rounded-lg text-green-400">
                                            {player.winRate}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 통계 요약 */}
                <div
                    className={`grid grid-cols-4 gap-6 mb-32 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 text-center group hover:border-green-600/50 transition-all">
                        <p className="text-gray-400 mb-2">총 참가자</p>
                        <p className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform">
                            {selectedPeriod === 'daily' && '1,234'}
                            {selectedPeriod === 'weekly' && '8,567'}
                            {selectedPeriod === 'monthly' && '24,891'}
                            {selectedPeriod === 'all' && '98,765'}
                        </p>
                    </div>
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 text-center group hover:border-blue-600/50 transition-all">
                        <p className="text-gray-400 mb-2">평균 레벨</p>
                        <p className="text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform">{currentRankings[0].level - 30}</p>
                    </div>
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 text-center group hover:border-yellow-600/50 transition-all">
                        <p className="text-gray-400 mb-2">최고 기록</p>
                        <p className="text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">{currentRankings[0].points.toLocaleString()}</p>
                    </div>
                    <div
                        className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl p-6 border border-gray-800 text-center group hover:border-purple-600/50 transition-all">
                        <p className="text-gray-400 mb-2">
                            {selectedCategory === 'creative' ? '총 제작 맵' : '클리어 맵'}
                        </p>
                        <p className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                            {selectedCategory === 'creative'
                                ? currentRankings.reduce((sum, p) => sum + (isCreativePlayer(p) ? p.createdMaps : 0), 0).toLocaleString()
                                : currentRankings.reduce((sum, p) => sum + p.completedMaps, 0).toLocaleString()
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}