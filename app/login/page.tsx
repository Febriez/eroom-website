    useEffect(() => {
        // 로그인 성공 시 리디렉션
        if (loginSuccess) {
            if (loginSuccess.userId) {
                router.push(`/profile/${loginSuccess.userId}`)
            } else {
                router.push('/profile')
            }
        }

        // 이미 로그인된 사용자는 프로필 페이지로 리디렉션
        if (!loading && user) {
            // 사용자 프로필 정보를 가져오는 함수
            const getUserProfile = async () => {
                try {
                    const usersQuery = query(collection(db, 'User'), where('uid', '==', user.uid))
                    const querySnapshot = await getDocs(usersQuery)

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data()
                        router.push(`/profile/${userData.userId}`)
                    } else {
                        router.push('/profile')
                    }
                } catch (error) {
                    console.error('프로필 정보 가져오기 오류:', error)
                    router.push('/profile')
                }
            }

            getUserProfile()
        }
    }, [loginSuccess, router, loading, user])
