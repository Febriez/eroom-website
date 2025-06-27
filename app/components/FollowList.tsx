'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, User, Users, X } from 'lucide-react'

interface FollowListProps {
  type: 'followers' | 'following' | 'friends'
  userIds: string[]
  isOpen: boolean
  onClose: () => void
}

interface UserInfo {
  uid: string
  userId: string
  nickname: string
  avatarUrl?: string
}

export default function FollowList({ type, userIds, isOpen, onClose }: FollowListProps) {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !userIds.length) return

    const fetchUsers = async () => {
      setLoading(true)
      try {
        const usersList: UserInfo[] = []

        // userIds는 uid 배열이므로 이 uid들에 해당하는 사용자 정보를 가져옴
        for (const uid of userIds) {
          const userQuery = query(collection(db, 'User'), where('uid', '==', uid))
          const snapshot = await getDocs(userQuery)

          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data()
            usersList.push({
              uid: userData.uid,
              userId: userData.userId,
              nickname: userData.nickname,
              avatarUrl: userData.avatarUrl
            })
          }
        }

        setUsers(usersList)
      } catch (error) {
        console.error(`Error fetching ${type}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isOpen, userIds, type])

  const getTitle = () => {
    switch (type) {
      case 'followers':
        return '팔로워'
      case 'following':
        return '팔로잉'
      case 'friends':
        return '친구 목록'
      default:
        return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {type === 'followers' && <Users className="w-5 h-5 text-green-400" />}
            {type === 'following' && <Users className="w-5 h-5 text-purple-400" />}
            {type === 'friends' && <Users className="w-5 h-5 text-blue-400" />}
            {getTitle()} ({userIds.length})
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-2">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-green-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              {type === 'followers' && '아직 팔로워가 없습니다.'}
              {type === 'following' && '아직 팔로우하는 사용자가 없습니다.'}
              {type === 'friends' && '아직 친구가 없습니다.'}
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user) => (
                <Link
                  key={user.uid}
                  href={`/profile/${user.userId}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.nickname} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.nickname}</p>
                    <p className="text-sm text-gray-400">@{user.userId}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
