// index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GameBoard } from '../../components/custom/GameBoard';
import { ScoreDisplay } from '../../components/custom/ScoreDisplay';
import { useGameLogic } from '../../hooks/useGameLogic';
import { PauseIcon, Play, SettingsIcon } from 'lucide-react-native';

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

  return (
    <View style={styles.container}>
      <ScoreDisplay score={score} highScore={highScore} level={level} />
      
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Play color="#fff" size={24} />
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : pattern.length === 0 ? (
        <View style={styles.startContainer}>
          <Text style={styles.titleText}>Memory Tiles</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Play color="#fff" size={24} />
            <Text style={styles.buttonText}>Start Game</Text>
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
          <View style={styles.bottomPanel}>
            <TouchableOpacity style={styles.iconButton}>
              <PauseIcon color="#fff" size={28} />
            </TouchableOpacity>
            <Text style={styles.levelText}>Level {level}</Text>
            <TouchableOpacity style={styles.iconButton}>
              <SettingsIcon color="#fff" size={28} />
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
    backgroundColor: '#121212',
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
    color: '#fff',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  finalScoreText: {
    fontSize: 24,
    color: '#aaa',
    fontFamily: 'Inter-SemiBold',
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
    color: '#fff',
    fontFamily: 'Inter-Bold',
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
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  bottomPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto', // Bu sayede panel en alta yapışır
  },
  iconButton: {
    padding: 10,
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});