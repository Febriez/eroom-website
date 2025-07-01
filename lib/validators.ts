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
 * 닉네임 유효성 검증
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    // 빈 문자열 체크
    if (!username || username.trim().length === 0) {
        return {isValid: false, error: '닉네임을 입력해주세요.'};
    }

    // 공백만으로 이루어진 닉네임 방지
    if (username.trim().length === 0) {
        return {isValid: false, error: '닉네임은 공백만으로 만들 수 없습니다.'};
    }

    // 길이 체크 (한글은 2자로 계산, 최대 16자)
    const length = getStringLength(username);
    if (length > 16) {
        return {isValid: false, error: '닉네임은 최대 16자(한글 8자)까지 가능합니다.'};
    }

    // 최소 길이 체크
    if (length < 2) {
        return {isValid: false, error: '닉네임은 최소 2자 이상이어야 합니다.'};
    }

    // 허용되지 않는 특수문자 체크
    const invalidCharsRegex = /[<>:"\/\\|?*]/;
    if (invalidCharsRegex.test(username)) {
        return {isValid: false, error: '닉네임에 사용할 수 없는 특수문자가 포함되어 있습니다.'};
    }

    // 시작과 끝 공백 체크 (중간 공백은 허용)
    if (username !== username.trim()) {
        return {isValid: false, error: '닉네임은 공백으로 시작하거나 끝날 수 없습니다.'};
    }

    return {isValid: true};
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
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (!password) {
        return {isValid: false, error: '비밀번호를 입력해주세요.'};
    }

    if (password.length < 8) {
        return {isValid: false, error: '비밀번호는 8자 이상이어야 합니다.'};
    }

    if (password.length > 128) {
        return {isValid: false, error: '비밀번호가 너무 깁니다.'};
    }

    // 최소 하나의 숫자, 하나의 소문자, 하나의 대문자 포함
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/;
    if (!passwordRegex.test(password)) {
        return {isValid: false, error: '비밀번호는 숫자, 소문자, 대문자를 각각 하나 이상 포함해야 합니다.'};
    }

    return {isValid: true};
};

/**
 * 프로필 설명 유효성 검증
 */
export const validateBio = (bio: string): { isValid: boolean; error?: string } => {
    if (bio && bio.length > 200) {
        return {isValid: false, error: '자기소개는 200자를 초과할 수 없습니다.'};
    }

    return {isValid: true};
};

/**
 * 맵 이름 유효성 검증
 */
export const validateMapName = (name: string): { isValid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
        return {isValid: false, error: '맵 이름을 입력해주세요.'};
    }

    if (name.length > 50) {
        return {isValid: false, error: '맵 이름은 50자를 초과할 수 없습니다.'};
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