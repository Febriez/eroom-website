'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {SocialService, UserService} from '@/lib/firebase/services'
import type {User} from '@/lib/firebase/types'
import {Unsubscribe} from 'firebase/firestore'

interface ProfileContextType {
    profileUser: User | null
    loading: boolean
    isOwnProfile: boolean
    isFriend: boolean
    isFollowing: boolean
    isBlocked: boolean
    socialLoading: boolean
    updateProfileUser: (username: string) => Promise<void>
    updateUserProfile: (data: Partial<User>) => Promise<void>
    handleFollowToggle: () => Promise<void>
    handleFriendToggle: () => Promise<void>
    handleBlockToggle: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType)

export function ProfileProvider({children}: { children: React.ReactNode }) {
    const {user: currentUser, updateUserProfile: updateCurrentUserProfile} = useAuth()
    const [profileUser, setProfileUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isFriend, setIsFriend] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false)
    const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | null>(null)

    const isOwnProfile = currentUser?.uid === profileUser?.uid

    // 소셜 관계 상태 업데이트
    useEffect(() => {
        if (profileUser && currentUser && currentUser.uid !== profileUser.uid) {
            setIsFriend(profileUser.social.friends.includes(currentUser.uid))
            setIsFollowing(currentUser.social?.following?.includes(profileUser.uid) || false)
            setIsBlocked(currentUser.social?.blocked?.includes(profileUser.uid) || false)
        }
    }, [profileUser, currentUser])

    // 현재 사용자 변경 시 소셜 관계 재확인
    useEffect(() => {
        if (profileUser && currentUser && !isOwnProfile) {
            // 현재 사용자의 following 목록이 변경되었을 때 isFollowing 상태 업데이트
            setIsFollowing(currentUser.social?.following?.includes(profileUser.uid) || false)
            setIsBlocked(currentUser.social?.blocked?.includes(profileUser.uid) || false)
        }
    }, [currentUser?.social.following, currentUser?.social.blocked, profileUser?.uid, isOwnProfile])

    // 프로필 사용자 정보 구독
    const updateProfileUser = async (username: string) => {
        setLoading(true)

        // 이전 구독 해제
        if (unsubscribe) {
            unsubscribe()
        }

        try {
            // 먼저 username으로 사용자 찾기
            const user = await UserService.getUserByUsername(username)

            if (user) {
                // 실시간 구독 설정
                const unsub = UserService.subscribeToUser(user.uid, (updatedUser) => {
                    if (updatedUser) {
                        setProfileUser(updatedUser)

                        // 소셜 관계 확인
                        if (currentUser && currentUser.uid !== updatedUser.uid) {
                            setIsFriend(updatedUser.social.friends.includes(currentUser.uid))
                            setIsFollowing(currentUser.social?.following?.includes(updatedUser.uid) || false)
                            setIsBlocked(currentUser.social?.blocked?.includes(updatedUser.uid) || false)
                        }
                    }
                })

                setUnsubscribe(() => unsub)
            } else {
                setProfileUser(null)
            }
        } catch (error) {
            console.error('Error fetching user:', error)
            setProfileUser(null)
        } finally {
            setLoading(false)
        }
    }

    // 컴포넌트 언마운트 시 구독 해제
    useEffect(() => {
        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [unsubscribe])

    // 사용자 프로필 업데이트
    const updateUserProfile = async (data: Partial<User>) => {
        if (!profileUser || !currentUser) return

        try {
            await UserService.updateUser(profileUser.id, data)

            // 본인 프로필인 경우 AuthContext도 업데이트
            if (isOwnProfile) {
                await updateCurrentUserProfile(data)
            }

            // 상태는 실시간 리스너가 자동으로 업데이트
        } catch (error) {
            console.error('Error updating profile:', error)
            throw error
        }
    }

    // 팔로우/언팔로우
    const handleFollowToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return

        setSocialLoading(true)
        try {
            if (isFollowing) {
                await SocialService.unfollowUser(currentUser.uid, profileUser.uid)
                // 낙관적 업데이트
                setIsFollowing(false)

                // 현재 사용자의 following 목록 업데이트
                await updateCurrentUserProfile({
                    social: {
                        ...currentUser.social,
                        following: currentUser.social.following.filter(id => id !== profileUser.uid)
                    }
                })
            } else {
                await SocialService.followUser(currentUser.uid, profileUser.uid)
                // 낙관적 업데이트
                setIsFollowing(true)

                // 현재 사용자의 following 목록 업데이트
                await updateCurrentUserProfile({
                    social: {
                        ...currentUser.social,
                        following: [...currentUser.social.following, profileUser.uid]
                    }
                })
            }
        } catch (error) {
            console.error('Follow toggle error:', error)
            // 에러 발생 시 상태 롤백
            setIsFollowing(!isFollowing)
            alert('오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    // 친구 요청/제거
    const handleFriendToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return

        setSocialLoading(true)
        try {
            if (isFriend) {
                await SocialService.removeFriend(currentUser.uid, profileUser.uid)
                // 낙관적 업데이트
                setIsFriend(false)

                // 친구 목록 업데이트
                await updateCurrentUserProfile({
                    social: {
                        ...currentUser.social,
                        friends: currentUser.social.friends.filter(id => id !== profileUser.uid),
                        friendCount: Math.max(0, (currentUser.social.friendCount || 0) - 1)
                    }
                })
            } else {
                await SocialService.sendFriendRequest(
                    {
                        uid: currentUser.uid,
                        username: currentUser.username || '',
                        displayName: currentUser.displayName || ''
                    },
                    {
                        uid: profileUser.uid,
                        username: profileUser.username,
                        displayName: profileUser.displayName
                    }
                )
                alert('친구 요청을 보냈습니다.')
            }
        } catch (error: any) {
            console.error('Friend toggle error:', error)
            // 에러 발생 시 상태 롤백
            setIsFriend(!isFriend)
            alert(error.message || '오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    // 차단/차단해제
    const handleBlockToggle = async () => {
        if (!currentUser || !profileUser || socialLoading) return

        const confirmMessage = isBlocked
            ? '이 사용자를 차단 해제하시겠습니까?'
            : '이 사용자를 차단하시겠습니까? 차단하면 서로 메시지를 보낼 수 없습니다.'

        if (!confirm(confirmMessage)) return

        setSocialLoading(true)
        try {
            const updatedBlocked = isBlocked
                ? currentUser.social.blocked.filter(id => id !== profileUser.uid)
                : [...(currentUser.social.blocked || []), profileUser.uid]

            await UserService.updateUser(currentUser.uid, {
                social: {
                    ...currentUser.social,
                    blocked: updatedBlocked
                }
            })

            // 낙관적 업데이트
            setIsBlocked(!isBlocked)

            // AuthContext 업데이트
            await updateCurrentUserProfile({
                social: {
                    ...currentUser.social,
                    blocked: updatedBlocked
                }
            })
        } catch (error) {
            console.error('Block toggle error:', error)
            // 에러 발생 시 상태 롤백
            setIsBlocked(!isBlocked)
            alert('오류가 발생했습니다.')
        } finally {
            setSocialLoading(false)
        }
    }

    const value = {
        profileUser,
        loading,
        isOwnProfile,
        isFriend,
        isFollowing,
        isBlocked,
        socialLoading,
        updateProfileUser,
        updateUserProfile,
        handleFollowToggle,
        handleFriendToggle,
        handleBlockToggle
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext)
}