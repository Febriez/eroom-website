'use client'

import * as React from 'react'

// 제네릭 TabsContext 정의
interface TabsContextType<T extends string = string> {
    activeTab: T
    setActiveTab: (value: T) => void
}

const TabsContext = React.createContext<TabsContextType<any> | undefined>(undefined)

interface TabsProps<T extends string = string> {
    defaultValue: T
    value?: T
    onValueChange?: (value: T) => void
    className?: string
    children: React.ReactNode
}

export function Tabs<T extends string = string>({
                                                    defaultValue,
                                                    value,
                                                    onValueChange,
                                                    className,
                                                    children
                                                }: TabsProps<T>) {
    const [internalValue, setInternalValue] = React.useState<T>(defaultValue)
    const activeTab = value ?? internalValue

    const setActiveTab = React.useCallback((newValue: T) => {
        if (!value) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
    }, [value, onValueChange])

    const contextValue = React.useMemo<TabsContextType<T>>(
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
    const context = useTabsContext<string>()
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
    const {activeTab} = useTabsContext<string>()
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

// 제네릭 Context Hook
export function useTabsContext<T extends string = string>() {
    const context = React.useContext(TabsContext) as TabsContextType<T> | undefined
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider')
    }
    return context
}
