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

    console.log('Showing Pattern:', patternToShow);

    // Reset consecutive activations
    setConsecutiveActivations({});

    for (let i = 0; i < patternToShow.length; i++) {
      const tileIndex = patternToShow[i];

      // Update consecutive activations
      setConsecutiveActivations((prev) => ({
        ...prev,
        [tileIndex]: (prev[tileIndex] || 0) + 1,
      }));

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

      // Reset consecutive activations if the next tile is different
      if (i < patternToShow.length - 1 && patternToShow[i + 1] !== tileIndex) {
        setConsecutiveActivations((prev) => ({
          ...prev,
          [tileIndex]: 0,
        }));
      }
    }

    // Reset consecutive activations when pattern display ends
    setConsecutiveActivations({});
    setCurrentShowingIndex(-1);
    setIsShowingPattern(false);
  }, [level]);

  const startGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setLevel(1); // Reset level to 1 immediately
    setPlayerPattern([]); // Reset player pattern
    setConsecutiveActivations({}); // Reset consecutive activations
    setCurrentShowingIndex(-1); // Reset current showing index
  }, []);

  // Generate the new pattern after the level state has been updated
  useEffect(() => {
    if (level === 1 && !gameOver) {
      const newPattern = generatePattern();
      console.log('Initial Pattern:', newPattern);
      setPattern(newPattern);
      showPattern(newPattern);
    }
  }, [level, gameOver, generatePattern, showPattern]);

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

        // Add a delay before starting the next level
        setTimeout(() => {
          // Reset player pattern and current showing index
          setPlayerPattern([]);
          setCurrentShowingIndex(-1);

          // Generate the new pattern for the next level
          const patternLength = INITIAL_PATTERN_LENGTH + Math.floor(newLevel / 2);
          const maxTileIndex = gridSize * gridSize;
          const newPattern = Array(patternLength)
            .fill(0)
            .map(() => Math.floor(Math.random() * maxTileIndex));

          console.log('Generated Pattern:', newPattern);
          setPattern(newPattern);
          showPattern(newPattern);
        }, 500); // 500ms delay before starting the next level
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