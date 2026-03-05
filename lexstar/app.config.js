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
  },
};
