'use client'

import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface ProfileEditProps {
  userDocId: string
  currentBio: string
  onClose: () => void
  onUpdate: (newBio: string) => void
}

export default function ProfileEdit({ userDocId, currentBio, onClose, onUpdate }: ProfileEditProps) {
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)

  // 컴포넌트 마운트 시 현재 자기소개를 상태에 설정
  useEffect(() => {
    setBio(currentBio || '')
  }, [currentBio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userRef = doc(db, 'User', userDocId)
      await updateDoc(userRef, { bio })
      onUpdate(bio)
      onClose()
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-900/30 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">자기소개 수정</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="자기소개를 입력하세요..."
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors flex items-center justify-center min-w-[80px]"
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
