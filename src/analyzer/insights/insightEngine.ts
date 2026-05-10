import { DetailedMetrics, ComparisonResult } from '../types/base';

export const generateInsight = (
  metrics: DetailedMetrics,
  comparison: ComparisonResult,
  consistency: number
): string => {
  const { evolutionState, regions } = metrics;
  const { trendDirection } = comparison;

  const insights: string[] = [];

  // Base state-aware insight
  if (evolutionState === 'Beginner') {
    insights.push('You are in the "Newbie Gains" phase. Keep showing up!');
  } else if (evolutionState === 'Elite') {
    insights.push('Exceptional physique maintenance. Your consistency is top-tier.');
  }

  // Trend-aware insight
  if (trendDirection === 'up') {
    insights.push('Muscle density markers are showing a clear upward trend.');
  } else if (trendDirection === 'down') {
    insights.push('Metabolic markers suggest a slight recovery phase is needed.');
  }

  // Region-aware insight
  const bestRegion = Object.entries(regions).sort((a, b) => b[1].progress - a[1].progress)[0];
  insights.push(`${bestRegion[0]} development is particularly strong this session.`);

  // Consistency-aware insight
  if (consistency < 0.4) {
    insights.push('Gaps between scans are reducing analysis confidence. Try scanning weekly.');
  }

  return insights.join(' ');
};
