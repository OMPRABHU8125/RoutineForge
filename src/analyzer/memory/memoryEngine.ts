import { RegionType, RegionMetrics } from '../types/base';
import { ScanResult } from '../../services/storage';

export const analyzeRegionMemory = (
  history: ScanResult[]
): Record<RegionType, { isStrong: boolean; isStubborn: boolean }> => {
  const memory: Record<RegionType, { isStrong: boolean; isStubborn: boolean }> = {
    Arms: { isStrong: false, isStubborn: false },
    Abdomen: { isStrong: false, isStubborn: false },
    'Full Body': { isStrong: false, isStubborn: false },
  };

  if (history.length < 3) return memory;

  // Identify Strong vs Stubborn regions based on historical volatility and growth
  const regions: RegionType[] = ['Arms', 'Abdomen', 'Full Body'];
  
  regions.forEach(region => {
    const scores = history.map(h => h.metrics.regions[region].progress);
    const growth = scores[0] - scores[scores.length - 1]; // Latest - Oldest
    const variance = Math.max(...scores) - Math.min(...scores);

    memory[region] = {
      isStrong: growth > 5,
      isStubborn: growth < 1 && variance < 2,
    };
  });

  return memory;
};
