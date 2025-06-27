    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (password !== confirmPassword) {
                throw new Error('비밀번호가 일치하지 않습니다.')
            }

            await signUpWithEmail(email, password, nickname, userId)
            // 회원가입 후 자동 로그인 처리
            await signInWithEmail(email, password)
            router.push(`/profile/${userId}`)
        } catch (error: any) {
            console.error('Signup error:', error)
            if (error.code === 'auth/email-already-in-use') {
                setError('이미 사용 중인 이메일입니다.')
            } else if (error.message === 'userId already exists') {
                setError('이미 사용 중인 아이디입니다.')
            } else {
                setError(error.message || '회원가입 중 오류가 발생했습니다.')
            }
        } finally {
            setLoading(false)
        }
    }
