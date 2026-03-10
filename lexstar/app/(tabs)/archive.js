import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import { useUser, useColors } from '../../src/context/UserContext';
import { useAuth } from '../../src/context/AuthContext';
import { fetchArchive } from '../../src/services/archiveService';
import { applyDateFilter } from '../../src/utils/dateUtils';
import { FEED_PREFS } from '../../src/data/feedPrefs';
import ArticleCard from '../../src/components/ArticleCard';

const STORY_TYPES = [{ id: 'all', label: 'All' }, ...FEED_PREFS];
const DATE_FILTERS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all',   label: 'All Time' },
];

export default function ArchiveScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);
  const { user } = useUser();
  const auth = useAuth();
  const uid = auth?.user?.uid || null;
  const accentColor = user.plan === 'pro' ? colors.gold : colors.student;

  const [allArticles, setAllArticles] = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoryType, setActiveStoryType] = useState('all');
  const [activeDateFilter, setActiveDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input by 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Load archive on mount
  useEffect(() => {
    loadArchive();
  }, [uid]);

  const loadArchive = async () => {
    setLoading(true);
    try {
      const articles = await fetchArchive(uid);
      setAllArticles(articles);
    } catch {
      setAllArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter articles
  useEffect(() => {
    let results = allArticles;

    if (debouncedQuery.length > 1) {
      const q = debouncedQuery.toLowerCase();
      results = results.filter(a =>
        (a.headline || '').toLowerCase().includes(q) ||
        (a.brief || '').toLowerCase().includes(q)
      );
    }

    if (activeStoryType !== 'all') {
      results = results.filter(a => a.storyType === activeStoryType);
    }

    results = applyDateFilter(results, activeDateFilter);
    setFiltered(results);
  }, [debouncedQuery, activeStoryType, activeDateFilter, allArticles]);

  const renderArticle = useCallback(({ item }) => (
    <ArticleCard
      article={item}
      detailLevel={1}
      plan={user.plan}
      userSectors={user.sectors}
    />
  ), [user.plan, user.sectors]);

  const renderEmpty = () => {
    if (loading) return null;

    if (allArticles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your archive is empty</Text>
          <Text style={styles.emptySubtitle}>
            Read your feed to start building your archive
          </Text>
          <TouchableOpacity
            style={[styles.goToFeedButton, { backgroundColor: accentColor }]}
            activeOpacity={0.7}
            onPress={() => router.navigate('/(tabs)/feed')}
          >
            <Text style={styles.goToFeedText}>Go to Feed</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No archived articles match your search</Text>
        <Text style={styles.emptySubtitle}>
          Articles from your feed are saved here automatically
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Archive</Text>
        <Text style={styles.articleCount}>
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stories..."
            placeholderTextColor={colors.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Story type chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
      >
        {STORY_TYPES.map((type) => {
          const isActive = activeStoryType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => setActiveStoryType(type.id)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isActive && { borderColor: accentColor, backgroundColor: accentColor + '15' },
              ]}
            >
              <Text style={[
                styles.chipLabel,
                isActive && { color: accentColor, fontWeight: '600' },
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Date filter row */}
      <View style={styles.dateFilterRow}>
        {DATE_FILTERS.map((df) => {
          const isActive = activeDateFilter === df.id;
          return (
            <TouchableOpacity
              key={df.id}
              onPress={() => setActiveDateFilter(df.id)}
              activeOpacity={0.7}
              style={[
                styles.datePill,
                isActive && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
            >
              <Text style={[
                styles.datePillLabel,
                isActive && { color: colors.bg, fontWeight: '700' },
              ]}>
                {df.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Archive list */}
      <FlatList
        data={filtered}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
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
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.text,
    },
    articleCount: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
    searchBarContainer: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: SPACING.md,
      minHeight: 44,
    },
    searchIcon: {
      fontSize: 18,
      color: colors.textDim,
      marginRight: SPACING.sm,
    },
    searchInput: {
      flex: 1,
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.text,
      paddingVertical: SPACING.sm,
    },
    clearButton: {
      fontSize: 14,
      color: colors.textMid,
      paddingLeft: SPACING.sm,
    },
    chipScroll: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chipContent: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      gap: SPACING.xs,
    },
    chip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: SPACING.xs,
      minHeight: 34,
      justifyContent: 'center',
    },
    chipLabel: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textDim,
    },
    dateFilterRow: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      gap: SPACING.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    datePill: {
      flex: 1,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 34,
    },
    datePillLabel: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.textDim,
    },
    listContent: {
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.xxl * 2,
      paddingHorizontal: SPACING.lg,
    },
    emptyTitle: {
      fontFamily: FONTS.serif,
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
      marginBottom: SPACING.sm,
    },
    emptySubtitle: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMid,
      textAlign: 'center',
      lineHeight: 20,
    },
    goToFeedButton: {
      marginTop: SPACING.lg,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.sm,
      minHeight: 48,
      justifyContent: 'center',
    },
    goToFeedText: {
      fontFamily: FONTS.sans,
      fontSize: 15,
      fontWeight: '700',
      color: '#080A0F',
      textAlign: 'center',
    },
  });
}
