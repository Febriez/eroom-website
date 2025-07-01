'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth'
import {auth, db, googleProvider} from '@/lib/firebase/config'
import {UserService} from '@/lib/firebase/services'
import {validateUsername} from '@/lib/validators'
import {doc, serverTimestamp, setDoc, Timestamp} from 'firebase/firestore'
import {COLLECTIONS} from '@/lib/firebase/collections'
import {useRouter} from 'next/navigation'
import type {User} from '@/lib/firebase/types'

interface AuthContextType {
    firebaseUser: FirebaseUser | null
    user: User | null
    loading: boolean
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUpWithEmail: (email: string, password: string, displayName: string, username: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    checkUsernameAvailability: (username: string) => Promise<boolean>
    resetPassword: (email: string) => Promise<void>
    updateUserProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Firestore에서 사용자 정보를 가져오는 함수
    const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
        try {
            const userData = await UserService.getUserById(firebaseUser.uid)
            setUser(userData)
            return userData
        } catch (error) {
            console.error('Error fetching user data:', error)
            return null
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser)

            if (firebaseUser) {
                await fetchUserData(firebaseUser)
            } else {
                setUser(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const checkUsernameAvailability = async (username: string): Promise<boolean> => {
        try {
            const existingUser = await UserService.getUserByUsername(username)
            return !existingUser
        } catch (error) {
            console.error('Error checking username availability:', error)
            return false
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const {user: firebaseUser} = await signInWithEmailAndPassword(auth, email, password)

            // 로그인 즉시 사용자 정보 가져오기
            const userData = await fetchUserData(firebaseUser)

            if (userData) {
                // 로그인 시간 업데이트
                await UserService.updateUser(userData.id, {
                    lastLoginAt: serverTimestamp() as any
                })

                // 상태 다시 업데이트 (Timestamp 유지)
                const updatedUser = {
                    ...userData,
                    lastLoginAt: Timestamp.now()
                }
                setUser(updatedUser)
            }

            // 사용자 정보가 완전히 로드될 때까지 대기
            await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const signUpWithEmail = async (
        email: string,
        password: string,
        displayName: string,
        username: string
    ) => {
        try {
            // 닉네임 검증
            const displayNameValidation = validateUsername(displayName)
            if (!displayNameValidation.isValid) {
                throw new Error(displayNameValidation.error)
            }

            // username 중복 확인
            const isAvailable = await checkUsernameAvailability(username)
            if (!isAvailable) {
                throw new Error('이미 사용 중인 사용자명입니다.')
            }

            const {user: firebaseUser} = await createUserWithEmailAndPassword(auth, email, password)

            // Firebase Auth 프로필 업데이트
            await updateProfile(firebaseUser, {displayName})

            // Firestore에 사용자 정보 저장
            const userId = firebaseUser.uid // Firebase Auth UID를 그대로 사용
            const newUser: User = {
                id: userId,
                uid: firebaseUser.uid,
                username,
                email: firebaseUser.email!,
                displayName,
                level: 1,
                points: 0,
                credits: 100,
                stats: {
                    mapsCompleted: 0,
                    mapsCreated: 0,
                    totalPlayTime: 0,
                    winRate: 0,
                    avgClearTime: 0,
                    achievements: []
                },
                social: {
                    followers: [],
                    following: [],
                    friends: [],
                    blocked: [],
                    friendCount: 0
                },
                settings: {
                    privacy: {
                        showProfile: true,
                        showStats: true,
                        showFriends: true,
                        showActivity: true,
                        allowMessages: true,
                        allowFriendRequests: true
                    },
                    preferences: {
                        soundEnabled: true,
                        musicVolume: 0.5,
                        effectsVolume: 0.7,
                        mouseSensitivity: 1,
                        language: 'ko',
                        theme: 'dark'
                    },
                    notifications: {
                        friendRequests: true,
                        messages: true,
                        gameInvites: true,
                        achievements: true,
                        updates: true,
                        marketing: false
                    }
                },
                role: 'user',
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any,
                lastLoginAt: serverTimestamp() as any,
                canChangeUsername: false
            }

            await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser)

            // 생성한 사용자 정보를 즉시 상태에 반영
            setUser({
                ...newUser,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                lastLoginAt: Timestamp.now()
            })

        } catch (error) {
            console.error('Signup error:', error)
            throw error
        }
    }

    const signInWithGoogle = async () => {
        try {
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            })

            const result = await signInWithPopup(auth, googleProvider)
            const {user: firebaseUser} = result

            // 기존 사용자인지 확인
            let userData = await UserService.getUserById(firebaseUser.uid)

            if (!userData) {
                // 새 사용자라면 랜덤 username으로 계정 생성
                const userId = firebaseUser.uid
                const baseUsername = firebaseUser.email?.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user'
                let username = baseUsername
                let counter = 1

                // 중복되지 않는 username 찾기
                while (await UserService.getUserByUsername(username)) {
                    username = `${baseUsername}${counter}`
                    counter++
                }

                // displayName 검증 및 조정
                let displayName = firebaseUser.displayName || 'Player'
                const displayNameValidation = validateUsername(displayName)
                if (!displayNameValidation.isValid) {
                    // 기본값 사용
                    displayName = 'Player'
                }

                const newUser: User = {
                    id: userId,
                    uid: firebaseUser.uid,
                    username: username,
                    email: firebaseUser.email!,
                    displayName: displayName,
                    avatarUrl: firebaseUser.photoURL || undefined,
                    level: 1,
                    points: 0,
                    credits: 150, // 구글 가입 보너스
                    stats: {
                        mapsCompleted: 0,
                        mapsCreated: 0,
                        totalPlayTime: 0,
                        winRate: 0,
                        avgClearTime: 0,
                        achievements: []
                    },
                    social: {
                        followers: [],
                        following: [],
                        friends: [],
                        blocked: [],
                        friendCount: 0
                    },
                    settings: {
                        privacy: {
                            showProfile: true,
                            showStats: true,
                            showFriends: true,
                            showActivity: true,
                            allowMessages: true,
                            allowFriendRequests: true
                        },
                        preferences: {
                            soundEnabled: true,
                            musicVolume: 0.5,
                            effectsVolume: 0.7,
                            mouseSensitivity: 1,
                            language: 'ko',
                            theme: 'dark'
                        },
                        notifications: {
                            friendRequests: true,
                            messages: true,
                            gameInvites: true,
                            achievements: true,
                            updates: true,
                            marketing: false
                        }
                    },
                    role: 'user',
                    createdAt: serverTimestamp() as any,
                    updatedAt: serverTimestamp() as any,
                    lastLoginAt: serverTimestamp() as any,
                    canChangeUsername: true
                }

                await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser)

                // 생성한 사용자 정보를 즉시 상태에 반영
                setUser({
                    ...newUser,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    lastLoginAt: Timestamp.now()
                })
            } else {
                // 기존 사용자라면 로그인 시간만 업데이트
                await UserService.updateUser(userData.id, {
                    lastLoginAt: serverTimestamp() as any
                })

                // 상태 업데이트
                setUser({
                    ...userData,
                    lastLoginAt: Timestamp.now()
                })
            }

            // 상태가 완전히 업데이트될 때까지 대기
            await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error: any) {
            console.error('Google login error:', error)

            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('로그인이 취소되었습니다.')
            } else if (error.code === 'auth/popup-blocked') {
                throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
            }

            throw error
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null)
            setFirebaseUser(null)

            // 로그아웃 후 메인 페이지로 이동하고 새로고침
            router.push('/')

            // 상태가 완전히 정리될 때까지 약간의 지연 후 새로고침
            setTimeout(() => {
                router.refresh()
                // 또는 완전한 페이지 새로고침을 원한다면:
                // window.location.href = '/'
            }, 100)
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (error) {
            console.error('Password reset error:', error)
            throw error
        }
    }

    const updateUserProfile = async (data: Partial<User>) => {
        if (!user) throw new Error('User not found')

        try {
            // 닉네임 변경 시 검증
            if (data.displayName) {
                const validation = validateUsername(data.displayName)
                if (!validation.isValid) {
                    throw new Error(validation.error)
                }
            }

            await UserService.updateUser(user.id, data)

            // 상태 즉시 업데이트
            const updatedUser = {...user, ...data}
            setUser(updatedUser)
        } catch (error) {
            console.error('Error updating user profile:', error)
            throw error
        }
    }

    const value = {
        firebaseUser,
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        checkUsernameAvailability,
        resetPassword,
        updateUserProfile
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