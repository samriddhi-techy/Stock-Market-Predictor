"use client";

import { Clock, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
  onClear: () => void;
  className?: string;
}

export function RecentSearches({
  searches,
  onSelect,
  onRemove,
  onClear,
  className,
}: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>Recent searches</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
          aria-label="Clear all recent searches"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="list" aria-label="Recent stock searches">
        {searches.map((symbol) => (
          <div
            key={symbol}
            role="listitem"
            className="group flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-full pl-3 pr-1 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <button
              onClick={() => onSelect(symbol)}
              aria-label={`Search for ${symbol}`}
              className="flex items-center gap-1 focus-visible:outline-none"
            >
              {symbol}
              <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </button>
            <button
              onClick={() => onRemove(symbol)}
              aria-label={`Remove ${symbol} from recent searches`}
              className="ml-0.5 p-0.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              <X className="w-2.5 h-2.5 text-slate-400" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
