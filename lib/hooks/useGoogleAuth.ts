import {useEffect, useState} from 'react'

interface UseGoogleAuthReturn {
    googleLoading: boolean
    googleCountdown: number
    startGoogleAuth: () => void
    resetGoogleAuth: () => void
}

export function useGoogleAuth(onTimeout?: () => void): UseGoogleAuthReturn {
    const [googleLoading, setGoogleLoading] = useState(false)
    const [googleCountdown, setGoogleCountdown] = useState(0)

    // 구글 로그인 카운트다운 효과
    useEffect(() => {
        if (googleCountdown > 0) {
            const timer = setTimeout(() => {
                setGoogleCountdown(googleCountdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (googleCountdown === 0 && googleLoading) {
            // 카운트다운 종료 시 자동으로 로딩 상태 해제
            setGoogleLoading(false)
            if (onTimeout) {
                onTimeout()
            }
        }
    }, [googleCountdown, googleLoading, onTimeout])

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            setGoogleCountdown(0)
        }
    }, [])

    const startGoogleAuth = () => {
        setGoogleLoading(true)
        setGoogleCountdown(30) // 30초 타임아웃
    }

    const resetGoogleAuth = () => {
        setGoogleLoading(false)
        setGoogleCountdown(0)
    }

    return {
        googleLoading,
        googleCountdown,
        startGoogleAuth,
        resetGoogleAuth
    }
}