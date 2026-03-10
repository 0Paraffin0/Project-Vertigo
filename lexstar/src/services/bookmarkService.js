import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import {
  doc, setDoc, deleteDoc,
  collection, getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const LOCAL_KEY = 'lexstar_bookmarks';

export async function bookmarkArticle(article, uid = null) {
  if (uid) {
    const ref = doc(db, 'users', uid, 'bookmarks', article.id);
    await setDoc(ref, { ...article, savedAt: serverTimestamp() });
  } else {
    const existing = await getLocalBookmarks();
    const updated = [article, ...existing.filter(a => a.id !== article.id)];
    await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  }
}

export async function removeBookmark(articleId, uid = null) {
  if (uid) {
    await deleteDoc(doc(db, 'users', uid, 'bookmarks', articleId));
  } else {
    const existing = await getLocalBookmarks();
    const updated = existing.filter(a => a.id !== articleId);
    await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  }
}

export async function getBookmarks(uid = null) {
  if (uid) {
    const snap = await getDocs(collection(db, 'users', uid, 'bookmarks'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return getLocalBookmarks();
}

async function getLocalBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
