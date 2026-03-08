import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../src/context/UserContext';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/theme';

export default function Index() {
  const { user } = useUser();
  const auth = useAuth();

  useEffect(() => {
    // Wait for Firebase auth to resolve before redirecting
    if (auth?.authLoading) return;

    if (!auth?.user) {
      router.replace('/auth/login');
    } else if (!user.hasOnboarded) {
      router.replace('/onboarding/welcome');
    } else {
      router.replace('/(tabs)/feed');
    }
  }, [auth?.authLoading, auth?.user, user.hasOnboarded]);

  // Show loading spinner while Firebase resolves
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={COLORS.gold} />
    </View>
  );
}
