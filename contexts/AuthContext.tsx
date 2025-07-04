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
import {validateDisplayName} from '@/lib/utils/validators'
import {doc, serverTimestamp, setDoc, Unsubscribe} from 'firebase/firestore'
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

// 알림 권한 요청 함수
const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        return
    }

    // 이미 권한이 있거나 거부된 경우 요청하지 않음
    if (Notification.permission !== 'default') {
        return
    }

    try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            console.log('알림 권한이 허용되었습니다.')
        }
    } catch (error) {
        console.error('알림 권한 요청 중 오류:', error)
    }
}

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [userUnsubscribe, setUserUnsubscribe] = useState<Unsubscribe | null>(null)
    const [hasRequestedPermission, setHasRequestedPermission] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser)

            // 이전 사용자 구독 해제
            if (userUnsubscribe) {
                userUnsubscribe()
                setUserUnsubscribe(null)
            }

            if (firebaseUser) {
                // 실시간 구독 설정
                const unsub = UserService.subscribeToUser(firebaseUser.uid, (userData) => {
                    setUser(userData)

                    // 로그인한 사용자에게 한 번만 알림 권한 요청
                    if (userData && !hasRequestedPermission) {
                        // 브라우저 알림이 활성화된 사용자만 권한 요청
                        const browserNotificationsEnabled = userData.settings?.notifications?.browser !== false

                        if (browserNotificationsEnabled) {
                            // 3초 후에 권한 요청 (사용자가 페이지에 적응할 시간)
                            setTimeout(() => {
                                requestNotificationPermission()
                                setHasRequestedPermission(true)
                            }, 3000)
                        }
                    }
                })
                setUserUnsubscribe(() => unsub)
            } else {
                setUser(null)
                setHasRequestedPermission(false)
            }

            setLoading(false)
        })

        return () => {
            unsubscribe()
            if (userUnsubscribe) {
                userUnsubscribe()
            }
        }
    }, [hasRequestedPermission])

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

            // 로그인 시간 업데이트
            await UserService.updateUser(firebaseUser.uid, {
                lastLoginAt: serverTimestamp() as any
            })

            // 상태 업데이트는 실시간 리스너가 처리
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
            // 닉네임(displayName) 검증
            const displayNameValidation = validateDisplayName(displayName)
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
            const userId = firebaseUser.uid
            const newUser: User = {
                uid: userId,
                email: firebaseUser.email!,
                displayName,
                username,
                level: 1,
                exp: 0,
                points: 0,
                credits: 100,
                stats: {
                    totalPlays: 0,
                    successRate: 0,
                    fastestTime: 0,
                    averageTime: 0,
                    hintsUsed: 0,
                    perfectClears: 0,
                    achievements: 0,
                    createdRooms: 0
                },
                social: {
                    followers: [],
                    following: [],
                    friends: [],
                    friendCount: 0,
                    blockedUsers: [],
                    blockedBy: []
                },
                settings: {
                    theme: 'dark',
                    notifications: {
                        browser: true,
                        email: true,
                        friendRequests: true,
                        messages: true,
                        achievements: true
                    },
                    privacy: {
                        profileVisibility: 'public',
                        showOnlineStatus: true,
                        allowFriendRequests: true,
                        allowMessages: true
                    }
                },
                inventory: {
                    items: {},
                    activeBoosts: [],
                    activeThemes: []
                },
                role: 'user',
                status: 'active',
                canChangeUsername: false,
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any,
                lastLoginAt: serverTimestamp() as any
            }

            await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser)

            // 상태 업데이트는 실시간 리스너가 처리

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

                // displayName 설정 - 이메일 앞부분 사용
                let displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player'

                // displayName 유효성 검증 (validateDisplayName 사용)
                const displayNameValidation = validateDisplayName(displayName)
                if (!displayNameValidation.isValid) {
                    // 이메일 앞부분 사용 시도
                    displayName = firebaseUser.email?.split('@')[0] || 'Player'

                    // 그래도 유효하지 않으면 기본값 사용
                    const secondValidation = validateDisplayName(displayName)
                    if (!secondValidation.isValid) {
                        displayName = 'Player'
                    }
                }

                const newUser: User = {
                    uid: userId,
                    email: firebaseUser.email!,
                    displayName: displayName,
                    username: username,
                    avatarUrl: firebaseUser.photoURL || undefined,
                    level: 1,
                    exp: 0,
                    points: 0,
                    credits: 150,
                    stats: {
                        totalPlays: 0,
                        successRate: 0,
                        fastestTime: 0,
                        averageTime: 0,
                        hintsUsed: 0,
                        perfectClears: 0,
                        achievements: 0,
                        createdRooms: 0
                    },
                    social: {
                        followers: [],
                        following: [],
                        friends: [],
                        friendCount: 0,
                        blockedUsers: [],
                        blockedBy: []
                    },
                    settings: {
                        theme: 'dark',
                        notifications: {
                            browser: true,
                            email: true,
                            friendRequests: true,
                            messages: true,
                            achievements: true
                        },
                        privacy: {
                            profileVisibility: 'public',
                            showOnlineStatus: true,
                            allowFriendRequests: true,
                            allowMessages: true
                        }
                    },
                    inventory: {
                        items: {},
                        activeBoosts: [],
                        activeThemes: []
                    },
                    role: 'user',
                    status: 'active',
                    canChangeUsername: true,
                    createdAt: serverTimestamp() as any,
                    updatedAt: serverTimestamp() as any,
                    lastLoginAt: serverTimestamp() as any
                }

                await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser)
            } else {
                // 기존 사용자라면 로그인 시간만 업데이트
                await UserService.updateUser(userData.uid, {
                    lastLoginAt: serverTimestamp() as any
                })
            }

            // 상태 업데이트는 실시간 리스너가 처리
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
            // 구독 해제
            if (userUnsubscribe) {
                userUnsubscribe()
                setUserUnsubscribe(null)
            }

            await signOut(auth)
            setUser(null)
            setFirebaseUser(null)
            setHasRequestedPermission(false)

            router.push('/')
            setTimeout(() => {
                router.refresh()
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
                const validation = validateDisplayName(data.displayName)
                if (!validation.isValid) {
                    throw new Error(validation.error)
                }
            }

            await UserService.updateUser(user.uid, {
                ...data,
                updatedAt: serverTimestamp() as any
            })

            // 낙관적 업데이트 (실시간 리스너가 곧 업데이트할 것)
            setUser({...user, ...data})
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