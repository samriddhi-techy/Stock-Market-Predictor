"use client";

import { History, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PredictionHistoryEntry } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface PredictionHistoryTableProps {
  history: PredictionHistoryEntry[];
  onClear: () => void;
  className?: string;
}

const TREND_ICONS = {
  BULLISH: { Icon: TrendingUp, class: 'text-emerald-600 dark:text-emerald-400' },
  BEARISH: { Icon: TrendingDown, class: 'text-red-600 dark:text-red-400' },
  NEUTRAL: { Icon: Minus, class: 'text-slate-400' },
};

export function PredictionHistoryTable({ history, onClear, className }: PredictionHistoryTableProps) {
  if (history.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No prediction history yet"
        description="Generate a prediction for any stock and save it to track your AI forecasts over time."
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <History className="w-4 h-4" aria-hidden="true" />
          Prediction History ({history.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-600 gap-1"
          aria-label="Clear all prediction history"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          Clear
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Stock
                </th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Predicted
                </th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                  Actual
                </th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">
                  Accuracy
                </th>
                <th scope="col" className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Trend
                </th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {history.map((entry) => {
                const trendConfig = TREND_ICONS[entry.trend];
                const TrendIcon = trendConfig.Icon;
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{entry.symbol}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[100px]">{entry.name}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(entry.predictedPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      {entry.actualPrice != null ? formatCurrency(entry.actualPrice) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      {entry.accuracy != null ? (
                        <span className={cn(
                          'font-medium',
                          entry.accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                          entry.accuracy >= 75 ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                        )}>
                          {entry.accuracy.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TrendIcon className={cn('w-4 h-4 mx-auto', trendConfig.class)} aria-label={entry.trend} />
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 dark:text-slate-500 text-xs hidden lg:table-cell">
                      {formatDate(entry.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
