'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { UserPlus, UserCheck, UserMinus, Loader2 } from 'lucide-react'

interface FriendRequestButtonProps {
  targetUserId: string // 상대방 userId
  targetUserUid: string // 상대방 uid
  targetUserNickname: string // 상대방 닉네임
}

type RequestStatus = 'none' | 'pending' | 'accepted' | 'self'

export default function FriendRequestButton({ targetUserId, targetUserUid, targetUserNickname }: FriendRequestButtonProps) {
  const { user } = useAuth()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('none')
  const [requestId, setRequestId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // 자기 자신인지 확인
    if (user.uid === targetUserUid) {
      setRequestStatus('self')
      setLoading(false)
      return
    }

    const checkFriendStatus = async () => {
      try {
        // 이미 친구인지 확인
        const friendsQuery = query(
          collection(db, 'User'),
          where('uid', '==', user.uid)
        )
        const friendsSnapshot = await getDocs(friendsQuery)

        if (!friendsSnapshot.empty) {
          const userData = friendsSnapshot.docs[0].data()
          if (userData.friends && userData.friends.includes(targetUserUid)) {
            setRequestStatus('accepted')
            setLoading(false)
            return
          }
        }

        // 내가 보낸 요청 확인
        const sentRequestsQuery = query(
          collection(db, 'friendRequests'),
          where('from', '==', user.uid),
          where('to', '==', targetUserUid)
        )

        // 받은 요청 확인
        const receivedRequestsQuery = query(
          collection(db, 'friendRequests'),
          where('from', '==', targetUserUid),
          where('to', '==', user.uid)
        )

        const sentSnapshot = await getDocs(sentRequestsQuery)
        const receivedSnapshot = await getDocs(receivedRequestsQuery)

        if (!sentSnapshot.empty) {
          setRequestStatus('pending')
          setRequestId(sentSnapshot.docs[0].id)
        } else if (!receivedSnapshot.empty) {
          setRequestStatus('pending')
          setRequestId(receivedSnapshot.docs[0].id)
        } else {
          setRequestStatus('none')
        }
      } catch (error) {
        console.error('Error checking friend status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFriendStatus()

    // 실시간 업데이트를 위한 리스너 설정
    const unsubscribe = onSnapshot(
      query(collection(db, 'friendRequests'), 
        where('from', 'in', [user.uid, targetUserUid]),
        where('to', 'in', [user.uid, targetUserUid])
      ), 
      (snapshot) => {
        if (snapshot.empty) {
          setRequestStatus('none')
        } else {
          setRequestStatus('pending')
          setRequestId(snapshot.docs[0].id)
        }
      }
    )

    return () => unsubscribe()
  }, [user, targetUserUid])

  const sendFriendRequest = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 사용자 정보 가져오기
      const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
      const userSnapshot = await getDocs(userQuery)

      if (userSnapshot.empty) {
        console.error('User document not found')
        return
      }

      const userData = userSnapshot.docs[0].data()

      // 친구 요청 추가
      const requestRef = await addDoc(collection(db, 'friendRequests'), {
        from: user.uid,
        fromNickname: userData.nickname || user.displayName,
        fromUserId: userData.userId,
        to: targetUserUid,
        toNickname: targetUserNickname,
        toUserId: targetUserId,
        status: 'pending',
        createdAt: new Date()
      })

      // 알림 추가
      await addDoc(collection(db, 'notifications'), {
        to: targetUserUid,
        from: user.uid,
        fromNickname: userData.nickname || user.displayName,
        type: 'friend_request',
        title: '친구 요청',
        message: `${userData.nickname || user.displayName}님이 친구 요청을 보냈습니다.`,
        createdAt: new Date(),
        read: false,
        requestId: requestRef.id
      })

      setRequestStatus('pending')
      setRequestId(requestRef.id)
    } catch (error) {
      console.error('Error sending friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelFriendRequest = async () => {
    if (!requestId) return
    setLoading(true)

    try {
      // 요청 삭제
      await deleteDoc(doc(db, 'friendRequests', requestId))

      // 알림도 삭제
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('requestId', '==', requestId)
      )
      const notificationsSnapshot = await getDocs(notificationsQuery)

      notificationsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      })

      setRequestStatus('none')
      setRequestId('')
    } catch (error) {
      console.error('Error canceling friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFriend = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 내 친구 목록에서 삭제
      const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0]
        const userData = userDoc.data()

        if (userData.friends) {
          const updatedFriends = userData.friends.filter((uid: string) => uid !== targetUserUid)
          await updateDoc(userDoc.ref, { 
            friends: updatedFriends,
            friendsCount: updatedFriends.length
          })
        }
      }

      // 상대방 친구 목록에서도 삭제
      const targetUserQuery = query(collection(db, 'User'), where('uid', '==', targetUserUid))
      const targetUserSnapshot = await getDocs(targetUserQuery)

      if (!targetUserSnapshot.empty) {
        const targetUserDoc = targetUserSnapshot.docs[0]
        const targetUserData = targetUserDoc.data()

        if (targetUserData.friends) {
          const updatedFriends = targetUserData.friends.filter((uid: string) => uid !== user.uid)
          await updateDoc(targetUserDoc.ref, { 
            friends: updatedFriends,
            friendsCount: updatedFriends.length
          })
        }
      }

      setRequestStatus('none')
    } catch (error) {
      console.error('Error removing friend:', error)
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

  if (requestStatus === 'self') {
    return null // 자기 자신에게는 버튼 표시 안함
  }

  if (requestStatus === 'accepted') {
    return (
      <button 
        onClick={removeFriend}
        className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
      >
        <UserMinus className="w-4 h-4" />
        <span>친구 삭제</span>
      </button>
    )
  }

  if (requestStatus === 'pending') {
    return (
      <button 
        onClick={cancelFriendRequest}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <UserCheck className="w-4 h-4" />
        <span>요청 취소</span>
      </button>
    )
  }

  return (
    <button 
      onClick={sendFriendRequest}
      className="flex items-center gap-2 px-4 py-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors"
    >
      <UserPlus className="w-4 h-4" />
      <span>친구 추가</span>
    </button>
  )
}
