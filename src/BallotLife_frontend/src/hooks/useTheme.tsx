import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import { getFromStorage, setToStorage, getSystemTheme, resolveThemeMode } from '../utils';
import type { ThemeMode, ThemeState } from '../types';

const ThemeContext = createContext<ThemeState | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return getFromStorage('THEME', 'system');
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    return resolveThemeMode(mode);
  });

  // Update resolved mode when mode or system preference changes
  useEffect(() => {
    const newResolvedMode = resolveThemeMode(mode);
    setResolvedMode(newResolvedMode);
  }, [mode]);

  // Listen to system theme changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setResolvedMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    setToStorage('THEME', newMode);
  };

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  const theme = createAppTheme(resolvedMode);

  const value: ThemeState = {
    mode,
    toggleMode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeState => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};