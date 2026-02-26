import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, RADIUS, FONTS } from '../../src/constants/theme';
import { MARKETS } from '../../src/data/mockMarkets';
import { MOCK_ARTICLES } from '../../src/data/mockArticles';
import ArticleCard from '../../src/components/ArticleCard';
import { useUser } from '../../src/context/UserContext';

const REGION_FILTERS = [
  { id: null,   label: 'All' },
  { id: 'us',   label: 'US' },
  { id: 'uk',   label: 'UK' },
  { id: 'eu',   label: 'EU' },
  { id: 'asia', label: 'Asia' },
];

function ExchangeRow({ exchange, active, onPress }) {
  const borderColor = exchange.positive ? COLORS.green : COLORS.red;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.exchangeRow,
        active && styles.exchangeRowActive,
      ]}
    >
      <View style={[styles.exchangeLeftBorder, { backgroundColor: borderColor }]} />
      <View style={styles.exchangeInfo}>
        <Text style={styles.exchangeName}>{exchange.name}</Text>
        <Text style={styles.exchangeIndex}>{exchange.index}</Text>
      </View>
      <View style={styles.exchangeRight}>
        <Text style={styles.exchangePrice}>{exchange.price}</Text>
        <Text style={[styles.exchangeChange, { color: exchange.positive ? COLORS.green : COLORS.red }]}>
          {exchange.change}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MarketsScreen() {
  const { user } = useUser();
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeMarketId, setActiveMarketId] = useState(null);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const filteredMarkets = activeRegion
    ? MARKETS.filter((m) => m.region === activeRegion)
    : MARKETS;

  const activeMarket = MARKETS.find((m) => m.id === activeMarketId);

  const relatedArticles = activeMarket
    ? MOCK_ARTICLES
        .filter((a) => (a.regionIds || []).includes(activeMarket.region))
        .slice(0, 3)
    : [];

  const handleMarketPress = (marketId) => {
    setActiveMarketId((prev) => (prev === marketId ? null : marketId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Region filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}
        >
          {REGION_FILTERS.map((f) => (
            <TouchableOpacity
              key={String(f.id)}
              onPress={() => {
                setActiveRegion(f.id);
                setActiveMarketId(null);
              }}
              activeOpacity={0.7}
              style={[
                styles.filterChip,
                activeRegion === f.id && styles.filterChipActive,
              ]}
            >
              <Text style={[
                styles.filterChipText,
                activeRegion === f.id && styles.filterChipTextActive,
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exchange list */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>GLOBAL EXCHANGES</Text>
          {filteredMarkets.map((ex) => (
            <ExchangeRow
              key={ex.id}
              exchange={ex}
              active={activeMarketId === ex.id}
              onPress={() => handleMarketPress(ex.id)}
            />
          ))}
        </View>

        {/* Related news */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeader}>Related News</Text>
          {activeMarket ? (
            relatedArticles.length > 0 ? (
              relatedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  detailLevel={0}
                  isExpanded={false}
                  onPress={() => {}}
                  plan={user.plan}
                  userSectors={user.sectors}
                />
              ))
            ) : (
              <Text style={styles.noRelatedText}>No stories found for this region</Text>
            )
          ) : (
            <View style={styles.relatedPlaceholder}>
              <Text style={styles.relatedPlaceholderText}>
                Select a market above to see related news
              </Text>
            </View>
          )}
        </View>

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
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    color: COLORS.text,
  },
  date: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
  },
  scroll: {
    flex: 1,
  },
  filterRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterRowContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  filterChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    minHeight: 34,
    justifyContent: 'center',
  },
  filterChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '18',
  },
  filterChipText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textMid,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.gold,
  },
  sectionCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exchangeRowActive: {
    backgroundColor: COLORS.gold + '0C',
  },
  exchangeLeftBorder: {
    width: 3,
    alignSelf: 'stretch',
    marginRight: SPACING.sm,
    borderRadius: 2,
  },
  exchangeInfo: {
    flex: 1,
    gap: 3,
  },
  exchangeName: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  exchangeIndex: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textMid,
  },
  exchangeRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  exchangePrice: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  exchangeChange: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  relatedSection: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  relatedHeader: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  relatedPlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  relatedPlaceholderText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  noRelatedText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textDim,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
