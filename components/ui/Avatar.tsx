import {User} from 'lucide-react'

interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Avatar({src, alt, size = 'md', className = ''}: AvatarProps) {
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
                />
            ) : (
                <User className={`${iconSizes[size]} text-white`}/>
            )}
        </div>
    )
}