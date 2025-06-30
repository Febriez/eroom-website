import './globals.css';
import { Metadata } from 'next';
import { Providers } from './providers';
import React from "react";

export const metadata: Metadata = {
  title: '게임 커뮤니티',
  description: '게이머들을 위한 커뮤니티 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Providers>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}