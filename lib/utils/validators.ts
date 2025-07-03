// lib/utils/validators.ts
import {VALIDATION_RULES} from '@/lib/firebase/types'

/**
 * 한글인지 확인하는 함수
 */
const isKorean = (char: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(char);
};

/**
 * 문자열의 실제 길이를 계산 (한글은 2자로 계산)
 */
const getStringLength = (str: string): number => {
    let length = 0;
    for (const char of str) {
        length += isKorean(char) ? 2 : 1;
    }
    return length;
};

/**
 * 닉네임(displayName) 유효성 검증
 */
export const validateDisplayName = (displayName: string): { isValid: boolean; error?: string } => {
    // 빈 문자열 체크
    if (!displayName || displayName.trim().length === 0) {
        return {isValid: false, error: '닉네임을 입력해주세요.'};
    }

    // 공백만으로 이루어진 닉네임 방지
    if (displayName.trim().length === 0) {
        return {isValid: false, error: '닉네임은 공백만으로 만들 수 없습니다.'};
    }

    // 길이 체크 (한글은 2자로 계산, 3~16자)
    const length = getStringLength(displayName);
    if (length > 16) {
        return {isValid: false, error: '닉네임은 최대 16자(한글 8자)까지 가능합니다.'};
    }

    // 최소 길이 체크
    if (length < 3) {
        return {isValid: false, error: '닉네임은 최소 3자 이상이어야 합니다.'};
    }

    // 허용되지 않는 특수문자 체크
    const invalidCharsRegex = /[<>:"\/\\|?*]/;
    if (invalidCharsRegex.test(displayName)) {
        return {isValid: false, error: '닉네임에 사용할 수 없는 특수문자가 포함되어 있습니다.'};
    }

    // 시작과 끝 공백 체크 (중간 공백은 허용)
    if (displayName !== displayName.trim()) {
        return {isValid: false, error: '닉네임은 공백으로 시작하거나 끝날 수 없습니다.'};
    }

    return {isValid: true};
};

/**
 * 사용자명(username) 유효성 검증
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    const {minLength, maxLength, pattern, reserved} = VALIDATION_RULES.username

    if (!username || username.trim().length === 0) {
        return {isValid: false, error: '사용자명을 입력해주세요.'}
    }

    if (username.length < minLength) {
        return {isValid: false, error: `최소 ${minLength}자 이상이어야 합니다.`}
    }

    if (username.length > maxLength) {
        return {isValid: false, error: `최대 ${maxLength}자까지 가능합니다.`}
    }

    if (!pattern.test(username)) {
        return {isValid: false, error: '영문, 숫자, 언더스코어(_)만 사용 가능합니다.'}
    }

    if (reserved.includes(username.toLowerCase())) {
        return {isValid: false, error: '사용할 수 없는 사용자명입니다.'}
    }

    return {isValid: true}
};

/**
 * 이메일 유효성 검증
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    if (!email) {
        return {isValid: false, error: '이메일을 입력해주세요.'};
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {isValid: false, error: '올바른 이메일 형식이 아닙니다.'};
    }

    return {isValid: true};
};

/**
 * 비밀번호 유효성 검증
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string; errors?: string[] } => {
    const {minLength, maxLength, requireUppercase, requireLowercase, requireNumber} = VALIDATION_RULES.password

    if (!password) {
        return {isValid: false, error: '비밀번호를 입력해주세요.'};
    }

    const errors: string[] = []

    if (password.length < minLength) {
        errors.push(`최소 ${minLength}자 이상`)
    }

    if (password.length > maxLength) {
        errors.push(`최대 ${maxLength}자 이하`)
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

    if (errors.length > 0) {
        return {
            isValid: false,
            error: `비밀번호는 ${errors.join(', ')} 조건을 만족해야 합니다.`,
            errors
        }
    }

    return {isValid: true};
};

/**
 * 프로필 설명 유효성 검증
 */
export const validateBio = (bio: string): { isValid: boolean; error?: string } => {
    const {maxLength} = VALIDATION_RULES.bio

    if (bio && bio.length > maxLength) {
        return {isValid: false, error: `자기소개는 ${maxLength}자를 초과할 수 없습니다.`};
    }

    return {isValid: true};
};

/**
 * 태그 유효성 검증
 */
export const validateTag = (tag: string): { isValid: boolean; error?: string } => {
    if (!tag || tag.trim().length === 0) {
        return {isValid: false, error: '태그를 입력해주세요.'};
    }

    if (tag.length > 20) {
        return {isValid: false, error: '태그는 20자를 초과할 수 없습니다.'};
    }

    const tagRegex = /^[a-zA-Z0-9가-힣_-]+$/;
    if (!tagRegex.test(tag)) {
        return {isValid: false, error: '태그는 문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다.'};
    }

    return {isValid: true};
};

/**
 * URL 유효성 검증
 */
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url) {
        return {isValid: false, error: 'URL을 입력해주세요.'};
    }

    try {
        new URL(url);
        return {isValid: true};
    } catch {
        return {isValid: false, error: '올바른 URL 형식이 아닙니다.'};
    }
};

/**
 * 한국 전화번호 유효성 검증
 */
export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
    if (!phone) {
        return {isValid: false, error: '전화번호를 입력해주세요.'};
    }

    const regex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!regex.test(phone.replace(/-/g, ''))) {
        return {isValid: false, error: '올바른 전화번호 형식이 아닙니다.'};
    }

    return {isValid: true};
};

/**
 * 메시지 유효성 검증
 */
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
    const {maxLength} = VALIDATION_RULES.message

    if (!message || message.trim().length === 0) {
        return {isValid: false, error: '메시지를 입력해주세요.'};
    }

    if (message.length > maxLength) {
        return {isValid: false, error: `메시지는 ${maxLength}자를 초과할 수 없습니다.`};
    }

    return {isValid: true};
};