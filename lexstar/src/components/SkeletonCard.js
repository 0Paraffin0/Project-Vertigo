import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { SPACING, RADIUS } from '../constants/theme';
import { useColors } from '../context/UserContext';

function ShimmerBar({ width, height = 12, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: 4, opacity }, style]}
    />
  );
}

export default function SkeletonCard() {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Category bar — short */}
      <ShimmerBar
        width={80}
        height={10}
        style={{ backgroundColor: colors.textDim }}
      />
      {/* Headline — long */}
      <ShimmerBar
        width="90%"
        height={16}
        style={{ backgroundColor: colors.textMid, marginTop: SPACING.sm }}
      />
      <ShimmerBar
        width="70%"
        height={16}
        style={{ backgroundColor: colors.textMid, marginTop: 6 }}
      />
      {/* Brief — medium */}
      <ShimmerBar
        width="100%"
        height={11}
        style={{ backgroundColor: colors.textDim, marginTop: SPACING.sm }}
      />
      <ShimmerBar
        width="85%"
        height={11}
        style={{ backgroundColor: colors.textDim, marginTop: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
});
