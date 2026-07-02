import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { WatchlistItem } from '@/lib/types';
import { Analytics } from '@/lib/utils/analytics';

/**
 * Unified watchlist hook.
 * Single source of truth — replaces the two separate localStorage keys.
 * Syncs to localStorage immediately on every change.
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>(
    STORAGE_KEYS.WATCHLIST,
    []
  );

  const isInWatchlist = useCallback(
    (symbol: string) => watchlist.some((item) => item.symbol === symbol),
    [watchlist]
  );

  const addToWatchlist = useCallback(
    (stock: { symbol: string; name: string; currentPrice: number }) => {
      if (isInWatchlist(stock.symbol)) return;
      const newItem: WatchlistItem = {
        id: `${stock.symbol}-${Date.now()}`,
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice,
        alertsEnabled: true,
        priceAlert: false,
        changeAlert: true,
        addedDate: new Date().toISOString(),
      };
      setWatchlist((prev) => [...prev, newItem]);
      Analytics.watchlistAdded(stock.symbol);
    },
    [isInWatchlist, setWatchlist]
  );

  const removeFromWatchlist = useCallback(
    (symbolOrId: string) => {
      setWatchlist((prev) =>
        prev.filter((item) => item.symbol !== symbolOrId && item.id !== symbolOrId)
      );
      Analytics.watchlistRemoved(symbolOrId);
    },
    [setWatchlist]
  );

  const updateWatchlistItem = useCallback(
    (id: string, updates: Partial<WatchlistItem>) => {
      setWatchlist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    [setWatchlist]
  );

  const stats = useMemo(
    () => ({
      total: watchlist.length,
      activeAlerts: watchlist.filter((item) => item.alertsEnabled).length,
    }),
    [watchlist]
  );

  return {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    stats,
  };
}
