'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {Skeleton} from '@/components/ui/Skeleton'
import {
    Brain,
    Calendar,
    Check,
    Clock,
    Crown,
    Eye,
    Filter,
    Gem,
    Gift,
    Key,
    Lock,
    Package,
    Palette,
    Search,
    Shield,
    ShoppingBag,
    Sparkles,
    Star,
    Timer,
    TrendingUp,
    X,
    Zap
} from 'lucide-react'
import {ItemService} from "@/lib/firebase/services/item.service"
import {ItemDefinition} from "@/lib/firebase/types/item.types"
import {formatDistanceToNow} from '@/lib/utils/formatters'

interface InventoryItem extends ItemDefinition {
    userData: {
        quantity: number
        purchasedAt: any
        lastUsedAt?: any
        expiresAt?: any
        isActive?: boolean
        activatedAt?: any
    }
}

export default function InventoryPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<InventoryItem[]>([])
    const [storeItems, setStoreItems] = useState<ItemDefinition[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedFilter, setSelectedFilter] = useState<string>('all') // all, active, expired

    // 로그인 체크
    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])

    // 인벤토리 새로고침 함수
    const refreshInventory = async () => {
        if (!user?.uid) return

        setLoading(true)
        try {
            const [storeItemsData, userInventory] = await Promise.all([
                ItemService.getActiveItems(),
                ItemService.getUserInventory(user.uid)
            ])

            setStoreItems(storeItemsData)

            const userItems: InventoryItem[] = []
            Object.entries(userInventory).forEach(([itemId, userData]) => {
                const itemDef = storeItemsData.find(item => item.id === itemId)
                if (itemDef && userData.quantity > 0) {
                    userItems.push({
                        ...itemDef,
                        userData: userData as any
                    })
                }
            })

            setItems(userItems)
        } catch (error) {
            console.error('인벤토리 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    // 데이터 로드
    useEffect(() => {
        refreshInventory()
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    // 아이콘 매핑
    const getIcon = (iconName: string) => {
        const iconMap: { [key: string]: React.ReactNode } = {
            'Palette': <Palette className="w-6 h-6"/>,
            'Zap': <Zap className="w-6 h-6"/>,
            'Eye': <Eye className="w-6 h-6"/>,
            'TrendingUp': <TrendingUp className="w-6 h-6"/>,
            'Gem': <Gem className="w-6 h-6"/>,
            'Brain': <Brain className="w-6 h-6"/>,
            'Timer': <Timer className="w-6 h-6"/>,
            'Key': <Key className="w-6 h-6"/>,
            'Gift': <Gift className="w-6 h-6"/>,
            'Crown': <Crown className="w-6 h-6"/>,
            'Lock': <Lock className="w-6 h-6"/>,
            'Sparkles': <Sparkles className="w-6 h-6"/>
        }
        return iconMap[iconName] || <Star className="w-6 h-6"/>
    }

    const categories = [
        {id: 'all', name: '전체', icon: <Package className="w-4 h-4"/>},
        {id: 'themes', name: '테마', icon: <Palette className="w-4 h-4"/>},
        {id: 'boosts', name: '부스터', icon: <TrendingUp className="w-4 h-4"/>},
        {id: 'tools', name: '도구', icon: <Brain className="w-4 h-4"/>},
        {id: 'bundles', name: '번들', icon: <Gift className="w-4 h-4"/>},
        {id: 'special', name: '특별', icon: <Sparkles className="w-4 h-4"/>}
    ]

    const filters = [
        {id: 'all', name: '전체', color: 'text-gray-400'},
        {id: 'active', name: '활성화', color: 'text-green-400'},
        {id: 'expired', name: '만료', color: 'text-red-400'}
    ]

    const getRarityGradient = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-800 to-gray-900'
            case 'rare':
                return 'from-blue-900/50 to-gray-900'
            case 'epic':
                return 'from-purple-900/50 to-gray-900'
            case 'legendary':
                return 'from-orange-900/50 to-gray-900'
            case 'mythic':
                return 'from-red-900/50 to-gray-900'
            default:
                return 'from-gray-800 to-gray-900'
        }
    }

    const getRarityBorder = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'border-gray-700'
            case 'rare':
                return 'border-blue-600'
            case 'epic':
                return 'border-purple-600'
            case 'legendary':
                return 'border-orange-600'
            case 'mythic':
                return 'border-red-600'
            default:
                return 'border-gray-700'
        }
    }

    const formatTime = (timestamp: any) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return formatDistanceToNow(date, {addSuffix: true})
    }

    const isExpired = (item: InventoryItem) => {
        if (!item.userData.expiresAt) return false
        const now = new Date()
        const expiresAt = item.userData.expiresAt.toDate ? item.userData.expiresAt.toDate() : new Date(item.userData.expiresAt)
        return expiresAt < now
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory

        let matchesFilter = true
        if (selectedFilter === 'active') {
            matchesFilter = item.category === 'boosts' && item.userData.isActive === true && !isExpired(item)
        } else if (selectedFilter === 'expired') {
            matchesFilter = item.category === 'boosts' && isExpired(item)
        }

        return matchesSearch && matchesCategory && matchesFilter
    })

    const handleActivateBooster = async (itemId: string) => {
        try {
            await ItemService.activateBooster(user!.uid, itemId)
            alert('부스터가 활성화되었습니다!')
            await refreshInventory()
        } catch (error: any) {
            alert(error.message || '부스터 활성화에 실패했습니다.')
        }
    }

    const handleUseItem = async (itemId: string) => {
        try {
            await ItemService.consumeToolItem(user!.uid, itemId, 1)
            alert('아이템을 사용했습니다!')
            await refreshInventory()
        } catch (error: any) {
            alert(error.message || '아이템 사용에 실패했습니다.')
        }
    }

    if (!user) return null

    return (
        <>
            <PageHeader
                title="내 인벤토리"
                description="보유한 아이템을 관리하세요"
                badge={
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4"/>
                        <span>{loading ? '...' : items.length} 아이템</span>
                    </div>
                }
                icon={<ShoppingBag className="w-5 h-5"/>}
            />

            <Container className="py-8">
                {loading ? (
                    <div className="space-y-6">
                        {/* 로딩 스켈레톤 */}
                        <div className="flex gap-8">
                            <div className="w-64 flex-shrink-0 hidden lg:block">
                                <Skeleton className="h-10 mb-4"/>
                                <div className="space-y-4">
                                    <Skeleton className="h-32"/>
                                    <Skeleton className="h-32"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="h-80 rounded-2xl"/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-8">
                        {/* 왼쪽 사이드바 */}
                        <div className="w-64 flex-shrink-0 hidden lg:block">
                            <div className="sticky top-24 space-y-6">
                                {/* 검색 */}
                                <div>
                                    <Input
                                        placeholder="아이템 검색..."
                                        icon={<Search className="w-5 h-5"/>}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mb-4"
                                    />
                                </div>

                                {/* 카테고리 */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-3">카테고리</h3>
                                    <div className="space-y-1">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                                    selectedCategory === category.id
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                }`}
                                            >
                                                {category.icon}
                                                <span className="font-medium">{category.name}</span>
                                                <span className="ml-auto text-xs">
                                                    {items.filter(item =>
                                                        category.id === 'all' || item.category === category.id
                                                    ).length}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 필터 */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-3">필터</h3>
                                    <div className="space-y-1">
                                        {filters.map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setSelectedFilter(filter.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                                    selectedFilter === filter.id
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                                }`}
                                            >
                                                <Filter className={`w-4 h-4 ${filter.color}`}/>
                                                <span className={`font-medium ${filter.color}`}>{filter.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 상점 바로가기 */}
                                <div className="pt-6 border-t border-gray-800">
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => router.push('/store/items')}
                                    >
                                        <ShoppingBag className="w-4 h-4"/>
                                        상점으로 가기
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 메인 콘텐츠 */}
                        <div className="flex-1">
                            {/* 모바일 필터 */}
                            <div className="lg:hidden mb-6 flex gap-2">
                                <Input
                                    placeholder="검색..."
                                    icon={<Search className="w-5 h-5"/>}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4"/>
                                </Button>
                            </div>

                            {/* 아이템 그리드 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredItems.map(item => {
                                    const expired = isExpired(item)

                                    return (
                                        <div
                                            key={item.id}
                                            className={`group relative bg-gradient-to-br ${getRarityGradient(item.rarity)} rounded-2xl border-2 ${getRarityBorder(item.rarity)} overflow-hidden transition-all duration-300 ${
                                                expired ? 'opacity-60' : ''
                                            }`}
                                        >
                                            {/* 상태 배지 */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                                                {item.userData.isActive && !expired && (
                                                    <Badge variant="success" size="sm">활성화</Badge>
                                                )}
                                                {expired && (
                                                    <Badge variant="danger" size="sm">만료</Badge>
                                                )}
                                            </div>

                                            {/* 카드 내용 */}
                                            <div className="relative z-10 p-6">
                                                {/* 아이콘 */}
                                                <div
                                                    className={`w-16 h-16 bg-gradient-to-br ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                                    {getIcon(item.iconName)}
                                                </div>

                                                {/* 제목과 설명 */}
                                                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                                                <p className="text-sm text-gray-400 mb-4">{item.description}</p>

                                                {/* 수량 표시 (도구 아이템만) */}
                                                {item.category === 'tools' && (
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Shield className="w-4 h-4 text-gray-500"/>
                                                        <span className="text-sm text-gray-400">
                                                            보유 수량: <span
                                                            className="text-white font-semibold">{item.userData.quantity}개</span>
                                                        </span>
                                                    </div>
                                                )}

                                                {/* 구매 정보 */}
                                                <div className="space-y-2 text-xs text-gray-500 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3 h-3"/>
                                                        <span>구매: {formatTime(item.userData.purchasedAt)}</span>
                                                    </div>

                                                    {/* 부스터 추가 정보 */}
                                                    {item.category === 'boosts' && item.userData.isActive && (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="w-3 h-3 text-green-400"/>
                                                                <span>활성화: {formatTime(item.userData.activatedAt)}</span>
                                                            </div>
                                                            {item.userData.expiresAt && (
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3 text-orange-400"/>
                                                                    <span>만료: {formatTime(item.userData.expiresAt)}</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* 도구 사용 정보 */}
                                                    {item.category === 'tools' && item.userData.lastUsedAt && (
                                                        <div className="flex items-center gap-2">
                                                            <Timer className="w-3 h-3"/>
                                                            <span>마지막 사용: {formatTime(item.userData.lastUsedAt)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 버튼 */}
                                                <div className="flex gap-2">
                                                    {/* 부스터 활성화 버튼 */}
                                                    {item.category === 'boosts' && !item.userData.isActive && !expired && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            fullWidth
                                                            onClick={() => handleActivateBooster(item.id)}
                                                        >
                                                            <Zap className="w-4 h-4"/>
                                                            활성화
                                                        </Button>
                                                    )}

                                                    {/* 도구 사용 버튼 */}
                                                    {item.category === 'tools' && (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            fullWidth
                                                            onClick={() => handleUseItem(item.id)}
                                                        >
                                                            <Brain className="w-4 h-4"/>
                                                            사용하기
                                                        </Button>
                                                    )}

                                                    {/* 활성화된 상태 표시 */}
                                                    {item.userData.isActive && !expired && (
                                                        <div
                                                            className="flex items-center justify-center py-2 w-full bg-green-600/20 rounded-lg border border-green-600/30">
                                                            <Check className="w-5 h-5 text-green-400 mr-2"/>
                                                            <span className="text-green-400 font-semibold">활성화됨</span>
                                                        </div>
                                                    )}

                                                    {/* 만료된 상태 표시 */}
                                                    {expired && (
                                                        <div
                                                            className="flex items-center justify-center py-2 w-full bg-red-600/20 rounded-lg border border-red-600/30">
                                                            <X className="w-5 h-5 text-red-400 mr-2"/>
                                                            <span className="text-red-400 font-semibold">만료됨</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* 빈 상태 */}
                            {filteredItems.length === 0 && (
                                <div className="text-center py-20">
                                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                                    <p className="text-gray-400 mb-4">
                                        {searchTerm || selectedCategory !== 'all' || selectedFilter !== 'all'
                                            ? '검색 결과가 없습니다.'
                                            : '아직 보유한 아이템이 없습니다.'}
                                    </p>
                                    {!searchTerm && selectedCategory === 'all' && selectedFilter === 'all' && (
                                        <Button variant="primary" onClick={() => router.push('/store/items')}>
                                            <ShoppingBag className="w-4 h-4"/>
                                            상점으로 가기
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Container>
        </>
    )
}