import { cn } from '@/lib/utils';

export function SkeletonStockCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3', className)}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
        </div>
        <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-shimmer" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-2">
          <div className="h-7 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
