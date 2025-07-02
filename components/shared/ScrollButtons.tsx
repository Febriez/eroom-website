'use client'

import {useEffect, useState} from 'react'
import {ChevronDown, ChevronUp} from 'lucide-react'

interface ScrollButtonsProps {
    showThreshold?: number
    className?: string
    showProgress?: boolean
}

export function ScrollButtons({
                                  showThreshold = 100,
                                  className = '',
                                  showProgress = true
                              }: ScrollButtonsProps) {
    const [showButtons, setShowButtons] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const documentHeight = document.documentElement.scrollHeight
            const windowHeight = window.innerHeight

            setShowButtons(currentScrollY > showThreshold)

            if (showProgress) {
                const progress = (currentScrollY / (documentHeight - windowHeight)) * 100
                setScrollProgress(Math.min(100, Math.max(0, progress)))
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [showThreshold, showProgress])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        })
    }

    if (!showButtons) return null

    return (
        <div className={`fixed right-8 bottom-10 z-50 flex flex-col gap-2 ${className}`}>
            {/* 맨 위로 버튼 */}
            <button
                onClick={scrollToTop}
                className="group relative bg-white hover:bg-gray-50 text-gray-700 hover:text-green-400 
                           shadow-lg hover:shadow-xl border border-gray-200 rounded-full 
                           w-12 h-12 flex items-center justify-center
                           transition-all duration-300 ease-in-out
                           hover:scale-110 active:scale-95"
                aria-label="맨 위로 이동"
            >
                <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"/>

                {/* 툴팁 */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2
                                bg-gray-900 text-white text-xs px-2 py-1 rounded
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                whitespace-nowrap pointer-events-none">
                    맨 위로
                </div>
            </button>

            {/* 맨 아래로 버튼 */}
            <button
                onClick={scrollToBottom}
                className="group relative bg-white hover:bg-gray-50 text-gray-700 hover:text-green-400 
                           shadow-lg hover:shadow-xl border border-gray-200 rounded-full 
                           w-12 h-12 flex items-center justify-center
                           transition-all duration-300 ease-in-out
                           hover:scale-110 active:scale-95"
                aria-label="맨 아래로 이동"
            >
                <ChevronDown className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-0.5"/>

                {/* 툴팁 */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2
                                bg-gray-900 text-white text-xs px-2 py-1 rounded
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                whitespace-nowrap pointer-events-none">
                    맨 아래로
                </div>
            </button>

            {/* 스크롤 진행률 인디케이터 */}
            {showProgress && (
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div
                        className="h-full bg-green-400 transition-all duration-150 ease-out"
                        style={{width: `${scrollProgress}%`}}
                    />
                </div>
            )}
        </div>
    )
}