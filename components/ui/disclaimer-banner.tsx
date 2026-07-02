"use client";

import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FINANCIAL_DISCLAIMER, STORAGE_KEYS } from '@/lib/constants';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';

interface DisclaimerBannerProps {
  className?: string;
}

export function DisclaimerBanner({ className }: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(() =>
    getStorageItem<boolean>(STORAGE_KEYS.DISMISSED_DISCLAIMER) === true
  );

  const handleDismiss = () => {
    setDismissed(true);
    setStorageItem(STORAGE_KEYS.DISMISSED_DISCLAIMER, true);
  };

  if (dismissed) return null;

  return (
    <aside
      role="note"
      aria-label="Financial disclaimer"
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
        className
      )}
    >
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" aria-hidden="true" />
      <p className="text-xs leading-relaxed flex-1">{FINANCIAL_DISCLAIMER}</p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
        className="flex-shrink-0 p-0.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </aside>
  );
}
