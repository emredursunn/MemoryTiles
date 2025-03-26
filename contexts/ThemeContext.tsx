// contexts/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  controlBar: string;
  tileBg: string;
  accent: string; // Yeni eklenen aksan rengi
};

const lightTheme: ThemeColors = {
  background: '#F8F9FA', // Soft white with a hint of gray
  text: '#2D3748', // Deep gray-blue for readability
  card: '#FFFFFF', // Pure white cards with subtle shadows
  controlBar: '#E2E8F0', // Very light gray-blue control area
  tileBg: '#EDF2F7', // Ultra light blue-gray tiles
  accent: '#4299E1', // Vibrant blue for interactive elements
};

const darkTheme: ThemeColors = {
  background: '#1A202C', // Deep blue-gray
  text: '#E2E8F0', // Soft white with blue tint
  card: '#2D3748', // Dark gray-blue cards
  controlBar: '#2D3748', // Slightly darker than cards
  tileBg: '#4A5568', // Medium blue-gray tiles
  accent: '#63B3ED', // Soft electric blue for accents
};

// Premium alternatif (daha lüks bir his için):
const premiumLightTheme: ThemeColors = {
  background: '#F5F3FF', // Ultra light lavender
  text: '#4C1D95', // Deep purple
  card: '#EDE9FE', // Light lavender cards
  controlBar: '#DDD6FE', // Medium lavender
  tileBg: '#C4B5FD', // Soft purple tiles
  accent: '#8B5CF6', // Vibrant purple
};

const premiumDarkTheme: ThemeColors = {
  background: '#1E1B4B', // Deep navy
  text: '#E9D5FF', // Soft lavender text
  card: '#312E81', // Dark navy cards
  controlBar: '#4338CA', // Rich blue control
  tileBg: '#5B21B6', // Royal purple tiles
  accent: '#A78BFA', // Light purple accent
};

const ThemeContext = createContext<ThemeColors>(premiumDarkTheme);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { theme } = useSettings();
  
  return (
    <ThemeContext.Provider value={theme === 'dark' ? premiumDarkTheme : premiumLightTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);