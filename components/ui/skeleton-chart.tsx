import { cn } from '@/lib/utils';

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div
      className={cn('space-y-4', className)}
      aria-hidden="true"
    >
      {/* Time range selector skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-10 rounded bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          ))}
        </div>
      </div>
      {/* Chart area skeleton */}
      <div className="h-80 w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden animate-shimmer relative">
        {/* Fake chart lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline points="0,150 50,120 100,130 150,80 200,100 250,60 300,90 350,50 400,70" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
        </svg>
      </div>
    </div>
  );
}
