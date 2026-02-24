import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import { FEED_PREFS } from '../../src/data/feedPrefs';
import { REGIONS } from '../../src/data/regions';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import GhostButton from '../../src/components/GhostButton';
import TagChip from '../../src/components/TagChip';

function StoryTypeCard({ pref, active, onToggle }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.storyCard, active && styles.storyCardActive]}
    >
      <View style={styles.storyTop}>
        <Text style={styles.storyIcon}>{pref.icon}</Text>
        <Text style={[styles.storyLabel, active && styles.storyLabelActive]}>
          {pref.label}
        </Text>
        <View style={[styles.toggle, active && styles.toggleActive]}>
          <View style={[styles.toggleThumb, active && styles.toggleThumbActive]} />
        </View>
      </View>
      <Text style={styles.storyDesc}>{pref.description}</Text>
    </TouchableOpacity>
  );
}

export default function FeedPrefsScreen() {
  const [activePrefs, setActivePrefs] = useState(['breaking', 'regulatory', 'court']);
  const [activeRegions, setActiveRegions] = useState(['uk', 'us']);

  const togglePref = (id) => {
    setActivePrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleRegion = (id) => {
    setActiveRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ProgressBar step={4} total={6} milestone="Your Feed" nextMilestone="Notifications" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Customise your feed</Text>
        <Text style={styles.subheading}>Choose the story types and regions you care about</Text>

        <Text style={styles.sectionLabel}>STORY TYPES</Text>
        {FEED_PREFS.map((pref) => (
          <StoryTypeCard
            key={pref.id}
            pref={pref}
            active={activePrefs.includes(pref.id)}
            onToggle={() => togglePref(pref.id)}
          />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>REGIONS</Text>
        <View style={styles.regionsRow}>
          {REGIONS.map((region) => (
            <TouchableOpacity
              key={region.id}
              onPress={() => toggleRegion(region.id)}
              activeOpacity={0.7}
              style={[
                styles.regionChip,
                activeRegions.includes(region.id) && styles.regionChipActive,
              ]}
            >
              <Text style={styles.regionFlag}>{region.flag}</Text>
              <Text style={[
                styles.regionLabel,
                activeRegions.includes(region.id) && styles.regionLabelActive,
              ]}>
                {region.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue →"
          onPress={() => router.push('/onboarding/notifications')}
        />
        <GhostButton
          label="Set up later"
          onPress={() => router.push('/onboarding/notifications')}
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
    marginTop: SPACING.xs,
  },
  storyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  storyCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '0D',
  },
  storyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  storyIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  storyLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMid,
    flex: 1,
  },
  storyLabelActive: {
    color: COLORS.text,
  },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: COLORS.gold + '44',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.textDim,
  },
  toggleThumbActive: {
    backgroundColor: COLORS.gold,
    marginLeft: 'auto',
  },
  storyDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textDim,
    lineHeight: 17,
    paddingLeft: 30,
  },
  regionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    minHeight: 36,
  },
  regionChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '15',
  },
  regionFlag: {
    fontSize: 16,
  },
  regionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textDim,
  },
  regionLabelActive: {
    color: COLORS.gold,
  },
  footer: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
});
