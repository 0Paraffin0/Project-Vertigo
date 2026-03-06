import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import {
  collection, addDoc, getDocs,
  query, orderBy, limit,
  where, serverTimestamp,
} from 'firebase/firestore';

const LOCAL_KEY = 'lexstar_archive';
const MAX_LOCAL = 100;

// Called by feedService after every successful fetch
export async function appendToArchive(articles, uid = null) {
  if (uid) {
    const col = collection(db, 'users', uid, 'archive');
    for (const article of articles) {
      await addDoc(col, {
        ...article,
        archivedAt: serverTimestamp(),
      });
    }
  } else {
    const existing = await loadLocalArchive();
    const merged = [...articles, ...existing].slice(0, MAX_LOCAL);
    await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
  }
}

export async function fetchArchive(uid = null, filters = {}) {
  if (uid) {
    return fetchFirestoreArchive(uid, filters);
  }
  return fetchLocalArchive(filters);
}

async function fetchFirestoreArchive(uid, filters) {
  const col = collection(db, 'users', uid, 'archive');
  let q = query(col, orderBy('archivedAt', 'desc'), limit(50));

  if (filters.storyType) {
    q = query(col,
      where('storyType', '==', filters.storyType),
      orderBy('archivedAt', 'desc'),
      limit(50)
    );
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadLocalArchive() {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function fetchLocalArchive(filters) {
  const all = await loadLocalArchive();
  if (!filters.storyType) return all;
  return all.filter(a => a.storyType === filters.storyType);
}
