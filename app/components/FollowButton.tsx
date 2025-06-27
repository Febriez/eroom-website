'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'

interface FollowButtonProps {
  targetUserId: string // 상대방 userId
  targetUserUid: string // 상대방 uid
  targetUserNickname: string // 상대방 닉네임
}

export default function FollowButton({ targetUserId, targetUserUid, targetUserNickname }: FollowButtonProps) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // 자기 자신인지 확인
    if (user.uid === targetUserUid) {
      setLoading(false)
      return
    }

    const checkFollowStatus = async () => {
      try {
        // 내가 팔로우하고 있는지 확인
        const userQuery = query(
          collection(db, 'User'),
          where('uid', '==', user.uid)
        )
        const userSnapshot = await getDocs(userQuery)

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data()
          setIsFollowing(userData.following && userData.following.includes(targetUserUid))
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFollowStatus()
  }, [user, targetUserUid])

  const handleFollow = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 내 following 목록 업데이트
      const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref
        await updateDoc(userDoc, {
          following: arrayUnion(targetUserUid)
        })
      }

      // 상대방 followers 목록 업데이트
      const targetUserQuery = query(collection(db, 'User'), where('uid', '==', targetUserUid))
      const targetUserSnapshot = await getDocs(targetUserQuery)

      if (!targetUserSnapshot.empty) {
        const targetUserDoc = targetUserSnapshot.docs[0].ref
        await updateDoc(targetUserDoc, {
          followers: arrayUnion(user.uid)
        })
      }

      setIsFollowing(true)
    } catch (error) {
      console.error('Error following user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 내 following 목록 업데이트
      const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref
        await updateDoc(userDoc, {
          following: arrayRemove(targetUserUid)
        })
      }

      // 상대방 followers 목록 업데이트
      const targetUserQuery = query(collection(db, 'User'), where('uid', '==', targetUserUid))
      const targetUserSnapshot = await getDocs(targetUserQuery)

      if (!targetUserSnapshot.empty) {
        const targetUserDoc = targetUserSnapshot.docs[0].ref
        await updateDoc(targetUserDoc, {
          followers: arrayRemove(user.uid)
        })
      }

      setIsFollowing(false)
    } catch (error) {
      console.error('Error unfollowing user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg cursor-not-allowed"
        disabled
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>로딩 중...</span>
      </button>
    )
  }

  // 자기 자신에게는 팔로우 버튼 표시 안함
  if (user?.uid === targetUserUid) {
    return null
  }

  if (isFollowing) {
    return (
      <button 
        onClick={handleUnfollow}
        className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 text-purple-400 rounded-lg hover:bg-purple-900/50 transition-colors"
      >
        <UserMinus className="w-4 h-4" />
        <span>팔로우 취소</span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleFollow}
      className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 text-purple-400 rounded-lg hover:bg-purple-900/50 transition-colors"
    >
      <UserPlus className="w-4 h-4" />
      <span>팔로우</span>
    </button>
  )
}
