import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS, COLORS } from '../../src/constants/theme';
import { useUser, useColors } from '../../src/context/UserContext';
import { loginUser } from '../../src/services/authService';
import { getUserProfile } from '../../src/services/userService';
import PrimaryButton from '../../src/components/PrimaryButton';
import GhostButton from '../../src/components/GhostButton';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);
  const { updateUser } = useUser();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [emailTouched, setEmailTouched]     = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const emailValid    = validateEmail(email);
  const passwordValid = password.length >= 8;
  const formValid     = emailValid && passwordValid;

  const handleLogin = async () => {
    if (!formValid) return;
    setLoading(true);
    setError('');
    try {
      const firebaseUser = await loginUser(email, password);
      const profile = await getUserProfile(firebaseUser.uid);
      if (profile) {
        updateUser(profile);
      }
      if (profile?.hasOnboarded) {
        router.replace('/(tabs)/feed');
      } else {
        router.replace('/onboarding/welcome');
      }
    } catch (e) {
      const code = e.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    router.replace('/onboarding/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Wordmark */}
          <View style={styles.brandSection}>
            <Text style={styles.wordmark}>LexStar</Text>
            <Text style={styles.tagline}>LEGAL & FINANCIAL INTELLIGENCE</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  emailTouched && !emailValid && email.length > 0 && styles.inputError,
                ]}
                placeholder="Email"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                onBlur={() => setEmailTouched(true)}
              />
              {emailTouched && !emailValid && email.length > 0 && (
                <Text style={styles.fieldError}>Enter a valid email address</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  passwordTouched && !passwordValid && password.length > 0 && styles.inputError,
                ]}
                placeholder="Password"
                placeholderTextColor={colors.textDim}
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                onBlur={() => setPasswordTouched(true)}
              />
              {passwordTouched && !passwordValid && password.length > 0 && (
                <Text style={styles.fieldError}>Password must be at least 8 characters</Text>
              )}
            </View>

            <PrimaryButton
              label={loading ? '' : 'Sign In'}
              onPress={handleLogin}
              disabled={!formValid || loading}
              style={styles.signInButton}
            >
              {loading && <ActivityIndicator color={COLORS.bg} size="small" />}
            </PrimaryButton>

            <TouchableOpacity
              onPress={() => router.push('/auth/forgot-password')}
              activeOpacity={0.7}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Bottom actions */}
          <View style={styles.bottomActions}>
            <GhostButton
              label="Create an account"
              onPress={() => router.push('/auth/register')}
            />

            <TouchableOpacity
              onPress={() => router.replace('/onboarding/welcome')}
              activeOpacity={0.7}
              style={styles.guestButton}
            >
              <Text style={styles.guestText}>Continue without account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
    },
    brandSection: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    wordmark: {
      fontFamily: FONTS.serif,
      fontSize: 32,
      color: colors.gold,
      letterSpacing: 1,
    },
    tagline: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      color: colors.textMid,
      letterSpacing: 2,
      marginTop: SPACING.xs,
    },
    form: {
      gap: SPACING.md,
    },
    errorBanner: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.red,
      textAlign: 'center',
      backgroundColor: colors.red + '15',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: RADIUS.sm,
      overflow: 'hidden',
    },
    inputGroup: {
      gap: SPACING.xs,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADIUS.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      fontFamily: FONTS.sans,
      fontSize: 15,
      color: colors.text,
      minHeight: 52,
    },
    inputError: {
      borderColor: colors.red,
    },
    fieldError: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.red,
      marginLeft: SPACING.xs,
    },
    signInButton: {
      marginTop: SPACING.xs,
    },
    linkButton: {
      alignItems: 'center',
      paddingVertical: SPACING.xs,
    },
    linkText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.gold,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textDim,
      marginHorizontal: SPACING.md,
    },
    bottomActions: {
      gap: SPACING.md,
    },
    guestButton: {
      alignItems: 'center',
      paddingVertical: SPACING.sm,
    },
    guestText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textDim,
    },
  });
}
