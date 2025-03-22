import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const PADDING = 20;
const GRID_MARGIN = 10;

interface GameBoardProps {
  size: number;
  pattern: number[];
  playerPattern: number[];
  isShowingPattern: boolean;
  currentShowingIndex: number;
  onTilePress: (index: number) => void;
}

export function GameBoard({
  size, // Fixed grid size
  pattern,
  playerPattern,
  isShowingPattern,
  currentShowingIndex,
  onTilePress,
}: GameBoardProps) {
  const gridSize = size;
  const tileSize = Math.max(
    10, // Minimum tile size to prevent it from being too small
    (width - PADDING * 2 - GRID_MARGIN * (gridSize - 1)) / gridSize
  );

  // Create an array of tile indices
  const totalTiles = gridSize * gridSize;
  const tileIndices = Array(totalTiles).fill(0).map((_, index) => index);

  // Pre-define animated styles for all tiles
  const animatedStyles = tileIndices.map((index) => {
    const isActive = isShowingPattern
      ? pattern[currentShowingIndex] === index
      : playerPattern.includes(index);

    return useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(isActive ? '#4CAF50' : '#333333', {
          duration: 300,
        }),
        transform: [
          {
            scale: withSequence(
              withTiming(isActive ? 1.1 : 1, { duration: 150 }),
              withTiming(1, { duration: 150 })
            ),
          },
        ],
      };
    });
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            width: width - PADDING * 2,
            height: width - PADDING * 2,
          },
        ]}>
        {tileIndices.map((index) => (
          <TouchableOpacity
            key={index}
            onPress={() => !isShowingPattern && onTilePress(index)}
            disabled={isShowingPattern}>
            <Animated.View
              style={[
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  margin: GRID_MARGIN / 2,
                },
                animatedStyles[index], // Use pre-defined animated style
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
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
