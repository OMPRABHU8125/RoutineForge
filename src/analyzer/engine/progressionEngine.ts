import { 
  DetailedMetrics, 
  RegionType, 
  ConfidenceLevel, 
  CVMetrics 
} from '../types/base';
import { ScanResult, storageService } from '../../services/storage';
import { calculateRegionMetrics } from '../metrics/metricsEngine';
import { determineEvolutionState } from '../states/stateEngine';
import { compareScans } from '../comparators/comparisonEngine';
import { generateInsight } from '../insights/insightEngine';
import { performQualityCheck } from '../quality/qualityEngine';
import { segmentPhysique } from '../segmentation/segmentationEngine';
import { extractPhysiqueEmbeddings } from '../embeddings/embeddingEngine';
import { calculateCosineSimilarity } from '../similarity/similarityEngine';
import { normalizeScan } from '../normalization/normalizationEngine';
import { calibrateBaseline, calculatePersonalizedScore } from '../calibration/calibrationEngine';
import { extractPhysiqueTraits } from '../traits/traitEngine';
import { analyzeRegionMemory } from '../memory/memoryEngine';

export const analyzePhysique = async (
  imageUri: string,
  regionType: RegionType = 'Full Body'
): Promise<ScanResult> => {
  // 1. Normalization
  await normalizeScan(imageUri);

  // 2. Quality Validation
  const quality = await performQualityCheck(imageUri);
  
  // 3. Segmentation & Feature Extraction
  const segmentation = await segmentPhysique(imageUri);
  const currentEmbedding = await extractPhysiqueEmbeddings(imageUri);
  
  // 4. History & Memory Context
  const history = await storageService.getHistory();
  const lastScan = history[0];
  const scanCount = history.length;
  const regionMemory = analyzeRegionMemory(history);
  const baseline = calibrateBaseline(history);
  
  // 5. Visual Similarity Comparison
  let similarityScore = 1.0;
  if (lastScan) {
    const mockPrevEmbedding = await extractPhysiqueEmbeddings(lastScan.imageUri);
    similarityScore = calculateCosineSimilarity(currentEmbedding, mockPrevEmbedding);
  }

  // 6. Calculate Consistency
  let consistency = 1.0;
  if (lastScan) {
    const daysSinceLast = (Date.now() - lastScan.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 14) consistency = 0.5;
    if (daysSinceLast > 30) consistency = 0.2;
  }

  // 7. Base Progression Scoring
  let rawBaseScore = 70;
  if (lastScan) {
    const prevScore = lastScan.metrics.physiqueScore;
    const visualShift = (1 - similarityScore) * 10; 
    const qualityBonus = (quality.score - 0.5) * 2;
    rawBaseScore = Math.min(99, prevScore + (visualShift * consistency) + qualityBonus);
  } else {
    rawBaseScore = 65 + (Math.random() * 10);
  }

  // 8. PERSONALIZATION: Calibrate against baseline and state
  const evolutionState = determineEvolutionState(scanCount, rawBaseScore, consistency);
  const physiqueScore = calculatePersonalizedScore(rawBaseScore, baseline, evolutionState);

  // 9. Region Analysis with Memory
  const regions = {
    Arms: { ...calculateRegionMetrics('Arms', physiqueScore, consistency), ...regionMemory.Arms },
    Abdomen: { ...calculateRegionMetrics('Abdomen', physiqueScore, consistency), ...regionMemory.Abdomen },
    'Full Body': { ...calculateRegionMetrics('Full Body', physiqueScore, consistency), ...regionMemory['Full Body'] },
  };

  // Add segmentation URIs
  Object.keys(regions).forEach(key => {
    (regions[key as RegionType] as any).segmentationUri = segmentation.regionCrops[key as RegionType];
  });

  // 10. Trait Extraction
  const detailedMetricsPlaceholder: any = { regions, physiqueScore }; // Partial for trait engine
  const traits = extractPhysiqueTraits(detailedMetricsPlaceholder, baseline);

  // 11. Final Metrics Assembly
  const detailedMetrics: DetailedMetrics = {
    physiqueScore,
    symmetryScore: regions[regionType].symmetry,
    definitionScore: regions[regionType].definition,
    trend: 0,
    confidence: 'Low',
    evolutionState,
    regions: regions as any,
    visionData: quality.metrics,
    similarityScore,
    traits,
    baseline,
  };

  // 12. Confidence Refinement
  const qualityFactor = quality.score;
  const stabilityFactor = similarityScore > 0.95 ? 1 : 0.8;
  const historyFactor = Math.min(1, scanCount / 10);
  const compositeConfidence = (qualityFactor * 0.3) + (historyFactor * 0.4) + (consistency * 0.2) + (stabilityFactor * 0.1);

  if (compositeConfidence > 0.85) detailedMetrics.confidence = 'High';
  else if (compositeConfidence > 0.55) detailedMetrics.confidence = 'Moderate';

  // 13. Comparison & Insights
  const comparison = compareScans(physiqueScore, lastScan?.metrics.physiqueScore);
  detailedMetrics.trend = comparison.percentImprovement;
  const insight = generateInsight(detailedMetrics, comparison, consistency);

  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    imageUri,
    insight,
    metrics: detailedMetrics,
  };
};
