export const CONSTANTS = {
    // 회사 정보
    COMPANY: {
        NAME: '주식회사 이룸',
        NAME_EN: 'EROOM',
        SLOGAN: 'AI, 방탈출의 지도를 새로 그리다',
        BRAND: 'BangtalBoyBand',
        ADDRESS: '서울특별시 강남구 테헤란로 123',
        MAIN_PHONE: '02-1234-5678',
        MAIN_EMAIL: 'bangtal@bangtal.com',
        CUSTOMER_SUPPORT_PHONE: '1588-1234',
        CUSTOMER_SUPPORT_HOURS: '평일 10:00 - 18:00 (점심시간 12:30 - 13:30, 주말 및 공휴일 제외)',
        RECRUITER_EMAIL: 'recruit@bangtal.com'
    },

    // 법적 정보
    LEGAL: {
        PRIVACY_OFFICER: {
            NAME: '김도형',
            POSITION: '정보보호팀장',
            EMAIL: 'mrdos123@bangtal.com',
            PHONE: '010-1357-2468'
        },
        TERMS_CONTACT: {
            EMAIL: 'bangcontact@bangtal.com',
            ADDRESS: '서울특별시 강남구 테헤란로 123',
            PHONE: '02-1234-5678'
        },
        COOKIES_CONTACT: {
            EMAIL: 'bangcookie@bangtal.com',
            PHONE: '02-2468-1357'
        }
    },

    // 게임 정보
    GAME_INFO: {
        NAME: 'EROOM',
        DEVELOPER: '주식회사 이룸',
        RELEASE_DATE: '2025년 7월 7일',
        PLATFORM: 'Windows PC',
        SYSTEM_REQUIREMENTS: {
            MINIMUM: {
                OS: 'Windows 10 (64-bit)',
                PROCESSOR: 'Intel Core i5-6600 또는 AMD Ryzen 5 1600',
                MEMORY: '8 GB RAM',
                GRAPHICS: 'NVIDIA GeForce GTX 1060 3GB 또는 AMD Radeon RX 580 4GB',
                STORAGE: '20 GB 사용 가능 공간'
            },
            RECOMMENDED: {
                OS: 'Windows 11 (64-bit)',
                PROCESSOR: 'Intel Core i5-11400F 또는 AMD Ryzen 5 5600X',
                MEMORY: '16 GB RAM',
                GRAPHICS: 'NVIDIA GeForce RTX 3060 또는 AMD Radeon RX 6600 XT',
                STORAGE: '20 GB 사용 가능 공간 (SSD 권장)'
            }
        }
    },

    // 커뮤니티 링크
    COMMUNITY_LINKS: {
        DISCORD: 'https://discord.gg/eroom-official',
        REDDIT: 'https://www.reddit.com/r/EROOM_Official/',
        YOUTUBE: 'https://www.youtube.com/@EROOM_Official',
        TWITCH: 'https://www.twitch.tv/eroom_official'
    },

    // SEO 정보
    SEO: {
        TITLE: 'EROOM | AI가 만드는 무한의 방탈출',
        DESCRIPTION: '매번 플레이할 때마다 AI가 실시간으로 새로운 맵을 생성하는 방탈출 게임, EROOM을 경험해 보세요. 친구와 함께 협동하고, 직접 맵을 만들어 전 세계 유저와 공유할 수도 있습니다.',
        KEYWORDS: '이룸, EROOM, AI 방탈출, 방탈출 게임, 실시간 맵 생성, AI 게임, 멀티플레이 방탈출, 협동 게임, 맵 제작, 유저 생성 콘텐츠, 퍼즐 게임, 인디 게임',
        AUTHOR: '주식회사 이룸',
        URL: 'https://eroom-website.vercel.app'
    },

    // 게임 관련
    GAME: {
        MAX_PLAYERS_PER_ROOM: 4,
        MIN_MAP_NAME_LENGTH: 3,
        MAX_MAP_NAME_LENGTH: 50,
        DIFFICULTIES: ['easy', 'normal', 'hard', 'extreme'] as const,
        THEMES: [
            'medieval',
            'sci-fi',
            'horror',
            'fantasy',
            'modern',
            'ancient',
            'underwater',
            'space',
            'jungle',
            'arctic'
        ] as const
    },

    // 소셜 관련
    SOCIAL: {
        MAX_FRIENDS: 500,
        MAX_MESSAGE_LENGTH: 1000,
        MAX_BIO_LENGTH: 200,
        NOTIFICATION_TYPES: [
            'friend_request',
            'message',
            'game_invite',
            'achievement',
            'system'
        ] as const
    },

    // UI 관련
    UI: {
        ITEMS_PER_PAGE: 20,
        TOAST_DURATION: 3000,
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300
    },

    // 스토어 관련
    STORE: {
        CURRENCIES: {
            KRW: '₩',
            USD: '$',
            EUR: '€'
        },
        ITEM_RARITIES: ['common', 'rare', 'epic', 'legendary'] as const,
        RARITY_COLORS: {
            common: 'gray',
            rare: 'blue',
            epic: 'purple',
            legendary: 'orange'
        }
    },

    // 에러 메시지
    ERRORS: {
        NETWORK: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        UNAUTHORIZED: '권한이 없습니다.',
        NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
        SERVER: '서버 오류가 발생했습니다.',
        VALIDATION: '입력값을 확인해주세요.'
    }
}