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
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {useRouter} from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUpWithEmail: (email: string, password: string, nickname: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithEmail: async () => {
    },
    signUpWithEmail: async () => {
    },
    signInWithGoogle: async () => {
    },
    logout: async () => {
    }
})

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/')
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const signUpWithEmail = async (email: string, password: string, nickname: string) => {
        try {
            const {user} = await createUserWithEmailAndPassword(auth, email, password)

            // 프로필 업데이트
            await updateProfile(user, {
                displayName: nickname
            })

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                nickname: nickname,
                createdAt: new Date().toISOString(),
                level: 1,
                points: 0,
                completedMaps: 0
            })

            router.push('/auth/login')
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

            const {user} = await signInWithPopup(auth, googleProvider)

            // 기존 사용자인지 확인
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (!userDoc.exists()) {
                // 새 사용자라면 Firestore에 정보 저장
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    nickname: user.displayName || 'Player',
                    createdAt: new Date().toISOString(),
                    level: 1,
                    points: 0,
                    completedMaps: 0
                })
            }

            router.push('/')
        } catch (error: any) {
            console.error('Google login error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            // 더 구체적인 에러 처리
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('사용자가 팝업을 닫았습니다.')
            } else if (error.code === 'auth/popup-blocked') {
                console.log('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
            } else if (error.code === 'auth/unauthorized-domain') {
                console.error('승인되지 않은 도메인입니다. Firebase Console에서 도메인을 추가해주세요.')
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
        logout
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