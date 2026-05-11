import { DetailedMetrics, ComparisonResult } from '../types/base';

export const generateInsight = (
  metrics: DetailedMetrics,
  comparison: ComparisonResult,
  consistency: number
): string => {
  const { evolutionState, regions, baseline, traits, confidence } = metrics;
  const { trendDirection } = comparison;

  const insights: string[] = [];

  // 1. Personalized Context
  if (baseline && baseline.scanCount > 5) {
    insights.push(`Analyzing against your calibrated baseline of ${Math.round(baseline.startingScore)}.`);
  }

  // 2. Trait-Based Insights (Explainable)
  const improvingTrait = traits.sort((a, b) => b.trend - a.trend)[0];
  if (improvingTrait && improvingTrait.trend > 1) {
    insights.push(`${improvingTrait.label} is showing noticeable evolution (+${Math.round(improvingTrait.trend)}%).`);
  }

  // 3. Memory-Based Logic
  const stubbornRegion = Object.entries(regions).find(([_, r]) => r.isStubbornRegion);
  if (stubbornRegion) {
    insights.push(`${stubbornRegion[0]} remains stable; metabolic adaptation suggested for this region.`);
  }

  // 4. Trend & State Reasoning
  if (trendDirection === 'up') {
    insights.push(`Progression trend is positive as you move deeper into the ${evolutionState} state.`);
  }

  // 5. Confidence Explanation
  if (confidence === 'High') {
    insights.push('Confidence is high due to consistent scan framing and stable trait markers.');
  } else if (confidence === 'Low') {
    insights.push('Consistency gaps are reducing analysis certainty. Calibrating with lower weights.');
  }

  return insights.join(' ');
};
