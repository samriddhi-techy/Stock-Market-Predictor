"use client";

import { memo, useCallback } from 'react';
import { Heart, TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatCurrency, formatChange, formatPercent } from '@/lib/utils/format';
import { MockStock } from '@/lib/constants';
import { Stock } from '@/lib/types';
import { useStocks } from '@/hooks/use-stocks';

// Helper to convert Stock (from live API) to MockStock for compatibility
function convertStockToMock(stock: Stock): MockStock {
  return {
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    marketCap: stock.marketCap,
    prediction: stock.prediction,
    confidence: stock.confidence,
    sector: stock.sector,
    pe: stock.pe,
    high52w: stock.high52w,
    low52w: stock.low52w,
  };
}

interface StockListItemProps {
  stock: MockStock;
  isSelected: boolean;
  isInWatchlist: boolean;
  isFavorite: boolean;
  onClick: (stock: MockStock) => void;
  onWatchlistToggle: (stock: MockStock) => void;
  onFavoriteToggle: (symbol: string) => void;
}

export const StockListItem = memo(function StockListItem({
  stock: initialStock,
  isSelected,
  isInWatchlist,
  isFavorite,
  onClick,
  onWatchlistToggle,
  onFavoriteToggle,
}: StockListItemProps) {
  // Fetch live data for this stock
  const { stock: liveStock, loading } = useStocks(initialStock.symbol, '1M');
  
  const displayStock: MockStock = liveStock 
    ? convertStockToMock(liveStock)
    : initialStock;
  
  const isGaining = displayStock.change >= 0;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(displayStock);
      }
    },
    [onClick, displayStock]
  );

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      className={cn(
        'p-4 rounded-xl border cursor-pointer transition-all duration-200 outline-none group',
        'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
      )}
      onClick={() => onClick(displayStock)}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{displayStock.symbol}</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              {displayStock.sector?.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {displayStock.name}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {/* Favorite toggle */}
          <button
            aria-label={isFavorite ? `Remove ${displayStock.symbol} from favorites` : `Add ${displayStock.symbol} to favorites`}
            aria-pressed={isFavorite}
            onClick={(e) => { e.stopPropagation(); onFavoriteToggle(displayStock.symbol); }}
            className={cn(
              'p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100',
              'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500',
              isFavorite
                ? 'opacity-100 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950'
                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950'
            )}
          >
            <Heart
              className="w-3.5 h-3.5"
              fill={isFavorite ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>

          {/* Watchlist toggle */}
          <button
            aria-label={isInWatchlist ? `Remove ${displayStock.symbol} from watchlist` : `Add ${displayStock.symbol} to watchlist`}
            aria-pressed={isInWatchlist}
            onClick={(e) => { e.stopPropagation(); onWatchlistToggle(displayStock); }}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              'focus-visible:ring-2 focus-visible:ring-blue-500',
              isInWatchlist
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100'
                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
            )}
          >
            {isInWatchlist ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(displayStock.price)}
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs mt-0.5 font-medium',
              isGaining ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {isGaining ? (
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span aria-label={`${isGaining ? 'Up' : 'Down'} ${Math.abs(displayStock.change).toFixed(2)} dollars, ${Math.abs(displayStock.changePercent).toFixed(2)} percent`}>
              {formatChange(displayStock.change)} ({formatPercent(displayStock.changePercent)})
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 dark:text-slate-500">AI Target</div>
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(displayStock.prediction)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {Math.round(displayStock.confidence * 100)}% conf.
          </div>
        </div>
      </div>
    </div>
  );
});
