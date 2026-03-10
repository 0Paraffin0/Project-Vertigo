import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS } from '../src/constants/theme';
import { useUser, useColors } from '../src/context/UserContext';
import { useAuth } from '../src/context/AuthContext';
import { getBookmarks } from '../src/services/bookmarkService';
import ArticleCard from '../src/components/ArticleCard';

export default function SavedScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);
  const { user } = useUser();
  const auth = useAuth();
  const uid = auth?.user?.uid || null;

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [uid]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const items = await getBookmarks(uid);
      setBookmarks(items);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = (articleId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks(prev => prev.filter(a => a.id !== articleId));
    }
  };

  const renderArticle = useCallback(({ item }) => (
    <ArticleCard
      article={item}
      detailLevel={1}
      plan={user.plan}
      userSectors={user.sectors}
      isBookmarked={true}
      uid={uid}
      onBookmarkChange={handleBookmarkChange}
    />
  ), [user.plan, user.sectors, uid]);

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No saved articles yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap {'\u2606'} on any story to save it
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saved Articles</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={bookmarks}
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
    backButton: {
      width: 60,
    },
    backText: {
      fontFamily: FONTS.sans,
      fontSize: 15,
      color: colors.gold,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 20,
      color: colors.text,
      textAlign: 'center',
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
  });
}
