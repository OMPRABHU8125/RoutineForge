import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import {
  TrendingUp,
  Award,
  ChevronRight,
  History,
  Zap,
  Activity,
  Target
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import { storageService, ScanResult } from '../../services/storage';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.lg * 2;
const CHART_HEIGHT = 150;

export const ProgressScreen = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [bestScan, setBestScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await storageService.getHistory();
    // For the chart, we want chronological order
    const chronological = [...data].reverse();
    setHistory(chronological);
    
    if (data.length > 0) {
      const best = [...data].sort((a, b) => b.metrics.physiqueScore - a.metrics.physiqueScore)[0];
      setBestScan(best);
    }
  };

  const renderChart = () => {
    if (history.length < 2) {
      return (
        <Card variant="flat" style={styles.emptyChart}>
          <Typography variant="caption" align="center">
            Log at least 2 scans to see your personalized progression chart.
          </Typography>
        </Card>
      );
    }

    const scores = history.map(h => h.metrics.physiqueScore);
    const min = Math.min(...scores) - 5;
    const max = Math.max(...scores) + 5;
    const range = max - min;

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((h.metrics.physiqueScore - min) / range) * CHART_HEIGHT;
      return `${x},${y}`;
    }).join(' ');

    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Polyline
            points={points}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {history.map((h, i) => {
            const x = (i / (history.length - 1)) * CHART_WIDTH;
            const y = CHART_HEIGHT - ((h.metrics.physiqueScore - min) / range) * CHART_HEIGHT;
            return (
              <Circle
                key={h.id}
                cx={x}
                cy={y}
                r="4"
                fill={COLORS.primary}
              />
            );
          })}
        </Svg>
        <View style={styles.chartLabels}>
          <Typography variant="caption">{new Date(history[0].timestamp).toLocaleDateString()}</Typography>
          <Typography variant="caption">{new Date(history[history.length - 1].timestamp).toLocaleDateString()}</Typography>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">Intelligence Progress</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trend Summary */}
        <Card style={styles.trendCard}>
          <View style={styles.trendInfo}>
            <View>
              <Typography variant="label">CURRENT STATE</Typography>
              <Typography variant="h3" weight="bold" color={COLORS.primary}>
                {history.length > 0 ? history[history.length - 1].metrics.evolutionState : 'Beginner'}
              </Typography>
            </View>
            <View style={styles.trendBadge}>
              <TrendingUp color={COLORS.success} size={20} />
              <Typography color={COLORS.success} weight="bold" style={{ marginLeft: 8 }}>
                +{history.length > 1 ? (history[history.length - 1].metrics.trend).toFixed(1) : '0'}%
              </Typography>
            </View>
          </View>
          
          <View style={styles.chartWrapper}>
            {renderChart()}
          </View>
        </Card>

        {/* Personalized Trait Evolution */}
        {history.length > 0 && history[history.length - 1].metrics.traits && (
          <>
            <Typography variant="h3" weight="bold" style={{ marginBottom: 16 }}>Trait Evolution</Typography>
            <View style={styles.traitsTimeline}>
              {history[history.length - 1].metrics.traits.map((trait) => (
                <Card key={trait.id} variant="flat" style={styles.traitEvolutionCard}>
                  <View style={styles.traitHeader}>
                    <Typography weight="semi-bold">{trait.label}</Typography>
                    <Typography variant="caption" color={trait.trend >= 0 ? COLORS.success : COLORS.error}>
                      {trait.trend >= 0 ? '+' : ''}{Math.round(trait.trend)}%
                    </Typography>
                  </View>
                  <View style={styles.traitProgressBarBg}>
                    <View style={[styles.traitProgressBarFill, { width: `${trait.value}%` }]} />
                  </View>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* Milestones */}
        <Typography variant="h3" weight="bold" style={{ marginTop: 24, marginBottom: 16 }}>Milestones</Typography>
        <View style={styles.milestonesGrid}>
          <MilestoneCard 
            icon={<Award color={COLORS.primary} size={24} />}
            label="Personal Best"
            value={bestScan ? Math.round(bestScan.metrics.physiqueScore).toString() : '--'}
          />
          <MilestoneCard 
            icon={<Activity color={COLORS.primary} size={24} />}
            label="Baseline"
            value={history.length > 0 ? 'Calibrated' : 'Learning'}
          />
        </View>

        {/* Historical Timeline */}
        <Typography variant="h3" weight="bold" style={{ marginTop: 24, marginBottom: 16 }}>Timeline</Typography>
        {[...history].reverse().map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDotContainer}>
              <View style={[styles.timelineDot, index === 0 && styles.activeDot]} />
              {index !== history.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <Card variant="flat" style={styles.timelineCard}>
              <View style={styles.timelineContent}>
                <View>
                  <Typography weight="bold">
                    {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Typography>
                  <Typography variant="caption">State: {item.metrics.evolutionState}</Typography>
                </View>
                <View style={styles.timelineScore}>
                  <Typography color={COLORS.primary} weight="bold">
                    {Math.round(item.metrics.physiqueScore)}
                  </Typography>
                  <ChevronRight color={COLORS.textSecondary} size={16} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {history.length === 0 && (
          <View style={styles.emptyState}>
            <History color={COLORS.textSecondary} size={48} />
            <Typography variant="body" color={COLORS.textSecondary} style={{ marginTop: 16 }}>
              No scans yet. Start your journey in the Analyze tab.
            </Typography>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const MilestoneCard = ({ icon, label, value }: any) => (
  <Card variant="outline" style={styles.milestoneItem}>
    {icon}
    <Typography variant="label" style={{ marginTop: 12 }}>{label}</Typography>
    <Typography variant="h3" weight="bold" color={COLORS.textPrimary}>{value}</Typography>
  </Card>
);

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
    paddingBottom: 40,
  },
  trendCard: {
    marginBottom: 24,
  },
  trendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chartWrapper: {
    marginTop: 10,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    marginTop: 8,
  },
  emptyChart: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  traitsTimeline: {
    marginBottom: 8,
  },
  traitEvolutionCard: {
    marginBottom: 10,
    padding: 12,
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  traitProgressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  traitProgressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  milestonesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneItem: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineDotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 20,
    zIndex: 2,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: 'rgba(215, 255, 0, 0.3)',
  },
  timelineLine: {
    position: 'absolute',
    top: 32,
    bottom: -20,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timelineCard: {
    flex: 1,
    marginBottom: 16,
    padding: 16,
  },
  timelineContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
});

export default ProgressScreen;
