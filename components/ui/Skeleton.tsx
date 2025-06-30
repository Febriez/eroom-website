interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({className = '', variant = 'text'}: SkeletonProps) {
    const variants = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    }

    return (
        <div className={`
      animate-pulse bg-gray-800
      ${variants[variant]}
      ${className}
    `}/>
    )
}