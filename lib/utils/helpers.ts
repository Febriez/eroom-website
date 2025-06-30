export const helpers = {
    // 클래스명 조합
    cn: (...classes: (string | undefined | null | false)[]): string => {
        return classes.filter(Boolean).join(' ')
    },

    // 객체에서 falsy 값 제거
    cleanObject: <T extends Record<string, any>>(obj: T): Partial<T> => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key as keyof T] = value
            }
            return acc
        }, {} as Partial<T>)
    },

    // 배열 섞기
    shuffle: <T>(array: T[]): T[] => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    },

    // 딜레이 함수
    delay: (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    // 랜덤 ID 생성
    generateId: (length: number = 8): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    },

    // 색상 밝기 조절
    adjustColor: (color: string, amount: number): string => {
        const clamp = (num: number) => Math.min(255, Math.max(0, num))

        // HEX to RGB
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)

        // Adjust brightness
        const newR = clamp(r + amount)
        const newG = clamp(g + amount)
        const newB = clamp(b + amount)

        // RGB to HEX
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    },

    // 쿼리 파라미터 파싱
    parseQueryParams: (search: string): Record<string, string> => {
        const params = new URLSearchParams(search)
        const result: Record<string, string> = {}

        params.forEach((value, key) => {
            result[key] = value
        })

        return result
    },

    // 스크롤 위치 저장/복원
    scrollPosition: {
        save: (key: string) => {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem(`scroll-${key}`, window.scrollY.toString())
            }
        },
        restore: (key: string) => {
            if (typeof window !== 'undefined') {
                const position = sessionStorage.getItem(`scroll-${key}`)
                if (position) {
                    window.scrollTo(0, parseInt(position))
                }
            }
        }
    }
}