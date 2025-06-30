import {HTMLAttributes} from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient'
    hover?: boolean
}

export function Card({
                         children,
                         variant = 'default',
                         hover = false,
                         className = '',
                         ...props
                     }: CardProps) {
    const variants = {
        default: 'bg-gray-900 border border-gray-800',
        glass: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50',
        gradient: 'bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800'
    }

    return (
        <div
            className={`
        rounded-xl
        ${variants[variant]}
        ${hover ? 'hover:border-green-600/50 transition-all duration-300' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    )
}