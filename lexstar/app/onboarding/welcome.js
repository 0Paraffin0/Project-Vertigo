import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ProgressBar step={1} total={6} milestone="Welcome" nextMilestone="Your Plan" />

      <View style={styles.content}>
        {/* Wordmark */}
        <View style={styles.wordmarkContainer}>
          <Text style={styles.wordmark}>LexStar</Text>
          <View style={styles.wordmarkUnderline} />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          News that matters.{'\n'}Without the noise.
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          From classroom to corner office — AI-curated briefings for legal and financial professionals, personalised to your industry, role and experience.
        </Text>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: '⚡', label: 'Breaking stories down' },
            { icon: '✓', label: 'Multi-source verified' },
            { icon: '◈', label: 'Tailored to your sector' },
          ].map((feature) => (
            <View key={feature.label} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <PrimaryButton
          label="Get Started →"
          onPress={() => router.push('/onboarding/plan')}
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  wordmarkContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  wordmark: {
    fontFamily: FONTS.serif,
    fontSize: 48,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  wordmarkUnderline: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: SPACING.xs,
    borderRadius: 1,
  },
  tagline: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: SPACING.lg,
  },
  description: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.textMid,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: SPACING.xl,
  },
  features: {
    alignSelf: 'stretch',
    gap: SPACING.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  featureIcon: {
    fontSize: 18,
    color: COLORS.gold,
    width: 28,
    textAlign: 'center',
  },
  featureLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  footerNote: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textDim,
    textAlign: 'center',
  },
});
