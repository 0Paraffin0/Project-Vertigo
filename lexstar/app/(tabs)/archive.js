import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SPACING, RADIUS, FONTS, CATEGORY_COLORS } from '../../src/constants/theme';
import { MOCK_ARTICLES } from '../../src/data/mockArticles';
import TagChip from '../../src/components/TagChip';
import { useColors } from '../../src/context/UserContext';

const TIME_FILTERS = ['Last 7 days', '30 days', '3 months'];

function CondensedCard({ article }) {
  const colors = useColors();
  const styles = makeStyles(colors);
  const categoryColor = CATEGORY_COLORS[article.category] || colors.gold;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardTopLeft}>
          <View style={[styles.dot, { backgroundColor: categoryColor }]} />
          <Text style={[styles.category, { color: categoryColor }]}>
            {article.category.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.time}>{article.time}</Text>
      </View>
      <Text style={styles.headline}>{article.headline}</Text>
      <View style={styles.tagsRow}>
        {article.tags.slice(0, 2).map((tag) => (
          <TagChip key={tag} label={tag} accentColor={categoryColor} />
        ))}
      </View>
    </View>
  );
}

export default function ArchiveScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Archive</Text>
        <TouchableOpacity style={styles.searchIcon} activeOpacity={0.7}>
          <Text style={styles.searchIconText}>⌕</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search stories...</Text>
        </View>
      </View>

      {/* Filter row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {TIME_FILTERS.map((filter, index) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(index)}
            activeOpacity={0.7}
            style={[
              styles.filterPill,
              activeFilter === index && styles.filterPillActive,
            ]}
          >
            <Text style={[styles.filterLabel, activeFilter === index && styles.filterLabelActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {MOCK_ARTICLES.map((article) => (
            <CondensedCard key={article.id} article={article} />
          ))}
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>Full archive search coming in Phase 3</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.text,
    },
    searchIcon: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchIconText: {
      fontSize: 22,
      color: colors.textMid,
    },
    searchBarContainer: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBar: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      minHeight: 44,
      justifyContent: 'center',
    },
    searchPlaceholder: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textDim,
    },
    filterScroll: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterContent: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      gap: SPACING.xs,
    },
    filterPill: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 36,
      justifyContent: 'center',
      marginRight: SPACING.xs,
    },
    filterPillActive: {
      borderColor: colors.gold,
      backgroundColor: colors.gold + '15',
    },
    filterLabel: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textDim,
    },
    filterLabelActive: {
      color: colors.gold,
      fontWeight: '600',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.xs,
    },
    cardTopLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    category: {
      fontFamily: FONTS.sans,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    time: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.textDim,
    },
    headline: {
      fontFamily: FONTS.serif,
      fontSize: 16,
      lineHeight: 22,
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    footerNote: {
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.md,
      padding: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    footerText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textDim,
    },
    bottomPad: {
      height: SPACING.xl,
    },
  });
}
