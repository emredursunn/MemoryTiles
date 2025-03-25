import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Crown, Trophy, Award, Star, BarChart } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

type ScoreDisplayProps = {
  score:any,
  highScore:any,
  level:any
}

export function ScoreDisplay({ score, highScore, level }: ScoreDisplayProps) {
  const themeColors = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1.1) }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: themeColors.controlBar + 'E6' }]}>
      {/* Level Gösterimi */}
      <View style={styles.scoreItem}>
        <Award size={24} color="#FFD700" />
        <Text style={[styles.score, { color: themeColors.text }]}>{level}</Text>
      </View>
      
      {/* Skor Gösterimi */}
      <View style={styles.scoreItem}>
        <BarChart size={24} color="#4CAF50" />
        <Text style={[styles.score, { color: themeColors.text }]}>{score}</Text>
      </View>
      
      {/* En Yüksek Skor */}
     <Animated.View style={[styles.scoreItem, animatedStyle]}>
        <Trophy size={24} color="#FF9800" />
        <Animated.Text style={[styles.score, { color: themeColors.text }]}>{highScore}</Animated.Text>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
});