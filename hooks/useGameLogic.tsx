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
  const [gameOver, setGameOver] = useState(false);
  const [consecutiveActivations, setConsecutiveActivations] = useState<{ [key: number]: number }>({});

  // Fixed grid size (e.g., 4x4)
  const gridSize = 3;

  useEffect(() => {
    loadHighScore();
  }, []);

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
    const patternLength = INITIAL_PATTERN_LENGTH + Math.floor(level / 2);
    const maxTileIndex = gridSize * gridSize;
    const newPattern = Array(patternLength)
      .fill(0)
      .map(() => Math.floor(Math.random() * maxTileIndex));

    console.log('Generated Pattern:', newPattern);
    setPattern(newPattern);
    return newPattern;
  }, [level, gridSize]);

const showPattern = useCallback(async (patternToShow: number[]) => {
  setIsShowingPattern(true);
  setPlayerPattern([]);
  setConsecutiveActivations({});

  // Dynamic speed based on level
  const baseSpeed = Math.max(
    MIN_DISPLAY_DURATION,
    INITIAL_DISPLAY_DURATION - level * 50
  );

  for (let i = 0; i < patternToShow.length; i++) {
    const tileIndex = patternToShow[i];
    setConsecutiveActivations((prev) => ({ ...prev, [tileIndex]: (prev[tileIndex] || 0) + 1 }));
    setCurrentShowingIndex(i);
    await new Promise((resolve) => setTimeout(resolve, baseSpeed));
    
    if (i < patternToShow.length - 1 && patternToShow[i + 1] !== tileIndex) {
      setConsecutiveActivations((prev) => ({ ...prev, [tileIndex]: 0 }));
    }
  }

  setIsShowingPattern(false);
}, [level]);

  const startGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    const newPattern = generatePattern();
    console.log('Initial Pattern:', newPattern); // Log the initial pattern
    setPattern(newPattern);
    showPattern(newPattern); // Pass the new pattern to showPattern
  }, [generatePattern, showPattern]);

  const handleTilePress = useCallback(
    (tileIndex: number) => {
      if (isShowingPattern) return;
  
      // Update consecutive activations
      setConsecutiveActivations((prev) => ({
        ...prev,
        [tileIndex]: (prev[tileIndex] || 0) + 1,
      }));
  
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
        const newLevel = level + 1;
        setLevel(newLevel);
  
        // Reset player pattern and current showing index
        setPlayerPattern([]);
        setCurrentShowingIndex(-1);
  
        setTimeout(() => {
          const patternLength = INITIAL_PATTERN_LENGTH + Math.floor(newLevel / 2);
          const maxTileIndex = gridSize * gridSize;
          const newPattern = Array(patternLength)
            .fill(0)
            .map(() => Math.floor(Math.random() * maxTileIndex));
  
          console.log('Generated Pattern:', newPattern);
          setPattern(newPattern);
          showPattern(newPattern);
        }, 1000);
      }
    },
    [isShowingPattern, playerPattern, pattern, score, highScore, level, gridSize]
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
    consecutiveActivations,
    handleTilePress,
    startGame,
  };
}