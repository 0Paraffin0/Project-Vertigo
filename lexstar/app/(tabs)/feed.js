import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import ArticleCard from '../../src/components/ArticleCard';
import SkeletonCard from '../../src/components/SkeletonCard';
import FilterPanel from '../../src/components/FilterPanel';
import { useUser, useColors } from '../../src/context/UserContext';
import { filterArticles, sortArticles } from '../../src/utils/feedFilter';
import { fetchFeed, clearFeedCache } from '../../src/services/feedService';
import { relativeTime } from '../../src/utils/timeUtils';
import { getTrendingTags } from '../../src/utils/trendingUtils';

function LiveDot() {
  const colors = useColors();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setVisible((v) => !v), 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, opacity: visible ? 1 : 0.3 }} />
  );
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const DETAIL_LEVELS = ['Headlines', 'Brief', 'Full'];

export default function FeedScreen() {
  const { user } = useUser();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [detailLevel, setDetailLevel] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    storyTypes: user.feedPrefs || [],
    regions: user.regions || [],
  });

  const accentColor = user.plan === 'pro' ? colors.gold : colors.student;

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  const loadFeed = useCallback(async (forceRefresh = false) => {
    setError(false);
    try {
      if (forceRefresh) await clearFeedCache();
      const raw = await fetchFeed(user);
      setArticles(raw);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    loadFeed();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(true);
  }, [loadFeed]);

  const handleCardPress = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Apply active filters on top of the loaded articles
  const filterProfile = {
    ...user,
    feedPrefs: activeFilters.storyTypes,
    regions: activeFilters.regions,
  };
  const filtered = sortArticles(filterArticles(articles, filterProfile));
  const trendingTags = getTrendingTags(articles, 6);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setFilterVisible(false);
  };

  const handleTrendingTagPress = (tag) => {
    // Filter by matching articles that contain this tag
    const matchingTypes = articles
      .filter((a) => (a.tags || []).includes(tag))
      .map((a) => a.storyType)
      .filter(Boolean);
    const uniqueTypes = [...new Set(matchingTypes)];
    setActiveFilters((prev) => ({
      ...prev,
      storyTypes: uniqueTypes.length > 0 ? uniqueTypes : prev.storyTypes,
    }));
  };

  const hasActiveFilters =
    activeFilters.storyTypes.length !== (user.feedPrefs || []).length ||
    activeFilters.regions.length !== (user.regions || []).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>LexStar</Text>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && { borderColor: accentColor }]}
          activeOpacity={0.7}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={[styles.filterText, hasActiveFilters && { color: accentColor }]}>
            Filter ≡
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <View style={styles.liveRow}>
          <LiveDot />
          <Text style={styles.liveText}>LIVE</Text>
          <Text style={styles.timeText}>{currentTime}</Text>
          {loading && !refreshing ? (
            <Text style={[styles.updatingText, { color: colors.textDim }]}>
              Updating your feed...
            </Text>
          ) : (
            <View style={[styles.countPill, { borderColor: accentColor }]}>
              <Text style={[styles.countText, { color: accentColor }]}>
                {filtered.length} stories
              </Text>
            </View>
          )}
          {/* Refresh icon */}
          {!loading && (
            <TouchableOpacity
              onPress={handleRefresh}
              activeOpacity={0.7}
              style={styles.refreshIconBtn}
            >
              <Text style={[styles.refreshIcon, { color: colors.textDim }]}>↻</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Detail level toggle */}
        <View style={styles.toggleRow}>
          {DETAIL_LEVELS.map((level, index) => (
            <TouchableOpacity
              key={level}
              onPress={() => setDetailLevel(index)}
              activeOpacity={0.7}
              style={[
                styles.toggleSegment,
                detailLevel === index && styles.toggleSegmentActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  detailLevel === index && styles.toggleLabelActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Loading skeleton */}
      {loading && !refreshing ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ScrollView>
      ) : error ? (
        /* Error state */
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Could not load your feed</Text>
          <Text style={styles.emptySub}>
            Check your connection and pull down to refresh
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        /* Empty filter state */
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No stories match your current filters</Text>
          <Text style={styles.emptySub}>Adjust your feed preferences in Profile</Text>
          <TouchableOpacity
            style={[styles.emptyButton, { borderColor: accentColor }]}
            activeOpacity={0.7}
            onPress={() => router.replace('/(tabs)/profile')}
          >
            <Text style={[styles.emptyButtonText, { color: accentColor }]}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
            />
          }
        >
          {/* Trending Tags */}
          {trendingTags.length > 0 && (
            <View style={styles.trendingSection}>
              <Text style={[styles.trendingLabel, { color: colors.gold }]}>TRENDING</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingScroll}
              >
                {trendingTags.map(({ tag }) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => handleTrendingTagPress(tag)}
                    activeOpacity={0.7}
                    style={[styles.trendingChip, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.trendingChipText, { color: colors.textMid }]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Articles */}
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={{
                ...article,
                time: article.publishedAt ? relativeTime(article.publishedAt) : (article.time || 'Just now'),
              }}
              detailLevel={detailLevel}
              isExpanded={expandedId === article.id}
              onPress={() => handleCardPress(article.id)}
              plan={user.plan}
              userSectors={user.sectors}
            />
          ))}
          <View style={styles.bottomPad} />
        </ScrollView>
      )}

      {/* Filter Panel */}
      <FilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        userProfile={user}
        activeFilters={activeFilters}
        onApply={handleApplyFilters}
        allArticles={articles}
      />
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
      backgroundColor: colors.bg,
    },
    wordmark: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.gold,
      letterSpacing: 0.5,
    },
    filterButton: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs + 2,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADIUS.sm,
      minHeight: 36,
      justifyContent: 'center',
    },
    filterText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
    subHeader: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.bg,
      gap: SPACING.sm,
    },
    liveRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
    },
    liveText: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      fontWeight: '700',
      color: colors.green,
      letterSpacing: 1.5,
    },
    timeText: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.textMid,
      marginLeft: SPACING.xs,
    },
    updatingText: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      marginLeft: SPACING.xs,
    },
    countPill: {
      borderWidth: 1,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
      marginLeft: SPACING.xs,
    },
    countText: {
      fontFamily: FONTS.sans,
      fontSize: 10,
      fontWeight: '600',
    },
    refreshIconBtn: {
      marginLeft: 'auto',
      padding: 4,
    },
    refreshIcon: {
      fontSize: 18,
    },
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    toggleSegment: {
      flex: 1,
      paddingVertical: SPACING.xs + 2,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 36,
    },
    toggleSegmentActive: {
      backgroundColor: colors.gold + '22',
      borderBottomWidth: 2,
      borderBottomColor: colors.gold,
    },
    toggleLabel: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textDim,
    },
    toggleLabelActive: {
      color: colors.gold,
      fontWeight: '600',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.md,
    },
    trendingSection: {
      marginBottom: SPACING.md,
    },
    trendingLabel: {
      fontFamily: FONTS.sans,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginBottom: SPACING.sm,
    },
    trendingScroll: {
      gap: SPACING.xs,
      paddingRight: SPACING.xs,
    },
    trendingChip: {
      borderWidth: 1,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs + 1,
    },
    trendingChipText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
    },
    bottomPad: {
      height: SPACING.xl,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
      gap: SPACING.md,
    },
    emptyTitle: {
      fontFamily: FONTS.sans,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      lineHeight: 24,
    },
    emptySub: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMid,
      textAlign: 'center',
      lineHeight: 21,
    },
    emptyButton: {
      borderWidth: 1,
      borderRadius: RADIUS.sm,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      marginTop: SPACING.xs,
      minHeight: 44,
      justifyContent: 'center',
    },
    emptyButtonText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}
