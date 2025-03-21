import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GameBoard } from '../../components/custom/GameBoard';
import { ScoreDisplay } from '../../components/custom/ScoreDisplay';
import { useGameLogic } from '../../hooks/useGameLogic';
import { Play } from 'lucide-react-native';

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
        <GameBoard
          size={gridSize}
          pattern={pattern}
          playerPattern={playerPattern}
          isShowingPattern={isShowingPattern}
          currentShowingIndex={currentShowingIndex}
          onTilePress={handleTilePress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  finalScoreText: {
    fontSize: 24,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 40,
    color: '#fff',
    fontFamily: 'Inter-Bold',
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});