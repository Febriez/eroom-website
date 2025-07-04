import {Loader2} from 'lucide-react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({size = 'md', className = ''}: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className={`${sizes[size]} animate-spin text-green-400 ${className}`}/>
        </div>
    )
}