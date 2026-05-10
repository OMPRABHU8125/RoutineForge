export type RegionType = 'Arms' | 'Abdomen' | 'Full Body';

export type EvolutionState = 'Beginner' | 'Consistent' | 'Athletic' | 'Advanced' | 'Elite';

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export interface RegionMetrics {
  definition: number;
  symmetry: number;
  progress: number;
  consistencyImpact: number;
  recoveryIndicator: number;
}

export interface DetailedMetrics {
  physiqueScore: number;
  symmetryScore: number;
  definitionScore: number;
  trend: number;
  confidence: ConfidenceLevel;
  evolutionState: EvolutionState;
  regions: Record<RegionType, RegionMetrics>;
}

export interface ComparisonResult {
  percentImprovement: number;
  trendDirection: 'up' | 'down' | 'stable';
  summary: string;
}

export interface QualityCheckResult {
  isGood: boolean;
  lighting: number; // 0-1
  blur: number; // 0-1
  alignment: number; // 0-1
  warnings: string[];
}
