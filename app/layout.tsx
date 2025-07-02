// app/layout.tsx
import type {Metadata, Viewport} from 'next'
import {Inter} from 'next/font/google'
import '../styles/globals.css'
import {Providers} from "@/app/Providers"
import React from "react";
import {ScrollButtons} from "@/components/shared/ScrollButtons";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
})

export const metadata: Metadata = {
    title: {
        default: 'EROOM - AI가 만드는 무한한 방탈출',
        template: '%s | EROOM'
    },
    description: '인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐 게임. BangtalBoyBand가 만든 차세대 AI 게이밍 플랫폼.',
    keywords: ['방탈출', '게임', 'AI', '퍼즐', 'EROOM', 'BangtalBoyBand', '인공지능'],
    authors: [{name: 'BangtalBoyBand'}],
    creator: 'BangtalBoyBand',
    publisher: 'BangtalBoyBand',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://eroom.bangtalboyband.com'),
    openGraph: {
        title: 'EROOM - AI가 만드는 무한한 방탈출',
        description: '인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐 게임',
        url: 'https://eroom.bangtalboyband.com',
        siteName: 'EROOM',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'EROOM - AI 방탈출 게임',
            }
        ],
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EROOM - AI가 만드는 무한한 방탈출',
        description: '인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐 게임',
        images: ['/twitter-image.jpg'],
        creator: '@bangtalboyband',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/manifest.json',
    // 브라우저 알림을 위한 아이콘 설정 추가
    icons: {
        icon: [
            {url: '/icon.ico'},
            {url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png'},
            {url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png'},
        ],
        shortcut: [
            {url: '/icons/icon-96x96.png'}
        ],
        apple: [
            {url: '/apple-touch-icon.png'},
            {url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png'},
        ],
    },
    // PWA 관련 메타데이터 추가
    applicationName: 'EROOM',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'EROOM',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko" className={inter.variable}>
        <body className="font-sans">
        <Providers>
            {children}
            <ScrollButtons/>
        </Providers>
        </body>
        </html>
    )
}