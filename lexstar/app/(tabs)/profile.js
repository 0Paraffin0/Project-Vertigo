import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import PlanBadge from '../../src/components/PlanBadge';
import TagChip from '../../src/components/TagChip';
import { useUser } from '../../src/context/UserContext';
import { FINANCE_SECTORS, LAW_SECTORS } from '../../src/data/sectors';
import { REGIONS } from '../../src/data/regions';
import { FEED_PREFS } from '../../src/data/feedPrefs';

const ALL_SECTORS = [...FINANCE_SECTORS, ...LAW_SECTORS];

const PLAN_META = {
  student: {
    icon: '🎓',
    name: 'Student Plan',
    tagline: "Personalised briefings for tomorrow's professionals",
    accentColor: COLORS.student,
  },
  pro: {
    icon: '⚡',
    name: 'Professional Plan',
    tagline: 'Intelligence for practitioners who need the edge',
    accentColor: COLORS.gold,
  },
};

const NOTIF_LABELS = {
  realtime: 'Real-time',
  morning: 'Morning digest · 7:00 AM',
  evening: 'Evening digest · 6:00 PM',
  weekly: 'Weekly roundup · Fridays 5:00 PM',
};

function SectionHeader({ title, onEdit }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SettingRow({ label, value, right, last }) {
  return (
    <View style={[styles.settingRow, last && styles.settingRowLast]}>
      <Text style={styles.settingLabel}>{label}</Text>
      {right || <Text style={styles.settingValue}>{value}</Text>}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, updateUser, resetUser } = useUser();

  const planMeta = PLAN_META[user.plan] || PLAN_META.student;
  const accentColor = planMeta.accentColor;

  const sectorLabels = user.sectors
    .map((id) => ALL_SECTORS.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const regionLabels = user.regions
    .map((id) => REGIONS.find((r) => r.id === id)?.label)
    .filter(Boolean);

  const feedPrefLabels = user.feedPrefs
    .map((id) => FEED_PREFS.find((p) => p.id === id)?.label)
    .filter(Boolean);

  const notifLabel = NOTIF_LABELS[user.notifPref] || 'Morning digest · 7:00 AM';

  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will clear all your preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetUser();
            router.replace('/onboarding/welcome');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Plan card */}
        <View style={[styles.planCard, { borderColor: accentColor + '44' }]}>
          <View style={styles.planTop}>
            <View style={styles.planInfo}>
              <Text style={styles.planIcon}>{planMeta.icon}</Text>
              <View style={styles.planText}>
                <Text style={styles.planName}>{planMeta.name}</Text>
                <Text style={styles.planTagline}>{planMeta.tagline}</Text>
              </View>
            </View>
            <PlanBadge plan={user.plan || 'student'} />
          </View>
          <TouchableOpacity
            style={styles.switchPlanButton}
            activeOpacity={0.7}
            onPress={() => router.push('/onboarding/plan')}
          >
            <Text style={styles.switchPlanText}>Switch Plan</Text>
          </TouchableOpacity>
        </View>

        {/* My Feed */}
        <View style={styles.section}>
          <SectionHeader
            title="My Feed"
            onEdit={() => router.push('/onboarding/feed-prefs')}
          />
          {feedPrefLabels.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContent}
            >
              {feedPrefLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/feed-prefs')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No preferences set — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Sectors */}
        <View style={styles.section}>
          <SectionHeader
            title="My Sectors"
            onEdit={() => router.push('/onboarding/industry')}
          />
          {sectorLabels.length > 0 ? (
            <View style={styles.chipsRow}>
              {sectorLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/industry')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No sectors selected — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Regions */}
        <View style={styles.section}>
          <SectionHeader
            title="My Regions"
            onEdit={() => router.push('/onboarding/feed-prefs')}
          />
          {regionLabels.length > 0 ? (
            <View style={styles.chipsRow}>
              {regionLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/feed-prefs')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No regions selected — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" />
          <View style={styles.settingsCard}>
            <SettingRow
              label="Frequency"
              right={
                <View style={styles.settingValueRow}>
                  <Text style={styles.settingValue}>{notifLabel}</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/onboarding/notifications')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.changeLink, { color: accentColor }]}>Change</Text>
                  </TouchableOpacity>
                </View>
              }
              last
            />
          </View>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <SectionHeader title="Display" />
          <View style={styles.settingsCard}>
            <SettingRow
              label="Dark mode"
              right={
                <Switch
                  value={user.darkMode !== false}
                  onValueChange={(val) => updateUser({ darkMode: val })}
                  trackColor={{ false: COLORS.border, true: COLORS.gold + '66' }}
                  thumbColor={user.darkMode !== false ? COLORS.gold : COLORS.textDim}
                />
              }
              last
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <SectionHeader title="Account" />
          <TouchableOpacity
            style={styles.resetButton}
            activeOpacity={0.7}
            onPress={handleReset}
          >
            <Text style={styles.resetText}>Reset App</Text>
          </TouchableOpacity>
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
  scroll: {
    flex: 1,
  },
  planCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    flex: 1,
  },
  planIcon: {
    fontSize: 28,
  },
  planText: {
    flex: 1,
    gap: 3,
  },
  planName: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  planTagline: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: 17,
  },
  switchPlanButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  switchPlanText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  section: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  editLink: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipsScrollContent: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingRight: SPACING.md,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
    textDecorationLine: 'underline',
  },
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 52,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
  },
  settingValue: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  settingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  changeLink: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.red + '66',
    paddingVertical: SPACING.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  resetText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.red,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
