import React from 'react'

interface GoogleAuthStatusProps {
    loading: boolean
    countdown: number
}

export function GoogleAuthStatus({loading, countdown}: GoogleAuthStatusProps) {
    if (!loading || countdown <= 0) return null

    return (
        <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 animate-fade-in">
            <p className="text-blue-400 text-sm text-center">
                구글 인증 중... ({countdown}초 남음)
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
                팝업 창에서 계정을 선택해주세요
            </p>
        </div>
    )
}