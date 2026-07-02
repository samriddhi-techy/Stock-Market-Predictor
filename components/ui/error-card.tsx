"use client";

import { AlertTriangle, RefreshCw, WifiOff, ServerCrash, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorVariant = 'generic' | 'network' | 'not-found' | 'server' | 'empty-search';

interface ErrorCardProps {
  title?: string;
  description?: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  suggestions?: string[];
  className?: string;
}

const VARIANT_CONFIG: Record<ErrorVariant, {
  icon: React.ComponentType<{ className?: string }>;
  defaultTitle: string;
  defaultDescription: string;
  iconClass: string;
}> = {
  generic: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'An unexpected error occurred. Please try again.',
    iconClass: 'text-amber-500',
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'No internet connection',
    defaultDescription: 'Check your network connection and try again.',
    iconClass: 'text-slate-400',
  },
  'not-found': {
    icon: SearchX,
    defaultTitle: 'Not found',
    defaultDescription: 'The stock or data you requested could not be found.',
    iconClass: 'text-blue-400',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Service unavailable',
    defaultDescription: 'Our servers are temporarily unavailable. Please try again in a moment.',
    iconClass: 'text-red-400',
  },
  'empty-search': {
    icon: SearchX,
    defaultTitle: 'No results found',
    defaultDescription: 'Try a different symbol or company name.',
    iconClass: 'text-slate-400',
  },
};

export function ErrorCard({
  title,
  description,
  variant = 'generic',
  onRetry,
  suggestions,
  className,
}: ErrorCardProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50',
        className
      )}
    >
      <div className={cn('mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-800', config.iconClass)}>
        <Icon className={cn('w-8 h-8', config.iconClass)} aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title ?? config.defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        {description ?? config.defaultDescription}
      </p>

      {suggestions && suggestions.length > 0 && (
        <ul className="text-sm text-slate-500 dark:text-slate-400 mb-6 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>
      )}

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="gap-2"
          aria-label="Retry the failed operation"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
}
