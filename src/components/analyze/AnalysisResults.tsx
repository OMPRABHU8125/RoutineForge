import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Animated } from 'react-native';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  BarChart, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Eye,
  Sun,
  Layers
} from 'lucide-react-native';
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
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          resizeMode="cover"
        />
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

      {/* Vision Intelligence Summary */}
      <View style={styles.visionSummary}>
        <VisionSignal 
          icon={<Sun color={COLORS.textPrimary} size={14} />} 
          label="Lighting" 
          value={Math.round((result?.metrics?.visionData?.lightingQuality || 0) * 100)} 
        />
        <VisionSignal 
          icon={<Eye color={COLORS.textPrimary} size={14} />} 
          label="Clarity" 
          value={Math.round((1 - (result?.metrics?.visionData?.blurScore || 0)) * 100)} 
        />
        <VisionSignal 
          icon={<Layers color={COLORS.textPrimary} size={14} />} 
          label="Similarity" 
          value={Math.round((result?.metrics?.similarityScore || 0) * 100)} 
        />
      </View>

      {/* AI Insight */}
      <Card style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <Sparkles color={COLORS.primary} size={18} />
          <Typography variant="label" style={{ marginLeft: 8 }}>CV INTELLIGENCE</Typography>
        </View>
        <Typography variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
          {result?.insight}
        </Typography>
      </Card>

      {/* Region Breakdowns with Previews */}
      <Typography variant="label" style={{ marginTop: 24, marginBottom: 12, marginLeft: 4 }}>
        VISION REGION ANALYSIS
      </Typography>
      {Object.entries(result.metrics.regions).map(([name, region]: any) => (
        <Card key={name} variant="flat" style={styles.regionCard}>
          <View style={styles.regionContent}>
            <View style={styles.regionPreview}>
              <Image 
                source={{ uri: region.segmentationUri?.startsWith('file://') ? region.segmentationUri : `file://${region.segmentationUri}` }} 
                style={styles.regionThumb} 
              />
              <View style={styles.maskOverlay} />
            </View>
            <View style={styles.regionInfo}>
              <View style={styles.regionHeader}>
                <Typography weight="bold">{name}</Typography>
                <Typography variant="label" color={COLORS.primary}>
                  {Math.round(region.progress)}%
                </Typography>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${region.progress}%` }]} />
              </View>
              <View style={styles.regionMetricsRow}>
                <Typography variant="caption">Def: {Math.round(region.definition)}%</Typography>
                <Typography variant="caption">Sym: {Math.round(region.symmetry)}%</Typography>
              </View>
            </View>
          </View>
        </Card>
      ))}

      <Button title="Done" onPress={onDone} style={{ marginTop: 32 }} />
    </ScrollView>
  );
};

const VisionSignal = ({ icon, label, value }: any) => (
  <View style={styles.visionSignal}>
    {icon}
    <Typography variant="caption" style={{ marginLeft: 6, marginRight: 4 }}>{label}:</Typography>
    <Typography variant="caption" weight="bold">{value}%</Typography>
  </View>
);

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
    marginBottom: 16,
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
  visionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  visionSignal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionCard: {
    marginBottom: 10,
    padding: 10,
  },
  regionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionPreview: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#000',
  },
  regionThumb: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  maskOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(215, 255, 0, 0.1)',
  },
  regionInfo: {
    flex: 1,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  regionMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
