/**
 * Firebase 설정 검증 유틸리티
 * 환경 변수가 올바르게 설정되었는지 확인
 */

interface FirebaseConfigValidation {
    isValid: boolean
    missingVars: string[]
    warnings: string[]
}

export function validateFirebaseConfig(): FirebaseConfigValidation {
    const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const optionalVars = [
        'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
        'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
    ]

    const missingVars: string[] = []
    const warnings: string[] = []

    // 필수 환경 변수 확인
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName)
        }
    })

    // 선택적 환경 변수 확인
    optionalVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(`Optional variable ${varName} is not set`)
        }
    })

    // 개발 환경에서만 경고 출력
    if (process.env.NODE_ENV === 'development') {
        if (missingVars.length > 0) {
            console.error('🔥 Firebase configuration error:')
            console.error('Missing required environment variables:', missingVars)
            console.error('Please check your .env.local file')
        }

        if (warnings.length > 0) {
            console.warn('⚠️  Firebase configuration warnings:')
            warnings.forEach(warning => console.warn(warning))
        }
    }

    return {
        isValid: missingVars.length === 0,
        missingVars,
        warnings
    }
}

// 설정 값 포맷 검증
export function validateFirebaseConfigFormat(): boolean {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    // API 키 형식 확인 (일반적으로 39자)
    if (apiKey && apiKey.length !== 39) {
        console.warn('Firebase API key length seems incorrect')
    }

    // Project ID 형식 확인 (소문자, 숫자, 하이픈만 허용)
    if (projectId && !/^[a-z0-9-]+$/.test(projectId)) {
        console.warn('Firebase project ID format seems incorrect')
    }

    return true
}