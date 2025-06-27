'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, UserPlus, UserCheck, Sparkles, Shield, Bell } from 'lucide-react'
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface NotificationItemProps {
  id: string
  type: 'friend_request' | 'game_update' | 'bug_report_response'
  title: string
  message: string
  from?: string
  fromNickname?: string
  fromUserId?: string
  createdAt: any
  read: boolean
  requestId?: string
  onAction?: () => void
}

export default function NotificationItem({
  id,
  type,
  title,
  message,
  from,
  fromNickname,
  fromUserId,
  createdAt,
  read,
  requestId,
  onAction
}: NotificationItemProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const markAsRead = async () => {
    try {
      const notificationRef = doc(db, 'notifications', id)
      await updateDoc(notificationRef, { read: true })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleClick = () => {
    markAsRead()
    setExpanded(!expanded)

    if (type === 'friend_request' && fromUserId) {
      router.push(`/profile/${fromUserId}`)
    }
  }

  const acceptFriendRequest = async () => {
    if (!from || !requestId) return
    setProcessing(true)

    try {
      // 현재 사용자 uid 가져오기
      const auth = JSON.parse(localStorage.getItem('firebase:authUser:AIzaSyBoK2EJ_0fIhYkYVXIlOqmcnPKcB7MInMg:[DEFAULT]') || '{}')
      const currentUserUid = auth.uid

      if (!currentUserUid) {
        console.error('Current user not found')
        return
      }

      // 내 정보 가져오기
      const myQuery = query(collection(db, 'User'), where('uid', '==', currentUserUid))
      const mySnapshot = await getDocs(myQuery)

      // 요청자 정보 가져오기
      const senderQuery = query(collection(db, 'User'), where('uid', '==', from))
      const senderSnapshot = await getDocs(senderQuery)

      if (mySnapshot.empty || senderSnapshot.empty) {
        console.error('User documents not found')
        return
      }

      const myDoc = mySnapshot.docs[0]
      const senderDoc = senderSnapshot.docs[0]
      const myData = myDoc.data()
      const senderData = senderDoc.data()

      // friends 필드가 없으면 초기화
      if (!myData.friends) {
        await updateDoc(myDoc.ref, { friends: [] })
      }

      if (!senderData.friends) {
        await updateDoc(senderDoc.ref, { friends: [] })
      }

      // 내 친구 목록에 추가
      await updateDoc(myDoc.ref, {
        friends: arrayUnion(from),
        friendsCount: (myData.friends?.length || 0) + 1
      })

      // 상대방 친구 목록에도 추가
      await updateDoc(senderDoc.ref, {
        friends: arrayUnion(currentUserUid),
        friendsCount: (senderData.friends?.length || 0) + 1
      })

      // 친구 요청 문서 삭제
      await deleteDoc(doc(db, 'friendRequests', requestId))

      // 알림 삭제
      await deleteDoc(doc(db, 'notifications', id))

      // 수락 알림 보내기
      await addDoc(collection(db, 'notifications'), {
        to: from,
        from: currentUserUid,
        fromNickname: myData.nickname,
        type: 'friend_request',
        title: '친구 요청 수락됨',
        message: `${myData.nickname}님이 친구 요청을 수락했습니다.`,
        createdAt: new Date(),
        read: false
      })

      if (onAction) onAction()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    } finally {
      setProcessing(false)
    }
  }

  const rejectFriendRequest = async () => {
    if (!requestId) return
    setProcessing(true)

    try {
      // 친구 요청 문서 삭제
      await deleteDoc(doc(db, 'friendRequests', requestId))

      // 알림 삭제
      await deleteDoc(doc(db, 'notifications', id))

      if (onAction) onAction()
    } catch (error) {
      console.error('Error rejecting friend request:', error)
    } finally {
      setProcessing(false)
    }
  }

  const getNotificationIcon = () => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="w-4 h-4" />
      case 'game_update':
        return <Sparkles className="w-4 h-4" />
      case 'bug_report_response':
        return <Shield className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ''

    if (date.toDate) {
      date = date.toDate()
    } else if (typeof date === 'object' && date.seconds) {
      date = new Date(date.seconds * 1000)
    }

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div 
      className={`block p-3 rounded-lg transition-all ${
        read ? 'bg-gray-800/50' : 'bg-green-900/30'
      } hover:bg-opacity-80`}
    >
      <div className="flex items-start gap-3" onClick={handleClick}>
        <div className="text-green-400 mt-0.5">
          {getNotificationIcon()}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(createdAt)}</p>
        </div>
        {!read && (
          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
        )}
      </div>

      {expanded && type === 'friend_request' && requestId && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={rejectFriendRequest}
            disabled={processing}
            className="flex items-center gap-1 px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors text-xs"
          >
            <X className="w-3 h-3" />
            거절
          </button>
          <button
            onClick={acceptFriendRequest}
            disabled={processing}
            className="flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-400 rounded hover:bg-green-900/50 transition-colors text-xs"
          >
            <Check className="w-3 h-3" />
            수락
          </button>
        </div>
      )}
    </div>
  )
}
