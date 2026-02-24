import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';

const FREQUENCIES = [
  { id: 'realtime', label: 'Real-time', desc: 'As stories break', icon: '⚡' },
  { id: 'morning', label: 'Morning digest', desc: 'Daily at 7:00 AM', icon: '☀️' },
  { id: 'evening', label: 'Evening digest', desc: 'Daily at 6:00 PM', icon: '🌆' },
  { id: 'weekly', label: 'Weekly roundup', desc: 'Fridays at 5:00 PM', icon: '📋' },
];

export default function NotificationsScreen() {
  const [frequency, setFrequency] = useState('morning');
  const [breakingAlerts, setBreakingAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ProgressBar step={5} total={6} milestone="Notifications" nextMilestone="Summary" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Stay informed your way</Text>
        <Text style={styles.subheading}>Set your notification preferences</Text>

        <Text style={styles.sectionLabel}>DIGEST FREQUENCY</Text>
        <View style={styles.frequencyGrid}>
          {FREQUENCIES.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              onPress={() => setFrequency(freq.id)}
              activeOpacity={0.7}
              style={[
                styles.freqCard,
                frequency === freq.id && styles.freqCardActive,
              ]}
            >
              <Text style={styles.freqIcon}>{freq.icon}</Text>
              <Text style={[styles.freqLabel, frequency === freq.id && styles.freqLabelActive]}>
                {freq.label}
              </Text>
              <Text style={styles.freqDesc}>{freq.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>ALERTS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Breaking news alerts</Text>
              <Text style={styles.settingDesc}>Market-moving stories only</Text>
            </View>
            <Switch
              value={breakingAlerts}
              onValueChange={setBreakingAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.gold + '66' }}
              thumbColor={breakingAlerts ? COLORS.gold : COLORS.textDim}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>DISPLAY</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Dark mode</Text>
              <Text style={styles.settingDesc}>Recommended for reading</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.gold + '66' }}
              thumbColor={darkMode ? COLORS.gold : COLORS.textDim}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue →"
          onPress={() => router.push('/onboarding/summary')}
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
    gap: SPACING.sm,
  },
  heading: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textMid,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  freqCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: 4,
    minHeight: 90,
  },
  freqCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '10',
  },
  freqIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  freqLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMid,
  },
  freqLabelActive: {
    color: COLORS.gold,
  },
  freqDesc: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textDim,
    lineHeight: 16,
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
    minHeight: 60,
  },
  settingLeft: {
    flex: 1,
    gap: 3,
  },
  settingLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
  },
  settingDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textDim,
  },
  footer: {
    padding: SPACING.lg,
  },
});
