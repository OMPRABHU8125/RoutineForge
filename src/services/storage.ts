import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SCAN_HISTORY: '@RoutineForge:scan_history',
};

export interface ScanResult {
  id: string;
  timestamp: string;
  regionId: string;
  imageUri: string;
  metrics: {
    physiqueScore: number;
    symmetryScore: number;
    definitionScore: number;
    consistencyImpact: number;
    trend: number; // -1 to 1
  };
  insight: string;
}

export const saveScanResult = async (result: ScanResult): Promise<void> => {
  try {
    const existing = await getScanHistory();
    const updated = [result, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving scan result:', error);
  }
};

export const getScanHistory = async (): Promise<ScanResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
};
