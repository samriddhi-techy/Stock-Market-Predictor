"use client";

import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  iconClass?: string;
  iconBg?: string;
  className?: string;
}

export const StockMetricCard = memo(function StockMetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  iconClass = 'text-blue-600',
  iconBg = 'bg-blue-50 dark:bg-blue-950',
  className,
}: StockMetricCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50',
        'transition-shadow hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg flex-shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconClass)} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">{value}</p>
          {subValue && (
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
});
