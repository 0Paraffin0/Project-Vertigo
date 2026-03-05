import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import { useUser } from '../../src/context/UserContext';

const PLANS = [
  {
    id: 'student',
    icon: '🎓',
    name: 'Student',
    tagline: 'Personalised briefings for tomorrow\'s professionals',
    accent: COLORS.student,
    features: [
      'Essential daily briefings',
      'Sector-tailored insights',
      'Stories aligned with your studies',
      'Career and recruitment intelligence',
    ],
  },
  {
    id: 'pro',
    icon: '⚡',
    name: 'Professional',
    tagline: 'Intelligence for practitioners who need the edge',
    accent: COLORS.gold,
    features: [
      'Real-time breaking news',
      'Deep market analysis',
      'Regulatory alerts',
      'Client-briefing summaries',
    ],
  },
];

function PlanCard({ plan, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={[
        styles.planCard,
        { borderColor: selected ? plan.accent : COLORS.border },
        selected && { backgroundColor: plan.accent + '0F' },
      ]}
    >
      <View style={styles.planTop}>
        <Text style={styles.planIcon}>{plan.icon}</Text>
        <View style={styles.planMeta}>
          <Text style={[styles.planName, { color: selected ? plan.accent : COLORS.text }]}>
            {plan.name}
          </Text>
          <Text style={styles.planTagline}>{plan.tagline}</Text>
        </View>
        <View style={[styles.radioOuter, { borderColor: selected ? plan.accent : COLORS.border }]}>
          {selected && <View style={[styles.radioInner, { backgroundColor: plan.accent }]} />}
        </View>
      </View>
      <View style={styles.featureList}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text style={[styles.featureTick, { color: plan.accent }]}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function PlanScreen() {
  const { user, updateUser } = useUser();
  const { returnTo } = useLocalSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(user.plan || 'student');
  const activePlan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {!returnTo && <ProgressBar step={2} total={6} milestone="Your Plan" nextMilestone="Your Field" />}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Choose your plan</Text>
        <Text style={styles.subheading}>You can upgrade at any time</Text>

        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={returnTo ? 'Save Plan →' : 'Continue →'}
          accentColor={activePlan.accent}
          onPress={() => {
            updateUser({ plan: selectedPlan });
            if (returnTo === 'profile') {
              router.replace('/(tabs)/profile');
            } else {
              router.push('/onboarding/industry');
            }
          }}
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
    gap: SPACING.md,
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
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  planIcon: {
    fontSize: 26,
  },
  planMeta: {
    flex: 1,
    gap: 3,
  },
  planName: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  planTagline: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: 17,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  featureList: {
    gap: SPACING.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureTick: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '700',
    width: 16,
  },
  featureText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  footer: {
    padding: SPACING.lg,
  },
});
