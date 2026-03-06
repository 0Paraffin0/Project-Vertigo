import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUser } from '../src/context/UserContext';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, FONTS } from '../src/constants/theme';

export default function Index() {
  const { user } = useUser();
  const auth = useAuth();

  // 1. Auth is still loading → show loading screen
  if (auth?.authLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.wordmark}>LexStar</Text>
      </View>
    );
  }

  // 2. No Firebase user → navigate to auth/login
  if (!auth?.user) {
    return <Redirect href="/auth/login" />;
  }

  // 3. Firebase user exists, hasOnboarded false → onboarding
  if (!user.hasOnboarded) {
    return <Redirect href="/onboarding/welcome" />;
  }

  // 4. Firebase user exists, hasOnboarded true → feed
  return <Redirect href="/(tabs)/feed" />;
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
