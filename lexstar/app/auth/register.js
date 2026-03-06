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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS, COLORS } from '../../src/constants/theme';
import { useColors } from '../../src/context/UserContext';
import { registerUser } from '../../src/services/authService';
import { createUserProfile } from '../../src/services/userService';
import PrimaryButton from '../../src/components/PrimaryButton';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(password) {
  if (password.length < 8) return { level: 'weak', label: 'Weak', color: '#FF5C5C', width: '33%' };
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (password.length >= 10 && hasNumberOrSymbol) return { level: 'strong', label: 'Strong', color: '#3ECF8E', width: '100%' };
  return { level: 'fair', label: 'Fair', color: '#F5A623', width: '66%' };
}

export default function RegisterScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);

  const [firstName, setFirstName]           = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameTouched, setFirstNameTouched]       = useState(false);
  const [emailTouched, setEmailTouched]               = useState(false);
  const [passwordTouched, setPasswordTouched]         = useState(false);
  const [confirmTouched, setConfirmTouched]           = useState(false);

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const firstNameValid  = firstName.trim().length >= 2;
  const emailValid      = validateEmail(email);
  const passwordValid   = password.length >= 8;
  const confirmValid    = password === confirmPassword && confirmPassword.length > 0;
  const formValid       = firstNameValid && emailValid && passwordValid && confirmValid;

  const strength = getPasswordStrength(password);

  const handleRegister = async () => {
    if (!formValid) return;
    setLoading(true);
    setError('');
    try {
      const firebaseUser = await registerUser(email, password, firstName.trim());
      await createUserProfile(firebaseUser.uid, {
        name: firstName.trim(),
        email,
        plan: null,
        hasOnboarded: false,
        sectors: [],
        feedPrefs: [],
        regions: [],
        notifPref: 'morning',
        darkMode: true,
        field: 'finance',
      });
      router.replace('/onboarding/welcome');
    } catch (e) {
      const code = e.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Registration failed. Please try again.');
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create Account</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <View style={styles.form}>
            {/* First name */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  firstNameTouched && !firstNameValid && firstName.length > 0 && styles.inputError,
                ]}
                placeholder="First name"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
                autoComplete="given-name"
                value={firstName}
                onChangeText={(t) => { setFirstName(t); setError(''); }}
                onBlur={() => setFirstNameTouched(true)}
              />
              {firstNameTouched && !firstNameValid && firstName.length > 0 && (
                <Text style={styles.fieldError}>Name must be at least 2 characters</Text>
              )}
            </View>

            {/* Email */}
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

            {/* Password */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  passwordTouched && !passwordValid && password.length > 0 && styles.inputError,
                ]}
                placeholder="Password"
                placeholderTextColor={colors.textDim}
                secureTextEntry
                autoComplete="new-password"
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                onBlur={() => setPasswordTouched(true)}
              />
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthBar,
                        { backgroundColor: strength.color, width: strength.width },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
              {passwordTouched && !passwordValid && password.length > 0 && (
                <Text style={styles.fieldError}>Password must be at least 8 characters</Text>
              )}
            </View>

            {/* Confirm password */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  confirmTouched && !confirmValid && confirmPassword.length > 0 && styles.inputError,
                ]}
                placeholder="Confirm password"
                placeholderTextColor={colors.textDim}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                onBlur={() => setConfirmTouched(true)}
              />
              {confirmTouched && !confirmValid && confirmPassword.length > 0 && (
                <Text style={styles.fieldError}>Passwords do not match</Text>
              )}
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account you agree to our{' '}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL('https://lexstar.app/terms')}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL('https://lexstar.app/privacy')}
              >
                Privacy Policy
              </Text>
            </Text>

            <PrimaryButton
              label={loading ? '' : 'Create Account'}
              onPress={handleRegister}
              disabled={!formValid || loading}
              style={styles.submitButton}
            >
              {loading && <ActivityIndicator color={COLORS.bg} size="small" />}
            </PrimaryButton>
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
    strengthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginTop: 2,
    },
    strengthTrack: {
      flex: 1,
      height: 3,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    strengthBar: {
      height: 3,
      borderRadius: 2,
    },
    strengthLabel: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      fontWeight: '600',
    },
    termsText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMid,
      lineHeight: 18,
    },
    termsLink: {
      color: colors.gold,
      textDecorationLine: 'underline',
    },
    submitButton: {
      marginTop: SPACING.xs,
    },
  });
}
