interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md'
    className?: string
    onClick?: () => void // Add this line
}

export function Badge({children, variant = 'default', size = 'md', className = '', onClick}: BadgeProps) {
    const variants = {
        default: 'bg-gray-800 text-gray-300',
        success: 'bg-green-900/30 text-green-400',
        warning: 'bg-yellow-900/30 text-yellow-400',
        danger: 'bg-red-900/30 text-red-400',
        info: 'bg-blue-900/30 text-blue-400'
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm'
    }

    return (
        <span
            className={`
                inline-flex items-center font-medium rounded-full
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            onClick={onClick} // Add this line
        >
            {children}
        </span>
    )
}