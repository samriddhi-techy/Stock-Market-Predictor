import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants';
import { PredictionHistoryEntry } from '@/lib/types';
import { Analytics } from '@/lib/utils/analytics';

/**
 * Hook for managing prediction history.
 * Persists to localStorage. Max 50 entries. Newest first.
 */
export function usePredictionHistory() {
  const [history, setHistory] = useLocalStorage<PredictionHistoryEntry[]>(
    STORAGE_KEYS.PREDICTION_HISTORY,
    []
  );

  const addPrediction = useCallback(
    (entry: Omit<PredictionHistoryEntry, 'id'>) => {
      const newEntry: PredictionHistoryEntry = {
        ...entry,
        id: `${entry.symbol}-${Date.now()}`,
      };
      Analytics.predictionGenerated(entry.symbol, entry.confidence);
      setHistory((prev) =>
        [newEntry, ...prev].slice(0, APP_CONFIG.MAX_PREDICTION_HISTORY)
      );
      return newEntry;
    },
    [setHistory]
  );

  const updateActualPrice = useCallback(
    (id: string, actualPrice: number) => {
      setHistory((prev) =>
        prev.map((entry) => {
          if (entry.id !== id) return entry;
          const accuracy =
            actualPrice > 0
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    (1 - Math.abs(entry.predictedPrice - actualPrice) / actualPrice) * 100
                  )
                )
              : undefined;
          return { ...entry, actualPrice, accuracy };
        })
      );
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addPrediction, updateActualPrice, clearHistory };
}
