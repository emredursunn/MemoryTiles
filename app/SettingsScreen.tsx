// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const {
    gridSize,
    setGridSize,
    displaySpeed,
    setDisplaySpeed,
    theme,
    setTheme,
  } = useSettings();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Game Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.label}>Grid Size: {gridSize}x{gridSize}</Text>
          <Slider
            style={styles.slider}
            minimumValue={2}
            maximumValue={6}
            step={1}
            value={gridSize}
            onValueChange={setGridSize}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#888"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Pattern Speed: {displaySpeed}ms</Text>
          <Slider
            style={styles.slider}
            minimumValue={300}
            maximumValue={2000}
            step={100}
            value={displaySpeed}
            onValueChange={setDisplaySpeed}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#888"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
            trackColor={{ false: '#888', true: '#4CAF50' }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  settingItem: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default SettingsScreen;