// TODO: Replace placeholder values with your Firebase project config
// Get these from: Firebase Console → Project Settings → Your Apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey:            extra.firebaseApiKey            || "FIREBASE_API_KEY",
  authDomain:        extra.firebaseAuthDomain        || "FIREBASE_AUTH_DOMAIN",
  projectId:         extra.firebaseProjectId         || "FIREBASE_PROJECT_ID",
  storageBucket:     extra.firebaseStorageBucket     || "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: extra.firebaseMessagingSenderId || "FIREBASE_MESSAGING_SENDER_ID",
  appId:             extra.firebaseAppId             || "FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
