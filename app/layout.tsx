import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import {Providers} from './providers'
import React from "react";
import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EROOM - AI 방탈출 게임',
  description: '인공지능이 만드는 무한한 방탈출 세계',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'EROOM - AI가 만드는 무한한 방탈출 | BangtalBoyBand',
    description: '인공지능이 실시간으로 생성하는 독창적인 방탈출 퍼즐 게임',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
        <body className={inter.className}>
        <Providers>
            <Navigation/>
            {children}
        </Providers>
        </body>
        </html>
    )
}