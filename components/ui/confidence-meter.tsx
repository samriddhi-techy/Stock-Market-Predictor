import { cn } from '@/lib/utils';
import { CONFIDENCE_THRESHOLDS } from '@/lib/constants';

interface ConfidenceMeterProps {
  value: number; // 0 to 1
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getConfidenceConfig(value: number) {
  if (value >= CONFIDENCE_THRESHOLDS.HIGH) {
    return {
      label: 'High Confidence',
      color: 'bg-emerald-500',
      trackColor: 'bg-emerald-100 dark:bg-emerald-950',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (value >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return {
      label: 'Medium Confidence',
      color: 'bg-amber-500',
      trackColor: 'bg-amber-100 dark:bg-amber-950',
      textColor: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    label: 'Low Confidence',
    color: 'bg-red-500',
    trackColor: 'bg-red-100 dark:bg-red-950',
    textColor: 'text-red-600 dark:text-red-400',
  };
}

const SIZE_CLASSES = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ConfidenceMeter({ value, showLabel = true, size = 'md', className }: ConfidenceMeterProps) {
  const percent = Math.round(value * 100);
  const config = getConfidenceConfig(value);

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Confidence</span>
          <span className={cn('font-semibold', config.textColor)}>
            {percent}% — {config.label}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Prediction confidence: ${percent}%`}
        className={cn('w-full rounded-full overflow-hidden', SIZE_CLASSES[size], config.trackColor)}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', config.color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
