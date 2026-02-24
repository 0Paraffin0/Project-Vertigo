import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, CATEGORY_COLORS } from '../constants/theme';
import TagChip from './TagChip';

export default function ArticleCard({ article, detailLevel, isExpanded, onPress }) {
  const categoryColor = CATEGORY_COLORS[article.category] || COLORS.gold;
  const isBreaking = article.category === 'breaking';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, isExpanded && styles.cardExpanded]}
    >
      {/* Top row: category + breaking badge + time */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          <Text style={[styles.categoryLabel, { color: categoryColor }]}>
            {article.category.toUpperCase()}
          </Text>
          {isBreaking && (
            <View style={[styles.breakingBadge, { borderColor: COLORS.red }]}>
              <Text style={styles.breakingText}>BREAKING</Text>
            </View>
          )}
        </View>
        <Text style={styles.time}>{article.time}</Text>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>{article.headline}</Text>

      {/* Brief — shown when detailLevel >= 1 */}
      {detailLevel >= 1 && (
        <Text style={styles.brief}>{article.brief}</Text>
      )}

      {/* Feed label */}
      <Text style={styles.feedLabel}>◈ In your feed · {article.sector}</Text>

      {/* Verified line */}
      {article.verified && (
        <Text style={styles.verified}>
          ✓ Verified — {article.sources.join(' · ')}
        </Text>
      )}

      {/* Tags */}
      <View style={styles.tagsRow}>
        {article.tags.map((tag) => (
          <TagChip
            key={tag}
            label={tag}
            accentColor={categoryColor}
          />
        ))}
      </View>

      {/* Read originals — shown only when expanded */}
      {isExpanded && (
        <View style={styles.originalsRow}>
          <Text style={styles.originalsLabel}>Read originals →</Text>
          <View style={styles.sourceLinks}>
            {article.sources.map((src) => (
              <View key={src} style={[styles.sourceChip, { borderColor: categoryColor }]}>
                <Text style={[styles.sourceText, { color: categoryColor }]}>{src}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardExpanded: {
    borderColor: COLORS.borderB,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  breakingBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  breakingText: {
    fontFamily: FONTS.sans,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.red,
    letterSpacing: 0.8,
  },
  time: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textDim,
  },
  headline: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  brief: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textMid,
    marginBottom: SPACING.sm,
  },
  feedLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textDim,
    marginBottom: SPACING.xs,
  },
  verified: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.green,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  originalsRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  originalsLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textMid,
    marginBottom: SPACING.xs,
  },
  sourceLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  sourceChip: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  sourceText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
  },
});
