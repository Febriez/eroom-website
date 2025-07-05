import {Container} from '@/components/ui/Container'
import React from "react";

interface PageHeaderProps {
    title: string
    description?: string
    badge?: string | React.ReactNode
    icon?: React.ReactNode
    actions?: React.ReactNode
}

export function PageHeader({title, description, badge, icon, actions}: PageHeaderProps) {
    return (
        <section className="pt-32 pb-16 px-4 sm:px-8 bg-gradient-to-b from-black via-gray-900/20 to-black">
            <Container>
                <div className="text-center max-w-4xl mx-auto">
                    {badge && (
                        <div className="inline-flex items-center gap-2 bg-green-900/20 px-6 py-2 rounded-full mb-6">
                            {icon && <div className="text-green-400">{icon}</div>}
                            {typeof badge === 'string' ? (
                                <span className="text-green-400 font-medium">{badge}</span>
                            ) : (
                                <div className="text-green-400 font-medium">{badge}</div>
                            )}
                        </div>
                    )}

                    <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-normal bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-xl sm:text-2xl text-gray-300 font-light mb-8">
                            {description}
                        </p>
                    )}

                    {actions && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {actions}
                        </div>
                    )}
                </div>
            </Container>
        </section>
    )
}