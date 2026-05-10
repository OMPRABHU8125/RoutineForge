import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView, Switch } from 'react-native';
import { Settings, Bell, Shield, CircleUser, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import { USER_MOCK } from '../../data/mockData';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">Profile</Typography>
        <Settings color={COLORS.textPrimary} size={24} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarPlaceholder}>
            <CircleUser color={COLORS.textSecondary} size={64} />
          </View>
          <Typography variant="h2" weight="bold" style={{ marginTop: 16 }}>
            {USER_MOCK.name}
          </Typography>
          <Typography variant="caption">Elite Member • Since Jan 2024</Typography>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Typography variant="h3" weight="bold">82.5</Typography>
            <Typography variant="label">Weight (kg)</Typography>
          </View>
          <View style={[styles.statItem, styles.borderLeft]}>
            <Typography variant="h3" weight="bold">182</Typography>
            <Typography variant="label">Height (cm)</Typography>
          </View>
        </View>

        {/* Settings Groups */}
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          App Settings
        </Typography>
        <Card style={styles.settingsCard}>
          <SettingItem icon={<Bell color={COLORS.primary} size={20} />} title="Notifications" />
          <SettingItem icon={<Shield color={COLORS.primary} size={20} />} title="Privacy & Security" />
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Typography>Dark Mode</Typography>
            </View>
            <Switch
              value={true}
              trackColor={{ false: COLORS.surfaceElevated, true: COLORS.primary }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
        </Card>

        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Fitness Goals
        </Typography>
        <Card style={styles.settingsCard}>
          <SettingItem title="Weight Goal" value="Muscle Gain" />
          <SettingItem title="Intensity Level" value="High" />
          <SettingItem title="Analyze Frequency" value="Weekly" />
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem = ({ icon, title, value }: any) => (
  <View style={styles.settingRow}>
    <View style={styles.settingLabel}>
      {icon}
      <Typography style={icon ? { marginLeft: 12 } : {}}>{title}</Typography>
    </View>
    <View style={styles.settingValue}>
      {value ? (
        <Typography variant="caption" color={COLORS.primary}>{value}</Typography>
      ) : (
        <ChevronRight color={COLORS.textTertiary} size={18} />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  settingsCard: {
    marginBottom: SPACING.xl,
    padding: 0,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
