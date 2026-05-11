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

export interface RegionMetrics {
  definition: number;
  symmetry: number;
  progress: number;
  consistencyImpact: number;
  recoveryIndicator: number;
  segmentationUri?: string; // URI to segmented mask/crop
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
  similarityScore?: number; // Visual similarity to best/previous scan
}

export interface ComparisonResult {
  percentImprovement: number;
  trendDirection: 'up' | 'down' | 'stable';
  summary: string;
  visualCertainty: number; // 0-1
}

export interface QualityCheckResult {
  isGood: boolean;
  score: number;
  metrics: CVMetrics;
  warnings: string[];
}

export type PhysiqueEmbedding = number[]; // 1D vector of features

export interface SegmentationResult {
  maskUri: string;
  regionCrops: Record<RegionType, string>;
}
