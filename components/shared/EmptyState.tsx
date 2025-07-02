import {Button} from "@/components/ui/Button";
import React from "react";

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({icon, title, description, action}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {icon && (
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <div className="text-gray-500">{icon}</div>
                </div>
            )}

            <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>

            {description && (
                <p className="text-gray-400 mb-6 max-w-sm">{description}</p>
            )}

            {action && (
                <Button variant="primary" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}