import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Sparkles, TrendingUp, Target, BarChart, CheckCircle2 } from 'lucide-react-native';
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
  const imageUri = result.imageUri.startsWith('file://') 
    ? result.imageUri 
    : `file://${result.imageUri}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <CheckCircle2 color={COLORS.success} size={40} />
        <Typography variant="h2" weight="bold" style={{ marginTop: 12 }}>
          Analysis Ready
        </Typography>
      </View>

      <View style={styles.imagePreview}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.scoreBadge}>
          <Typography variant="h3" weight="bold" color={COLORS.background}>
            {Math.round(result.metrics.physiqueScore)}
          </Typography>
          <Typography variant="label" color={COLORS.background} style={{ fontSize: 8 }}>
            PHYSIQUE
          </Typography>
        </View>
      </View>

      {/* AI Insight */}
      <Card style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <Sparkles color={COLORS.primary} size={18} />
          <Typography variant="label" style={{ marginLeft: 8 }}>AI INSIGHT</Typography>
        </View>
        <Typography variant="body" style={{ marginTop: 12 }}>
          {result.insight}
        </Typography>
      </Card>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <MetricItem 
          icon={<BarChart color={COLORS.primary} size={16} />}
          label="Symmetry"
          value={`${Math.round(result.metrics.symmetryScore)}%` }
        />
        <MetricItem 
          icon={<Target color={COLORS.primary} size={16} />}
          label="Definition"
          value={`${Math.round(result.metrics.definitionScore)}%` }
        />
        <MetricItem 
          icon={<TrendingUp color={COLORS.primary} size={16} />}
          label="Trend"
          value={result.metrics.trend > 0 ? '+2.4%' : 'Stable'}
          valueColor={result.metrics.trend > 0 ? COLORS.success : COLORS.textPrimary}
        />
      </View>

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
  imagePreview: {
    height: 350, // Increased height for better view
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 1, // Full opacity
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
});
