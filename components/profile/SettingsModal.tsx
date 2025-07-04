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
            profileVisibility: 'public' as 'public' | 'friends' | 'private',
            showOnlineStatus: true,
            allowFriendRequests: true,
            allowMessages: true
        },
        notifications: {
            browser: true,
            email: true,
            friendRequests: true,
            messages: true,
            achievements: true
        },
        game: {
            soundEnabled: true,
            musicVolume: 0.7,
            effectsVolume: 0.8,
            mouseSensitivity: 1.0,
            language: 'ko' as 'ko' | 'en',
            theme: 'dark' as 'dark' | 'light' | 'auto'
        }
    })

    // 프로필 사용자 설정 동기화
    useEffect(() => {
        if (profileUser?.settings) {
            setTempSettings({
                privacy: profileUser.settings.privacy || {
                    profileVisibility: 'public',
                    showOnlineStatus: true,
                    allowFriendRequests: true,
                    allowMessages: true
                },
                notifications: profileUser.settings.notifications || {
                    browser: true,
                    email: true,
                    friendRequests: true,
                    messages: true,
                    achievements: true
                },
                game: {
                    soundEnabled: true,
                    musicVolume: 0.7,
                    effectsVolume: 0.8,
                    mouseSensitivity: 1.0,
                    language: 'ko',
                    theme: profileUser.settings.theme || 'dark'
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
                    notifications: {...tempSettings.notifications, browser: false}
                })
                alert('브라우저 알림을 사용하려면 권한을 허용해주세요.')
                return
            }
        }

        setTempSettings({
            ...tempSettings,
            notifications: {...tempSettings.notifications, browser: enabled}
        })
    }

    const handleSaveSettings = async () => {
        if (!profileUser) return
        setSavingSettings(true)

        try {
            const updatedSettings = {
                theme: tempSettings.game.theme,
                privacy: tempSettings.privacy,
                notifications: tempSettings.notifications
            }

            await updateUserProfile({settings: updatedSettings})

            setSettingsSaved(true)
            setTimeout(() => {
                setSettingsSaved(false)
            }, 3000)
        } catch (error) {
            console.error('Settings save error:', error)

            // Firebase 인증 오류 처리
            if (error instanceof Error) {
                if (error.message.includes('auth/user-not-found')) {
                    alert('사용자를 찾을 수 없습니다. 다시 로그인해주세요.')
                } else if (error.message.includes('auth/invalid-user-token')) {
                    alert('인증이 만료되었습니다. 다시 로그인해주세요.')
                } else if (error.message.includes('auth/network-request-failed')) {
                    alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
                } else {
                    alert('설정 저장에 실패했습니다. 다시 시도해주세요.')
                }
            } else {
                alert('설정 저장에 실패했습니다.')
            }
        } finally {
            setSavingSettings(false)
        }
    }

    const handleClose = () => {
        if (!savingSettings) {
            onClose()
            setSettingsSaved(false)
            // 설정 초기화
            if (profileUser?.settings) {
                setTempSettings({
                    privacy: profileUser.settings.privacy || {
                        profileVisibility: 'public',
                        showOnlineStatus: true,
                        allowFriendRequests: true,
                        allowMessages: true
                    },
                    notifications: profileUser.settings.notifications || {
                        browser: true,
                        email: true,
                        friendRequests: true,
                        messages: true,
                        achievements: true
                    },
                    game: {
                        soundEnabled: true,
                        musicVolume: 0.7,
                        effectsVolume: 0.8,
                        mouseSensitivity: 1.0,
                        language: 'ko',
                        theme: profileUser.settings.theme || 'dark'
                    }
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
                                {/* 프로필 공개 설정 */}
                                <div className="p-3 hover:bg-gray-800 rounded-lg">
                                    <label className="block text-gray-300 mb-2">프로필 공개 범위</label>
                                    <select
                                        value={tempSettings.privacy.profileVisibility}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            privacy: {
                                                ...tempSettings.privacy,
                                                profileVisibility: e.target.value as 'public' | 'friends' | 'private'
                                            }
                                        })}
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                                    >
                                        <option value="public">전체 공개</option>
                                        <option value="friends">친구만</option>
                                        <option value="private">비공개</option>
                                    </select>
                                </div>

                                {/* 기타 개인정보 설정 */}
                                {[
                                    {key: 'showOnlineStatus', label: '온라인 상태 표시'},
                                    {key: 'allowFriendRequests', label: '친구 요청 받기 허용'},
                                    {key: 'allowMessages', label: '메시지 받기 허용'}
                                ].map(({key, label}) => (
                                    <label key={key}
                                           className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                        <span className="text-gray-300">{label}</span>
                                        <input
                                            type="checkbox"
                                            checked={tempSettings.privacy[key as 'showOnlineStatus' | 'allowFriendRequests' | 'allowMessages']}
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
                                        checked={tempSettings.game.soundEnabled}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            game: {...tempSettings.game, soundEnabled: e.target.checked}
                                        })}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded"
                                    />
                                </label>

                                {/* 음악 볼륨 */}
                                <div className="p-3 hover:bg-gray-800 rounded-lg">
                                    <label className="block text-gray-300 mb-2">음악 볼륨</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={tempSettings.game.musicVolume}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            game: {...tempSettings.game, musicVolume: parseFloat(e.target.value)}
                                        })}
                                        className="w-full"
                                    />
                                    <span
                                        className="text-sm text-gray-400">{Math.round(tempSettings.game.musicVolume * 100)}%</span>
                                </div>

                                {/* 효과음 볼륨 */}
                                <div className="p-3 hover:bg-gray-800 rounded-lg">
                                    <label className="block text-gray-300 mb-2">효과음 볼륨</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={tempSettings.game.effectsVolume}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            game: {...tempSettings.game, effectsVolume: parseFloat(e.target.value)}
                                        })}
                                        className="w-full"
                                    />
                                    <span
                                        className="text-sm text-gray-400">{Math.round(tempSettings.game.effectsVolume * 100)}%</span>
                                </div>

                                {/* 테마 설정 */}
                                <div className="p-3 hover:bg-gray-800 rounded-lg">
                                    <label className="block text-gray-300 mb-2">테마</label>
                                    <select
                                        value={tempSettings.game.theme}
                                        onChange={e => setTempSettings({
                                            ...tempSettings,
                                            game: {
                                                ...tempSettings.game,
                                                theme: e.target.value as 'dark' | 'light' | 'auto'
                                            }
                                        })}
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                                    >
                                        <option value="dark">다크</option>
                                        <option value="light">라이트</option>
                                        <option value="auto">자동</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 알림 설정 */}
                    <div className="lg:border-l lg:border-gray-800 lg:pl-8">
                        <h3 className="text-lg font-semibold mb-4 text-white">알림 설정</h3>
                        <div className="space-y-3">
                            {/* 브라우저 알림 */}
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
                                        checked={tempSettings.notifications.browser}
                                        onChange={e => handleBrowserNotificationToggle(e.target.checked)}
                                        disabled={browserNotificationPermission === 'denied'}
                                        className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {/* 기타 알림 설정 */}
                            {[
                                {key: 'email', label: '이메일 알림'},
                                {key: 'friendRequests', label: '친구 요청 알림'},
                                {key: 'messages', label: '메시지 알림'},
                                {key: 'achievements', label: '업적 달성 알림'}
                            ].map(({key, label}) => (
                                <label key={key}
                                       className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                                    <span className="text-gray-300">{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={tempSettings.notifications[key as 'email' | 'friendRequests' | 'messages' | 'achievements']}
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