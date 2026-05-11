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

export const analyzePhysique = async (
  imageUri: string,
  regionType: RegionType = 'Full Body'
): Promise<ScanResult> => {
  // --- CV PIPELINE START ---
  
  // 1. Quality Validation
  const quality = await performQualityCheck(imageUri);
  
  // 2. Segmentation
  const segmentation = await segmentPhysique(imageUri);
  
  // 3. Embedding Extraction (DINOv2)
  const currentEmbedding = await extractPhysiqueEmbeddings(imageUri);
  
  // --- CV PIPELINE END ---

  // 4. Fetch History & Context
  const history = await storageService.getHistory();
  const lastScan = history[0];
  const scanCount = history.length;
  
  // 5. Visual Similarity Comparison
  let similarityScore = 1.0;
  if (lastScan) {
    // In a real app, we would store/fetch embeddings from DB
    // For now, we simulate comparison
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

  // 7. Progression Scoring (Heuristic + CV Influenced)
  let baseScore = 70;
  if (lastScan) {
    const prevScore = lastScan.metrics.physiqueScore;
    // Scores are influenced by visual similarity and quality
    const visualShift = (1 - similarityScore) * 10; 
    const qualityBonus = (quality.score - 0.5) * 2;
    
    baseScore = Math.min(99, prevScore + (visualShift * consistency) + qualityBonus);
  } else {
    baseScore = 65 + (Math.random() * 10);
  }

  // 8. Region Specific Analysis
  const regions = {
    Arms: calculateRegionMetrics('Arms', baseScore, consistency),
    Abdomen: calculateRegionMetrics('Abdomen', baseScore, consistency),
    'Full Body': calculateRegionMetrics('Full Body', baseScore, consistency),
  };

  // Add segmentation URIs to regions
  Object.keys(regions).forEach(key => {
    regions[key as RegionType].segmentationUri = segmentation.regionCrops[key as RegionType];
  });

  // 9. Confidence Calculation (Advanced)
  let confidence: ConfidenceLevel = 'Low';
  const qualityFactor = quality.score;
  const historyFactor = Math.min(1, scanCount / 10);
  const compositeConfidence = (qualityFactor * 0.4) + (historyFactor * 0.4) + (consistency * 0.2);

  if (compositeConfidence > 0.8) confidence = 'High';
  else if (compositeConfidence > 0.5) confidence = 'Moderate';

  const detailedMetrics: DetailedMetrics = {
    physiqueScore: baseScore,
    symmetryScore: regions[regionType].symmetry,
    definitionScore: regions[regionType].definition,
    trend: 0,
    confidence,
    evolutionState: determineEvolutionState(scanCount, baseScore, consistency),
    regions,
    visionData: quality.metrics,
    similarityScore,
  };

  // 10. Comparison & Insights
  const comparison = compareScans(baseScore, lastScan?.metrics.physiqueScore);
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
