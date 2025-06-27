'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    User
} from 'firebase/auth'
import {auth, db, googleProvider} from '../lib/firebase'
import {collection, doc, getDocs, query, serverTimestamp, setDoc, where} from 'firebase/firestore'
import {useRouter} from 'next/navigation'
import {v4 as uuidv4} from 'uuid'

interface UserProfile {
    docId: string
    uid: string
    userId: string
    email: string
    nickname: string
    bio: string
    level: number
    points: number
    completedMaps: number
    createdMaps: number
    totalPlayTime: string
    winRate: string
    avgClearTime: string
    friendsCount: number
    createdAt: string
    followers?: string[]
    following?: string[]
    friends?: string[]
    blocked?: string[]
    userIdChangedAt?: any
    canChangeUserId?: boolean

    // 게임 데이터 필드
    Credits?: number
    Username?: string
    RegistrationDate?: any
    LastLoginDate?: any
    TotalPlayTime?: number
    LikedRooms?: string[]
    Preferences?: {
        SoundEnabled: boolean
        MusicVolume: number
        EffectsVolume: number
        MouseSensitivity: number
        Language: string
    }
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUpWithEmail: (email: string, password: string, nickname: string, userId: string) => Promise<void>
    signInWithGoogle: () => Promise<{ success: boolean; cancelled?: boolean } | undefined>
    logout: () => Promise<void>
    checkUserIdAvailability: (userId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithEmail: async () => {
    },
    signUpWithEmail: async () => {
    },
    signInWithGoogle: async () => undefined,
    logout: async () => {
    },
    checkUserIdAvailability: async () => false
})

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            setLoading(true)

            if (user) {
                try {
                    // uid로 사용자 정보 가져오기
                    const usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                    const querySnapshot = await getDocs(usersQuery)

                    // 사용자 정보가 없으면 에러 로그 기록
                    if (querySnapshot.empty) {
                        console.error('User document not found for uid:', user.uid)
                    }
                } catch (error) {
                    console.error('Error fetching user document:', error)
                }
            }

            setLoading(false)
        })

        return unsubscribe
    }, [])

    const checkUserIdAvailability = async (userId: string): Promise<boolean> => {
        try {
            const usersQuery = query(collection(db, 'User'), where('userId', '==', userId))
            const querySnapshot = await getDocs(usersQuery)
            return querySnapshot.empty
        } catch (error) {
            console.error('Error checking userId availability:', error)
            return false
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            // router.push를 제거하고 호출하는 쪽에서 처리하도록 함
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const signUpWithEmail = async (email: string, password: string, nickname: string, userId: string) => {
        try {
            // userId 중복 확인
            const isAvailable = await checkUserIdAvailability(userId)
            if (!isAvailable) {
                throw new Error('userId already exists')
            }

            const {user} = await createUserWithEmailAndPassword(auth, email, password)

            // 프로필 업데이트
            await updateProfile(user, {
                displayName: nickname
            })

            // 랜덤 UUID 생성 (문서 ID로 사용)
            const docId = uuidv4()

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, 'users', docId), {
                docId: docId,
                uid: user.uid,  // Firebase Auth UID (참조용)
                userId: userId,  // 사용자가 설정한 고유 ID
                email: user.email,
                nickname: nickname,
                bio: '',
                createdAt: new Date().toISOString(),
                RegistrationDate: serverTimestamp(),  // 게임 데이터와 호환
                LastLoginDate: serverTimestamp(),     // 게임 데이터와 호환

                // 기본 정보
                level: 1,
                points: 0,
                Credits: 100,                         // 게임 데이터와 호환
                Username: nickname,                   // 게임 데이터와 호환

                // 게임 통계
                completedMaps: 0,
                createdMaps: 0,
                totalPlayTime: '0시간',
                TotalPlayTime: 0,                     // 게임 데이터와 호환 (초 단위)
                winRate: '0%',
                avgClearTime: '00:00',
                friendsCount: 0,

                // 소셜
                followers: [],
                following: [],
                friends: [],
                blocked: [],
                LikedRooms: [],                       // 게임 데이터와 호환

                // 설정 및 환경설정
                Preferences: {                         // 게임 데이터와 호환
                    SoundEnabled: true,
                    MusicVolume: 0.5,
                    EffectsVolume: 0.7,
                    MouseSensitivity: 1,
                    Language: 'Ko'
                },

                // ID 관리
                userIdChangedAt: null,                // userId 변경 이력 (타임스탬프)
                canChangeUserId: true                  // userId 변경 가능 여부
            })

            // router.push를 제거하고 호출하는 쪽에서 처리하도록 함
        } catch (error) {
            console.error('Signup error:', error)
            throw error
        }
    }

    const signInWithGoogle = async () => {
        try {
            // 팝업 설정 추가
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            })

            const result = await signInWithPopup(auth, googleProvider)
            const {user} = result

            // 기존 사용자인지 확인 (uid로 검색)
            const usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
            const querySnapshot = await getDocs(usersQuery)

            if (querySnapshot.empty) {
                // 새 사용자라면 랜덤 userId로 계정 생성
                const docId = uuidv4()
                const randomUserId = `user_${uuidv4().substring(0, 8)}`

                await setDoc(doc(db, 'users', docId), {
                    docId: docId,
                    uid: user.uid,
                    userId: randomUserId,  // 구글 로그인 사용자는 랜덤 userId
                    email: user.email,
                    nickname: user.displayName || 'Player',
                    bio: '',
                    createdAt: new Date().toISOString(),
                    RegistrationDate: serverTimestamp(),  // 게임 데이터와 호환
                    LastLoginDate: serverTimestamp(),     // 게임 데이터와 호환

                    // 기본 정보
                    level: 1,
                    points: 0,
                    Credits: 100,                         // 게임 데이터와 호환
                    Username: user.displayName || 'Player', // 게임 데이터와 호환

                    // 게임 통계
                    completedMaps: 0,
                    createdMaps: 0,
                    totalPlayTime: '0시간',
                    TotalPlayTime: 0,                     // 게임 데이터와 호환 (초 단위)
                    winRate: '0%',
                    avgClearTime: '00:00',
                    friendsCount: 0,

                    // 소셜
                    followers: [],
                    following: [],
                    friends: [],
                    blocked: [],
                    LikedRooms: [],                       // 게임 데이터와 호환

                    // 설정 및 환경설정
                    Preferences: {                         // 게임 데이터와 호환
                        SoundEnabled: true,
                        MusicVolume: 0.5,
                        EffectsVolume: 0.7,
                        MouseSensitivity: 1,
                        Language: 'Ko'
                    },

                    // ID 관리
                    userIdChangedAt: null,
                    canChangeUserId: true  // 구글 로그인 사용자도 1회 변경 가능
                })
            }

            // router.push를 제거하고 성공 시그널만 반환
            return {success: true}
        } catch (error: any) {
            console.error('Google login error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            // 더 구체적인 에러 처리
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('로그인이 취소되었습니다.')
            } else if (error.code === 'auth/popup-blocked') {
                throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
            } else if (error.code === 'auth/unauthorized-domain') {
                throw new Error('승인되지 않은 도메인입니다.')
            } else if (error.code === 'auth/cancelled-popup-request') {
                // 이미 다른 팝업이 열려있는 경우 - 무시
                return {success: false, cancelled: true}
            }

            throw error
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }

    const value = {
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        checkUserIdAvailability
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}