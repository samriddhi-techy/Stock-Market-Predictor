"use client";

import { memo } from 'react';
import { TrendingUp, TrendingDown, Sparkles, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MockStock } from '@/lib/constants';
import { ConfidenceMeter } from '@/components/ui/confidence-meter';
import { TrendBadge } from '@/components/ui/trend-badge';
import { RiskBadge } from '@/components/ui/risk-badge';
import { formatCurrency, formatPercent, formatChange, getRiskLevel, getTrendDirection } from '@/lib/utils/format';

interface PredictionCardProps {
  stock: MockStock;
  onSavePrediction?: () => void;
  className?: string;
}

export const PredictionCard = memo(function PredictionCard({
  stock,
  onSavePrediction,
  className,
}: PredictionCardProps) {
  const predChange = stock.prediction - stock.price;
  const predChangePercent = (predChange / stock.price) * 100;
  const isUp = predChange >= 0;
  const riskLevel = getRiskLevel(stock.confidence);
  const trend = getTrendDirection(predChangePercent);
  const now = new Date();

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden',
        className
      )}
      aria-label={`AI Prediction for ${stock.symbol}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Prediction</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">7-day price target</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendBadge direction={trend} />
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      {/* Main prediction */}
      <div className="px-5 py-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Predicted Price</p>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(stock.prediction)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Expected Change</p>
            <div className={cn(
              'flex items-center gap-1 text-xl font-bold',
              isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {isUp ? <TrendingUp className="w-5 h-5" aria-hidden="true" /> : <TrendingDown className="w-5 h-5" aria-hidden="true" />}
              <span aria-label={`Expected change: ${isUp ? 'up' : 'down'} ${Math.abs(predChangePercent).toFixed(2)} percent`}>
                {formatPercent(predChangePercent)}
              </span>
            </div>
            <div className={cn(
              'text-sm',
              isUp ? 'text-emerald-500' : 'text-red-500'
            )}>
              {formatChange(predChange)} from current
            </div>
          </div>
        </div>

        {/* Confidence meter */}
        <ConfidenceMeter value={stock.confidence} size="md" />

        {/* Trend summary */}
        <div className="mt-4 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-700 dark:text-slate-300">Trend Summary: </span>
            {stock.symbol} shows a{' '}
            <span className={cn('font-medium', isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
              {isUp ? 'bullish' : 'bearish'}
            </span>{' '}
            outlook over the next 7 days based on momentum indicators and volume patterns. 
            The model identified {isUp ? 'increasing buying pressure' : 'selling pressure'} with {Math.round(stock.confidence * 100)}% certainty.
          </p>
        </div>

        {/* Footer meta */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>Updated {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span>LSTM v2.1</span>
          </div>
        </div>

        {/* Save button */}
        {onSavePrediction && (
          <button
            onClick={onSavePrediction}
            className={cn(
              'mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
              'hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
            )}
            aria-label={`Save prediction for ${stock.symbol}`}
          >
            Save to History
          </button>
        )}
      </div>
    </div>
  );
});
