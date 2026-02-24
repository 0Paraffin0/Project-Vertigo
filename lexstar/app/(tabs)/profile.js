import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import PlanBadge from '../../src/components/PlanBadge';
import TagChip from '../../src/components/TagChip';

const MY_SECTORS = ['Trading & Markets', 'Asset Management', 'Competition Law'];
const MY_REGIONS = ['United Kingdom', 'United States', 'European Union'];

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({ label, value, right }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {right || <Text style={styles.settingValue}>{value}</Text>}
    </View>
  );
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Plan card */}
        <View style={styles.planCard}>
          <View style={styles.planTop}>
            <View style={styles.planInfo}>
              <Text style={styles.planIcon}>🎓</Text>
              <View>
                <Text style={styles.planName}>Student Plan</Text>
                <Text style={styles.planTagline}>Personalised briefings for tomorrow's professionals</Text>
              </View>
            </View>
            <PlanBadge plan="student" />
          </View>
          <TouchableOpacity style={styles.switchPlanButton} activeOpacity={0.7}>
            <Text style={styles.switchPlanText}>Switch Plan</Text>
          </TouchableOpacity>
        </View>

        {/* My Sectors */}
        <View style={styles.section}>
          <SectionHeader title="My Sectors" />
          <View style={styles.chipsRow}>
            {MY_SECTORS.map((sector) => (
              <TagChip
                key={sector}
                label={sector}
                active
                accentColor={COLORS.student}
              />
            ))}
          </View>
        </View>

        {/* My Regions */}
        <View style={styles.section}>
          <SectionHeader title="My Regions" />
          <View style={styles.chipsRow}>
            {MY_REGIONS.map((region) => (
              <TagChip
                key={region}
                label={region}
                active
                accentColor={COLORS.student}
              />
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" />
          <View style={styles.settingsCard}>
            <SettingRow label="Frequency" value="Daily digest" />
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
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: COLORS.border, true: COLORS.gold + '66' }}
                  thumbColor={darkMode ? COLORS.gold : COLORS.textDim}
                />
              }
            />
          </View>
        </View>

        {/* Redo onboarding */}
        <TouchableOpacity style={styles.redoButton} activeOpacity={0.7}>
          <Text style={styles.redoText}>Redo Onboarding</Text>
        </TouchableOpacity>

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
    borderColor: COLORS.student + '44',
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
  planName: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  planTagline: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: 17,
    maxWidth: 200,
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
  sectionHeader: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  settingLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
  },
  settingValue: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textMid,
  },
  redoButton: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  redoText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textDim,
    textDecorationLine: 'underline',
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
