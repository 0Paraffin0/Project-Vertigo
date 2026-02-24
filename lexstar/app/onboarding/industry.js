import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import { FINANCE_SECTORS, LAW_SECTORS } from '../../src/data/sectors';
import ProgressBar from '../../src/components/ProgressBar';
import PrimaryButton from '../../src/components/PrimaryButton';
import GhostButton from '../../src/components/GhostButton';

const FIELDS = [
  { id: 'finance', label: 'Finance', icon: '📈', sectors: FINANCE_SECTORS },
  { id: 'law', label: 'Law', icon: '⚖️', sectors: LAW_SECTORS },
];

function SectorGrid({ sectors, selected, onToggle }) {
  return (
    <View style={styles.grid}>
      {sectors.map((sector) => {
        const isSelected = selected.includes(sector.id);
        return (
          <TouchableOpacity
            key={sector.id}
            onPress={() => onToggle(sector.id)}
            activeOpacity={0.7}
            style={[
              styles.sectorCell,
              isSelected && styles.sectorCellActive,
            ]}
          >
            <Text style={styles.sectorIcon}>{sector.icon}</Text>
            <Text style={[styles.sectorLabel, isSelected && styles.sectorLabelActive]}>
              {sector.label}
            </Text>
            {isSelected && <Text style={styles.sectorCheck}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function IndustryScreen() {
  const [activeField, setActiveField] = useState('finance');
  const [selectedSectors, setSelectedSectors] = useState([]);

  const toggleSector = (id) => {
    setSelectedSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const currentField = FIELDS.find((f) => f.id === activeField);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ProgressBar step={3} total={6} milestone="Your Field" nextMilestone="Your Feed" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>What's your field?</Text>
        <Text style={styles.subheading}>Select the sectors most relevant to you</Text>

        {/* Field toggle */}
        <View style={styles.fieldToggle}>
          {FIELDS.map((field) => (
            <TouchableOpacity
              key={field.id}
              onPress={() => setActiveField(field.id)}
              activeOpacity={0.7}
              style={[
                styles.fieldTab,
                activeField === field.id && styles.fieldTabActive,
              ]}
            >
              <Text style={styles.fieldIcon}>{field.icon}</Text>
              <Text style={[
                styles.fieldLabel,
                activeField === field.id && styles.fieldLabelActive,
              ]}>
                {field.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectorGrid
          sectors={currentField.sectors}
          selected={selectedSectors}
          onToggle={toggleSector}
        />

        {selectedSectors.length > 0 && (
          <Text style={styles.selectionCount}>
            {selectedSectors.length} sector{selectedSectors.length > 1 ? 's' : ''} selected
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue →"
          onPress={() => router.push('/onboarding/feed-prefs')}
          disabled={selectedSectors.length === 0}
        />
        <GhostButton
          label="Set up later"
          onPress={() => router.push('/onboarding/feed-prefs')}
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
  fieldToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  fieldTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
    minHeight: 48,
  },
  fieldTabActive: {
    backgroundColor: COLORS.gold + '18',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  fieldIcon: {
    fontSize: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textDim,
    fontWeight: '600',
  },
  fieldLabelActive: {
    color: COLORS.gold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  sectorCell: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'flex-start',
    gap: SPACING.xs,
    minHeight: 80,
  },
  sectorCellActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '10',
  },
  sectorIcon: {
    fontSize: 20,
  },
  sectorLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
    lineHeight: 18,
  },
  sectorLabelActive: {
    color: COLORS.text,
  },
  sectorCheck: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  selectionCount: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.gold,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
});
