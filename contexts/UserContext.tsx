import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from './AuthContext';
import type { User, UserStats } from '@/lib/firebase/types';
import { getUserStats } from '@/lib/firebase/services/user.service';

interface UserContextType {
  user: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  stats: null,
  isLoading: true,
  error: null,
  updateProfile: async () => {}
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 사용자 정보 실시간 업데이트
  useEffect(() => {
    if (!authUser) {
      setUser(null);
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Firestore에서 사용자 문서 구독
    const userRef = doc(db, COLLECTIONS.USERS, authUser.id);
    const unsubscribe = onSnapshot(
      userRef,
      async (doc) => {
        if (doc.exists()) {
          const userData = { id: doc.id, ...doc.data() } as User;
          setUser(userData);

          try {
            // 사용자 통계 정보 가져오기
            const userStats = await getUserStats(userData.id);
            setStats(userStats);
          } catch (err) {
            console.error('사용자 통계 조회 오류:', err);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('사용자 정보 구독 오류:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser]);

  // 프로필 업데이트 함수
  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('사용자가 로그인되어 있지 않습니다.');

    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.id), data);
    } catch (err) {
      console.error('프로필 업데이트 오류:', err);
      throw err;
    }
  };

  const value = {
    user,
    stats,
    isLoading,
    error,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Firebase 함수 임포트
const { updateDoc } = require('firebase/firestore');
