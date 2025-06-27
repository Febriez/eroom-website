import {initializeApp} from 'firebase/app'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {validateFirebaseConfig} from './firebase-config-validator'

// 개발 환경에서 Firebase 설정 검증
if (process.env.NODE_ENV === 'development') {
    const validation = validateFirebaseConfig()
    if (!validation.isValid) {
        console.error('Firebase initialization may fail due to missing environment variables')
    }
}

// Firebase 설정 - 환경 변수에서 가져오기
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Firebase 초기화
console.log('Initializing Firebase with projectId:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized successfully');

// Auth 인스턴스
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Firestore 인스턴스
export const db = getFirestore(app)

// Storage 인스턴스
export const storage = getStorage(app)

export default app