import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants';
import { Analytics } from '@/lib/utils/analytics';

/**
 * Hook for managing favorite stocks (heart/star toggle).
 * Persists to localStorage. Max 20 favorites.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    STORAGE_KEYS.FAVORITES,
    []
  );

  const isFavorite = useCallback(
    (symbol: string) => favorites.includes(symbol),
    [favorites]
  );

  const addFavorite = useCallback(
    (symbol: string) => {
      if (favorites.length >= APP_CONFIG.MAX_FAVORITES) return;
      if (favorites.includes(symbol)) return;
      setFavorites((prev) => [...prev, symbol]);
      Analytics.favoriteAdded(symbol);
    },
    [favorites, setFavorites]
  );

  const removeFavorite = useCallback(
    (symbol: string) => {
      setFavorites((prev) => prev.filter((s) => s !== symbol));
      Analytics.favoriteRemoved(symbol);
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (symbol: string) => {
      if (isFavorite(symbol)) {
        removeFavorite(symbol);
      } else {
        addFavorite(symbol);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
