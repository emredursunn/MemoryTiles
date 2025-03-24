// contexts/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  // Diğer tema renkleri...
};

const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  text: '#333',
  card: '#fff',
};

const darkTheme: ThemeColors = {
  background: '#121212',
  text: '#fff',
  card: '#1e1e1e',
};

const ThemeContext = createContext<ThemeColors>(darkTheme);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { theme } = useSettings();
  
  return (
    <ThemeContext.Provider value={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);