import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants';
import { Analytics } from '@/lib/utils/analytics';

/**
 * Hook for managing recent stock searches.
 * Persists to localStorage. Max 10 entries. Newest first.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    STORAGE_KEYS.RECENT_SEARCHES,
    []
  );

  const addRecentSearch = useCallback(
    (symbol: string) => {
      Analytics.stockSearched(symbol);
      setRecentSearches((prev) => {
        // Move to front if already exists, otherwise prepend
        const filtered = prev.filter((s) => s !== symbol);
        return [symbol, ...filtered].slice(0, APP_CONFIG.MAX_RECENT_SEARCHES);
      });
    },
    [setRecentSearches]
  );

  const removeRecentSearch = useCallback(
    (symbol: string) => {
      setRecentSearches((prev) => prev.filter((s) => s !== symbol));
    },
    [setRecentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches };
}
