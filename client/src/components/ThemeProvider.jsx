import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => null });

export function ThemeProvider({ children, defaultTheme = 'dark', storageKey = 'hr-analytics-theme' }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(storageKey) || defaultTheme; } catch { return defaultTheme; }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try { localStorage.setItem(storageKey, theme); } catch {}
  }, [theme, storageKey]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
