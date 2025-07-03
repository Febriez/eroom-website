'use client'

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {SocialService, UserService} from '@/lib/firebase/services'
import type {FriendRequest, User} from '@/lib/firebase/types'
import {serverTimestamp, Unsubscribe} from 'firebase/firestore'
import {COLLECTIONS} from "@/lib/firebase/collections";

interface ProfileContextType {
    profileUser: User | null
    loading: boolean
    isOwnProfile: boolean
    isFriend: boolean
    isFollowing: boolean
    isBlocked: boolean
    hasPendingRequest: boolean
    receivedRequest: boolean
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
    const [hasPendingRequest, setHasPendingRequest] = useState(false)
    const [receivedRequest, setReceivedRequest] = useState(false)

    const isOwnProfile = currentUser?.uid === profileUser?.uid

    // 친구 요청 상태 확인
    const checkFriendRequestStatus = useCallback(async (currentUserId: string, targetUserId: string) => {
        try {
            // 내가 보낸 요청이 있는지 확인
            const sentRequest = await SocialService.getPendingRequestToUser(currentUserId, targetUserId)
            setHasPendingRequest(!!sentRequest)

            // 내가 받은 요청이 있는지 확인
            const receivedReq = await SocialService.getPendingRequestFromUser(currentUserId, targetUserId)
            setReceivedRequest(!!receivedReq)
        } catch (error) {
            console.error('Error checking friend request status:', error)
        }
    }, [])

    // 소셜 관계 상태 업데이트
    useEffect(() => {
        if (profileUser && currentUser && currentUser.uid !== profileUser.uid) {
            setIsFriend(profileUser.social.friends.includes(currentUser.uid))
            setIsFollowing(currentUser.social?.following?.includes(profileUser.uid) || false)
            setIsBlocked(currentUser.social?.blocked?.includes(profileUser.uid) || false)

            // 친구 요청 상태 확인
            checkFriendRequestStatus(currentUser.uid, profileUser.uid)
        }
    }, [profileUser, currentUser, checkFriendRequestStatus])

    // 현재 사용자 변경 시 소셜 관계 재확인
    useEffect(() => {
        if (profileUser && currentUser && !isOwnProfile) {
            // 현재 사용자의 following 목록이 변경되었을 때 isFollowing 상태 업데이트
            setIsFollowing(currentUser.social?.following?.includes(profileUser.uid) || false)
            setIsBlocked(currentUser.social?.blocked?.includes(profileUser.uid) || false)
        }
    }, [currentUser?.social.following, currentUser?.social.blocked, profileUser?.uid, isOwnProfile])

    // 프로필 사용자 정보 구독
    const updateProfileUser = useCallback(async (username: string) => {
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

                            // 친구 요청 상태 확인
                            checkFriendRequestStatus(currentUser.uid, updatedUser.uid)
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
    }, [currentUser, unsubscribe, checkFriendRequestStatus])

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
            await UserService.updateUser(profileUser.id, {
                ...data,
                updatedAt: serverTimestamp() as any
            })

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
                // 친구 제거
                if (!confirm(`${profileUser.displayName}님을 친구 목록에서 제거하시겠습니까?`)) {
                    setSocialLoading(false)
                    return
                }

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
            } else if (receivedRequest) {
                // 받은 요청이 있으면 수락 여부 묻기
                alert('이 사용자로부터 친구 요청을 받았습니다. 알림에서 확인해주세요.')
            } else if (hasPendingRequest) {
                // 이미 요청을 보낸 상태 - 취소 여부 확인
                if (confirm('이미 친구 요청을 보냈습니다. 친구 요청을 취소하시겠습니까?')) {
                    // 보낸 요청 찾기
                    const pendingRequest = await SocialService.getPendingRequestToUser(currentUser.uid, profileUser.uid)

                    if (pendingRequest) {
                        // 요청 상태 재확인
                        const requestDoc = await SocialService.getDocument<FriendRequest>(COLLECTIONS.FRIEND_REQUESTS, pendingRequest.id)

                        if (!requestDoc || requestDoc.status !== 'pending') {
                            // 이미 처리된 요청
                            if (requestDoc?.status === 'accepted') {
                                alert('상대방이 이미 친구 요청을 수락했습니다.')
                                // 친구 상태로 업데이트
                                setIsFriend(true)
                                setHasPendingRequest(false)
                            } else if (requestDoc?.status === 'rejected') {
                                alert('상대방이 이미 친구 요청을 거절했습니다.')
                                setHasPendingRequest(false)
                            }
                        } else {
                            // 취소 가능
                            await SocialService.cancelFriendRequest(pendingRequest.id)
                            setHasPendingRequest(false)

                            // 상대방의 알림 삭제
                            await SocialService.deleteFriendRequestNotification(profileUser.uid, pendingRequest.id)

                            alert('친구 요청이 취소되었습니다.')
                        }
                    }
                }
            } else {
                // 새로운 친구 요청 보내기
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
                setHasPendingRequest(true)
                alert('친구 요청을 보냈습니다.')
            }
        } catch (error: any) {
            console.error('Friend toggle error:', error)
            // 에러 발생 시 상태 재확인
            await checkFriendRequestStatus(currentUser.uid, profileUser.uid)
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
        hasPendingRequest,
        receivedRequest,
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