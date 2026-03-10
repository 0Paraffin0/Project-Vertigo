import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';

export default function TagChip({ label, active, accentColor, onPress }) {
  const accent = accentColor || COLORS.gold;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        { borderColor: active ? accent : COLORS.border },
        active && { backgroundColor: accent + '22' },
      ]}
    >
      <Text style={[styles.label, { color: active ? accent : COLORS.textMid }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 14,
  },
});
