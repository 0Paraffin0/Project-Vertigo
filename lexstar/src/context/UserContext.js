import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, getColors } from '../constants/theme';

const STORAGE_KEY = '@lexstar_user';

const INITIAL_STATE = {
  plan: 'student',
  name: '',
  sectors: [],
  feedPrefs: [],
  regions: [],
  notifPref: 'morning',
  darkMode: true,
  hasOnboarded: false,
  field: 'finance',
};

function userReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'RESET':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) {
          const saved = JSON.parse(json);
          dispatch({ type: 'UPDATE_USER', payload: saved });
        }
      })
      .catch(() => {
        // Storage read failed — use defaults
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Persist to storage on every state change (skip during initial load)
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, isLoading]);

  const updateUser = (partial) => {
    dispatch({ type: 'UPDATE_USER', payload: partial });
  };

  const resetUser = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.wordmark}>LexStar</Text>
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user: state, updateUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}

export function useColors() {
  const { user } = useUser();
  return getColors(user.darkMode);
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: FONTS.serif,
    fontSize: 36,
    color: COLORS.gold,
    letterSpacing: 1,
  },
});
