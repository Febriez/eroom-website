'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Book, Clock, Edit, Search, User} from 'lucide-react'
import {collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc} from 'firebase/firestore'
import {db} from '../../lib/firebase'
import {useAuth} from '../../contexts/AuthContext'

interface GuideData {
    id: string;
    title: string;
    author: string;
    authorId: string;
    createdAt: any;
    updatedAt: any;
    content: string;
    category: string;
    difficulty: string;
    readTime: string;
    likes: number;
    views: number;
}

export default function GuidesPage() {
    const router = useRouter()
    const {user} = useAuth()
    const [guides, setGuides] = useState<GuideData[]>([])
    const [filteredGuides, setFilteredGuides] = useState<GuideData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('recent')
    const [initialDataSaved, setInitialDataSaved] = useState(false)

    // 초기 가이드 데이터
    const initialGuides = [
        {
            id: '1',
            title: "초보자를 위한 방탈출 가이드",
            author: "EscapeMaster",
            authorId: "user_escapemaster",
            createdAt: new Date('2024-05-10'),
            updatedAt: new Date('2024-05-10'),
            content: "# 방탈출 게임 초보자 가이드\n\n안녕하세요! 이 가이드는 방탈출 게임을 처음 접하는 분들을 위한 기초 안내서입니다.\n\n## 기본 원칙\n\n1. **모든 것을 관찰하세요** - 작은 디테일이 중요한 단서가 될 수 있습니다.\n2. **체계적으로 탐색하세요** - 방 전체를 체계적으로 살펴보고 발견한 것을 기록하세요.\n3. **팀워크가 중요합니다** - 발견한 것을 팀원과 공유하고 함께 해결책을 찾으세요.\n\n## 자주 등장하는 퍼즐 유형\n\n- **숫자 조합** - 자물쇠나 금고를 열기 위한 숫자 조합을 찾는 퍼즐\n- **빛과 그림자** - 특정 각도에서 빛을 비춰 단서를 찾는 퍼즐\n- **패턴 인식** - 반복되는 패턴을 찾아 해독하는 퍼즐\n\n초보자들은 처음에는 어렵게 느껴질 수 있지만, 경험이 쌓이면서 점점 더 재미있게 즐길 수 있을 것입니다. 행운을 빕니다!",
            category: "초보자 가이드",
            difficulty: "입문",
            readTime: "5분",
            likes: 245,
            views: 1250
        },
        {
            id: '2',
            title: "숨겨진 단서 찾는 법",
            author: "DetectiveX",
            authorId: "user_detectivex",
            createdAt: new Date('2024-05-25'),
            updatedAt: new Date('2024-06-02'),
            content: "# 숨겨진 단서 찾는 전문 기술\n\n방탈출 게임의 핵심은 잘 숨겨진 단서를 찾는 것입니다. 이 가이드에서는 경험 많은 플레이어들이 사용하는 테크닉을 소개합니다.\n\n## 고급 탐색 기법\n\n### 1. 질감 분석\n\n- 표면의 미세한 변화를 손끝으로 느껴보세요\n- 벽지나 카페트의 불규칙한 부분을 확인하세요\n- 나무 패널의 느슨한 부분을 찾아보세요\n\n### 2. 빛 활용하기\n\n- 스마트폰 플래시를 다양한 각도에서 비춰보세요\n- UV 빛에만 보이는 단서가 있을 수 있습니다\n- 그림자가 만드는 패턴을 관찰하세요\n\n### 3. 소리 단서\n\n- 벽을 두드려 빈 공간을 찾으세요\n- 물체를 흔들어 내부에 무언가 있는지 확인하세요\n- 특정 장치가 작동할 때 나는 소리를 주의깊게 들으세요\n\n이러한 기술을 연습하면 숨겨진 단서를 찾는 능력이 크게 향상될 것입니다. 행운을 빕니다!",
            category: "고급 테크닉",
            difficulty: "중급",
            readTime: "8분",
            likes: 378,
            views: 1823
        },
        {
            id: '3',
            title: "시간 압박 상황에서의 탈출 전략",
            author: "TimeMaster",
            authorId: "user_timemaster",
            createdAt: new Date('2024-06-10'),
            updatedAt: new Date('2024-06-10'),
            content: "# 시간 압박 상황에서의 탈출 전략\n\n제한된 시간 내에 방을 탈출해야 하는 상황에서 효율적으로 문제를 해결하는 방법을 알아봅시다.\n\n## 시간 관리 전략\n\n### 1. 역할 분담\n\n- 팀원마다 특정 영역이나 퍼즐 유형을 담당하게 하세요\n- 전문성에 따라 역할을 배분하세요 (예: 수학 퍼즐, 물리적 퍼즐 등)\n- 주기적으로 진행 상황을 공유하세요\n\n### 2. 우선순위 설정\n\n- 모든 퍼즐에 동일한 시간을 할애하지 마세요\n- 병목 현상이 생기면 다른 퍼즐로 전환하세요\n- 10분 이상 진전이 없으면 힌트를 요청하는 것이 좋습니다\n\n### 3. 멀티태스킹\n\n- 여러 퍼즐을 동시에 진행하세요\n- 발견한 모든 단서를 공유 공간에 모아두세요\n- 미해결 단서 목록을 유지하세요\n\n시간이 부족할 때는 침착함을 유지하는 것이 가장 중요합니다. 서두르면 실수가 증가하고 오히려 더 많은 시간을 낭비하게 됩니다.",
            category: "전략 가이드",
            difficulty: "고급",
            readTime: "10분",
            likes: 421,
            views: 2105
        }
    ];

    // Firestore에서 가이드 데이터 불러오기
    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            try {
                const guidesQuery = query(collection(db, 'guides'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(guidesQuery);

                if (snapshot.empty && !initialDataSaved) {
                    // Firestore에 데이터가 없으면 초기 데이터 저장
                    console.log('가이드 데이터가 없습니다. 초기 데이터를 저장합니다.');
                    await saveInitialData();
                    setInitialDataSaved(true);
                    // 저장 후 다시 불러오기
                    fetchGuides();
                } else {
                    // Firestore에서 데이터 불러오기
                    const guidesList: GuideData[] = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        guidesList.push({
                            id: doc.id,
                            title: data.title,
                            author: data.author,
                            authorId: data.authorId,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                            content: data.content,
                            category: data.category,
                            difficulty: data.difficulty,
                            readTime: data.readTime,
                            likes: data.likes,
                            views: data.views
                        });
                    });
                    setGuides(guidesList);
                    setFilteredGuides(guidesList);
                }
            } catch (error) {
                console.error('가이드 데이터 불러오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [initialDataSaved]);

    // 초기 데이터 Firestore에 저장
    const saveInitialData = async () => {
        try {
            for (const guide of initialGuides) {
                await setDoc(doc(db, 'guides', guide.id), {
                    title: guide.title,
                    author: guide.author,
                    authorId: guide.authorId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    content: guide.content,
                    category: guide.category,
                    difficulty: guide.difficulty,
                    readTime: guide.readTime,
                    likes: guide.likes,
                    views: guide.views
                });
            }
            console.log('초기 가이드 데이터 저장 완료');
            return true;
        } catch (error) {
            console.error('초기 가이드 데이터 저장 오류:', error);
            return false;
        }
    };

    // 검색 및 정렬 적용
    useEffect(() => {
        if (!guides.length) return;

        // 검색어 필터링
        let result = [...guides];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(guide =>
                guide.title.toLowerCase().includes(lowerSearchTerm) ||
                guide.author.toLowerCase().includes(lowerSearchTerm) ||
                guide.category.toLowerCase().includes(lowerSearchTerm) ||
                guide.content.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 정렬 적용
        switch (filter) {
            case 'recent':
                // Firestore 타임스탬프 처리
                result.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
                    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
                break;
            case 'popular':
                result.sort((a, b) => b.likes - a.likes);
                break;
            case 'views':
                result.sort((a, b) => b.views - a.views);
                break;
            default:
                break;
        }

        setFilteredGuides(result);
    }, [searchTerm, filter, guides]);

    // 가이드 작성 페이지로 이동
    const handleCreateGuide = () => {
        if (!user) {
            // 로그인 페이지로 리다이렉트
            router.push('/auth/login?redirect=/community/guides/create');
            return;
        }

        router.push('/community/guides/create');
    };

    // 날짜 포맷팅 함수
    const formatDate = (date: any) => {
        if (!date) return '';

        if (date.toDate) {
            date = date.toDate();
        } else if (typeof date === 'object' && date.seconds) {
            date = new Date(date.seconds * 1000);
        }

        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        방탈출 가이드
                    </h1>
                    <p className="text-2xl text-gray-300">전문가들이 작성한 팁과 전략으로 방탈출 실력을 향상시키세요</p>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="가이드 검색..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 rounded-xl border border-gray-800 focus:border-green-600 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('recent')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'recent' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => setFilter('popular')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'popular' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            인기순
                        </button>
                        <button
                            onClick={() => setFilter('views')}
                            className={`px-6 py-4 rounded-xl font-medium transition-all ${
                                filter === 'views' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            조회순
                        </button>
                    </div>
                </div>

                {/* Create Guide Button */}
                <div className="mb-10">
                    <button
                        onClick={handleCreateGuide}
                        className="px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5"/>
                        가이드 작성하기
                    </button>
                </div>

                {/* Guides List */}
                {loading ? (
                    <div className="py-16 text-center">
                        <div
                            className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
                        <p className="text-xl text-gray-400">가이드를 불러오는 중...</p>
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-xl text-gray-400 mb-4">검색 결과가 없습니다</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilter('recent');
                            }}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            필터 초기화
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 mb-32">
                        {filteredGuides.map((guide) => (
                            <div key={guide.id}
                                 onClick={() => router.push(`/community/guides/${guide.id}`)}
                                 className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl overflow-hidden border border-gray-800 hover:border-green-600/50 transition-all cursor-pointer p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex gap-3 mb-2">
                                            <span
                                                className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs">{guide.category}</span>
                                            <span
                                                className="px-3 py-1 bg-gray-800 rounded-lg text-xs">{guide.difficulty}</span>
                                        </div>

                                        <h2 className="text-2xl font-bold mb-3">{guide.title}</h2>

                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4"/>
                                                <span>{guide.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4"/>
                                                <span>{guide.readTime} 소요</span>
                                            </div>
                                            <div>
                                                {formatDate(guide.createdAt)}
                                            </div>
                                        </div>

                                        <p className="text-gray-300 line-clamp-2">
                                            {guide.content.replace(/\#|\*/g, '').split('\n').filter(line => line.trim()).slice(0, 2).join(' ')}
                                        </p>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center gap-6 md:min-w-32">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-400">{guide.likes}</div>
                                            <div className="text-xs text-gray-500">좋아요</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{guide.views}</div>
                                            <div className="text-xs text-gray-500">조회수</div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/community/guides/${guide.id}`);
                                            }}
                                            className="hidden md:flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                                            <Book className="w-4 h-4"/>
                                            읽기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}