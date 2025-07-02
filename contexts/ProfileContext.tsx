'use client'

import React, {createContext, useContext, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {SocialService, UserService} from '@/lib/firebase/services'
import type {User} from '@/lib/firebase/types'

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

    const isOwnProfile = currentUser?.uid === profileUser?.uid

    // 프로필 사용자 정보 업데이트
    const updateProfileUser = async (username: string) => {
        setLoading(true)
        try {
            const user = await UserService.getUserByUsername(username)
            setProfileUser(user)

            // 소셜 관계 확인
            if (user && currentUser && currentUser.uid !== user.uid) {
                setIsFriend(user.social.friends.includes(currentUser.uid))
                setIsFollowing(currentUser.social?.following?.includes(user.uid) || false)
                setIsBlocked(currentUser.social?.blocked?.includes(user.uid) || false)
            }
        } catch (error) {
            console.error('Error fetching user:', error)
            setProfileUser(null)
        } finally {
            setLoading(false)
        }
    }

    // 사용자 프로필 업데이트
    const updateUserProfile = async (data: Partial<User>) => {
        if (!profileUser || !currentUser) return

        try {
            await UserService.updateUser(profileUser.id, data)
            setProfileUser({...profileUser, ...data})

            if (isOwnProfile) {
                await updateCurrentUserProfile(data)
            }
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
                setIsFollowing(false)
            } else {
                await SocialService.followUser(currentUser.uid, profileUser.uid)
                setIsFollowing(true)
            }
        } catch (error) {
            console.error('Follow toggle error:', error)
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
                setIsFriend(false)
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

            setIsBlocked(!isBlocked)
        } catch (error) {
            console.error('Block toggle error:', error)
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