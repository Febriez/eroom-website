import {forwardRef, InputHTMLAttributes} from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({label, error, icon, className = '', ...props}, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`
              w-full bg-gray-800 border rounded-lg px-4 py-3
              text-gray-100 placeholder-gray-500
              focus:border-green-500 focus:outline-none
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : 'border-gray-700'}
              ${className}
            `}
                        {...props}
                    />
                </div>

                {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'