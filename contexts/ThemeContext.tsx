// contexts/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  controlBar: string;
  tileBg: string;
  // Diğer tema renkleri...
};

const lightTheme: ThemeColors = {
  background: '#F5F0E1', // Beige background
  text: '#5D4037', // Darker brown text
  card: '#F0E6D2', // Lighter beige for cards
  controlBar: '#E6D7C3', // Slightly darker beige for controls
  tileBg: '#D7CCA8', // Default tile color in light mode
};

const darkTheme: ThemeColors = {
  background: '#121212',
  text: '#fff',
  card: '#1e1e1e',
  controlBar: '#1a1a1a',
  tileBg: '#333333', // Default tile color in dark mode
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