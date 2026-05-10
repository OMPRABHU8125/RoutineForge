import { DetailedMetrics, RegionType, ConfidenceLevel } from '../types/base';
import { ScanResult, storageService } from '../../services/storage';
import { calculateRegionMetrics } from '../metrics/metricsEngine';
import { determineEvolutionState } from '../states/stateEngine';
import { compareScans } from '../comparators/comparisonEngine';
import { generateInsight } from '../insights/insightEngine';

export const analyzePhysique = async (
  imageUri: string,
  regionType: RegionType = 'Full Body'
): Promise<ScanResult> => {
  // 1. Fetch History
  const history = await storageService.getHistory();
  const lastScan = history[0]; // Latest is first
  const scanCount = history.length;
  
  // 2. Calculate Consistency (Scans per month simplified)
  let consistency = 1.0;
  if (lastScan) {
    const daysSinceLast = (Date.now() - lastScan.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 14) consistency = 0.5;
    if (daysSinceLast > 30) consistency = 0.2;
  }

  // 3. Generate Realistic Base Score (Progression-Aware)
  let baseScore = 70; // Default for first scan
  if (lastScan) {
    const prevScore = lastScan.metrics.physiqueScore;
    // Realistically, scores don't jump more than 1-2% per week
    const naturalGrowth = (Math.random() * 0.5) * consistency;
    baseScore = Math.min(99, prevScore + naturalGrowth);
  } else {
    baseScore = 65 + (Math.random() * 10);
  }

  // 4. Detailed Region Metrics
  const regions = {
    Arms: calculateRegionMetrics('Arms', baseScore, consistency),
    Abdomen: calculateRegionMetrics('Abdomen', baseScore, consistency),
    'Full Body': calculateRegionMetrics('Full Body', baseScore, consistency),
  };

  // 5. Overall Scores
  const symmetryScore = regions[regionType].symmetry;
  const definitionScore = regions[regionType].definition;
  
  // 6. Confidence Level
  let confidence: ConfidenceLevel = 'Low';
  if (scanCount >= 3) confidence = 'Moderate';
  if (scanCount >= 10 && consistency > 0.7) confidence = 'High';

  const detailedMetrics: DetailedMetrics = {
    physiqueScore: baseScore,
    symmetryScore,
    definitionScore,
    trend: 0, // Calculated below
    confidence,
    evolutionState: determineEvolutionState(scanCount, baseScore, consistency),
    regions,
  };

  // 7. Comparison Logic
  const comparison = compareScans(baseScore, lastScan?.metrics.physiqueScore);
  detailedMetrics.trend = comparison.percentImprovement;

  // 8. Generate Adaptive Insight
  const insight = generateInsight(detailedMetrics, comparison, consistency);

  // 9. Return Result (Ready for storage)
  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    imageUri,
    insight,
    metrics: detailedMetrics,
  };
};
