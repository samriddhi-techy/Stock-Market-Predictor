import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendDirection } from '@/lib/types';

interface TrendBadgeProps {
  direction: TrendDirection;
  size?: 'sm' | 'md';
  className?: string;
}

const TREND_CONFIG = {
  BULLISH: {
    label: 'Bullish',
    Icon: TrendingUp,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  },
  BEARISH: {
    label: 'Bearish',
    Icon: TrendingDown,
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  },
  NEUTRAL: {
    label: 'Neutral',
    Icon: Minus,
    className: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  },
};

export function TrendBadge({ direction, size = 'md', className }: TrendBadgeProps) {
  const { label, Icon, className: trendClass } = TREND_CONFIG[direction];

  return (
    <span
      role="status"
      aria-label={`Trend: ${label}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        trendClass,
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      {label}
    </span>
  );
}
