import {initializeApp} from 'firebase/app'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

// Firebase 설정 - 실제 프로젝트의 설정으로 교체해주세요
const firebaseConfig = {
    apiKey: "AIzaSyC4_ylHAexqsVFY37R1AbuvYV7M6amIe6k",
    authDomain: "eroom-e6659.firebaseapp.com",
    databaseURL: "https://eroom-e6659-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "eroom-e6659",
    storageBucket: "eroom-e6659.firebasestorage.app",
    messagingSenderId: "923480975983",
    appId: "1:923480975983:web:64a101e783aa40dadbfb9a",
    measurementId: "G-0BGB493KS1"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Auth 인스턴스
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Firestore 인스턴스
export const db = getFirestore(app)

export default app