'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/contexts/AuthContext'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Badge} from '@/components/ui/Badge'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {
    Brain,
    Check,
    Clock,
    Crown,
    Eye,
    Filter,
    Gem,
    Gift,
    Key,
    Lock,
    Minus,
    Palette,
    Plus,
    Search,
    Shield,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Star,
    Timer,
    TrendingUp,
    X,
    Zap
} from 'lucide-react'
import {ItemService} from "@/lib/firebase/services/item.service"
import {ItemDefinition} from "@/lib/firebase/types/item.types"

interface CartItem extends ItemDefinition {
    cartQuantity: number
}

export default function StoreItemsPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedRarity, setSelectedRarity] = useState<string>('all')
    const [showCart, setShowCart] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([])
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [purchasedItems, setPurchasedItems] = useState<{ [itemId: string]: boolean }>({})
    const [animatingItems, setAnimatingItems] = useState<string[]>([])
    const [items, setItems] = useState<ItemDefinition[]>([])
    const [loading, setLoading] = useState(true)

    const userCredits = user?.credits || 0

    // 아이템 목록 로드
    useEffect(() => {
        loadItems()
        if (user?.uid) {
            loadUserInventory()
        }
    }, [user])

    const loadItems = async () => {
        try {
            const activeItems = await ItemService.getActiveItems()
            setItems(activeItems)
        } catch (error) {
            console.error('아이템 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadUserInventory = async () => {
        if (!user?.uid) return

        try {
            const inventory = await ItemService.getUserInventory(user.uid)
            const purchased: { [itemId: string]: boolean } = {}

            Object.entries(inventory).forEach(([itemId, item]) => {
                if (item.quantity > 0) {
                    purchased[itemId] = true
                }
            })

            setPurchasedItems(purchased)
        } catch (error) {
            console.error('인벤토리 로드 실패:', error)
        }
    }

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
        {id: 'all', name: '전체', icon: <ShoppingBag className="w-4 h-4"/>},
        {id: 'themes', name: '테마', icon: <Palette className="w-4 h-4"/>},
        {id: 'boosts', name: '부스터', icon: <TrendingUp className="w-4 h-4"/>},
        {id: 'tools', name: '도구', icon: <Brain className="w-4 h-4"/>},
        {id: 'bundles', name: '번들', icon: <Gift className="w-4 h-4"/>},
        {id: 'special', name: '특별', icon: <Sparkles className="w-4 h-4"/>}
    ]

    const rarities = [
        {id: 'all', name: '전체', color: 'text-gray-400'},
        {id: 'common', name: '일반', color: 'text-gray-400'},
        {id: 'rare', name: '레어', color: 'text-blue-400'},
        {id: 'epic', name: '에픽', color: 'text-purple-400'},
        {id: 'legendary', name: '전설', color: 'text-orange-400'},
        {id: 'mythic', name: '신화', color: 'text-red-400'}
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
                return 'border-red-600 animate-pulse'
            default:
                return 'border-gray-700'
        }
    }

    const isPurchased = (item: ItemDefinition) => {
        // 테마나 번들, 특별 아이템은 한 번만 구매 가능
        if (['themes', 'bundles', 'special'].includes(item.category)) {
            return purchasedItems[item.id] || false
        }
        return false
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity
        return matchesSearch && matchesCategory && matchesRarity
    })

    const addToCart = (item: ItemDefinition) => {
        // 애니메이션 시작
        setAnimatingItems(prev => [...prev, item.id])

        // 카드 애니메이션 효과
        setTimeout(() => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id)
            if (existingItem) {
                // 테마, 번들, 특별 아이템은 1개만 담을 수 있음
                if (!['themes', 'bundles', 'special'].includes(item.category)) {
                    setCart(cart.map(cartItem =>
                        cartItem.id === item.id
                            ? {...cartItem, cartQuantity: cartItem.cartQuantity + 1}
                            : cartItem
                    ))
                }
            } else {
                setCart([...cart, {...item, cartQuantity: 1}])
            }

            // 애니메이션 완료
            setTimeout(() => {
                setAnimatingItems(prev => prev.filter(id => id !== item.id))
            }, 100)
        }, 300)
    }

    const removeFromCart = (itemId: string) => {
        setCart(cart.filter(item => item.id !== itemId))
    }

    const updateCartQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId)
        } else {
            setCart(cart.map(item =>
                item.id === itemId ? {...item, cartQuantity: quantity} : item
            ))
        }
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0)
    }

    const handleDirectPurchase = async (item: ItemDefinition) => {
        if (!user?.uid) {
            alert('로그인이 필요합니다.')
            return
        }

        const remainingCredits = userCredits - item.price

        if (remainingCredits < 0) {
            alert(`크레딧이 부족합니다!\n\n필요한 크레딧: ${item.price.toLocaleString()}\n현재 크레딧: ${userCredits.toLocaleString()}\n부족한 크레딧: ${Math.abs(remainingCredits).toLocaleString()}`)
            return
        }

        if (confirm(`"${item.name}"을(를) 구매하시겠습니까?\n\n가격: ${item.price.toLocaleString()} 크레딧\n현재 크레딧: ${userCredits.toLocaleString()}\n구매 후 잔액: ${remainingCredits.toLocaleString()} 크레딧`)) {
            try {
                await ItemService.purchaseItems(user.uid, [{item, quantity: 1}])
                alert('구매가 완료되었습니다!')

                // 구매 완료 후 인벤토리 다시 로드
                await loadUserInventory()
            } catch (error: any) {
                console.error('구매 실패:', error)
                alert(error.message || '구매 처리 중 오류가 발생했습니다.')
            }
        }
    }

    const handleCartPurchase = async () => {
        if (!user?.uid) {
            alert('로그인이 필요합니다.')
            return
        }

        const totalPrice = getTotalPrice()
        const remainingCredits = userCredits - totalPrice

        if (remainingCredits < 0) {
            alert(`크레딧이 부족합니다!\n\n필요한 크레딧: ${totalPrice.toLocaleString()}\n현재 크레딧: ${userCredits.toLocaleString()}\n부족한 크레딧: ${Math.abs(remainingCredits).toLocaleString()}`)
            return
        }

        const itemList = cart.map(item => `- ${item.name} x${item.cartQuantity}`).join('\n')

        if (confirm(`장바구니 아이템을 구매하시겠습니까?\n\n${itemList}\n\n총 가격: ${totalPrice.toLocaleString()} 크레딧\n현재 크레딧: ${userCredits.toLocaleString()}\n구매 후 잔액: ${remainingCredits.toLocaleString()} 크레딧`)) {
            try {
                const purchaseItems = cart.map(item => ({
                    item: items.find(i => i.id === item.id)!,
                    quantity: item.cartQuantity
                }))

                await ItemService.purchaseItems(user.uid, purchaseItems)
                alert('구매가 완료되었습니다!')
                setCart([])
                setShowCart(false)

                // 구매 완료 후 인벤토리 다시 로드
                await loadUserInventory()
            } catch (error: any) {
                console.error('구매 실패:', error)
                alert(error.message || '구매 처리 중 오류가 발생했습니다.')
            }
        }
    }

    if (loading) {
        return (
            <>
                <PageHeader
                    title="아이템 상점"
                    description="당신의 방탈출 경험을 업그레이드하세요"
                    icon={<ShoppingCart className="w-5 h-5"/>}
                />
                <Container className="py-8 text-center">
                    <p>아이템을 불러오는 중...</p>
                </Container>
            </>
        )
    }

    return (
        <>
            <PageHeader
                title="아이템 상점"
                description="당신의 방탈출 경험을 업그레이드하세요"
                badge={
                    <div className="flex items-center gap-2">
                        <Gem className="w-4 h-4"/>
                        <span>{userCredits.toLocaleString()} 크레딧</span>
                    </div>
                }
                icon={<ShoppingCart className="w-5 h-5"/>}
            />

            <Container className="py-8">
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

                            {/* 희귀도 필터 */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-3">희귀도</h3>
                                <div className="space-y-1">
                                    {rarities.map(rarity => (
                                        <button
                                            key={rarity.id}
                                            onClick={() => setSelectedRarity(rarity.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                                selectedRarity === rarity.id
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                            }`}
                                        >
                                            <Star className={`w-4 h-4 ${rarity.color}`}/>
                                            <span className={`font-medium ${rarity.color}`}>{rarity.name}</span>
                                        </button>
                                    ))}
                                </div>
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
                            {filteredItems.map(item => (
                                <div
                                    key={item.id}
                                    className={`group relative bg-gradient-to-br ${getRarityGradient(item.rarity)} rounded-2xl border-2 ${getRarityBorder(item.rarity)} overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu`}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {/* 배경 효과 */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"/>

                                    {/* 할인 배지 */}
                                    {item.discount && (
                                        <div
                                            className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-20 shadow-lg border-2 border-red-400">
                                            -{item.discount}%
                                        </div>
                                    )}

                                    {/* 인기/한정 배지 */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                                        {item.popular && (
                                            <Badge variant="success" size="sm">인기</Badge>
                                        )}
                                        {item.limitedTime && (
                                            <Badge variant="danger" size="sm">한정</Badge>
                                        )}
                                    </div>

                                    {/* 카드 내용 */}
                                    <div className="relative z-10 p-6">
                                        {/* 아이콘 */}
                                        <div
                                            className={`w-16 h-16 bg-gradient-to-br ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-12 transition-transform`}>
                                            {getIcon(item.iconName)}
                                        </div>

                                        {/* 제목과 설명 */}
                                        <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                                        <p className="text-sm text-gray-400 mb-4">{item.description}</p>

                                        {/* 특징 */}
                                        {item.features && (
                                            <ul className="text-xs text-gray-500 space-y-1 mb-4">
                                                {item.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-green-500"/>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* 지속시간/수량 */}
                                        {(item.duration || item.quantity) && (
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                {item.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3"/>
                                                        {item.duration}
                                                    </div>
                                                )}
                                                {item.quantity && (
                                                    <div className="flex items-center gap-1">
                                                        <Shield className="w-3 h-3"/>
                                                        {item.quantity}개
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 가격 */}
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                {item.originalPrice && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        {item.originalPrice.toLocaleString()}
                                                    </p>
                                                )}
                                                <p className="text-2xl font-bold text-green-400">
                                                    {item.price.toLocaleString()}
                                                    <span className="text-sm text-gray-400 ml-1">크레딧</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* 버튼 */}
                                        {!isPurchased(item) && (
                                            <div className="flex gap-2 relative z-20">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="flex-1 relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
                                                    onClick={() => addToCart(item)}
                                                >
                                                    <ShoppingBag className="w-4 h-4"/>
                                                    담기
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="flex-1 relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
                                                    onClick={() => handleDirectPurchase(item)}
                                                >
                                                    <Zap className="w-4 h-4"/>
                                                    바로 구매
                                                </Button>
                                            </div>
                                        )}

                                        {/* 구매 완료 표시 */}
                                        {isPurchased(item) && (
                                            <div
                                                className="flex items-center justify-center py-3 bg-green-600/20 rounded-lg border border-green-600/30">
                                                <Check className="w-5 h-5 text-green-400 mr-2"/>
                                                <span className="text-green-400 font-semibold">구매 완료</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 빈 상태 */}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-20">
                                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                                <p className="text-gray-400">검색 결과가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* 장바구니 버튼 */}
            <button
                onClick={() => setShowCart(true)}
                className="fixed right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-40 group"
            >
                <ShoppingCart className="w-8 h-8 group-hover:animate-bounce"/>
                {cart.length > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-bold animate-pulse">
                        {cart.reduce((total, item) => total + item.cartQuantity, 0)}
                    </span>
                )}

                {/* 장바구니 툴팁 */}
                <div
                    className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    장바구니 {cart.length > 0 && `(${cart.reduce((total, item) => total + item.cartQuantity, 0)})`}
                    <div
                        className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-y-4 border-y-transparent"></div>
                </div>
            </button>

            {/* 장바구니 모달 */}
            {showCart && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">장바구니</h2>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4"/>
                                    <p className="text-gray-400">장바구니가 비어있습니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id}
                                             className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                {getIcon(item.iconName)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.name}</h4>
                                                <p className="text-sm text-gray-400">
                                                    {item.price.toLocaleString()} 크레딧
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {['themes', 'bundles', 'special'].includes(item.category) ? (
                                                    <div className="w-20 text-center">
                                                        <span className="text-gray-400">1개</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                                                            className="p-1 hover:bg-gray-700 rounded"
                                                        >
                                                            <Minus className="w-4 h-4"/>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={item.cartQuantity}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || /^\d+$/.test(value)) {
                                                                    const numValue = value === '' ? 1 : parseInt(value);
                                                                    if (numValue >= 1) {
                                                                        updateCartQuantity(item.id, numValue);
                                                                    }
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                if (e.target.value === '') {
                                                                    updateCartQuantity(item.id, 1);
                                                                }
                                                            }}
                                                            className="w-16 text-center bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                                                        />
                                                        <button
                                                            onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                                                            className="p-1 hover:bg-gray-700 rounded"
                                                        >
                                                            <Plus className="w-4 h-4"/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <p className="font-semibold text-green-400">
                                                {(item.price * item.cartQuantity).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 hover:bg-gray-700 rounded-lg"
                                            >
                                                <X className="w-4 h-4 text-red-400"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-800">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg">총 금액</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        {getTotalPrice().toLocaleString()} 크레딧
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setShowCart(false)}
                                    >
                                        계속 쇼핑
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleCartPurchase}
                                    >
                                        <ShoppingCart className="w-4 h-4"/>
                                        결제하기
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}