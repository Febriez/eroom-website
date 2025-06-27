'use client'

import {ChevronDown, CreditCard, Gamepad2, HelpCircle, Settings, Shield, Users} from 'lucide-react'
import {useState} from 'react'

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [openItems, setOpenItems] = useState<number[]>([])

    const faqCategories = [
        {id: 'all', name: '전체', icon: <HelpCircle className="w-4 h-4"/>},
        {id: 'account', name: '계정', icon: <Users className="w-4 h-4"/>},
        {id: 'game', name: '게임플레이', icon: <Gamepad2 className="w-4 h-4"/>},
        {id: 'technical', name: '기술 지원', icon: <Settings className="w-4 h-4"/>},
        {id: 'payment', name: '결제', icon: <CreditCard className="w-4 h-4"/>},
        {id: 'safety', name: '안전', icon: <Shield className="w-4 h-4"/>}
    ]

    const faqData = [
        // 계정 관련
        {
            id: 1,
            category: 'account',
            question: "계정을 어떻게 만드나요?",
            answer: "게임을 처음 실행하면 계정 생성 화면이 나타납니다. 이메일 주소와 비밀번호를 입력하고, 닉네임을 설정하면 계정이 생성됩니다. 구글 계정으로도 간편하게 가입할 수 있습니다."
        },
        {
            id: 2,
            category: 'account',
            question: "비밀번호를 잊어버렸어요.",
            answer: "로그인 화면에서 '비밀번호를 잊으셨나요?' 링크를 클릭하세요. 가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다."
        },
        {
            id: 3,
            category: 'account',
            question: "닉네임을 변경할 수 있나요?",
            answer: "네, 가능합니다. 게임 내 프로필 설정에서 닉네임을 변경할 수 있습니다. 단, 30일에 한 번만 변경 가능합니다."
        },
        {
            id: 4,
            category: 'account',
            question: "계정을 삭제하고 싶어요.",
            answer: "계정 삭제는 설정 > 계정 관리에서 가능합니다. 삭제 후 30일 이내에는 복구가 가능하며, 그 이후에는 모든 데이터가 영구 삭제됩니다."
        },

        // 게임플레이 관련
        {
            id: 5,
            category: 'game',
            question: "AI가 생성한 맵이 너무 어려워요.",
            answer: "설정 메뉴에서 난이도를 조절할 수 있습니다. AI는 플레이어의 실력을 학습하여 자동으로 난이도를 조절하지만, 수동 설정도 가능합니다. '쉬움', '보통', '어려움', '매우 어려움' 중에서 선택하세요."
        },
        {
            id: 6,
            category: 'game',
            question: "친구와 함께 플레이하려면 어떻게 하나요?",
            answer: "메인 메뉴에서 '멀티플레이'를 선택하고, '방 만들기' 또는 '방 참가하기'를 선택하세요. 방 코드를 공유하거나 친구 목록에서 직접 초대할 수 있습니다. 최대 4명까지 함께 플레이 가능합니다."
        },
        {
            id: 7,
            category: 'game',
            question: "맵을 직접 만들 수 있나요?",
            answer: "네! 맵 에디터를 통해 자신만의 방탈출 맵을 제작할 수 있습니다. 메인 메뉴의 '맵 에디터'를 선택하면 다양한 도구와 퍼즐 요소를 활용해 맵을 만들 수 있습니다."
        },
        {
            id: 8,
            category: 'game',
            question: "제작한 맵을 공유하는 방법은?",
            answer: "맵 에디터에서 맵 제작을 완료한 후 '공유하기' 버튼을 누르면 커뮤니티에 업로드됩니다. 비공개로 설정하여 친구들과만 공유할 수도 있습니다."
        },

        // 기술 지원 관련
        {
            id: 9,
            category: 'technical',
            question: "게임이 실행되지 않아요.",
            answer: "먼저 시스템 요구사항을 확인해주세요. 그래픽 드라이버를 최신 버전으로 업데이트하고, 바이러스 백신 프로그램에서 게임을 예외로 추가해보세요. 문제가 지속되면 게임을 재설치해보시기 바랍니다."
        },
        {
            id: 10,
            category: 'technical',
            question: "게임이 자주 멈추거나 느려요.",
            answer: "설정에서 그래픽 품질을 낮춰보세요. 백그라운드에서 실행 중인 다른 프로그램들을 종료하고, 게임 파일의 무결성을 검증해보세요. SSD에 게임을 설치하면 성능이 향상됩니다."
        },
        {
            id: 11,
            category: 'technical',
            question: "음성 채팅이 작동하지 않아요.",
            answer: "Windows 설정에서 마이크 권한을 확인하세요. 게임 내 오디오 설정에서 올바른 입력/출력 장치가 선택되어 있는지 확인하고, 마이크 볼륨을 조절해보세요."
        },

        // 결제 관련
        {
            id: 12,
            category: 'payment',
            question: "크레딧은 어떻게 구매하나요?",
            answer: "게임 내 상점에서 크레딧을 구매할 수 있습니다. 신용카드, 페이팔, 문화상품권 등 다양한 결제 수단을 지원합니다. 구매한 크레딧은 즉시 계정에 반영됩니다."
        },
        {
            id: 13,
            category: 'payment',
            question: "결제했는데 크레딧이 들어오지 않아요.",
            answer: "결제 후 최대 10분까지 기다려주세요. 그래도 반영되지 않는다면 결제 영수증과 함께 고객센터로 문의해주세요. 24시간 이내에 처리해드립니다."
        },
        {
            id: 14,
            category: 'payment',
            question: "환불이 가능한가요?",
            answer: "구매 후 7일 이내, 사용하지 않은 크레딧에 한해 환불이 가능합니다. 이미 사용한 크레딧은 환불이 불가능하며, 자세한 사항은 환불 정책을 참고해주세요."
        },

        // 안전 관련
        {
            id: 15,
            category: 'safety',
            question: "부적절한 맵이나 플레이어를 신고하려면?",
            answer: "게임 내에서 신고 버튼(⚠️)을 클릭하여 신고할 수 있습니다. 신고 사유를 선택하고 자세한 내용을 작성해주세요. 모든 신고는 24시간 이내에 검토됩니다."
        },
        {
            id: 16,
            category: 'safety',
            question: "개인정보는 안전하게 보호되나요?",
            answer: "네, 모든 개인정보는 암호화되어 안전하게 보관됩니다. 개인정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요."
        },
        {
            id: 17,
            category: 'safety',
            question: "아이가 안전하게 플레이할 수 있나요?",
            answer: "EROOM은 전체 이용가 게임입니다. AI가 부적절한 콘텐츠를 자동으로 필터링하며, 부모님이 자녀 계정의 활동을 모니터링할 수 있는 가족 안전 기능을 제공합니다."
        }
    ]

    const filteredFAQ = selectedCategory === 'all'
        ? faqData
        : faqData.filter(item => item.category === selectedCategory)

    const toggleItem = (id: number) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    return (
        <div className="min-h-screen bg-black py-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        자주 묻는 질문
                    </h1>
                    <p className="text-2xl text-gray-300">EROOM에 대해 궁금한 점을 찾아보세요</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {faqCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                selectedCategory === category.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {category.icon}
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4 mb-24">
                    {filteredFAQ.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gradient-to-br from-gray-900/50 to-black rounded-xl border border-gray-800 hover:border-green-600/50 transition-all"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full p-6 text-left flex items-center justify-between"
                            >
                                <h3 className="text-lg font-medium pr-4">{item.question}</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                        openItems.includes(item.id) ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openItems.includes(item.id) && (
                                <div className="px-6 pb-6">
                                    <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Still Need Help */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 text-center mb-16">
                    <h2 className="text-3xl font-bold mb-6">원하는 답변을 찾지 못하셨나요?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        고객센터에서 더 자세한 도움을 받으실 수 있습니다.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/support/help"
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all"
                        >
                            고객센터 바로가기
                        </a>
                        <a
                            href="/support/bug-report"
                            className="px-8 py-4 border-2 border-green-700 rounded-xl font-bold text-lg hover:bg-green-900/30 transition-all"
                        >
                            버그 신고하기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}