'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Crown, Filter, Palette, Search, Shield, ShoppingCart, Sparkles, Star, Zap} from 'lucide-react'

interface ShopItem {
    id: string
    name: string
    description: string
    category: 'theme' | 'skin' | 'tool' | 'bundle'
    price: number
    originalPrice?: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    icon: React.ReactNode
    new?: boolean
    limited?: boolean
}

export default function StoreItemsPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    const items: ShopItem[] = [
        {
            id: '1',
            name: '사이버펑크 2077 테마',
            description: '네온 빛이 가득한 미래 도시 테마',
            category: 'theme',
            price: 1200,
            originalPrice: 1500,
            rarity: 'epic',
            icon: <Palette className="w-8 h-8"/>,
            new: true
        },
        {
            id: '2',
            name: '황금 기사 스킨',
            description: '빛나는 황금 갑옷을 입은 캐릭터',
            category: 'skin',
            price: 2000,
            rarity: 'legendary',
            icon: <Crown className="w-8 h-8"/>,
            limited: true
        },
        {
            id: '3',
            name: '마스터 키 세트',
            description: '모든 문을 열 수 있는 특수 도구',
            category: 'tool',
            price: 500,
            rarity: 'rare',
            icon: <Zap className="w-8 h-8"/>
        },
        {
            id: '4',
            name: '고대 유적 테마',
            description: '신비로운 고대 문명의 비밀',
            category: 'theme',
            price: 800,
            rarity: 'rare',
            icon: <Shield className="w-8 h-8"/>
        },
        {
            id: '5',
            name: '우주 탐험가 번들',
            description: '우주 테마 + 우주복 스킨 + 특수 도구',
            category: 'bundle',
            price: 3000,
            originalPrice: 4000,
            rarity: 'epic',
            icon: <Sparkles className="w-8 h-8"/>,
            new: true
        },
        {
            id: '6',
            name: '시간 조작기',
            description: '30초간 시간을 멈출 수 있는 도구',
            category: 'tool',
            price: 300,
            rarity: 'common',
            icon: <Zap className="w-8 h-8"/>
        }
    ]

    const categories = [
        {id: 'theme', name: '테마', icon: <Palette className="w-4 h-4"/>},
        {id: 'skin', name: '스킨', icon: <Crown className="w-4 h-4"/>},
        {id: 'tool', name: '도구', icon: <Zap className="w-4 h-4"/>},
        {id: 'bundle', name: '번들', icon: <Sparkles className="w-4 h-4"/>}
    ]

    const rarities = [
        {id: 'common', name: '일반', color: 'text-gray-400'},
        {id: 'rare', name: '레어', color: 'text-blue-400'},
        {id: 'epic', name: '에픽', color: 'text-purple-400'},
        {id: 'legendary', name: '전설', color: 'text-orange-400'}
    ]

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-600 to-gray-700'
            case 'rare':
                return 'from-blue-600 to-blue-700'
            case 'epic':
                return 'from-purple-600 to-purple-700'
            case 'legendary':
                return 'from-orange-600 to-orange-700'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    const getRarityBorder = (rarity: string, isSelected: boolean) => {
        if (isSelected) {
            switch (rarity) {
                case 'common':
                    return 'border-gray-500 ring-2 ring-gray-500'
                case 'rare':
                    return 'border-blue-500 ring-2 ring-blue-500'
                case 'epic':
                    return 'border-purple-500 ring-2 ring-purple-500'
                case 'legendary':
                    return 'border-orange-500 ring-2 ring-orange-500'
                default:
                    return 'border-gray-500 ring-2 ring-gray-500'
            }
        }

        switch (rarity) {
            case 'common':
                return 'border-gray-700'
            case 'rare':
                return 'border-blue-600'
            case 'epic':
                return 'border-purple-600'
            case 'legendary':
                return 'border-orange-600'
            default:
                return 'border-gray-700'
        }
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || item.category === selectedCategory
        const matchesRarity = !selectedRarity || item.rarity === selectedRarity
        return matchesSearch && matchesCategory && matchesRarity
    })

    const handlePurchase = (itemId: string, itemName: string) => {
        if (!selectedItem || selectedItem !== itemId) {
            alert(`먼저 "${itemName}"을(를) 선택해주세요.`)
            setSelectedItem(itemId)
            return
        }

        // 실제 구매 로직
        alert(`"${itemName}"을(를) 구매하시겠습니까?`)
    }

    return (
        <>
            <PageHeader
                title="아이템 샵"
                description="게임을 더욱 특별하게 만들어줄 프리미엄 아이템"
                badge="매주 업데이트"
                icon={<ShoppingCart className="w-5 h-5"/>}
            />

            <Container className="py-12">
                {/* 검색 및 필터 */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="아이템 검색..."
                                icon={<Search className="w-5 h-5"/>}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="w-4 h-4"/>
                            필터
                        </Button>
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">카테고리</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    !selectedCategory
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                전체
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        selectedCategory === category.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {category.icon}
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 희귀도 필터 */}
                    <div>
                        <p className="text-sm text-gray-400 mb-2">희귀도</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedRarity(null)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    !selectedRarity
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                전체
                            </button>
                            {rarities.map(rarity => (
                                <button
                                    key={rarity.id}
                                    onClick={() => setSelectedRarity(rarity.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        selectedRarity === rarity.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    <span className={rarity.color}>{rarity.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 아이템 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => {
                        const rarity = rarities.find(r => r.id === item.rarity)
                        const discount = item.originalPrice
                            ? Math.round((1 - item.price / item.originalPrice) * 100)
                            : 0
                        const isSelected = selectedItem === item.id

                        return (
                            <Card
                                key={item.id}
                                hover
                                className={`p-6 relative overflow-hidden cursor-pointer transition-all ${getRarityBorder(item.rarity, isSelected)}`}
                                onClick={() => setSelectedItem(item.id)}
                            >
                                {/* 배지들 */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    {item.new && (
                                        <Badge variant="success" size="sm">NEW</Badge>
                                    )}
                                    {item.limited && (
                                        <Badge variant="danger" size="sm">한정판</Badge>
                                    )}
                                    {discount > 0 && (
                                        <Badge variant="warning" size="sm">{discount}% OFF</Badge>
                                    )}
                                </div>

                                {/* 아이콘 */}
                                <div
                                    className={`w-20 h-20 bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-2xl flex items-center justify-center mb-4`}>
                                    {item.icon}
                                </div>

                                {/* 정보 */}
                                <h3 className="text-lg font-bold mb-2 break-keep-all">{item.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 break-keep-all">{item.description}</p>

                                {/* 희귀도 */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className={`w-4 h-4 ${rarity?.color}`}/>
                                    <span className={`text-sm font-medium ${rarity?.color}`}>
                                        {rarity?.name}
                                    </span>
                                </div>

                                {/* 가격 및 구매 버튼 */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        {item.originalPrice && (
                                            <p className="text-sm text-gray-500 line-through">
                                                {item.originalPrice.toLocaleString()} 크레딧
                                            </p>
                                        )}
                                        <p className="text-xl font-bold text-green-400">
                                            {item.price.toLocaleString()} 크레딧
                                        </p>
                                    </div>
                                    <Button
                                        variant={isSelected ? "primary" : "secondary"}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handlePurchase(item.id, item.name)
                                        }}
                                    >
                                        구매
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* 빈 상태 */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                        <p className="text-gray-400">검색 결과가 없습니다.</p>
                    </div>
                )}
            </Container>
        </>
    )
}