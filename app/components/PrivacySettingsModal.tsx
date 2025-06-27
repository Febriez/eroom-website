'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

interface PrivacySettings {
  showFollowers: boolean
  showFollowing: boolean
  showFriends: boolean
  showPoints: boolean
  showCompletedMaps: boolean
  showCreatedMaps: boolean
  showPlayTime: boolean
  showWinRate: boolean
  showAvgClearTime: boolean
}

interface PrivacySettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacySettingsModal({ isOpen, onClose }: PrivacySettingsModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<PrivacySettings>({
    showFollowers: true,
    showFollowing: true,
    showFriends: true,
    showPoints: true,
    showCompletedMaps: true,
    showCreatedMaps: true,
    showPlayTime: true,
    showWinRate: true,
    showAvgClearTime: true
  })

  useEffect(() => {
    if (!user || !isOpen) return

    const loadSettings = async () => {
      try {
        setLoading(true)
        const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          if (userData.privacySettings) {
            setSettings({
              ...settings,
              ...userData.privacySettings
            })
          }
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user, isOpen])

  const handleChange = (field: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
      const querySnapshot = await getDocs(userQuery)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref
        await updateDoc(userDoc, {
          privacySettings: settings
        })
        onClose()
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">개인정보 공개 설정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-400 text-sm mb-5">
            프로필에서 다른 사용자에게 공개할 정보를 선택하세요.
          </p>

          <div className="space-y-4">
            <div className="border-b border-gray-800 pb-4">
              <h4 className="font-medium mb-3 text-green-400">소셜 정보</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showFollowers}
                    onChange={() => handleChange('showFollowers')}
                  />
                  <span>팔로워 목록 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showFollowing}
                    onChange={() => handleChange('showFollowing')}
                  />
                  <span>팔로잉 목록 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showFriends}
                    onChange={() => handleChange('showFriends')}
                  />
                  <span>친구 목록 공개</span>
                </label>
              </div>
            </div>

            <div className="border-b border-gray-800 pb-4">
              <h4 className="font-medium mb-3 text-green-400">게임 통계</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showPoints}
                    onChange={() => handleChange('showPoints')}
                  />
                  <span>포인트 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showCompletedMaps}
                    onChange={() => handleChange('showCompletedMaps')}
                  />
                  <span>클리어한 맵 수 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showCreatedMaps}
                    onChange={() => handleChange('showCreatedMaps')}
                  />
                  <span>제작한 맵 수 공개</span>
                </label>
              </div>
            </div>

            <div className="pb-4">
              <h4 className="font-medium mb-3 text-green-400">플레이 통계</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showPlayTime}
                    onChange={() => handleChange('showPlayTime')}
                  />
                  <span>총 플레이 시간 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showWinRate}
                    onChange={() => handleChange('showWinRate')}
                  />
                  <span>승률 공개</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                    checked={settings.showAvgClearTime}
                    onChange={() => handleChange('showAvgClearTime')}
                  />
                  <span>평균 클리어 시간 공개</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-900/50 text-green-400 hover:bg-green-900/70 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
