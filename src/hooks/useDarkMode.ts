import { useState, useEffect } from 'react';

const DARK_MODE_KEY = 'rajarshi-code-schedule-dark-mode';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
    
    // Update document class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
};