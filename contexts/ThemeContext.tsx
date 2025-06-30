import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/utils/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 로컬 스토리지에서 테마 설정 로드
  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    }
  }, []);

  // 테마 변경 시 로컬 스토리지 업데이트 및 클래스 적용
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    // 테마 모드 결정
    const determineTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    };

    const currentTheme = determineTheme();
    setIsDarkMode(currentTheme === 'dark');

    // HTML에 클래스 적용
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
  }, [theme]);

  // 시스템 테마 변경 감지 (system 모드일 때만 적용)
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setIsDarkMode(mediaQuery.matches);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
