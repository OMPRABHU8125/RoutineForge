import { ComparisonResult } from '../types/base';
import { ScanResult } from '../../services/storage';

export const compareScans = (
  current: number,
  previous: number | undefined
): ComparisonResult => {
  if (previous === undefined) {
    return {
      percentImprovement: 0,
      trendDirection: 'stable',
      summary: 'Starting your transformation journey today.',
    };
  }

  const diff = current - previous;
  const percentImprovement = (diff / previous) * 100;
  
  let trendDirection: 'up' | 'down' | 'stable' = 'stable';
  if (percentImprovement > 0.5) trendDirection = 'up';
  if (percentImprovement < -0.5) trendDirection = 'down';

  let summary = '';
  if (trendDirection === 'up') {
    summary = `Progressing well! Your score improved by ${Math.abs(percentImprovement).toFixed(1)}%.`;
  } else if (trendDirection === 'down') {
    summary = 'Slight dip in metrics. Focus on consistency to bounce back.';
  } else {
    summary = 'Maintaining your physique steady. Great job on staying consistent.';
  }

  return {
    percentImprovement,
    trendDirection,
    summary,
  };
};

export const findBestScan = (history: ScanResult[]): ScanResult | undefined => {
  if (history.length === 0) return undefined;
  return [...history].sort((a, b) => b.metrics.physiqueScore - a.metrics.physiqueScore)[0];
};
