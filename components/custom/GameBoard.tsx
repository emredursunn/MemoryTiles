//Gameboard.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useAudio from '@/hooks/useAudio';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

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
  const { playBubbleSound } = useAudio();
  const themeColors = useTheme();
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
  

  // Function to get the tile color based on consecutive activations and theme
  const colors = ['#4CAF50', '#FF9800', '#F44336', '#a83291', '#4632a8'];
  const getTileColor = (index: number): string => {
    'worklet'
    const activationCount = consecutiveActivations[index] || 0;
    if (activationCount == 0) {
      // Use the theme's tile background color
      return themeColors.tileBg;
    }
    return colors[Math.min(activationCount - 1, colors.length - 1)];
  };
  
  // Create a single animated style function that will be used for all tiles
  // This ensures the number of hooks remains constant regardless of grid size

  const tileActiveState = useSharedValue<Record<number, boolean>>({});

  // Tüm tile durumlarını güncelle (orijinal mantık)
  React.useEffect(() => {
    const newState: Record<number, boolean> = {};
    
    tileIndices.forEach((index) => {
      newState[index] = isShowingPattern
        ? pattern[currentShowingIndex] === index
        : playerPattern.includes(index);
    });
    
    tileActiveState.value = newState;
  }, [isShowingPattern, pattern, currentShowingIndex, playerPattern, tileIndices]);

  // Tile bileşeni (orijinal animasyon mantığıyla)
  const Tile = React.memo(({ index, onPress, isShowingPattern, tileSize } : {
    index: number,
    onPress: (index: number) => void,
    isShowingPattern: boolean,
    tileSize: number
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const isActive = tileActiveState.value[index] || false;
      
      return {
        backgroundColor: withTiming(
          isActive ? getTileColor(index) : themeColors.tileBg,
          { duration: 80 }
        ),
        transform: [
          { scale: withTiming(isActive ? 1.05 : 1, { duration: 80 }) },
        ],
      };
    });

    return (
      <Pressable
        onPress={() => onPress(index)}
        disabled={isShowingPattern}
        style={({ pressed }) => [{
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        }]}>
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
      </Pressable>
    );
  });

  // Render kısmı (orijinal düzen)
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            width: availableWidth,
            height: availableWidth,
            paddingHorizontal: GRID_MARGIN / 2,
          },
        ]}>
        {tileIndices.map((index) => (
          <Tile
            key={index}
            index={index}
            onPress={handlePress}
            isShowingPattern={isShowingPattern}
            tileSize={tileSize}
          />
        ))}
      </View>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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