import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import PlanBadge from '../../src/components/PlanBadge';
import TagChip from '../../src/components/TagChip';

function SummaryRow({ label, children }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <View style={styles.summaryContent}>{children}</View>
    </View>
  );
}

export default function SummaryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ProgressBar step={6} total={6} milestone="All Done" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Celebration header */}
        <View style={styles.celebrationBlock}>
          <Text style={styles.celebrationIcon}>✦</Text>
          <Text style={styles.celebrationTitle}>You're all set</Text>
          <Text style={styles.celebrationSub}>
            Your personalised feed is ready. Here's what we've configured for you.
          </Text>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <SummaryRow label="PLAN">
            <PlanBadge plan="student" />
          </SummaryRow>

          <SummaryRow label="FIELD">
            <View style={styles.chipsRow}>
              <TagChip label="Finance" accentColor={COLORS.gold} active />
            </View>
          </SummaryRow>

          <SummaryRow label="SECTORS">
            <View style={styles.chipsRow}>
              {['Trading & Markets', 'Asset Management'].map((s) => (
                <TagChip key={s} label={s} accentColor={COLORS.gold} active />
              ))}
            </View>
          </SummaryRow>

          <SummaryRow label="REGIONS">
            <View style={styles.chipsRow}>
              {['United Kingdom', 'United States'].map((r) => (
                <TagChip key={r} label={r} accentColor={COLORS.gold} active />
              ))}
            </View>
          </SummaryRow>

          <SummaryRow label="DIGEST">
            <Text style={styles.summaryValue}>Morning · 7:00 AM</Text>
          </SummaryRow>

          <SummaryRow label="BREAKING ALERTS">
            <View style={[styles.statusPill, { borderColor: COLORS.green }]}>
              <Text style={[styles.statusText, { color: COLORS.green }]}>On</Text>
            </View>
          </SummaryRow>
        </View>

        {/* Note */}
        <Text style={styles.editNote}>
          You can adjust these at any time in your Profile tab.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Open LexStar →"
          onPress={() => router.replace('/(tabs)/feed')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  celebrationBlock: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  celebrationIcon: {
    fontSize: 36,
    color: COLORS.gold,
  },
  celebrationTitle: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    color: COLORS.text,
  },
  celebrationSub: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textMid,
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
    minHeight: 52,
  },
  summaryLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
    width: 80,
    marginTop: 3,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
    paddingTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  editNote: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: SPACING.lg,
  },
});
