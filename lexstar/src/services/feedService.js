import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRawHeadlines } from './newsService';
import { summariseArticles } from './claudeService';
import { MOCK_ARTICLES } from '../data/mockArticles';

const CACHE_KEY = 'lexstar_feed_cache';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchFeed(userProfile) {
  const cached = await loadCache();
  if (cached) return cached;

  try {
    const rawArticles = await fetchRawHeadlines(userProfile);
    const summarised = await summariseArticles(rawArticles, userProfile);

    if (summarised.length > 0) {
      await saveCache(summarised);
      return summarised;
    }

    return MOCK_ARTICLES;
  } catch (error) {
    console.error('Feed fetch failed:', error);
    return MOCK_ARTICLES;
  }
}

async function loadCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const { articles, timestamp } = JSON.parse(raw);
    const age = Date.now() - timestamp;

    if (age > CACHE_DURATION_MS) {
      await AsyncStorage.removeItem(CACHE_KEY);
      return null;
    }

    return articles;
  } catch {
    return null;
  }
}

async function saveCache(articles) {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ articles, timestamp: Date.now() })
    );
  } catch (e) {
    console.error('Cache save failed:', e);
  }
}

export async function clearFeedCache() {
  await AsyncStorage.removeItem(CACHE_KEY);
}
