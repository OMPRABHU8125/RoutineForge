import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Animated, TouchableOpacity } from 'react-native';
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
  Layers,
  ChevronDown,
  ChevronUp,
  Activity,
  History
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
  const [showReasoning, setShowReasoning] = useState(false);
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

      {/* AI Insight & Reasoning */}
      <Card style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <Sparkles color={COLORS.primary} size={18} />
          <Typography variant="label" style={{ marginLeft: 8 }}>PERSONALIZED INTELLIGENCE</Typography>
        </View>
        <Typography variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
          {result?.insight}
        </Typography>
        
        <TouchableOpacity 
          style={styles.reasoningToggle} 
          onPress={() => setShowReasoning(!showReasoning)}
        >
          <Typography variant="caption" color={COLORS.primary} weight="bold">
            {showReasoning ? 'Hide AI Reasoning' : 'Show AI Reasoning'}
          </Typography>
          {showReasoning ? <ChevronUp color={COLORS.primary} size={16} /> : <ChevronDown color={COLORS.primary} size={16} />}
        </TouchableOpacity>

        {showReasoning && (
          <View style={styles.reasoningContent}>
            <View style={styles.reasoningItem}>
              <Activity color={COLORS.textSecondary} size={12} />
              <Typography variant="caption" style={{ marginLeft: 8 }}>
                Baseline calibration active since {new Date(result.metrics.baseline?.startingDate || Date.now()).toLocaleDateString()}.
              </Typography>
            </View>
            <View style={styles.reasoningItem}>
              <History color={COLORS.textSecondary} size={12} />
              <Typography variant="caption" style={{ marginLeft: 8 }}>
                Current score is stabilized against your historical average of {Math.round(result.metrics.baseline?.historicalAvg || 0)}.
              </Typography>
            </View>
          </View>
        )}
      </Card>

      {/* Trait Tracking */}
      <Typography variant="label" style={{ marginTop: 24, marginBottom: 12, marginLeft: 4 }}>
        PHYSIQUE TRAIT EVOLUTION
      </Typography>
      <View style={styles.traitsGrid}>
        {result.metrics.traits.map((trait) => (
          <Card key={trait.id} variant="flat" style={styles.traitCard}>
            <Typography variant="caption" color={COLORS.textSecondary}>{trait.label}</Typography>
            <View style={styles.traitValueRow}>
              <Typography weight="bold" variant="h3">{Math.round(trait.value)}%</Typography>
              <View style={[styles.trendIndicator, { backgroundColor: trait.trend >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Typography color={trait.trend >= 0 ? COLORS.success : COLORS.error} weight="bold" style={{ fontSize: 10 }}>
                  {trait.trend >= 0 ? '+' : ''}{Math.round(trait.trend)}%
                </Typography>
              </View>
            </View>
            <Typography variant="label" style={{ fontSize: 9, marginTop: 4 }}>{trait.evolution}</Typography>
          </Card>
        ))}
      </View>

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
  reasoningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  reasoningContent: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: BORDER_RADIUS.sm,
  },
  reasoningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  traitCard: {
    width: '48%',
    marginBottom: 10,
    padding: 12,
  },
  traitValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
