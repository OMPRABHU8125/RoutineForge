import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import { Flame, Target, Sparkles, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import ProgressRing from '../../components/shared/ProgressRing';
import Button from '../../components/shared/Button';
import { USER_MOCK } from '../../data/mockData';

export const DashboardScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="caption">Welcome back,</Typography>
            <Typography variant="h1" weight="bold">
              {USER_MOCK.name}
            </Typography>
          </View>
          <Card variant="flat" padding="sm" style={styles.streakCard}>
            <Flame color={COLORS.primary} size={20} />
            <Typography weight="bold" style={{ marginLeft: 4 }}>
              {USER_MOCK.streak}
            </Typography>
          </Card>
        </View>

        {/* Progress Section */}
        <View style={styles.progressRow}>
          <Card style={styles.progressCard}>
            <ProgressRing
              progress={USER_MOCK.workoutProgress}
              label="Workout Goal"
              size={110}
            />
          </Card>
          <View style={styles.focusContainer}>
            <Card variant="outline" style={styles.focusCard}>
              <View style={styles.cardHeader}>
                <Target color={COLORS.primary} size={16} />
                <Typography variant="label" style={{ marginLeft: 8 }}>
                  Today's Focus
                </Typography>
              </View>
              <Typography weight="semi-bold" style={{ marginTop: 8 }}>
                {USER_MOCK.dailyFocus}
              </Typography>
            </Card>
            <Button
              title="Quick Scan"
              onPress={() => navigation.navigate('Analyze')}
              size="sm"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>

        {/* AI Insight Card */}
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Latest Insight
        </Typography>
        <Card onPress={() => {}}>
          <View style={styles.cardHeader}>
            <Sparkles color={COLORS.primary} size={18} />
            <Typography variant="label" style={{ marginLeft: 8 }}>
              AI ANALYZER
            </Typography>
          </View>
          <Typography variant="h3" weight="semi-bold" style={{ marginTop: 12 }}>
            {USER_MOCK.lastInsight.title}
          </Typography>
          <Typography variant="caption" style={{ marginTop: 8 }}>
            {USER_MOCK.lastInsight.summary}
          </Typography>
          <View style={styles.cardFooter}>
            <Typography variant="label" color={COLORS.primary}>
              View Details
            </Typography>
            <ChevronRight color={COLORS.primary} size={16} />
          </View>
        </Card>

        {/* Placeholder for more cards */}
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
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  progressRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  progressCard: {
    flex: 1,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusContainer: {
    flex: 1.2,
  },
  focusCard: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});

export default DashboardScreen;
