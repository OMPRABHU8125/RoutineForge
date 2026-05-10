import { EvolutionState } from '../types/base';

export const determineEvolutionState = (
  scanCount: number,
  avgScore: number,
  consistency: number
): EvolutionState => {
  if (scanCount < 3) return 'Beginner';
  
  if (consistency > 0.8 && avgScore > 85) return 'Elite';
  if (consistency > 0.7 && avgScore > 75) return 'Advanced';
  if (consistency > 0.5 && avgScore > 65) return 'Athletic';
  
  return 'Consistent';
};
