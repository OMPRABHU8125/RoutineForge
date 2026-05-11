import { PersonalBaseline, RegionType, DetailedMetrics } from '../types/base';
import { ScanResult } from '../../services/storage';

export const calibrateBaseline = (
  history: ScanResult[]
): PersonalBaseline | undefined => {
  if (history.length === 0) return undefined;

  // The baseline is established from the earliest recorded scans
  const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
  const initialScan = sortedHistory[0];
  
  const initialProportions: Record<RegionType, number> = {
    Arms: initialScan.metrics.regions.Arms.progress,
    Abdomen: initialScan.metrics.regions.Abdomen.progress,
    'Full Body': initialScan.metrics.regions['Full Body'].progress,
  };

  const historicalAvg = history.reduce((acc, scan) => acc + scan.metrics.physiqueScore, 0) / history.length;

  return {
    startingScore: initialScan.metrics.physiqueScore,
    startingDate: initialScan.timestamp,
    initialProportions,
    historicalAvg,
    scanCount: history.length,
  };
};

export const calculatePersonalizedScore = (
  baseScore: number,
  baseline: PersonalBaseline | undefined,
  evolutionState: string
): number => {
  if (!baseline) return baseScore;

  // Personalized progression logic
  // Beginners get a slightly higher relative score to encourage early gains
  const beginnerBoost = evolutionState === 'Beginner' ? 1.05 : 1.0;
  
  // Compare against historical average to stabilize scoring
  const drift = baseScore - baseline.historicalAvg;
  const stabilizedScore = baseline.historicalAvg + (drift * 0.8); // Dampen volatility

  return Math.min(99, stabilizedScore * beginnerBoost);
};
