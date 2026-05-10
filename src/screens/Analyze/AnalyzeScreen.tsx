import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Info,
  ChevronLeft,
  Scan as ScanIcon,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { CameraCapture } from '../../components/analyze/CameraCapture';
import { PoseGuide } from '../../components/analyze/PoseGuide';
import { AnalysisResults } from '../../components/analyze/AnalysisResults';
import { useCameraSystem } from '../../hooks/useCameraSystem';
import { analyzePhysique } from '../../analyzer/engine/progressionEngine';
import { performQualityCheck } from '../../analyzer/quality/qualityEngine';
import { storageService, ScanResult } from '../../services/storage';
import { RegionType } from '../../analyzer/types/base';

const REGIONS = [
  { 
    id: 'Arms', 
    title: 'Arms', 
    description: 'Flexed bicep pose for peak analysis',
    instructions: 'Stand sideways, flex your dominant arm at 90 degrees.',
  },
  { 
    id: 'Abdomen', 
    title: 'Abdomen', 
    description: 'Front relaxed pose for core definition',
    instructions: 'Stand tall, exhaled, hands at sides or behind head.',
  },
  { 
    id: 'Full Body', 
    title: 'Full Body', 
    description: 'Front standing pose for overall symmetry',
    instructions: 'Stand straight, legs shoulder width apart.',
  },
] as const;

export const AnalyzeScreen = () => {
  const { 
    step, 
    setStep, 
    capturedPhoto, 
    startCapture, 
    cancelCapture, 
    onCapture, 
    reset 
  } = useCameraSystem();

  const [selectedRegion, setSelectedRegion] = useState<typeof REGIONS[number] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await storageService.getHistory();
    setHistory(data);
  };

  useEffect(() => {
    if (step === 'analyzing' && capturedPhoto && selectedRegion) {
      performFullWorkflow();
    }
  }, [step, capturedPhoto, selectedRegion]);

  const performFullWorkflow = async () => {
    if (!capturedPhoto || !selectedRegion) return;
    
    try {
      // 1. Quality Check
      const quality = await performQualityCheck(capturedPhoto.path);
      
      if (!quality.isGood) {
        Alert.alert(
          'Quality Warning',
          quality.warnings.join('\n'),
          [
            { text: 'Retake', onPress: () => setStep('capturing') },
            { text: 'Analyze Anyway', onPress: () => runAnalysis() }
          ]
        );
      } else {
        await runAnalysis();
      }
    } catch (e) {
      console.error(e);
      setStep('idle');
    }
  };

  const runAnalysis = async () => {
    if (!capturedPhoto || !selectedRegion) return;
    
    try {
      const result = await analyzePhysique(
        capturedPhoto.path,
        selectedRegion.id as RegionType
      );
      setAnalysisResult(result);
      await storageService.saveScanResult(result);
      await loadHistory();
      setStep('result');
    } catch (e) {
      console.error(e);
      setStep('idle');
    }
  };

  if (step === 'capturing' && selectedRegion) {
    return (
      <CameraCapture onCapture={onCapture} onClose={cancelCapture}>
        <PoseGuide regionId={selectedRegion.id.toLowerCase() as any} />
        <View style={styles.guideOverlay}>
          <Typography color={COLORS.primary} weight="bold" align="center">
            {selectedRegion.instructions}
          </Typography>
        </View>
      </CameraCapture>
    );
  }

  if (step === 'analyzing') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Typography variant="h3" weight="bold" style={{ marginTop: 24 }}>
          AI Intelligence Processing...
        </Typography>
        <Typography variant="caption" align="center" style={{ marginTop: 8, paddingHorizontal: 40 }}>
          Analyzing muscle symmetry, definition, and historical progression markers for {selectedRegion?.title}
        </Typography>
      </View>
    );
  }

  if (step === 'result' && analysisResult) {
    return (
      <AnalysisResults 
        result={analysisResult} 
        onDone={() => {
          reset();
          setSelectedRegion(null);
          setAnalysisResult(null);
        }} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedRegion && (
          <TouchableOpacity onPress={() => setSelectedRegion(null)} style={styles.backButton}>
            <ChevronLeft color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        <Typography variant="h2" weight="bold">
          {selectedRegion ? 'Instructions' : 'Physique Analyzer'}
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!selectedRegion ? (
          <>
            <Typography variant="body" style={{ marginBottom: SPACING.lg }}>
              Select a body region to begin your AI-powered physique analysis.
            </Typography>
            {REGIONS.map((region) => (
              <Card
                key={region.id}
                onPress={() => setSelectedRegion(region)}
                style={styles.regionCard}
              >
                <View style={styles.regionInfo}>
                  <View style={styles.iconContainer}>
                    <ScanIcon color={COLORS.primary} size={24} />
                  </View>
                  <View style={{ marginLeft: 16 }}>
                    <Typography weight="bold">{region.title}</Typography>
                    <Typography variant="caption">{region.description}</Typography>
                  </View>
                </View>
              </Card>
            ))}

            {history.length > 0 && (
              <View style={{ marginTop: 32 }}>
                <View style={styles.historyHeader}>
                  <Typography variant="h3" weight="bold">Recent Scans</Typography>
                  <TouchableOpacity onPress={() => storageService.clearHistory().then(loadHistory)}>
                    <Typography variant="caption" color={COLORS.primary}>Clear</Typography>
                  </TouchableOpacity>
                </View>
                {history.slice(0, 3).map((item) => (
                  <Card key={item.id} variant="outline" style={{ marginBottom: 12 }}>
                    <View style={styles.historyItem}>
                      <View>
                        <Typography weight="semi-bold">
                          {item.metrics.evolutionState} - {new Date(item.timestamp).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption">
                          Trend: {item.metrics.trend > 0 ? 'Improving' : 'Stable'}
                        </Typography>
                      </View>
                      <View style={styles.historyScore}>
                        <Typography color={COLORS.primary} weight="bold" variant="h3">
                          {Math.round(item.metrics.physiqueScore)}
                        </Typography>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </>
        ) : (
          <View>
            <Typography variant="h3" weight="semi-bold" style={{ marginBottom: 16 }}>
              Scan Guidelines
            </Typography>
            <InstructionItem text="Use bright, natural lighting" />
            <InstructionItem text="Keep consistent distance (approx 3ft)" />
            <InstructionItem text="Maintain the same angle as previous scans" />

            <View style={styles.instructionCard}>
              <Typography variant="body" color={COLORS.textSecondary}>
                {selectedRegion.instructions}
              </Typography>
            </View>

            <Button
              title="Open AI Camera"
              onPress={startCapture}
              style={{ marginTop: 32 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InstructionItem = ({ text }: { text: string }) => (
  <View style={styles.instructionItem}>
    <Info color={COLORS.primary} size={20} />
    <Typography style={{ marginLeft: 12 }}>{text}</Typography>
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
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  regionCard: {
    marginBottom: SPACING.md,
  },
  regionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  instructionCard: {
    padding: 20,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideOverlay: {
    position: 'absolute',
    top: 120,
    left: 40,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyScore: {
    backgroundColor: 'rgba(215, 255, 0, 0.1)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnalyzeScreen;
