// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // PWA 및 알림을 위한 헤더 설정
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/manifest+json',
                    },
                ],
            },
        ]
    },

    // 이미지 도메인 설정 (필요한 경우)
    images: {
        domains: [
            'firebasestorage.googleapis.com', // Firebase Storage
            'lh3.googleusercontent.com', // Google 프로필 이미지
        ],
    },
};

export default nextConfig;