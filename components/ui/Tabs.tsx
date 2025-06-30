'use client'

import * as React from 'react'

interface TabsContextType {
    activeTab: string
    setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
    defaultValue: string
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    children: React.ReactNode
}

export function Tabs({
                         defaultValue,
                         value,
                         onValueChange,
                         className,
                         children
                     }: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const activeTab = value ?? internalValue

    const setActiveTab = React.useCallback((newValue: string) => {
        if (!value) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
    }, [value, onValueChange])

    const contextValue = React.useMemo(
        () => ({activeTab, setActiveTab}),
        [activeTab, setActiveTab]
    )

    return (
        <TabsContext.Provider value={contextValue}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}

interface TabsListProps {
    className?: string
    children: React.ReactNode
}

export function TabsList({className, children}: TabsListProps) {
    return (
        <div className={`inline-flex bg-gray-800 rounded-xl p-1 ${className || ''}`}>
            {children}
        </div>
    )
}

interface TabsTriggerProps {
    value: string
    className?: string
    disabled?: boolean
    children: React.ReactNode
}

export function TabsTrigger({
                                value,
                                className,
                                disabled = false,
                                children
                            }: TabsTriggerProps) {
    const context = useTabsContext()
    const isActive = context.activeTab === value

    return (
        <button
            className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className || ''}
      `}
            onClick={() => !disabled && context.setActiveTab(value)}
            disabled={disabled}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${value}`}
        >
            {children}
        </button>
    )
}

interface TabsContentProps {
    value: string
    className?: string
    forceMount?: boolean
    children: React.ReactNode
}

export function TabsContent({
                                value,
                                className,
                                forceMount = false,
                                children
                            }: TabsContentProps) {
    const {activeTab} = useTabsContext()
    const isActive = activeTab === value

    if (!forceMount && !isActive) return null

    return (
        <div
            className={`
        ${isActive ? 'block' : 'hidden'}
        ${className || ''}
      `}
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
        >
            {children}
        </div>
    )
}

// Hook to use tabs context
export function useTabsContext() {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider')
    }
    return context
}