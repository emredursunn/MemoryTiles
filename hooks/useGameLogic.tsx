import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_PATTERN_LENGTH = 3;
const INITIAL_DISPLAY_DURATION = 1000;
const MIN_DISPLAY_DURATION = 500;

export function useGameLogic() {
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [currentShowingIndex, setCurrentShowingIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadHighScore();
  }, []);

  // Update grid size when level changes
  useEffect(() => {
    // Update grid size based on level
    if (level >= 10) {
      setGridSize(5);
    } else if (level >= 5) {
      setGridSize(4);
    } else {
      setGridSize(3);
    }
  }, [level]);

  const loadHighScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem('highScore');
      if (savedScore) setHighScore(parseInt(savedScore, 10));
    } catch (error) {
      console.error('Error loading high score:', error);
    }
  };

  const saveHighScore = async (newScore: number) => {
    try {
      await AsyncStorage.setItem('highScore', newScore.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  const generatePattern = useCallback(() => {
    // Calculate pattern length based on current level
    const patternLength = INITIAL_PATTERN_LENGTH + Math.floor(level / 2);
    // Ensure we use the current grid size to determine the maximum tile index
    const maxTileIndex = gridSize * gridSize;
    // Generate random pattern within the valid range
    const newPattern = Array(patternLength)
      .fill(0)
      .map(() => Math.floor(Math.random() * maxTileIndex));
    setPattern(newPattern);
    return newPattern;
  }, [level, gridSize]);

  const showPattern = useCallback(async () => {
    setIsShowingPattern(true);
    setPlayerPattern([]);

    for (let i = 0; i < pattern.length; i++) {
      setCurrentShowingIndex(i);
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          Math.max(
            MIN_DISPLAY_DURATION,
            INITIAL_DISPLAY_DURATION - level * 50
          )
        )
      );
    }

    setCurrentShowingIndex(-1);
    setIsShowingPattern(false);
  }, [pattern, level]);

  const startGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setGridSize(3);
    const newPattern = generatePattern();
    setPattern(newPattern);
    showPattern();
  }, [generatePattern, showPattern]);

  const handleTilePress = useCallback(
    (tileIndex: number) => {
      if (isShowingPattern) return;

      const newPlayerPattern = [...playerPattern, tileIndex];
      setPlayerPattern(newPlayerPattern);

      const currentIndex = newPlayerPattern.length - 1;
      if (pattern[currentIndex] !== tileIndex) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          saveHighScore(score);
        }
        return;
      }

      if (newPlayerPattern.length === pattern.length) {
        setScore((prevScore) => prevScore + pattern.length * 10);
        // Update level first, then generate a new pattern with the new level
        const newLevel = level + 1;
        setLevel(newLevel);
        
        // Determine the new grid size based on the new level
        let newGridSize = gridSize;
        if (newLevel >= 10) {
          newGridSize = 5;
        } else if (newLevel >= 5) {
          newGridSize = 4;
        } else {
          newGridSize = 3;
        }
        
        // Update grid size if needed
        if (newGridSize !== gridSize) {
          setGridSize(newGridSize);
        }
        
        setTimeout(() => {
          // Calculate pattern length using the new level value directly
          const patternLength = INITIAL_PATTERN_LENGTH + Math.floor(newLevel / 2);
          // Use the new grid size for calculating max tile index
          const maxTileIndex = newGridSize * newGridSize;
          const newPattern = Array(patternLength)
            .fill(0)
            .map(() => Math.floor(Math.random() * maxTileIndex));
          
          setPattern(newPattern);
          showPattern();
        }, 1000);
      }
    },
    [
      isShowingPattern,
      playerPattern,
      pattern,
      score,
      highScore,
      generatePattern,
      showPattern,
    ]
  );

  return {
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
  };
}