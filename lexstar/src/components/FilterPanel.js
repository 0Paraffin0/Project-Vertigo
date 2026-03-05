import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SPACING, RADIUS, FONTS } from '../constants/theme';
import { FEED_PREFS } from '../data/feedPrefs';
import { REGIONS } from '../data/regions';
import { useColors } from '../context/UserContext';
import { filterArticles } from '../utils/feedFilter';

export default function FilterPanel({ visible, onClose, userProfile, activeFilters, onApply, allArticles }) {
  const colors = useColors();
  const accentColor = userProfile.plan === 'pro' ? colors.gold : colors.student;

  const [localTypes, setLocalTypes] = useState(activeFilters.storyTypes || []);
  const [localRegions, setLocalRegions] = useState(activeFilters.regions || []);

  const toggleType = (id) => {
    setLocalTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleRegion = (id) => {
    setLocalRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setLocalTypes(userProfile.feedPrefs || []);
    setLocalRegions(userProfile.regions || []);
  };

  const handleApply = () => {
    onApply({ storyTypes: localTypes, regions: localRegions });
  };

  // Live count — how many articles match current local selections
  const previewProfile = {
    ...userProfile,
    feedPrefs: localTypes,
    regions: localRegions,
  };
  const matchCount = filterArticles(allArticles, previewProfile).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Panel */}
      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={styles.panelHeader}>
          <Text style={[styles.panelTitle, { color: colors.text }]}>Filter Feed</Text>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text style={[styles.resetText, { color: accentColor }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.panelScroll}
          contentContainerStyle={styles.panelScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Story Types */}
          <Text style={[styles.sectionLabel, { color: colors.textDim }]}>STORY TYPES</Text>
          <View style={styles.chipGrid}>
            {FEED_PREFS.map((pref) => {
              const active = localTypes.includes(pref.id);
              return (
                <TouchableOpacity
                  key={pref.id}
                  onPress={() => toggleType(pref.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    { borderColor: active ? accentColor : colors.border },
                    active && { backgroundColor: accentColor + '1A' },
                  ]}
                >
                  <Text style={styles.chipIcon}>{pref.icon}</Text>
                  <Text style={[
                    styles.chipLabel,
                    { color: active ? accentColor : colors.textMid },
                  ]}>
                    {pref.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Regions */}
          <Text style={[styles.sectionLabel, { color: colors.textDim, marginTop: SPACING.md }]}>
            REGIONS
          </Text>
          <View style={styles.chipGrid}>
            {REGIONS.map((region) => {
              const active = localRegions.includes(region.id);
              return (
                <TouchableOpacity
                  key={region.id}
                  onPress={() => toggleRegion(region.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    { borderColor: active ? accentColor : colors.border },
                    active && { backgroundColor: accentColor + '1A' },
                  ]}
                >
                  <Text style={styles.chipIcon}>{region.flag}</Text>
                  <Text style={[
                    styles.chipLabel,
                    { color: active ? accentColor : colors.textMid },
                  ]}>
                    {region.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply button */}
        <View style={[styles.applyRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.85}
            style={[styles.applyButton, { backgroundColor: accentColor }]}
          >
            <Text style={styles.applyButtonText}>
              Show {matchCount} {matchCount === 1 ? 'story' : 'stories'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  panelTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
  },
  resetText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    minHeight: 34,
  },
  chipIcon: {
    fontSize: 13,
  },
  chipLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '500',
  },
  applyRow: {
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
  applyButton: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0C12',
  },
});
