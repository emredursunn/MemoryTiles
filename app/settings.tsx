// app/settings.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, StatusBar, Pressable, Animated } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun, Grid, Clock, Zap, Check, Activity } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function SettingsScreen() {
  const {
    gridSize,
    setGridSize,
    displaySpeed,
    setDisplaySpeed,
    theme,
    setTheme,
    loadSettings,
  } = useSettings();

  const themeColors = useTheme();
  const router = useRouter();
  
  // Speed options in ms
  const speedOptions = [300, 600, 900, 1200, 1500, 2000];
  
  // Grid size options
  const gridSizeOptions = [2, 3, 4, 5, 6];

  useEffect(() => {
    // Load settings when component mounts
    loadSettings();
  }, [loadSettings]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={themeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Appearance</Text>
            {theme === 'dark' ? (
              <Moon color={themeColors.text} size={18} />
            ) : (
              <Sun color={themeColors.text} size={18} />
            )}
          </View>
          
          <View style={[styles.themeContainer, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity 
              style={[styles.themeOption, theme === 'light' && styles.activeThemeOption]}
              onPress={() => setTheme('light')}
            >
              <View style={styles.themeContent}>
                <View style={[styles.themeIconContainer, { backgroundColor: theme === 'light' ? '#FFECB3' : themeColors.card }]}>
                  <Sun color={theme === 'light' ? '#FF9800' : themeColors.text + '60'} size={24} />
                </View>
                <Text style={[styles.themeText, { color: themeColors.text, opacity: theme === 'light' ? 1 : 0.6 }]}>Light</Text>
                {theme === 'light' && (
                  <View style={styles.activeIndicator}>
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeOption, theme === 'dark' && styles.activeThemeOption]}
              onPress={() => setTheme('dark')}
            >
              <View style={styles.themeContent}>
                <View style={[styles.themeIconContainer, { backgroundColor: theme === 'dark' ? '#5C6BC0' : themeColors.card }]}>
                  <Moon color={theme === 'dark' ? '#fff' : themeColors.text + '60'} size={24} />
                </View>
                <Text style={[styles.themeText, { color: themeColors.text, opacity: theme === 'dark' ? 1 : 0.6 }]}>Dark</Text>
                {theme === 'dark' && (
                  <View style={styles.activeIndicator}>
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid Size Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Grid Size</Text>
            <Grid color={themeColors.text} size={18} />
          </View>
          
          <View style={[styles.gridContainer, { backgroundColor: themeColors.card }]}>
            {gridSizeOptions.map((size) => (
              <TouchableOpacity
                key={`grid-${size}`}
                style={[styles.gridOption, gridSize === size && styles.activeGridOption]}
                onPress={() => setGridSize(size)}
              >
                <View style={styles.gridPreview}>
                  {Array.from({ length: size }).map((_, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.gridRow}>
                      {Array.from({ length: size }).map((_, colIndex) => (
                        <View 
                          key={`cell-${rowIndex}-${colIndex}`} 
                          style={[
                            styles.gridCell,
                            { backgroundColor: gridSize === size ? '#4CAF50' : themeColors.tileBg }
                          ]} 
                        />
                      ))}
                    </View>
                  ))}
                </View>
                <Text style={[styles.gridSizeText, { 
                  color: gridSize === size ? '#4CAF50' : themeColors.text,
                  fontWeight: gridSize === size ? '700' : '500'
                }]}>
                  {size}×{size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Speed Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pattern Speed</Text>
            <Activity color={themeColors.text} size={18} />
          </View>
          
          <View style={[styles.speedContainer, { backgroundColor: themeColors.card }]}>
            {speedOptions.map((speed) => {
              const isActive = displaySpeed === speed;
              const speedType = speed <= 600 ? 'Fast' : speed <= 1200 ? 'Medium' : 'Slow';
              const speedColor = speed <= 600 ? '#F44336' : speed <= 1200 ? '#FF9800' : '#4CAF50';
              
              return (
                <TouchableOpacity
                  key={`speed-${speed}`}
                  style={[styles.speedOption, isActive && styles.activeSpeedOption]}
                  onPress={() => setDisplaySpeed(speed)}
                >
                  <View style={[styles.speedIconContainer, { backgroundColor: isActive ? speedColor + '20' : 'transparent' }]}>
                    <Zap size={24} color={isActive ? speedColor : themeColors.text + '60'} />
                    {speed <= 600 && <Zap size={24} color={isActive ? speedColor : themeColors.text + '60'} style={styles.secondZap} />}
                  </View>
                  <Text style={[styles.speedValueText, { 
                    color: isActive ? speedColor : themeColors.text,
                    fontWeight: isActive ? '700' : '500'
                  }]}>
                    {speed} ms
                  </Text>
                  <Text style={[styles.speedTypeText, { 
                    color: isActive ? speedColor : themeColors.text + '80' 
                  }]}>
                    {speedType}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>About</Text>
          </View>
          <View style={[styles.aboutContainer, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.appTitle, { color: themeColors.text }]}>Memory Tiles</Text>
            <Text style={[styles.appVersion, { color: themeColors.text + '99' }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  
  // Theme styles
  themeContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 10,
  },
  themeOption: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    margin: 5,
    position: 'relative',
  },
  activeThemeOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  themeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Grid styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 15,
  },
  gridOption: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 12,
  },
  activeGridOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  gridPreview: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 6,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    margin: 1,
    borderRadius: 2,
  },
  gridSizeText: {
    fontSize: 14,
  },
  
  // Speed styles
  speedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 15,
  },
  speedOption: {
    width: '31%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeSpeedOption: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  speedIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  secondZap: {
    position: 'absolute',
    left: 10,
    opacity: 0.7,
  },
  speedValueText: {
    fontSize: 16,
    marginBottom: 2,
  },
  speedTypeText: {
    fontSize: 12,
  },
  
  // About styles
  aboutContainer: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
  },
});

// export default SettingsScreen;