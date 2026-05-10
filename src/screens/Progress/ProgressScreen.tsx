import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import { TrendingUp, Calendar, Trophy } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import { PROGRESS_MOCK } from '../../data/mockData';

export const ProgressScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">Physique Stats</Typography>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Weekly Score Row */}
        <View style={styles.scoreRow}>
          <Card style={styles.scoreCard}>
            <Trophy color={COLORS.primary} size={24} />
            <Typography variant="h2" weight="bold" style={{ marginTop: 8 }}>
              {PROGRESS_MOCK.weeklyScore}
            </Typography>
            <Typography variant="label">Weekly Score</Typography>
          </Card>
          <Card style={styles.scoreCard}>
            <Calendar color={COLORS.primary} size={24} />
            <Typography variant="h2" weight="bold" style={{ marginTop: 8 }}>
              {PROGRESS_MOCK.consistency}%
            </Typography>
            <Typography variant="label">Consistency</Typography>
          </Card>
        </View>

        {/* Muscle Group Progress */}
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Muscle Group Gains
        </Typography>
        <Card>
          {PROGRESS_MOCK.muscleGroups.map((group, index) => (
            <View key={group.name} style={[
              styles.progressItem,
              index !== PROGRESS_MOCK.muscleGroups.length - 1 && styles.borderBottom
            ]}>
              <View style={styles.progressLabelRow}>
                <Typography weight="semi-bold">{group.name}</Typography>
                <Typography variant="caption" color={COLORS.primary}>
                  +{Math.round(group.progress * 10)}%
                </Typography>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${group.progress * 100}%` }]} />
              </View>
            </View>
          ))}
        </Card>

        {/* Timeline */}
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Timeline
        </Typography>
        {PROGRESS_MOCK.timeline.map((entry) => (
          <Card key={entry.date} variant="outline" style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Typography weight="bold">{entry.date}</Typography>
              <TrendingUp color={COLORS.success} size={16} />
            </View>
            <View style={styles.timelineStats}>
              <View>
                <Typography variant="caption">Weight</Typography>
                <Typography weight="semi-bold">{entry.weight} kg</Typography>
              </View>
              <View style={{ marginLeft: 32 }}>
                <Typography variant="caption">Body Fat</Typography>
                <Typography weight="semi-bold">{entry.bf}%</Typography>
              </View>
            </View>
          </Card>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  scoreCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  progressItem: {
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  timelineCard: {
    marginBottom: SPACING.md,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineStats: {
    flexDirection: 'row',
  },
});

export default ProgressScreen;
