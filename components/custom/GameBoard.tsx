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
  size,
  pattern,
  playerPattern,
  isShowingPattern,
  currentShowingIndex,
  onTilePress,
}: GameBoardProps) {
  const gridSize = size;
  const tileSize = (width - (PADDING * 2) - (GRID_MARGIN * (gridSize - 1))) / gridSize;

  const renderTile = (index: number) => {
    const isActive = isShowingPattern
      ? pattern[currentShowingIndex] === index
      : playerPattern.includes(index);

    const animatedStyle = useAnimatedStyle(() => {
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

    return (
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
            animatedStyle,
          ]}
        />
      </TouchableOpacity>
    );
  };

  // Create an array with the correct number of tiles based on gridSize
  const totalTiles = gridSize * gridSize;
  const tiles = Array(totalTiles)
    .fill(0)
    .map((_, index) => renderTile(index));

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
        {tiles}
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