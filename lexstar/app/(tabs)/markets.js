import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';

const EXCHANGES = [
  { name: 'NYSE', price: '17,842.36', change: '+0.42%', positive: true },
  { name: 'LSE / FTSE 100', price: '7,612.10', change: '+0.61%', positive: true },
  { name: 'NASDAQ', price: '15,987.54', change: '-0.18%', positive: false },
  { name: 'Nikkei 225', price: '38,245.80', change: '+1.12%', positive: true },
  { name: 'DAX', price: '18,104.66', change: '-0.05%', positive: false },
];

function ExchangeRow({ exchange }) {
  return (
    <View style={styles.exchangeRow}>
      <View style={styles.exchangeLeft}>
        <Text style={styles.exchangeName}>{exchange.name}</Text>
        <Text style={styles.exchangePrice}>{exchange.price}</Text>
      </View>
      <Text style={[styles.exchangeChange, { color: exchange.positive ? COLORS.green : COLORS.red }]}>
        {exchange.change}
      </Text>
    </View>
  );
}

export default function MarketsScreen() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>GLOBAL EXCHANGES</Text>
          {EXCHANGES.map((ex) => (
            <ExchangeRow key={ex.name} exchange={ex} />
          ))}
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderTitle}>Global exchange data</Text>
          <Text style={styles.placeholderSub}>Coming in Phase 2</Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Tap an exchange to filter your news feed — coming soon
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    color: COLORS.text,
  },
  date: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  scroll: {
    flex: 1,
  },
  sectionCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exchangeLeft: {
    gap: 3,
  },
  exchangeName: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  exchangePrice: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  exchangeChange: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  placeholderCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  placeholderTitle: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMid,
  },
  placeholderSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textDim,
  },
  noteCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 19,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
