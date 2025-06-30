import {useEffect, useState} from 'react'

interface DeviceInfo {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isIOS: boolean
    isAndroid: boolean
    isTouchDevice: boolean
    deviceType: 'mobile' | 'tablet' | 'desktop'
}

export function useDevice() {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isIOS: false,
        isAndroid: false,
        isTouchDevice: false,
        deviceType: 'desktop'
    })

    useEffect(() => {
        const checkDevice = () => {
            const userAgent = window.navigator.userAgent.toLowerCase()
            const width = window.innerWidth

            const isIOS = /iphone|ipad|ipod/.test(userAgent)
            const isAndroid = /android/.test(userAgent)
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

            let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
            if (width < 768) deviceType = 'mobile'
            else if (width < 1024) deviceType = 'tablet'

            setDeviceInfo({
                isMobile: deviceType === 'mobile',
                isTablet: deviceType === 'tablet',
                isDesktop: deviceType === 'desktop',
                isIOS,
                isAndroid,
                isTouchDevice,
                deviceType
            })
        }

        checkDevice()
        window.addEventListener('resize', checkDevice)

        return () => window.removeEventListener('resize', checkDevice)
    }, [])

    return deviceInfo
}