"use client";

import { memo, useCallback } from 'react';
import { Heart, TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatChange, formatPercent } from '@/lib/utils/format';
import { MockStock } from '@/lib/constants';

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
  stock,
  isSelected,
  isInWatchlist,
  isFavorite,
  onClick,
  onWatchlistToggle,
  onFavoriteToggle,
}: StockListItemProps) {
  const isGaining = stock.change >= 0;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(stock);
      }
    },
    [onClick, stock]
  );

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
      onClick={() => onClick(stock)}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{stock.symbol}</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              {stock.sector?.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {stock.name}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {/* Favorite toggle */}
          <button
            aria-label={isFavorite ? `Remove ${stock.symbol} from favorites` : `Add ${stock.symbol} to favorites`}
            aria-pressed={isFavorite}
            onClick={(e) => { e.stopPropagation(); onFavoriteToggle(stock.symbol); }}
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
            aria-label={isInWatchlist ? `Remove ${stock.symbol} from watchlist` : `Add ${stock.symbol} to watchlist`}
            aria-pressed={isInWatchlist}
            onClick={(e) => { e.stopPropagation(); onWatchlistToggle(stock); }}
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
            {formatCurrency(stock.price)}
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
            <span aria-label={`${isGaining ? 'Up' : 'Down'} ${Math.abs(stock.change).toFixed(2)} dollars, ${Math.abs(stock.changePercent).toFixed(2)} percent`}>
              {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 dark:text-slate-500">AI Target</div>
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(stock.prediction)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {Math.round(stock.confidence * 100)}% conf.
          </div>
        </div>
      </div>
    </div>
  );
});
