import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SPACING, RADIUS, FONTS, COLORS } from '../../src/constants/theme';
import PlanBadge from '../../src/components/PlanBadge';
import TagChip from '../../src/components/TagChip';
import { useUser, useColors } from '../../src/context/UserContext';
import { useAuth } from '../../src/context/AuthContext';
import { logoutUser } from '../../src/services/authService';
import { getBookmarks } from '../../src/services/bookmarkService';
import { FINANCE_SECTORS, LAW_SECTORS } from '../../src/data/sectors';
import { REGIONS } from '../../src/data/regions';
import { FEED_PREFS } from '../../src/data/feedPrefs';

const ALL_SECTORS = [...FINANCE_SECTORS, ...LAW_SECTORS];

const PLAN_META = {
  student: {
    icon: '\uD83C\uDF93',
    name: 'Student Plan',
    tagline: "Personalised briefings for tomorrow's professionals",
  },
  pro: {
    icon: '\u26A1',
    name: 'Professional Plan',
    tagline: 'Intelligence for practitioners who need the edge',
  },
};

const NOTIF_LABELS = {
  realtime: 'Real-time',
  morning: 'Morning digest \u00B7 7:00 AM',
  evening: 'Evening digest \u00B7 6:00 PM',
  weekly: 'Weekly roundup \u00B7 Fridays 5:00 PM',
};

function SectionHeader({ title, onEdit, colors }) {
  const s = makeSectionStyles(colors);
  return (
    <View style={s.sectionHeaderRow}>
      <Text style={s.sectionHeader}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <Text style={s.editLink}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SettingRow({ label, value, right, last, colors }) {
  const s = makeSettingRowStyles(colors);
  return (
    <View style={[s.settingRow, last && s.settingRowLast]}>
      <Text style={s.settingLabel}>{label}</Text>
      {right || <Text style={s.settingValue}>{value}</Text>}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, updateUser, resetUser } = useUser();
  const colors = useColors();
  const styles = makeStyles(colors);
  const auth = useAuth();
  const firebaseUser = auth?.user || null;
  const uid = firebaseUser?.uid || null;

  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    getBookmarks(uid).then(items => setBookmarkCount(items.length)).catch(() => {});
  }, [uid]);

  const planMeta = PLAN_META[user.plan] || PLAN_META.student;
  const accentColor = user.plan === 'pro' ? colors.gold : colors.student;

  const sectorLabels = user.sectors
    .map((id) => ALL_SECTORS.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const regionLabels = user.regions
    .map((id) => REGIONS.find((r) => r.id === id)?.label)
    .filter(Boolean);

  const feedPrefLabels = user.feedPrefs
    .map((id) => FEED_PREFS.find((p) => p.id === id)?.label)
    .filter(Boolean);

  const notifLabel = NOTIF_LABELS[user.notifPref] || 'Morning digest \u00B7 7:00 AM';

  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will clear all your preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetUser();
            router.replace('/onboarding/welcome');
          },
        },
      ],
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out of LexStar?',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            await resetUser();
            router.replace('/auth/login');
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'To delete your account please contact support@lexstar.app',
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.text === '#E8E4DC' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Guest banner */}
        {!firebaseUser && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerText}>
              Sign in to sync your preferences across devices
            </Text>
            <TouchableOpacity
              style={[styles.guestSignInButton, { backgroundColor: accentColor }]}
              activeOpacity={0.7}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.guestSignInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User card (for logged-in users) */}
        {firebaseUser && (
          <View style={[styles.userCard, { borderColor: accentColor + '44' }]}>
            <View style={styles.userCardTop}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {firebaseUser.displayName || user.name || 'User'}
                </Text>
                <Text style={styles.userEmail}>{firebaseUser.email}</Text>
              </View>
              <PlanBadge plan={user.plan || 'student'} />
            </View>
          </View>
        )}

        {/* Plan card */}
        <View style={[styles.planCard, { borderColor: accentColor + '44' }]}>
          <View style={styles.planTop}>
            <View style={styles.planInfo}>
              <Text style={styles.planIcon}>{planMeta.icon}</Text>
              <View style={styles.planText}>
                <Text style={styles.planName}>{planMeta.name}</Text>
                <Text style={styles.planTagline}>{planMeta.tagline}</Text>
              </View>
            </View>
            {!firebaseUser && <PlanBadge plan={user.plan || 'student'} />}
          </View>
          <TouchableOpacity
            style={styles.switchPlanButton}
            activeOpacity={0.7}
            onPress={() => router.push('/onboarding/plan?returnTo=profile')}
          >
            <Text style={styles.switchPlanText}>Switch Plan</Text>
          </TouchableOpacity>
        </View>

        {/* My Feed */}
        <View style={styles.section}>
          <SectionHeader
            title="My Feed"
            onEdit={() => router.push('/onboarding/feed-prefs?returnTo=profile')}
            colors={colors}
          />
          {feedPrefLabels.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContent}
            >
              {feedPrefLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/feed-prefs?returnTo=profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No preferences set — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Sectors */}
        <View style={styles.section}>
          <SectionHeader
            title="My Sectors"
            onEdit={() => router.push('/onboarding/industry')}
            colors={colors}
          />
          {sectorLabels.length > 0 ? (
            <View style={styles.chipsRow}>
              {sectorLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/industry')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No sectors selected — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Regions */}
        <View style={styles.section}>
          <SectionHeader
            title="My Regions"
            onEdit={() => router.push('/onboarding/feed-prefs?section=regions&returnTo=profile')}
            colors={colors}
          />
          {regionLabels.length > 0 ? (
            <View style={styles.chipsRow}>
              {regionLabels.map((label) => (
                <TagChip key={label} label={label} active accentColor={accentColor} />
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/onboarding/feed-prefs?section=regions&returnTo=profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyText}>No regions selected — tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Saved Articles */}
        <View style={styles.section}>
          <SectionHeader title="Saved Articles" colors={colors} />
          <TouchableOpacity
            style={styles.savedRow}
            activeOpacity={0.7}
            onPress={() => router.push('/saved')}
          >
            <Text style={styles.savedLabel}>
              {'\u2605'} {bookmarkCount} saved {bookmarkCount === 1 ? 'article' : 'articles'}
            </Text>
            <Text style={styles.savedArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" colors={colors} />
          <View style={styles.settingsCard}>
            <SettingRow
              label="Frequency"
              right={
                <View style={styles.settingValueRow}>
                  <Text style={styles.settingValue}>{notifLabel}</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/onboarding/notifications')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.changeLink, { color: accentColor }]}>Change</Text>
                  </TouchableOpacity>
                </View>
              }
              last
              colors={colors}
            />
          </View>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <SectionHeader title="Display" colors={colors} />
          <View style={styles.settingsCard}>
            <SettingRow
              label="Dark mode"
              right={
                <Switch
                  value={user.darkMode !== false}
                  onValueChange={(val) => updateUser({ darkMode: val })}
                  trackColor={{ false: colors.border, true: colors.gold + '66' }}
                  thumbColor={user.darkMode !== false ? colors.gold : colors.textDim}
                />
              }
              last
              colors={colors}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <SectionHeader title="Account" colors={colors} />
          {firebaseUser ? (
            <View style={styles.accountActions}>
              <TouchableOpacity
                style={styles.signOutButton}
                activeOpacity={0.7}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.7}
              onPress={handleReset}
            >
              <Text style={styles.resetText}>Reset App</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeSectionStyles(colors) {
  return StyleSheet.create({
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    sectionHeader: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      fontWeight: '700',
      color: colors.textDim,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    editLink: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.gold,
      fontWeight: '600',
    },
  });
}

function makeSettingRowStyles(colors) {
  return StyleSheet.create({
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: 52,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingLabel: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.text,
    },
    settingValue: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
  });
}

function makeStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.text,
    },
    scroll: {
      flex: 1,
    },
    guestBanner: {
      margin: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.gold + '44',
      padding: SPACING.md,
      alignItems: 'center',
      gap: SPACING.sm,
    },
    guestBannerText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 20,
    },
    guestSignInButton: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.sm,
      minHeight: 40,
      justifyContent: 'center',
    },
    guestSignInText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      fontWeight: '700',
      color: '#080A0F',
    },
    userCard: {
      margin: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      padding: SPACING.md,
    },
    userCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
      gap: 3,
    },
    userName: {
      fontFamily: FONTS.serif,
      fontSize: 20,
      color: colors.text,
    },
    userEmail: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
    planCard: {
      margin: SPACING.md,
      marginTop: 0,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      padding: SPACING.md,
      gap: SPACING.md,
    },
    planTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    planInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.sm,
      flex: 1,
    },
    planIcon: {
      fontSize: 28,
    },
    planText: {
      flex: 1,
      gap: 3,
    },
    planName: {
      fontFamily: FONTS.sans,
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    planTagline: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMid,
      lineHeight: 17,
    },
    switchPlanButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADIUS.sm,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    switchPlanText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
    section: {
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.md,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chipsScrollContent: {
      flexDirection: 'row',
      gap: SPACING.xs,
      paddingRight: SPACING.md,
    },
    emptyText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textDim,
      textDecorationLine: 'underline',
    },
    savedRow: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52,
    },
    savedLabel: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.text,
    },
    savedArrow: {
      fontSize: 20,
      color: colors.textMid,
    },
    settingsCard: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingValue: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMid,
    },
    settingValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    changeLink: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      fontWeight: '600',
    },
    accountActions: {
      gap: SPACING.sm,
    },
    signOutButton: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      minHeight: 52,
      justifyContent: 'center',
    },
    signOutText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    deleteButton: {
      alignItems: 'center',
      paddingVertical: SPACING.xs,
    },
    deleteText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.red,
    },
    resetButton: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.red + '66',
      paddingVertical: SPACING.md,
      alignItems: 'center',
      minHeight: 52,
      justifyContent: 'center',
    },
    resetText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      fontWeight: '600',
      color: colors.red,
    },
    bottomPad: {
      height: SPACING.xl,
    },
  });
}
