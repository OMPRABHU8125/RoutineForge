import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Animated } from 'react-native';
import { Sparkles, TrendingUp, Target, BarChart, CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from '../shared/Typography';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { ScanResult } from '../../services/storage';

interface AnalysisResultsProps {
  result: ScanResult;
  onDone: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onDone }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Safety check for imageUri to prevent 'startsWith' of undefined error
  const rawUri = result?.imageUri || '';
  const imageUri = rawUri.startsWith('file://') ? rawUri : `file://${rawUri}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <CheckCircle2 color={COLORS.success} size={40} />
        <Typography variant="h2" weight="bold" style={{ marginTop: 12 }}>
          Analysis Ready
        </Typography>
        
        <View style={styles.stateBadge}>
          <Zap color={COLORS.primary} size={14} />
          <Typography variant="label" weight="bold" color={COLORS.primary} style={{ marginLeft: 6 }}>
            {(result?.metrics?.evolutionState || 'Beginner').toUpperCase()}
          </Typography>
        </View>
      </Animated.View>

      <View style={styles.imagePreview}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.centered]}>
            <Typography color={COLORS.textSecondary}>Image Unavailable</Typography>
          </View>
        )}
        <View style={styles.scoreBadge}>
          <Typography variant="h3" weight="bold" color={COLORS.background}>
            {Math.round(result?.metrics?.physiqueScore || 0)}
          </Typography>
          <Typography variant="label" color={COLORS.background} style={{ fontSize: 8 }}>
            PHYSIQUE
          </Typography>
        </View>
        
        <View style={styles.confidenceBadge}>
          <ShieldCheck color="#fff" size={12} />
          <Typography variant="label" style={{ color: '#fff', fontSize: 10, marginLeft: 4 }}>
            {result?.metrics?.confidence || 'Low'} Confidence
          </Typography>
        </View>
      </View>

      {/* AI Insight */}
      <Card style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <Sparkles color={COLORS.primary} size={18} />
          <Typography variant="label" style={{ marginLeft: 8 }}>AI INTELLIGENCE</Typography>
        </View>
        <Typography variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
          {result?.insight || 'Analysis complete. Continue your consistency to see more detailed insights.'}
        </Typography>
      </Card>

      {/* Primary Metrics Grid */}
      <View style={styles.metricsGrid}>
        <MetricItem 
          icon={<BarChart color={COLORS.primary} size={16} />}
          label="Symmetry"
          value={`${Math.round(result?.metrics?.symmetryScore || 0)}%` }
        />
        <MetricItem 
          icon={<Target color={COLORS.primary} size={16} />}
          label="Definition"
          value={`${Math.round(result?.metrics?.definitionScore || 0)}%` }
        />
        <MetricItem 
          icon={<TrendingUp color={COLORS.primary} size={16} />}
          label="Trend"
          value={result?.metrics?.trend > 0 ? `+${result.metrics.trend.toFixed(1)}%` : 'Stable'}
          valueColor={result?.metrics?.trend > 0 ? COLORS.success : COLORS.textPrimary}
        />
      </View>

      {/* Region Specifics */}
      {result?.metrics?.regions && (
        <>
          <Typography variant="label" style={{ marginTop: 24, marginBottom: 12, marginLeft: 4 }}>
            REGION BREAKDOWN
          </Typography>
          {Object.entries(result.metrics.regions).map(([name, region]: any) => (
            <Card key={name} variant="flat" style={styles.regionCard}>
              <View style={styles.regionHeader}>
                <Typography weight="bold">{name}</Typography>
                <Typography variant="label" color={COLORS.primary}>
                  {Math.round(region.progress)}% Progress
                </Typography>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${region.progress}%` }]} />
              </View>
              <View style={styles.regionMetricsRow}>
                <Typography variant="caption">Definition: {Math.round(region.definition)}%</Typography>
                <Typography variant="caption">Symmetry: {Math.round(region.symmetry)}%</Typography>
              </View>
            </Card>
          ))}
        </>
      )}

      <Button title="Done" onPress={onDone} style={{ marginTop: 32 }} />
    </ScrollView>
  );
};

const MetricItem = ({ icon, label, value, valueColor = COLORS.textPrimary }: any) => (
  <Card variant="flat" style={styles.metricItem}>
    {icon}
    <Typography variant="label" style={{ marginTop: 8 }}>{label}</Typography>
    <Typography variant="h3" weight="bold" color={valueColor} style={{ marginTop: 4 }}>
      {value}
    </Typography>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(215, 255, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  imagePreview: {
    height: 350,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scoreBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  confidenceBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  regionCard: {
    marginBottom: 10,
    padding: 12,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  regionMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
