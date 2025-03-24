import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Crown, Trophy, Award, Star, BarChart } from 'lucide-react-native';

type ScoreDisplayProps = {
  score:any,
  highScore:any,
  level:any
}

export function ScoreDisplay({ score, highScore, level }: ScoreDisplayProps) {

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1.1) }],
  }));

  return (
    <View style={styles.container}>
      {/* Level Gösterimi */}
      <View style={styles.scoreItem}>
        <Award size={24} color="#FFD700" />
        <Text style={styles.score}>{level}</Text>
      </View>
      
      {/* Skor Gösterimi */}
      <View style={styles.scoreItem}>
        <BarChart size={24} color="#4CAF50" />
        <Text style={styles.score}>{score}</Text>
      </View>
      
      {/* En Yüksek Skor */}
     <Animated.View style={[styles.scoreItem, animatedStyle]}>
        <Trophy size={24} color="#FF9800" />
        <Animated.Text style={styles.score}>{highScore}</Animated.Text>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
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
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    minWidth: 40,
    textAlign: 'center',
  },
});