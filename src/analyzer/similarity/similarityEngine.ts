import { PhysiqueEmbedding } from '../types/base';

export const calculateCosineSimilarity = (
  vecA: PhysiqueEmbedding,
  vecB: PhysiqueEmbedding
): number => {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  
  // Since our vectors are pre-normalized in the extractor, 
  // the dot product is the cosine similarity.
  return dotProduct;
};

export const detectVisualEvolution = (
  similarity: number
): { certainty: number; signal: 'positive' | 'negative' | 'neutral' } => {
  // Logic to translate visual similarity into evolution signals
  // High similarity = Stable physique
  // Lower similarity + higher scores = Positive evolution
  
  if (similarity > 0.98) return { certainty: 0.9, signal: 'neutral' };
  if (similarity > 0.90) return { certainty: 0.7, signal: 'positive' };
  
  return { certainty: 0.5, signal: 'neutral' };
};
