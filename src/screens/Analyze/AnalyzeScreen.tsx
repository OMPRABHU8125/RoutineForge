import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  Info,
  CheckCircle2,
  ChevronLeft,
  Scan as ScanIcon,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from '../../components/shared/Typography';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { SCAN_REGIONS } from '../../data/mockData';

type FlowState = 'selection' | 'instructions' | 'scanning' | 'result';

export const AnalyzeScreen = () => {
  const [step, setStep] = useState<FlowState>('selection');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const startScan = () => {
    setStep('scanning');
    // Mock processing time
    setTimeout(() => {
      setStep('result');
    }, 3000);
  };

  const reset = () => {
    setStep('selection');
    setSelectedRegion(null);
  };

  if (step === 'scanning') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Typography variant="h3" weight="bold" style={{ marginTop: 24 }}>
          AI Processing...
        </Typography>
        <Typography variant="caption" align="center" style={{ marginTop: 8, paddingHorizontal: 40 }}>
          Analyzing muscle symmetry and definition markers
        </Typography>
      </View>
    );
  }

  if (step === 'result') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.resultHeader}>
            <CheckCircle2 color={COLORS.success} size={48} />
            <Typography variant="h2" weight="bold" style={{ marginTop: 16 }}>
              Analysis Complete
            </Typography>
          </View>

          <Card style={{ marginTop: 32 }}>
            <Typography variant="label" color={COLORS.primary}>
              {selectedRegion?.title} Insight
            </Typography>
            <Typography variant="h3" weight="semi-bold" style={{ marginTop: 12 }}>
              Symmetry Detected: 94%
            </Typography>
            <Typography variant="body" style={{ marginTop: 12, color: COLORS.textSecondary }}>
              Based on the scan, your {selectedRegion?.title.toLowerCase()} show significant improvement in peak contraction. 
              Minimal imbalances detected in the lateral head.
            </Typography>
          </Card>

          <Button
            title="Done"
            onPress={reset}
            style={{ marginTop: 'auto', marginBottom: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {step === 'instructions' && (
          <TouchableOpacity onPress={() => setStep('selection')} style={styles.backButton}>
            <ChevronLeft color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        <Typography variant="h2" weight="bold">
          {step === 'selection' ? 'Physique Analyzer' : 'Instructions'}
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 'selection' ? (
          <>
            <Typography variant="body" style={{ marginBottom: SPACING.lg }}>
              Select a body region to begin your AI-powered physique analysis.
            </Typography>
            {SCAN_REGIONS.map((region) => (
              <Card
                key={region.id}
                onPress={() => {
                  setSelectedRegion(region);
                  setStep('instructions');
                }}
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
          </>
        ) : (
          <View>
            <Typography variant="h3" weight="semi-bold" style={{ marginBottom: 16 }}>
              Scan Guidelines
            </Typography>
            <View style={styles.instructionItem}>
              <Info color={COLORS.primary} size={20} />
              <Typography style={{ marginLeft: 12 }}>Use bright, natural lighting</Typography>
            </View>
            <View style={styles.instructionItem}>
              <Info color={COLORS.primary} size={20} />
              <Typography style={{ marginLeft: 12 }}>Keep consistent distance (approx 3ft)</Typography>
            </View>
            <View style={styles.instructionItem}>
              <Info color={COLORS.primary} size={20} />
              <Typography style={{ marginLeft: 12 }}>Maintain the same angle as previous scans</Typography>
            </View>

            <View style={styles.placeholderContainer}>
              <Camera color={COLORS.textTertiary} size={48} />
              <Typography variant="caption" style={{ marginTop: 12 }}>
                Camera Preview Placeholder
              </Typography>
            </View>

            <Button
              title="Start AI Scan"
              onPress={startScan}
              style={{ marginTop: 32 }}
            />
          </View>
        )}
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
  placeholderContainer: {
    height: 300,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
});

export default AnalyzeScreen;
