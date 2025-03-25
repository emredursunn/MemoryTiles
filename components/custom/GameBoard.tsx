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
  const { playBubbleSound, playFailSound } = useAudio();
  const themeColors = useTheme();
  const { theme } = useSettings();
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
    
    if (activationCount === 0) {
      // Use the theme's tile background color
      return themeColors.tileBg;
    }

    return colors[Math.min(activationCount - 1, colors.length - 1)];
  };
  
  // Create a single animated style function that will be used for all tiles
  // This ensures the number of hooks remains constant regardless of grid size
  const tileActiveState = useSharedValue<Record<number, boolean>>({});
  
  // Update the active state based on current game state
  React.useEffect(() => {
    const newState: Record<number, boolean> = {};
    
    tileIndices.forEach((index) => {
      newState[index] = isShowingPattern
        ? pattern[currentShowingIndex] === index
        : playerPattern.includes(index);
    });
    
    tileActiveState.value = newState;
  }, [isShowingPattern, pattern, currentShowingIndex, playerPattern, tileIndices]);
  
  // Create a single animated style that will be reused for all tiles
  const createAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const isActive = tileActiveState.value[index] || false;
      
      return {
        backgroundColor: withTiming(isActive ? getTileColor(index) : '#333333', {
          duration: 80,
        }),
        transform: [
          {
            scale: withTiming(isActive ? 1.05 : 1, { duration: 80 }),
          },
        ],
      };
    });
  };
  
  // Create a fixed number of animated styles that we'll reuse
  // This ensures we always call the same number of hooks
  const animatedStyle0 = createAnimatedStyle(0);
  const animatedStyle1 = createAnimatedStyle(1);
  const animatedStyle2 = createAnimatedStyle(2);
  const animatedStyle3 = createAnimatedStyle(3);
  const animatedStyle4 = createAnimatedStyle(4);
  const animatedStyle5 = createAnimatedStyle(5);
  const animatedStyle6 = createAnimatedStyle(6);
  const animatedStyle7 = createAnimatedStyle(7);
  const animatedStyle8 = createAnimatedStyle(8);
  const animatedStyle9 = createAnimatedStyle(9);
  const animatedStyle10 = createAnimatedStyle(10);
  const animatedStyle11 = createAnimatedStyle(11);
  const animatedStyle12 = createAnimatedStyle(12);
  const animatedStyle13 = createAnimatedStyle(13);
  const animatedStyle14 = createAnimatedStyle(14);
  const animatedStyle15 = createAnimatedStyle(15);
  const animatedStyle16 = createAnimatedStyle(16);
  const animatedStyle17 = createAnimatedStyle(17);
  const animatedStyle18 = createAnimatedStyle(18);
  const animatedStyle19 = createAnimatedStyle(19);
  const animatedStyle20 = createAnimatedStyle(20);
  const animatedStyle21 = createAnimatedStyle(21);
  const animatedStyle22 = createAnimatedStyle(22);
  const animatedStyle23 = createAnimatedStyle(23);
  const animatedStyle24 = createAnimatedStyle(24);
  const animatedStyle25 = createAnimatedStyle(25);
  const animatedStyle26 = createAnimatedStyle(26);
  const animatedStyle27 = createAnimatedStyle(27);
  const animatedStyle28 = createAnimatedStyle(28);
  const animatedStyle29 = createAnimatedStyle(29);
  const animatedStyle30 = createAnimatedStyle(30);
  const animatedStyle31 = createAnimatedStyle(31);
  const animatedStyle32 = createAnimatedStyle(32);
  const animatedStyle33 = createAnimatedStyle(33);
  const animatedStyle34 = createAnimatedStyle(34);
  const animatedStyle35 = createAnimatedStyle(35);
  
  // Create a lookup table for the animated styles
  const animatedStyles = useMemo(() => {
    return [
      animatedStyle0, animatedStyle1, animatedStyle2, animatedStyle3, animatedStyle4, animatedStyle5,
      animatedStyle6, animatedStyle7, animatedStyle8, animatedStyle9, animatedStyle10, animatedStyle11,
      animatedStyle12, animatedStyle13, animatedStyle14, animatedStyle15, animatedStyle16, animatedStyle17,
      animatedStyle18, animatedStyle19, animatedStyle20, animatedStyle21, animatedStyle22, animatedStyle23,
      animatedStyle24, animatedStyle25, animatedStyle26, animatedStyle27, animatedStyle28, animatedStyle29,
      animatedStyle30, animatedStyle31, animatedStyle32, animatedStyle33, animatedStyle34, animatedStyle35
    ];
  }, []);
  
  // The maximum grid size is 6x6 = 36, so we've created 36 animated styles

  return (
    <View style={styles.container}>
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
          <Pressable
            key={index}
            onPress={() => handlePress(index)}
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
                animatedStyles[index],
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

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