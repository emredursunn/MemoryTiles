import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  level: number;
}

export function ScoreDisplay({ score, highScore, level }: ScoreDisplayProps) {
  const animatedScoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1.2) }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>Score</Text>
        <Animated.Text style={[styles.score, animatedScoreStyle]}>
          {score}
        </Animated.Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>High Score</Text>
        <Text style={styles.score}>{highScore}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>Level</Text>
        <Text style={styles.score}>{level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  label: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
});