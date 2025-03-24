//Gameboard.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useAudio from '@/hooks/useAudio';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const PADDING = 10; // Daha az padding
const GRID_MARGIN = 8;

interface GameBoardProps {
  size: number;
  pattern: number[];
  playerPattern: number[];
  isShowingPattern: boolean;
  currentShowingIndex: number;
  consecutiveActivations: { [key: number]: number };
  onTilePress: (index: number) => void;
}

export function GameBoard({
  size,
  pattern,
  playerPattern,
  isShowingPattern,
  currentShowingIndex,
  consecutiveActivations = {},
  onTilePress,
}: GameBoardProps) {
  const gridSize = size;
  const { playBubbleSound, playFailSound } = useAudio();
  // Calculate available width after accounting for padding
  const availableWidth = width - PADDING * 2;
  
// Tile boyutunu hesaplarken yüksekliği de dikkate al
const tileSize = Math.min(
  (width - PADDING * 2 - (gridSize + 1) * GRID_MARGIN) / gridSize,
  (height * 0.6 - PADDING * 2 - (gridSize + 1) * GRID_MARGIN) / gridSize
);
  // Create an array of tile indices
  const totalTiles = gridSize * gridSize;
  const tileIndices = Array(totalTiles).fill(0).map((_, index) => index);

  const handlePress = (index: number) => {
    if (!isShowingPattern) {
      playBubbleSound(); // Kutulara basınca bubble sesi
      onTilePress(index);
    }
  };

  const theme = useTheme();

  // Function to get the tile color based on consecutive activations
  const colors = ['#4CAF50', '#FF9800', '#F44336', '#a83291', '#4632a8'];
  const getTileColor = (index: number): string => {
    'worklet'
    const activationCount = consecutiveActivations[index] || 0;
    
    if (activationCount === 0) return '#333333'; // Default color

    return colors[Math.min(activationCount - 1, colors.length - 1)];
  };

  const sharedAnimatedStyle = (isActive: boolean, index: number) => {
    return useAnimatedStyle(() => ({
      backgroundColor: withTiming(isActive ? getTileColor(index) : '#333333', {
        duration: 80,
      }),
      transform: [
        {
          scale: withTiming(isActive ? 1.05 : 1, { duration: 80 }),
        },
      ],
    }));
  };

const animatedStyles = tileIndices.map((index) => {
  const isActive = isShowingPattern
    ? pattern[currentShowingIndex] === index
    : playerPattern.includes(index);

    return sharedAnimatedStyle(isActive, index);
});

  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <View
        style={[
          styles.grid,
          {
            width: availableWidth,
            height: availableWidth,
            paddingHorizontal: GRID_MARGIN / 2, // Add horizontal padding to grid for margins
          },
        ]}>
        {tileIndices.map((index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            disabled={isShowingPattern}>
            <Animated.View
              style={[
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  margin: GRID_MARGIN / 2,
                },
                animatedStyles[index],
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});