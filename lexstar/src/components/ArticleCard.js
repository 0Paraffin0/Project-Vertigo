import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { RADIUS, SPACING, FONTS, CATEGORY_COLORS } from '../constants/theme';
import TagChip from './TagChip';
import { FINANCE_SECTORS, LAW_SECTORS } from '../data/sectors';
import { useColors } from '../context/UserContext';

const ALL_SECTORS = [...FINANCE_SECTORS, ...LAW_SECTORS];

export default function ArticleCard({ article, detailLevel, isExpanded, onPress, plan, userSectors = [] }) {
  const colors = useColors();
  const styles = makeStyles(colors);
  const categoryColor = CATEGORY_COLORS[article.category] || colors.gold;
  const isBreaking = article.breaking || article.category === 'breaking';
  const accentColor = plan === 'pro' ? colors.gold : colors.student;

  const matchingSector = userSectors.length > 0
    ? ALL_SECTORS.find((s) => (article.sectorIds || []).includes(s.id) && userSectors.includes(s.id))
    : ALL_SECTORS.find((s) => (article.sectorIds || []).includes(s.id));

  const displayTags = (article.tags || []).slice(0, 3);

  const handleSourcePress = (source) => {
    const url = "https://www.google.com/search?q=" + encodeURIComponent(source + " " + article.headline);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, isExpanded && styles.cardExpanded]}
    >
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

      <Text style={styles.headline}>{article.headline}</Text>

      {detailLevel >= 1 && article.brief && (
        <Text style={styles.brief}>{article.brief}</Text>
      )}

      {matchingSector && (
        <View style={styles.feedLabelRow}>
          <Text style={[styles.feedLabel, { color: accentColor }]}>
            {'◈'} In your feed · {matchingSector.label}
          </Text>
        </View>
      )}

      {detailLevel === 2 && (
        <View style={[styles.noteBox, { backgroundColor: accentColor + "14", borderColor: accentColor + "44" }]}>
          {plan === 'pro' ? (
            <>
              <Text style={[styles.noteLabel, { color: accentColor }]}>⚖ Pro Note</Text>
              <Text style={styles.noteText}>{article.proNote}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.noteLabel, { color: accentColor }]}>🎓 Student Note</Text>
              <Text style={styles.noteText}>{article.studentNote}</Text>
            </>
          )}
        </View>
      )}

      {article.verified && (
        <Text style={styles.verified}>
          ✓ Verified — {(article.sources || []).join(' · ')}
        </Text>
      )}

      <View style={styles.tagsRow}>
        {displayTags.map((tag) => (
          <TagChip
            key={tag}
            label={tag}
            accentColor={categoryColor}
          />
        ))}
      </View>

      {isExpanded && (
        <View style={styles.originalsRow}>
          <Text style={styles.originalsLabel}>Read originals →</Text>
          <View style={styles.sourceLinks}>
            {(article.sources || []).map((src) => (
              <TouchableOpacity
                key={src}
                onPress={() => handleSourcePress(src)}
                activeOpacity={0.7}
                style={[styles.sourceChip, { borderColor: categoryColor }]}
              >
                <Text style={[styles.sourceText, { color: categoryColor }]}>{src}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
    },
    cardExpanded: {
      borderColor: colors.borderB,
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
      color: colors.red,
      letterSpacing: 0.8,
    },
    time: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.textDim,
    },
    headline: {
      fontFamily: FONTS.serif,
      fontSize: 17,
      lineHeight: 24,
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    brief: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMid,
      marginBottom: SPACING.sm,
    },
    feedLabelRow: {
      marginBottom: SPACING.xs,
    },
    feedLabel: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      fontWeight: '600',
    },
    noteBox: {
      borderWidth: 1,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm,
      marginBottom: SPACING.sm,
      gap: 4,
    },
    noteLabel: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      fontWeight: '700',
    },
    noteText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMid,
      lineHeight: 18,
    },
    verified: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.green,
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
      borderTopColor: colors.border,
    },
    originalsLabel: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMid,
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
}
