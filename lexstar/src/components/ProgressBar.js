import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '../constants/theme';

export default function ProgressBar({ step, total, milestone, nextMilestone }) {
  const progress = step / total;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.milestone}>{milestone}</Text>
        {nextMilestone && (
          <Text style={styles.next}>Next: {nextMilestone} →</Text>
        )}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.stepsRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < step && styles.dotActive,
              i === step - 1 && styles.dotCurrent,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  milestone: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  next: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textDim,
  },
  track: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 999,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.goldDim,
  },
  dotCurrent: {
    backgroundColor: COLORS.gold,
    width: 16,
    borderRadius: 3,
  },
});
