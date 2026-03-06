// app.config.js — reads API keys from .env (never hardcode keys in this file)
// Expo automatically loads .env via @expo/env before this file runs.
// The .env file is gitignored. See .env for key names.

const appJson = require('./app.json');
const { expo } = appJson;

export default {
  ...expo,
  extra: {
    newsApiKey: process.env.NEWS_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    firebaseApiKey: process.env.FIREBASE_API_KEY || '',
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    firebaseAppId: process.env.FIREBASE_APP_ID || '',
  },
};
