export const USER_MOCK = {
  name: 'Alex',
  streak: 12,
  workoutProgress: 0.75,
  dailyFocus: 'Hypertrophy - Chest & Triceps',
  lastInsight: {
    title: 'Upper Chest Development',
    summary: 'Your upper pec density has increased by 4% since last month. Focus on incline movements to maintain symmetry.',
    date: '2024-05-08',
  }
};

export const SCAN_REGIONS = [
  { id: 'full', title: 'Full Body', description: 'Complete physique overview', icon: 'User' },
  { id: 'arms', title: 'Arms', description: 'Biceps & Triceps peak analysis', icon: 'Armchair' }, // Lucide icon names
  { id: 'abs', title: 'Abdomen', description: 'Midsection & Oblique definition', icon: 'Activity' },
];

export const PROGRESS_MOCK = {
  weeklyScore: 88,
  consistency: 95,
  muscleGroups: [
    { name: 'Chest', progress: 0.8 },
    { name: 'Back', progress: 0.65 },
    { name: 'Legs', progress: 0.4 },
    { name: 'Shoulders', progress: 0.75 },
  ],
  timeline: [
    { date: 'May 1', weight: 82.5, bf: 14.2 },
    { date: 'Apr 24', weight: 83.1, bf: 14.5 },
    { date: 'Apr 17', weight: 83.8, bf: 14.8 },
  ]
};
