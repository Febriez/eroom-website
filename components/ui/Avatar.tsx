import {User} from 'lucide-react'
import {useEffect} from 'react'

interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Avatar({src, alt, size = 'md', className = ''}: AvatarProps) {
    // 디버깅: eroom-master.png를 사용하려는 위치 추적
    useEffect(() => {
        if (src?.includes('eroom-master.png')) {
            console.error('🔴 Avatar trying to load eroom-master.png:', {
                src,
                stackTrace: new Error().stack,
                component: 'Avatar',
                timestamp: new Date().toISOString()
            })
        }
    }, [src])

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }

    return (
        <div className={`
            ${sizes[size]} 
            bg-gradient-to-br from-green-600 to-green-700 
            rounded-full flex items-center justify-center
            ${className}
        `}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        console.error('🔴 Image load failed:', src)
                        console.trace() // 스택 트레이스 출력
                    }}
                />
            ) : (
                <User className={`${iconSizes[size]} text-white`}/>
            )}
        </div>
    )
}