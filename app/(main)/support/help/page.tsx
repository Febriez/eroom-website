'use client'

import {BookOpen, HelpCircle, Mail, MessageSquare} from 'lucide-react'
import {PageHeader} from '@/components/layout/PageHeader'
import {Container} from '@/components/ui/Container'
import {Card} from '@/components/ui/Card'
import Link from 'next/link'

export default function HelpPage() {
    return (
        <>
            <PageHeader
                title="고객센터"
                description="EROOM에 문제가 생기셨나요? 다양한 방법으로 도움을 드립니다."
                badge="고객지원"
                icon={<HelpCircle className="w-5 h-5"/>}
            />

            <Container className="py-12 space-y-12">
                {/* 빠른 도움말 링크 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 hover:border-green-600/50 transition-colors">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-green-400"/>
                            자주 묻는 질문
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            설치, 계정, 결제 등 자주 문의되는 질문과 답변을 확인해보세요.
                        </p>
                        <Link href="/faq" className="text-green-400 text-sm font-medium hover:underline">
                            FAQ 보기 →
                        </Link>
                    </Card>

                    <Card className="p-6 hover:border-green-600/50 transition-colors">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-green-400"/>
                            커뮤니티 가이드
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            다른 유저들과 문제를 공유하고, 해결 방법을 찾아보세요.
                        </p>
                        <Link href="/community/guides" className="text-green-400 text-sm font-medium hover:underline">
                            커뮤니티 가이드 →
                        </Link>
                    </Card>

                    <Card className="p-6 hover:border-green-600/50 transition-colors">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-400"/>
                            1:1 문의하기
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            찾으시는 답변이 없으신가요? 고객센터에 직접 문의해주세요.
                        </p>
                        <Link href="/support/faq" className="text-green-400 text-sm font-medium hover:underline">
                            문의하기 →
                        </Link>
                    </Card>
                </div>

                {/* 안내 메시지 */}
                <Card className="p-6 text-center max-w-2xl mx-auto">
                    <p className="text-gray-300 mb-2">
                        문제가 계속된다면, 최신 버전으로 업데이트되어 있는지 확인해보시고
                        <br/>
                        FAQ 또는 커뮤니티 게시판에서 유사한 사례를 검색해보세요.
                    </p>
                    <Link href="/support/faq" className="btn-outline mt-4">
                        FAQ 바로가기
                    </Link>
                </Card>
            </Container>
        </>
    )
}
