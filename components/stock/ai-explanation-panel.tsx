"use client";

import { memo } from 'react';
import { Brain, Database, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
import { MockStock } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AIExplanationPanelProps {
  stock: MockStock;
  className?: string;
}

export const AIExplanationPanel = memo(function AIExplanationPanel({
  stock,
  className,
}: AIExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const changeStr = stock.changePercent >= 0 ? 'gaining' : 'losing';
  const trendWord = stock.confidence >= 0.75 ? 'strong' : stock.confidence >= 0.5 ? 'moderate' : 'weak';

  const factors = [
    {
      icon: TrendingUp,
      title: 'Price Momentum',
      description: `${stock.symbol} is currently ${changeStr} ${Math.abs(stock.changePercent).toFixed(2)}% today. Historical momentum patterns suggest ${stock.changePercent >= 0 ? 'continued upward pressure' : 'possible reversal'}.`,
    },
    {
      icon: Database,
      title: 'Data Used',
      description: `Prediction trained on 90 days of historical OHLCV data, including price, volume, and 20/50-day moving averages. Model version 2.1 (LSTM + gradient boosting ensemble).`,
    },
    {
      icon: AlertCircle,
      title: 'Uncertainty Factors',
      description: `Market events, earnings announcements, and macroeconomic changes are NOT factored into this model. Confidence is ${trendWord} (${Math.round(stock.confidence * 100)}%), meaning the model has ${trendWord} certainty in this prediction.`,
    },
  ];

  return (
    <div className={cn('rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden', className)}>
      {/* Header — always visible */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="ai-explanation-content"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            How was this prediction made?
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            · AI Explanation
          </span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isExpanded && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Expandable content */}
      <div
        id="ai-explanation-content"
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4">
          {factors.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 flex-shrink-0">
                <Icon className="w-4 h-4 text-purple-500" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}

          <div className="mt-4 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Remember:</strong> This is a machine learning prediction based on historical patterns only. 
              It does not account for news, earnings, or macroeconomic events. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
