import { cn } from '@/lib/utils';

export function SkeletonMetricCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-shimmer flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
