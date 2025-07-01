import React from 'react'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
    width?: string | number
    height?: string | number
    animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
                                                      className = '',
                                                      variant = 'rectangular',
                                                      width,
                                                      height,
                                                      animation = 'pulse'
                                                  }) => {
    const baseClasses = 'bg-gray-800'

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    }

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: ''
    }

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || 'auto'
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    )
}