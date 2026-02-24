import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import { MOCK_ARTICLES } from '../../src/data/mockArticles';
import ArticleCard from '../../src/components/ArticleCard';

function LiveDot() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setVisible((v) => !v), 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[styles.liveDot, { opacity: visible ? 1 : 0.3 }]} />
  );
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const DETAIL_LEVELS = ['Headlines', 'Brief', 'Full'];

export default function FeedScreen() {
  const [detailLevel, setDetailLevel] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleCardPress = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>LexStar</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Text style={styles.filterText}>Filter ≡</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <View style={styles.liveRow}>
          <LiveDot />
          <Text style={styles.liveText}>LIVE</Text>
          <Text style={styles.timeText}>{currentTime}</Text>
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

      {/* Articles */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ARTICLES.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            detailLevel={detailLevel}
            isExpanded={expandedId === article.id}
            onPress={() => handleCardPress(article.id)}
          />
        ))}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  wordmark: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  filterButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  subHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
    gap: SPACING.sm,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  liveText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
    letterSpacing: 1.5,
  },
  timeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textMid,
    marginLeft: SPACING.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.gold + '22',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  toggleLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
  },
  toggleLabelActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
