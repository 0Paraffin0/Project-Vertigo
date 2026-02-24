import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';

export default function PrimaryButton({ label, onPress, disabled, accentColor }) {
  const accent = accentColor || COLORS.gold;
  const accentDim = accentColor ? accentColor + 'BB' : COLORS.goldDim;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.button, disabled && styles.disabled]}
    >
      <View style={[styles.gradient, { backgroundColor: disabled ? COLORS.textDim : accent }]}>
        <Text style={[styles.label, { color: disabled ? COLORS.textMid : '#080A0F' }]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    minHeight: 52,
  },
  gradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
