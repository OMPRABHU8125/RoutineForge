export type RegionType = 'Arms' | 'Abdomen' | 'Full Body';

export type EvolutionState = 'Beginner' | 'Consistent' | 'Athletic' | 'Advanced' | 'Elite';

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export interface CVMetrics {
  lightingQuality: number;
  blurScore: number;
  framingConsistency: number;
  bodyVisibility: number;
  poseConfidence: number;
}

export interface PhysiqueTrait {
  id: string;
  label: string;
  value: number; // 0-100
  trend: number; // -100 to 100
  evolution: string; // e.g., "Steady", "Emerging", "Stable"
}

export interface ExplainableInsight {
  primary: string;
  reasoning: string;
  confidenceExplanation: string;
}

export interface RegionMetrics {
  definition: number;
  symmetry: number;
  progress: number;
  consistencyImpact: number;
  recoveryIndicator: number;
  segmentationUri?: string;
  isStrongRegion: boolean;
  isStubbornRegion: boolean;
}

export interface PersonalBaseline {
  startingScore: number;
  startingDate: number;
  initialProportions: Record<RegionType, number>;
  historicalAvg: number;
  scanCount: number;
}

export interface DetailedMetrics {
  physiqueScore: number;
  symmetryScore: number;
  definitionScore: number;
  trend: number;
  confidence: ConfidenceLevel;
  evolutionState: EvolutionState;
  regions: Record<RegionType, RegionMetrics>;
  visionData: CVMetrics;
  similarityScore: number;
  traits: PhysiqueTrait[];
  baseline?: PersonalBaseline;
}

export interface ComparisonResult {
  percentImprovement: number;
  trendDirection: 'up' | 'down' | 'stable';
  summary: string;
  visualCertainty: number;
}

export interface QualityCheckResult {
  isGood: boolean;
  score: number;
  metrics: CVMetrics;
  warnings: string[];
}

export type PhysiqueEmbedding = number[];

export interface SegmentationResult {
  maskUri: string;
  regionCrops: Record<RegionType, string>;
}
