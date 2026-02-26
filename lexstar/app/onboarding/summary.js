import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import PlanBadge from '../../src/components/PlanBadge';
import TagChip from '../../src/components/TagChip';
import { useUser } from '../../src/context/UserContext';
import { FINANCE_SECTORS, LAW_SECTORS } from '../../src/data/sectors';
import { REGIONS } from '../../src/data/regions';
import { FEED_PREFS } from '../../src/data/feedPrefs';

const ALL_SECTORS = [...FINANCE_SECTORS, ...LAW_SECTORS];

function SummaryRow({ label, children }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <View style={styles.summaryContent}>{children}</View>
    </View>
  );
}

function getNotifLabel(notifPref) {
  const map = {
    realtime: 'Real-time',
    morning: 'Morning · 7:00 AM',
    evening: 'Evening · 6:00 PM',
    weekly: 'Weekly · Fridays 5:00 PM',
  };
  return map[notifPref] || 'Morning · 7:00 AM';
}

export default function SummaryScreen() {
  const { user, updateUser } = useUser();

  const selectedSectorLabels = user.sectors
    .map((id) => ALL_SECTORS.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const selectedRegionLabels = user.regions
    .map((id) => REGIONS.find((r) => r.id === id)?.label)
    .filter(Boolean);

  const storyCount = Math.min(
    Math.max(
      user.sectors.length * 3 + user.feedPrefs.length * 2 + user.regions.length * 4,
      14,
    ),
    94,
  );

  const fieldLabel = user.field === 'law' ? 'Law' : 'Finance';

  const handleOpen = () => {
    updateUser({ hasOnboarded: true });
    router.replace('/(tabs)/feed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <ProgressBar step={6} total={6} milestone="All Done" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Celebration header */}
        <View style={styles.celebrationBlock}>
          <Text style={styles.celebrationIcon}>✦</Text>
          <Text style={styles.celebrationTitle}>You're all set</Text>
          <Text style={styles.celebrationSub}>
            Your personalised feed is ready. {storyCount} stories matched your profile.
          </Text>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <SummaryRow label="PLAN">
            <PlanBadge plan={user.plan || 'student'} />
          </SummaryRow>

          <SummaryRow label="FIELD">
            <View style={styles.chipsRow}>
              <TagChip label={fieldLabel} accentColor={COLORS.gold} active />
            </View>
          </SummaryRow>

          <SummaryRow label="SECTORS">
            <View style={styles.chipsRow}>
              {selectedSectorLabels.length > 0
                ? selectedSectorLabels.map((s) => (
                    <TagChip key={s} label={s} accentColor={COLORS.gold} active />
                  ))
                : <Text style={styles.noneText}>None selected</Text>}
            </View>
          </SummaryRow>

          <SummaryRow label="REGIONS">
            <View style={styles.chipsRow}>
              {selectedRegionLabels.length > 0
                ? selectedRegionLabels.map((r) => (
                    <TagChip key={r} label={r} accentColor={COLORS.gold} active />
                  ))
                : <Text style={styles.noneText}>All regions</Text>}
            </View>
          </SummaryRow>

          <SummaryRow label="DIGEST">
            <Text style={styles.summaryValue}>{getNotifLabel(user.notifPref)}</Text>
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
          onPress={handleOpen}
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
  backBtn: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 0,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontFamily: FONTS.sans,
    fontSize: 22,
    color: COLORS.textMid,
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
  noneText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
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
