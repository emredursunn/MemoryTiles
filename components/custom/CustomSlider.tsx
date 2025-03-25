import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

type CustomSliderProps = {
  minimumValue: number;
  maximumValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: any;
  label?: string;
  showValue?: boolean;
};

export function CustomSlider({
  minimumValue,
  maximumValue,
  step,
  value,
  onValueChange,
  minimumTrackTintColor = '#4CAF50',
  maximumTrackTintColor = '#ddd',
  thumbTintColor = '#fff',
  style,
  label,
  showValue = true,
}: CustomSliderProps) {
  const sliderWidth = 300;
  const thumbSize = 24;
  
  // Calculate the initial position based on the value
  const calculatePosition = (val: number) => {
    return ((val - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
  };
  
  const position = useSharedValue(calculatePosition(value));
  
  // Update position when value changes externally
  useEffect(() => {
    position.value = calculatePosition(value);
  }, [value, minimumValue, maximumValue]);
  
  const calculateValue = (pos: number) => {
    let rawValue = (pos / sliderWidth) * (maximumValue - minimumValue) + minimumValue;
    
    // Apply step
    if (step > 0) {
      rawValue = Math.round(rawValue / step) * step;
    }
    
    // Ensure value is within bounds
    return Math.max(minimumValue, Math.min(maximumValue, rawValue));
  };
  
  const updateValue = (pos: number) => {
    const newValue = calculateValue(pos);
    onValueChange(newValue);
  };
  
  const startX = useSharedValue(0);
  
  const gesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = position.value;
    })
    .onUpdate((e) => {
      const newPosition = Math.max(0, Math.min(sliderWidth, startX.value + e.translationX));
      position.value = newPosition;
    })
    .onEnd(() => {
      runOnJS(updateValue)(position.value);
    });
  
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
    };
  });
  
  const activeTrackStyle = useAnimatedStyle(() => {
    return {
      width: position.value,
    };
  });
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.sliderContainer}>
        <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
          <Animated.View
            style={[
              styles.activeTrack,
              { backgroundColor: minimumTrackTintColor },
              activeTrackStyle,
            ]}
          />
        </View>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.thumb,
              { backgroundColor: thumbTintColor, marginLeft: -thumbSize / 2 },
              thumbStyle,
            ]}
          />
        </GestureDetector>
      </View>
      {showValue && (
        <Text style={styles.valueText}>
          {calculateValue(position.value).toFixed(step < 1 ? 1 : 0)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  track: {
    height: 4,
    borderRadius: 2,
    width: 300,
  },
  activeTrack: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  valueText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
