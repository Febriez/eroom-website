import {useEffect, useState} from 'react'
import {CheckCircle} from 'lucide-react'
import {Modal} from '@/components/ui/Modal'
import {Button} from '@/components/ui/Button'
import {useProfile} from '@/contexts/ProfileContext'
import type {User} from '@/lib/firebase/types'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    profileUser: User | null
    browserNotificationPermission: NotificationPermission
    onRequestPermission: () => Promise<boolean>
}

export default function SettingsModal({
                                          isOpen,
                                          onClose,
                                          profileUser,
                                          browserNotificationPermission,
                                          onRequestPermission
                                      }: SettingsModalProps) {
    const {updateUserProfile} = useProfile()
    const [savingSettings, setSavingSettings] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const [tempSettings, setTempSettings] = useState({
        privacy: {
            showProfile: true,
            showStats: true,
            showFriends: true,
            showActivity: true,
            allowMessages: true,
            allowFriendRequests: true
        },
        notifications: {
            friendRequests: true,
            messages: true,
            gameInvites: true,
            achievements: true,
            updates: true,
            marketing: false,
            browserNotifications: true
        },
        preferences: {
            soundEnabled: true
        }
    })

    // 프로필 사용자 설정 동기화
    useEffect(() => {
        if (profileUser?.settings) {
            setTempSettings({
                privacy: profileUser.settings.privacy || {
                    showProfile: true,
                    showStats: true,
                    showFriends: true,
                    showActivity: true,
                    allowMessages: true,
                    allowFriendRequests: true
                },
                notifications: profileUser.settings.notifications ? {
                    ...profileUser.settings.notifications,
                    browserNotifications: profileUser.settings.notifications.browserNotifications ?? true
                } : {
                    friendRequests: true,
                    messages: true,
                    gameInvites: true,
                    achievements: true,
                    updates: true,
                    marketing: false,
                    browserNotifications: true
                },
                preferences: {
                    soundEnabled: profileUser.settings.preferences?.soundEnabled ?? true
                }
            })
        }
    }, [profileUser])

    const handleBrowserNotificationToggle = async (enabled: boolean) => {
        if (enabled && browserNotificationPermission !== 'granted') {
            const granted = await onRequestPermission()
            if (!granted) {
                setTempSettings({
                    ...tempSettings,
                    notifications: {...tempSettings.notifications, browserNotifications: false}
                })
                alert('브라우저 알림을 사용하려면 권한을 허용해주세요.')
                return
            }
        }

        setTempSettings({
            ...tempSettings,
            notifications: {...tempSettings.notifications, browserNotifications: enabled}
        })
    }

    const handleSaveSettings = async () => {
        if (!profileUser) return
        setSavingSettings(true)
        try {
            const updated = {
                ...profileUser.settings,
                privacy: tempSettings.privacy,
                notifications: tempSettings.notifications,
                preferences: {
                    ...profileUser.settings.preferences,
                    soundEnabled: tempSettings.preferences.soundEnabled
                }
            }

            await updateUserProfile({settings: updated})

            setSettingsSaved(true)
            setTimeout(() => {
                onClose()
                setSettingsSaved(false)
            }, 1500)
        } catch (e) {
            console.error(e)
            alert('설정 저장에 실패했습니다.')
        } finally {
            setSavingSettings(false)
        }
    }

    const handleClose = () => {
        if (!savingSettings) {
            onClose()
            setSettingsSaved(false)
            if (profileUser?.settings) {
                setTempSettings({
                    privacy: profileUser.settings.privacy,
                    notifications: profileUser.settings.notifications ? {
                        ...profileUser.settings.notifications,
                        browserNotifications: profileUser.settings.notifications.browserNotifications ?? true
                    } : tempSettings.notifications,
                    preferences: {soundEnabled: profileUser.settings.preferences?.soundEnabled ?? true}
                })
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="환경설정" size="xl">
            <div className="max-h-[70vh] overflow-y-auto">
                {settingsSaved && (
                    <div
                        className="bg-green-900/20 border border-green-600/50 rounded-lg p-4 flex items-center gap-3 mb-6">
                        <CheckCircle className="w-5 h-5 text-green-400"/>
                        <p className="text-green-400 text-sm">설정이 저장되었습니다!</p>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 개인정보 설정 */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">개인정보 설정</h3>
                            <div className="space-y-3">
                                {Object.entries({
                                    showProfile: '내 프로필 공개',
                                    showStats: '통계 공개',
                                    showFriends: '친구 목록 공개',
                                    showActivity: '활동 상태 표시',
                                    allowMessages: '메시지 받기 허용',
                                    allowFriendRequests: '친구 요청 받기 허용'
                                }).map(([key, label]) => (
                                    <label key={key}
                                           className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                        <span className="text-gray-300">{label}</span>
                                        <input
                                            type="checkbox"
                                            checked={tempSettings.privacy[key as keyof typeof tempSettings.privacy]}
                                            onChange={e => setTempSettings({
                                                ...tempSettings,
                                                privacy: {...tempSettings.privacy, [key]: e.target.checked}
                                            })}
                                            className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 게임 설정 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">게임 설정</h3>
                            <div className="space-y-3">
                                <label
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                    <span className="text-gray-300">사운드 활성화</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.preferences.soundEnabled}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            preferences: {...tempSettings.preferences, soundEnabled: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 알림 설정 */}
                    <div className="lg:border-l lg:border-gray-800 lg:pl-8">
                        <h3 className="text-lg font-semibold mb-4 text-white">알림 설정</h3>
                        <div className="space-y-3">
                            {/* 브라우저 알림 마스터 토글 */}
                            <div className="p-3 bg-gray-800/50 rounded-lg mb-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-gray-300 font-medium">브라우저 알림</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {browserNotificationPermission === 'denied'
                                                ? '브라우저 설정에서 알림을 허용해주세요'
                                                : browserNotificationPermission === 'default'
                                                    ? '클릭하여 알림 권한을 요청합니다'
                                                    : '백그라운드에서도 알림을 받습니다'}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications.browserNotifications}
                                        onChange={e => handleBrowserNotificationToggle(e.target.checked)}
                                        disabled={browserNotificationPermission === 'denied'}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {Object.entries({
                                friendRequests: '친구 요청 알림',
                                messages: '메시지 알림',
                                gameInvites: '게임 초대 알림',
                                achievements: '업적 달성 알림',
                                updates: '업데이트 알림',
                                marketing: '마케팅 정보 수신'
                            }).map(([key, label]) => (
                                <label key={key}
                                       className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                    <span className="text-gray-300">{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications[key as keyof typeof tempSettings.notifications]}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            notifications: {...tempSettings.notifications, [key]: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-800">
                    <Button variant="outline" onClick={handleClose} disabled={savingSettings}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSaveSettings} disabled={savingSettings || settingsSaved}>
                        {savingSettings ? '저장 중...' : settingsSaved ? '저장됨' : '적용'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}