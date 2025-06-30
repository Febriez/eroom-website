import {ButtonHTMLAttributes, forwardRef} from 'react'
import {Loader2} from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         children,
         variant = 'primary',
         size = 'md',
         loading,
         fullWidth,
         className = '',
         disabled,
         ...props
     }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl',
            secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100',
            outline: 'border-2 border-green-600 hover:bg-green-600/10 text-green-400',
            ghost: 'hover:bg-gray-800 text-gray-300 hover:text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white'
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-sm gap-1.5',
            md: 'px-4 py-2 text-base gap-2',
            lg: 'px-6 py-3 text-lg gap-2.5'
        }

        return (
            <button
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'