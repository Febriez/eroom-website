import React, {useEffect, useRef, useState} from 'react'

interface DropdownProps {
    trigger: React.ReactNode
    children: React.ReactNode
    align?: 'left' | 'right'
}

export function Dropdown({trigger, children, align = 'left'}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`
          absolute top-full mt-2 w-64 
          bg-gray-900 border border-gray-800 rounded-lg shadow-xl
          z-50 animate-dropdown-enter
          ${align === 'right' ? 'right-0' : 'left-0'}
        `}>
                    {children}
                </div>
            )}
        </div>
    )
}