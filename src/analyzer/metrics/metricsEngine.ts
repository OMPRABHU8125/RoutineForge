import { RegionType, RegionMetrics } from '../types/base';

export const calculateRegionMetrics = (
  region: RegionType,
  baseProgress: number,
  consistency: number
): RegionMetrics => {
  // Heuristic-based metric generation
  // In the future, this will be replaced by ML model outputs
  
  const seed = Math.random();
  
  // Specific weights per region
  const multipliers = {
    Arms: { def: 1.1, sym: 0.9 },
    Abdomen: { def: 1.2, sym: 0.8 },
    'Full Body': { def: 1.0, sym: 1.0 },
  }[region];

  const definition = Math.min(100, Math.max(0, (baseProgress * multipliers.def) + (seed * 5)));
  const symmetry = Math.min(100, Math.max(0, (baseProgress * multipliers.sym) + (seed * 10)));
  const progress = baseProgress;
  const consistencyImpact = consistency * 10;
  const recoveryIndicator = Math.round(70 + (seed * 30));

  return {
    definition,
    symmetry,
    progress,
    consistencyImpact,
    recoveryIndicator,
  };
};
