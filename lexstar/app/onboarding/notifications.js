import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import { useUser } from '../../src/context/UserContext';

const LIGHT = {
  bg: '#F8F6F1',
  surface: '#FFFFFF',
  border: '#E5E0D8',
  text: '#1C1A18',
  textMid: '#5C5A56',
  textDim: '#A09A90',
};

const FREQUENCIES = [
  { id: 'realtime', label: 'Real-time', desc: 'As stories break', icon: '⚡' },
  { id: 'morning', label: 'Morning digest', desc: 'Daily at 7:00 AM', icon: '☀️' },
  { id: 'evening', label: 'Evening digest', desc: 'Daily at 6:00 PM', icon: '🌆' },
  { id: 'weekly', label: 'Weekly roundup', desc: 'Fridays at 5:00 PM', icon: '📋' },
];

export default function NotificationsScreen() {
  const { user, updateUser } = useUser();
  const [frequency, setFrequency] = useState(user.notifPref || 'morning');
  const [breakingAlerts, setBreakingAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(user.darkMode !== undefined ? user.darkMode : true);

  const C = darkMode ? COLORS : { ...COLORS, ...LIGHT };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.bg }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={[styles.backArrow, { color: C.textMid }]}>←</Text>
      </TouchableOpacity>

      <ProgressBar step={5} total={6} milestone="Notifications" nextMilestone="Summary" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.heading, { color: C.text }]}>Stay informed your way</Text>
        <Text style={[styles.subheading, { color: C.textMid }]}>Set your notification preferences</Text>

        <Text style={[styles.sectionLabel, { color: C.textDim }]}>DIGEST FREQUENCY</Text>
        <View style={styles.frequencyGrid}>
          {FREQUENCIES.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              onPress={() => setFrequency(freq.id)}
              activeOpacity={0.7}
              style={[
                styles.freqCard,
                { backgroundColor: C.surface, borderColor: C.border },
                frequency === freq.id && { borderColor: COLORS.gold, backgroundColor: COLORS.gold + '10' },
              ]}
            >
              <Text style={styles.freqIcon}>{freq.icon}</Text>
              <Text style={[
                styles.freqLabel,
                { color: C.textMid },
                frequency === freq.id && styles.freqLabelActive,
              ]}>
                {freq.label}
              </Text>
              <Text style={[styles.freqDesc, { color: C.textDim }]}>{freq.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.md, color: C.textDim }]}>ALERTS</Text>
        <View style={[styles.settingsCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: C.text }]}>Breaking news alerts</Text>
              <Text style={[styles.settingDesc, { color: C.textDim }]}>Market-moving stories only</Text>
            </View>
            <Switch
              value={breakingAlerts}
              onValueChange={setBreakingAlerts}
              trackColor={{ false: C.border, true: COLORS.gold + '66' }}
              thumbColor={breakingAlerts ? COLORS.gold : COLORS.textDim}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.md, color: C.textDim }]}>DISPLAY</Text>
        <View style={[styles.settingsCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: C.text }]}>Dark mode</Text>
              <Text style={[styles.settingDesc, { color: C.textDim }]}>Recommended for reading</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => { setDarkMode(val); updateUser({ darkMode: val }); }}
              trackColor={{ false: C.border, true: COLORS.gold + '66' }}
              thumbColor={darkMode ? COLORS.gold : COLORS.textDim}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue →"
          onPress={() => {
            updateUser({ notifPref: frequency, darkMode });
            router.push('/onboarding/summary');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '700',
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
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    gap: 4,
    minHeight: 90,
  },
  freqIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  freqLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  freqLabelActive: {
    color: COLORS.gold,
  },
  freqDesc: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
  },
  settingsCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
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
  },
  settingDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
  },
  footer: {
    padding: SPACING.lg,
  },
});
