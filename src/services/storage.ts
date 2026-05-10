import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetailedMetrics } from '../analyzer/types/base';

const STORAGE_KEYS = {
  SCAN_HISTORY: '@RoutineForge:scan_history',
};

export interface ScanResult {
  id: string;
  timestamp: number;
  imageUri: string;
  metrics: DetailedMetrics;
  insight: string;
}

class StorageService {
  async saveScanResult(result: ScanResult): Promise<void> {
    try {
      const existing = await this.getHistory();
      const updated = [result, ...existing];
      await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving scan result:', error);
    }
  }

  async getHistory(): Promise<ScanResult[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting scan history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
  }
}

export const storageService = new StorageService();
