'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'multi-color';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: CustomColors;
  updateCustomColors: (colors: Partial<CustomColors>) => void;
  resetCustomColors: () => void;
}

const defaultCustomColors: CustomColors = {
  primary: '#4F8CFF',
  secondary: '#8B5CF6',
  accent: '#38BDF8',
  background: '#f9fafb',
  text: '#1f2937',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [customColors, setCustomColors] = useState<CustomColors>(defaultCustomColors);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedCustomColors = localStorage.getItem('customColors');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (e) {
        setCustomColors(defaultCustomColors);
      }
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage and apply to document
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'multi-color');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Save custom colors to localStorage and apply CSS variables
    localStorage.setItem('customColors', JSON.stringify(customColors));
    
    // Apply custom colors as CSS variables to root element
    const root = document.documentElement;
    root.style.setProperty('--custom-primary', customColors.primary);
    root.style.setProperty('--custom-secondary', customColors.secondary);
    root.style.setProperty('--custom-accent', customColors.accent);
    root.style.setProperty('--custom-background', customColors.background);
    root.style.setProperty('--custom-text', customColors.text);
  }, [customColors]);

  const updateCustomColors = useCallback((newColors: Partial<CustomColors>) => {
    setCustomColors(prev => ({ ...prev, ...newColors }));
  }, []);

  const resetCustomColors = useCallback(() => {
    setCustomColors(defaultCustomColors);
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    customColors,
    updateCustomColors,
    resetCustomColors,
  }), [theme, customColors, updateCustomColors, resetCustomColors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
