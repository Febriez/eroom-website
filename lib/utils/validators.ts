import {VALIDATION_RULES} from '@/lib/firebase/types'

export const validators = {
    // 이메일 검증
    email: (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    },

    // 사용자명 검증
    username: (username: string): { valid: boolean; error?: string } => {
        const {minLength, maxLength, pattern, reserved} = VALIDATION_RULES.username

        if (username.length < minLength) {
            return {valid: false, error: `최소 ${minLength}자 이상이어야 합니다.`}
        }

        if (username.length > maxLength) {
            return {valid: false, error: `최대 ${maxLength}자까지 가능합니다.`}
        }

        if (!pattern.test(username)) {
            return {valid: false, error: '영문, 숫자, 언더스코어(_)만 사용 가능합니다.'}
        }

        if (reserved.includes(username.toLowerCase())) {
            return {valid: false, error: '사용할 수 없는 사용자명입니다.'}
        }

        return {valid: true}
    },

    // 비밀번호 검증
    password: (password: string): { valid: boolean; errors: string[] } => {
        const {minLength, requireUppercase, requireLowercase, requireNumber} = VALIDATION_RULES.password
        const errors: string[] = []

        if (password.length < minLength) {
            errors.push(`최소 ${minLength}자 이상`)
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('대문자 포함')
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            errors.push('소문자 포함')
        }

        if (requireNumber && !/[0-9]/.test(password)) {
            errors.push('숫자 포함')
        }

        return {valid: errors.length === 0, errors}
    },

    // URL 검증
    url: (url: string): boolean => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    },

    // 한국 전화번호 검증
    phoneNumber: (phone: string): boolean => {
        const regex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
        return regex.test(phone.replace(/-/g, ''))
    }
}