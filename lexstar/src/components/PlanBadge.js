import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';

export default function PlanBadge({ plan }) {
  const isStudent = plan === 'student';
  const accent = isStudent ? COLORS.student : COLORS.gold;
  const icon = isStudent ? '🎓' : '⚡';
  const label = isStudent ? 'Student' : 'Professional';

  return (
    <View style={[styles.badge, { borderColor: accent }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, { color: accent }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
    gap: 4,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
