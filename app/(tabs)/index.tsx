// index.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GameBoard } from '../../components/custom/GameBoard';
import { ScoreDisplay } from '../../components/custom/ScoreDisplay';
import { useGameLogic } from '../../hooks/useGameLogic';
import { PauseIcon, Play, SettingsIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function GameScreen() {
  const {
    pattern,
    playerPattern,
    isShowingPattern,
    currentShowingIndex,
    score,
    highScore,
    level,
    gridSize,
    gameOver,
    consecutiveActivations,
    handleTilePress,
    startGame,
  } = useGameLogic();

  const router = useRouter();
  const themeColors = useTheme();
  const { theme } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScoreDisplay score={score} highScore={highScore} level={level} />
      
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={[styles.gameOverText, { color: themeColors.text }]}>Game Over!</Text>
          <Text style={[styles.finalScoreText, { color: themeColors.text + '99' }]}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Play color="#fff" size={24} />
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : pattern.length === 0 ? (
        <View style={styles.startContainer}>
          <Text style={[styles.titleText, { color: themeColors.text }]}>Memory Tiles</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Play color={themeColors.text} size={24} />
            <Text style={[styles.buttonText, { color: themeColors.text }]}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <GameBoard
            size={gridSize}
            pattern={pattern}
            playerPattern={playerPattern}
            isShowingPattern={isShowingPattern}
            currentShowingIndex={currentShowingIndex}
            consecutiveActivations={consecutiveActivations}
            onTilePress={handleTilePress}
          />
          <View style={[styles.bottomPanel, { backgroundColor: themeColors.controlBar + 'CC' }]}>
            <TouchableOpacity style={styles.iconButton}>
              <PauseIcon color={themeColors.text} size={28} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
              <SettingsIcon color={themeColors.text} size={28} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  finalScoreText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  bottomPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto', // Bu sayede panel en alta yapışır
  },
  iconButton: {
    padding: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
  },
});