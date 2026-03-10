import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS, COLORS } from '../../src/constants/theme';
import { useColors } from '../../src/context/UserContext';
import { resetPassword } from '../../src/services/authService';
import PrimaryButton from '../../src/components/PrimaryButton';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);

  const [email, setEmail]       = useState('');
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const emailValid = validateEmail(email);

  const handleReset = async () => {
    if (!emailValid) return;
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      const code = e.code || '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.description}>
            Enter your email and we'll send you a reset link
          </Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {sent ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Check your inbox. The link expires in 1 hour.
              </Text>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
              />
              <PrimaryButton
                label={loading ? '' : 'Send Reset Link'}
                onPress={handleReset}
                disabled={!emailValid || loading}
              >
                {loading && <ActivityIndicator color={COLORS.bg} size="small" />}
              </PrimaryButton>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backToLogin}
          >
            <Text style={styles.linkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
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
    container: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      paddingVertical: SPACING.sm,
      marginBottom: SPACING.md,
    },
    backText: {
      fontFamily: FONTS.sans,
      fontSize: 15,
      color: colors.gold,
    },
    heading: {
      fontFamily: FONTS.serif,
      fontSize: 26,
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    description: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMid,
      lineHeight: 20,
      marginBottom: SPACING.lg,
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
      marginBottom: SPACING.md,
    },
    form: {
      gap: SPACING.md,
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
    successBox: {
      backgroundColor: colors.green + '15',
      borderRadius: RADIUS.sm,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.green + '44',
    },
    successText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.green,
      lineHeight: 20,
      textAlign: 'center',
    },
    backToLogin: {
      alignItems: 'center',
      paddingVertical: SPACING.md,
      marginTop: SPACING.lg,
    },
    linkText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.gold,
    },
  });
}
