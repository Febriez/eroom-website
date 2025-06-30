export const CONSTANTS = {
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