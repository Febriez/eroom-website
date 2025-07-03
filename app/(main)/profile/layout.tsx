// app/(main)/profile/layout.tsx
'use client'

import {ProfileProvider} from '@/contexts/ProfileContext'
import React from "react";

export default function ProfileLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return (
        <ProfileProvider>
            {children}
        </ProfileProvider>
    )
}