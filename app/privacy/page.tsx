'use client'

import Link from 'next/link'
import {Calendar, Database, Globe, Lock, Mail, Phone, Shield, User} from 'lucide-react'

export default function PrivacyPage() {
    const sections = [
        {
            title: "1. 개인정보의 수집 및 이용 목적",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "회원 관리",
                    items: [
                        "회원제 서비스 이용에 따른 본인 확인",
                        "개인 식별, 불량회원의 부정 이용 방지",
                        "가입 의사 확인, 연령 확인, 만 14세 미만 아동 개인정보 수집 시 법정 대리인 동의 여부 확인",
                        "고지사항 전달"
                    ]
                },
                {
                    subtitle: "서비스 제공",
                    items: [
                        "EROOM 게임 서비스 제공",
                        "맞춤형 콘텐츠 제공",
                        "유료 서비스 이용 시 결제 및 정산"
                    ]
                },
                {
                    subtitle: "서비스 개선",
                    items: [
                        "신규 서비스 개발 및 맞춤 서비스 제공",
                        "통계학적 특성에 따른 서비스 제공 및 광고 게재",
                        "서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공"
                    ]
                }
            ]
        },
        {
            title: "2. 수집하는 개인정보의 항목",
            icon: <Database className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "필수 수집 항목",
                    items: [
                        "이메일 주소",
                        "비밀번호 (암호화하여 저장)",
                        "닉네임",
                        "생성일시, 접속 IP, 접속 로그"
                    ]
                },
                {
                    subtitle: "선택 수집 항목",
                    items: [
                        "프로필 이미지",
                        "생년월일",
                        "성별"
                    ]
                },
                {
                    subtitle: "자동 수집 항목",
                    items: [
                        "서비스 이용 기록",
                        "게임 플레이 기록 (플레이 시간, 클리어 맵 수, 포인트 등)",
                        "기기 정보 (OS, 브라우저 종류 등)"
                    ]
                }
            ]
        },
        {
            title: "3. 개인정보의 보유 및 이용 기간",
            icon: <Calendar className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "원칙",
                    items: [
                        "회원 탈퇴 시까지 보유 및 이용",
                        "탈퇴 시 지체 없이 파기"
                    ]
                },
                {
                    subtitle: "관련 법령에 따른 보유",
                    items: [
                        "계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)",
                        "대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)",
                        "소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)",
                        "표시/광고에 관한 기록: 6개월 (전자상거래법)",
                        "웹사이트 방문기록: 3개월 (통신비밀보호법)"
                    ]
                }
            ]
        },
        {
            title: "4. 개인정보의 제3자 제공",
            icon: <Globe className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "원칙",
                    items: [
                        "회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다"
                    ]
                },
                {
                    subtitle: "예외 사항",
                    items: [
                        "이용자가 사전에 동의한 경우",
                        "법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우"
                    ]
                }
            ]
        },
        {
            title: "5. 개인정보의 파기 절차 및 방법",
            icon: <Lock className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "파기 절차",
                    items: [
                        "이용자의 개인정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다"
                    ]
                },
                {
                    subtitle: "파기 방법",
                    items: [
                        "전자적 파일 형태: 기술적 방법을 사용하여 재생이 불가능하도록 삭제",
                        "종이 문서: 분쇄기로 분쇄하거나 소각"
                    ]
                }
            ]
        },
        {
            title: "6. 이용자의 권리와 행사 방법",
            icon: <User className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "이용자의 권리",
                    items: [
                        "개인정보 열람 요구",
                        "오류 등이 있을 경우 정정 요구",
                        "삭제 요구",
                        "처리정지 요구"
                    ]
                },
                {
                    subtitle: "행사 방법",
                    items: [
                        "고객센터를 통한 서면, 전화, 이메일로 연락",
                        "본인 확인 절차 후 처리"
                    ]
                }
            ]
        },
        {
            title: "7. 개인정보 보호를 위한 기술적/관리적 대책",
            icon: <Shield className="w-6 h-6 text-green-400"/>,
            content: [
                {
                    subtitle: "기술적 대책",
                    items: [
                        "개인정보의 암호화: 비밀번호는 단방향 암호화하여 저장",
                        "해킹 등에 대비한 대책: 침입차단시스템 및 침입탐지시스템 운영",
                        "접속기록의 보관 및 위변조 방지"
                    ]
                },
                {
                    subtitle: "관리적 대책",
                    items: [
                        "개인정보 취급 직원의 최소화 및 교육",
                        "내부관리계획의 수립 및 시행",
                        "개인정보 보호 전담조직의 운영"
                    ]
                }
            ]
        }
    ]

    const contactInfo = {
        company: "BangtalBoyBand",
        privacy_officer: "개인정보보호책임자: 방화채",
        email: "pickpictest@gamil.com",
        phone: "02-1234-5678",
        address: "서울특별시 강남구 테헤란로5길 20"
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-8">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        개인정보 수집 및 이용약관
                    </h1>
                    <p className="text-2xl text-gray-300 mb-4">
                        BangtalBoyBand는 이용자의 개인정보를 중요시하며, 개인정보보호법을 준수합니다.
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
                            <div className="flex items-center gap-4 mb-8">
                                {section.icon}
                                <h2 className="text-3xl font-bold">{section.title}</h2>
                            </div>

                            <div className="space-y-8">
                                {section.content.map((subsection, subIndex) => (
                                    <div key={subIndex}>
                                        <h3 className="text-xl font-semibold text-green-400 mb-4">{subsection.subtitle}</h3>
                                        <ul className="space-y-2">
                                            {subsection.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Information */}
                <div
                    className="bg-gradient-to-br from-green-900/20 to-black rounded-3xl p-12 border border-green-800/50 mb-32">
                    <h2 className="text-3xl font-bold mb-8 text-center">개인정보 관련 문의</h2>
                    <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <Mail className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                            <p className="text-gray-400 mb-2">이메일</p>
                            <p className="text-green-400">{contactInfo.email}</p>
                        </div>
                        <div className="text-center">
                            <Phone className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                            <p className="text-gray-400 mb-2">전화</p>
                            <p className="text-green-400">{contactInfo.phone}</p>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-gray-400">{contactInfo.privacy_officer}</p>
                        <p className="text-gray-500 text-sm mt-2">{contactInfo.address}</p>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex justify-center gap-8 mb-16">
                    <Link href="/auth/signup"
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                        회원가입으로 돌아가기
                    </Link>
                    <Link href="/"
                          className="px-8 py-3 border border-green-700 rounded-lg font-medium hover:bg-green-900/30 transition-all">
                        메인으로
                    </Link>
                </div>
            </div>
        </div>
    )
}