// contexts/SettingsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';
type SettingsContextType = {
  gridSize: number;
  setGridSize: (size: number) => void;
  displaySpeed: number;
  setDisplaySpeed: (speed: number) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  loadSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [gridSize, setGridSize] = useState(3);
  const [displaySpeed, setDisplaySpeed] = useState(1000);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@settings');
      if (savedSettings) {
        const { gridSize: savedSize, displaySpeed: savedSpeed, theme: savedTheme } = JSON.parse(savedSettings);
        setGridSize(savedSize || 3);
        setDisplaySpeed(savedSpeed || 1000);
        setTheme(savedTheme || 'dark');
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const saveSettings = async (newSettings: Partial<SettingsContextType>) => {
    try {
      const settings = {
        gridSize,
        displaySpeed,
        theme,
        ...newSettings
      };
      await AsyncStorage.setItem('@settings', JSON.stringify(settings));
      
      // State güncelle
      if (newSettings.gridSize) setGridSize(newSettings.gridSize);
      if (newSettings.displaySpeed) setDisplaySpeed(newSettings.displaySpeed);
      if (newSettings.theme) setTheme(newSettings.theme);
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      gridSize,
      setGridSize: (size) => saveSettings({ gridSize: size }),
      displaySpeed,
      setDisplaySpeed: (speed) => saveSettings({ displaySpeed: speed }),
      theme,
      setTheme: (theme) => saveSettings({ theme }),
      loadSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};