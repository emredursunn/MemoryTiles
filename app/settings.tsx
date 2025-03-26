// app/settings.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun, Grid, Zap, Check } from 'lucide-react-native';

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

  // Speed options with labels
  const speedOptions = [
    { value: 600, label: "Fast", description: "Quick patterns" },
    { value: 900, label: "Medium", description: "Balanced speed" },
    { value: 1500, label: "Slow", description: "Easier to follow" }
  ];

  const gridSizeOptions = [2, 3, 4, 5, 6];

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: themeColors.divider }]}>
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
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section - Box Style */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Appearance</Text>
          <View style={[styles.themeToggleContainer, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity 
              style={[
                styles.themeOptionBox,
                theme === 'light' && { 
                  backgroundColor: themeColors.primary + '20',
                  borderColor: themeColors.primary
                },
                { borderColor: themeColors.divider }
              ]}
              onPress={() => setTheme('light')}
            >
              <Sun 
                color={theme === 'light' ? themeColors.primary : themeColors.textSecondary} 
                size={20} 
              />
              <Text style={[
                styles.themeOptionText,
                { 
                  color: theme === 'light' ? themeColors.primary : themeColors.text,
                }
              ]}>
                Light
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.themeOptionBox,
                theme === 'dark' && { 
                  backgroundColor: themeColors.primary + '20',
                  borderColor: themeColors.primary
                },
                { borderColor: themeColors.divider }
              ]}
              onPress={() => setTheme('dark')}
            >
              <Moon 
                color={theme === 'dark' ? themeColors.primary : themeColors.textSecondary} 
                size={20} 
              />
              <Text style={[
                styles.themeOptionText,
                { 
                  color: theme === 'dark' ? themeColors.primary : themeColors.text,
                }
              ]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid Size Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Grid Size</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <View style={styles.gridOptionsContainer}>
              {gridSizeOptions.map((size) => (
                <TouchableOpacity
                  key={`grid-${size}`}
                  style={[
                    styles.gridOption,
                  ]}
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
                              { 
                                backgroundColor: gridSize === size ? 
                                  themeColors.primary : 
                                  themeColors.textSecondary + '40'
                              } 
                            ]}
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                  <Text style={[
                    styles.gridSizeText, 
                    { 
                      color: gridSize === size ? 
                        themeColors.primary : 
                        themeColors.text
                    }
                  ]}>
                    {size}×{size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Speed Section - Card Style */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pattern Speed</Text>
          <View style={styles.speedCardsContainer}>
            {speedOptions.map((speed) => {
              const isActive = displaySpeed === speed.value;
              
              return (
                <TouchableOpacity
                  key={`speed-${speed.value}`}
                  style={[
                    styles.speedCard,
                    { 
                      backgroundColor: themeColors.card,
                      borderColor: isActive ? themeColors.primary : themeColors.divider
                    }
                  ]}
                  onPress={() => setDisplaySpeed(speed.value)}
                >
                  <View style={styles.speedCardContent}>
                    <View style={[
                      styles.speedIconContainer,
                      { backgroundColor: isActive ? themeColors.primary + '10' : 'transparent' }
                    ]}>
                      <Zap 
                        size={24} 
                        color={isActive ? themeColors.primary : themeColors.textSecondary} 
                        fill={isActive ? themeColors.primary : 'transparent'}
                      />
                    </View>
                    <View>
                      <Text style={[
                        styles.speedCardTitle,
                        { 
                          color: isActive ? themeColors.primary : themeColors.text,
                        }
                      ]}>
                        {speed.label}
                      </Text>
                      <Text style={[
                        styles.speedCardDescription,
                        { 
                          color: isActive ? themeColors.primary + '90' : themeColors.textSecondary,
                        }
                      ]}>
                        {speed.description}
                      </Text>
                    </View>
                  </View>
                  {isActive && (
                    <View style={[
                      styles.speedCardBadge,
                      { backgroundColor: themeColors.primary }
                    ]}>
                      <Text style={styles.speedCardBadgeText}>
                        {speed.value}ms
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Theme Toggle Styles
  themeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  themeOptionBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    position: 'relative',
  },
  themeOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  // Grid Size Styles
  gridOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  gridOption: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
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
    borderRadius: 1,
  },
  gridSizeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  // Speed Cards Styles
  speedCardsContainer: {
    gap: 12,
  },
  speedCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  speedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  speedCardDescription: {
    fontSize: 14,
  },
  speedCardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  speedCardBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});