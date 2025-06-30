'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

export default function LoginRequiredPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md">
                <User className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">로그인이 필요합니다</h2>
                <p className="text-gray-400 mb-8">
                    프로필 정보를 확인하기 위해서는 로그인이 필요한 서비스입니다.
                </p>
                <div className="flex flex-col space-y-3">
                    <Link
                        href="/auth/login"
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-lg transition-all"
                    >
                        로그인하기
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-lg transition-all"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    )
}
