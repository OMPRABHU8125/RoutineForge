import { PhysiqueTrait, DetailedMetrics, PersonalBaseline } from '../types/base';

export const extractPhysiqueTraits = (
  metrics: DetailedMetrics,
  baseline: PersonalBaseline | undefined
): PhysiqueTrait[] => {
  const { regions } = metrics;
  
  // Logic to track persistent visual traits over time
  // Based on current region metrics and baseline deltas
  
  const traits: PhysiqueTrait[] = [
    {
      id: 'v-taper',
      label: 'V-Taper Emergence',
      value: regions['Full Body'].symmetry * 0.9,
      trend: baseline ? (regions['Full Body'].symmetry - baseline.initialProportions['Full Body']) : 0,
      evolution: 'Emerging',
    },
    {
      id: 'core-tightening',
      label: 'Waist Tightening',
      value: regions.Abdomen.definition,
      trend: baseline ? (regions.Abdomen.definition - baseline.initialProportions.Abdomen) : 0,
      evolution: 'Steady',
    },
    {
      id: 'arm-fullness',
      label: 'Arm Fullness',
      value: regions.Arms.definition,
      trend: baseline ? (regions.Arms.definition - baseline.initialProportions.Arms) : 0,
      evolution: 'Stable',
    }
  ];

  return traits;
};
