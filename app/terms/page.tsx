'use client'

import Link from 'next/link'
import {AlertCircle, Book, CreditCard, Gavel, Shield, Users, XCircle} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function TermsPage() {
    const { user, loading } = useAuth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            setIsLoggedIn(true)
        }
    }, [user, loading])
    const sections = [
        {
            title: "제1조 (목적)",
            icon: <Book className="w-6 h-6 text-green-400"/>,
            content: [
                "본 약관은 BangtalBoyBand(이하 '회사')가 제공하는 EROOM 게임 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다."
            ]
        },
        {
            title: "제2조 (용어의 정의)",
            icon: <Book className="w-6 h-6 text-green-400"/>,
            content: [
                "'서비스'란 회사가 제공하는 EROOM 게임 및 관련 제반 서비스를 의미합니다.",
                "'이용자'란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.",
                "'회원'이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.",
                "'크레딧'이란 서비스 내에서 유료 콘텐츠를 구매하기 위해 사용되는 가상화폐를 의미합니다."
            ]
        },
        {
            title: "제3조 (약관의 게시와 개정)",
            icon: <Gavel className="w-6 h-6 text-green-400"/>,
            content: [
                "회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 내 또는 연결화면에 게시합니다.",
                "회사는 필요하다고 인정되는 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.",
                "회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 내 공지사항에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다."
            ]
        },
        {
            title: "제4조 (회원가입)",
            icon: <Users className="w-6 h-6 text-green-400"/>,
            content: [
                "이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.",
                "회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:",
                "• 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우",
                "• 실명이 아니거나 타인의 정보를 이용한 경우",
                "• 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우",
                "• 14세 미만 아동이 법정대리인의 동의를 얻지 못한 경우",
                "• 기타 회원으로 등록하는 것이 서비스 운영에 현저히 지장이 있다고 판단되는 경우"
            ]
        },
        {
            title: "제5조 (서비스의 제공 및 변경)",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                "회사는 다음과 같은 서비스를 제공합니다:",
                "• EROOM 게임 서비스",
                "• AI 기반 맵 생성 서비스",
                "• 멀티플레이어 서비스",
                "• 맵 에디터 및 공유 서비스",
                "• 기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스",
                "",
                "회사는 서비스의 내용을 변경할 경우에는 변경사유 및 내용을 이용자가 알기 쉽도록 서비스 내에서 공지합니다."
            ]
        },
        {
            title: "제6조 (서비스 이용 시간)",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                "서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.",
                "회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.",
                "회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에 공지한 바에 따릅니다."
            ]
        },
        {
            title: "제7조 (이용자의 의무)",
            icon: <AlertCircle className="w-6 h-6 text-green-400"/>,
            content: [
                "이용자는 다음 행위를 하여서는 안 됩니다:",
                "• 신청 또는 변경 시 허위 내용의 등록",
                "• 타인의 정보 도용",
                "• 회사가 게시한 정보의 변경",
                "• 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시",
                "• 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해",
                "• 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위",
                "• 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위",
                "• 게임 내 버그를 악용하거나 핵, 매크로 등 비정상적인 방법으로 서비스를 이용하는 행위",
                "• 기타 불법적이거나 부당한 행위"
            ]
        },
        {
            title: "제8조 (유료 서비스)",
            icon: <CreditCard className="w-6 h-6 text-green-400"/>,
            content: [
                "회사는 유료 서비스를 제공할 수 있으며, 유료 서비스 이용에 대한 결제는 회사가 제공하는 결제 방법을 통해 가능합니다.",
                "이용자가 구매한 크레딧은 구매일로부터 1년간 사용 가능하며, 기간 내 사용하지 않은 크레딧은 자동 소멸됩니다.",
                "이용자의 귀책사유로 인한 서비스 이용 제한 시 크레딧은 환불되지 않습니다.",
                "청약철회 및 환불은 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 따릅니다."
            ]
        },
        {
            title: "제9조 (계약 해제 및 해지)",
            icon: <XCircle className="w-6 h-6 text-green-400"/>,
            content: [
                "회원은 언제든지 마이페이지 메뉴 등을 통하여 이용계약 해지 신청을 할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.",
                "회원이 계약을 해지할 경우, 관련 법령 및 개인정보처리방침에 따라 회사가 회원정보를 보유하는 경우를 제외하고는 해지 즉시 회원의 모든 데이터는 소멸됩니다.",
                "회사는 회원이 제7조에 규정한 금지행위를 한 경우 사전통지 없이 계약을 해지하거나 기간을 정하여 서비스 이용을 제한할 수 있습니다."
            ]
        },
        {
            title: "제10조 (면책조항)",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                "회사는 천재지변, 전쟁 및 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다.",
                "회사는 기간통신 사업자가 전기통신 서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우 책임이 면제됩니다.",
                "회사는 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 발생한 손해에 대한 책임이 면제됩니다.",
                "회사는 이용자의 컴퓨터 오류에 의해 손해가 발생한 경우, 또는 이용자가 개인정보 및 비밀번호를 부실하게 관리하여 발생한 손해에 대해 책임을 지지 않습니다."
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        서비스 이용약관
                    </h1>
                    <p className="text-2xl text-gray-300 mb-4">
                        EROOM 서비스를 이용해 주셔서 감사합니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        시행일: 2025년 6월 27일 | 최종 수정일: 2025년 6월 27일
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-12 mb-32">
                    {sections.map((section, index) => (
                        <div key={index}
                             className="bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-10 border border-gray-800">
                            <div className="flex items-center gap-4 mb-6">
                                {section.icon}
                                <h2 className="text-3xl font-bold">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-gray-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Information */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 mb-32">
                    <h2 className="text-3xl font-bold mb-8 text-center">부칙</h2>
                    <div className="space-y-4 text-gray-300 text-center">
                        <p>본 약관은 2025년 1월 1일부터 시행됩니다.</p>
                        <p>본 약관에 명시되지 않은 사항은 관련 법령에 따릅니다.</p>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
                    {!isLoggedIn ? (
                        <>
                            <Link href="/auth/signup"
                                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                                회원가입으로 돌아가기
                            </Link>
                            <Link href="/"
                                  className="px-8 py-3 border border-green-700 rounded-lg font-medium hover:bg-green-900/30 transition-all">
                                메인으로
                            </Link>
                        </>
                    ) : (
                        <Link href="/"
                              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                            메인으로
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}