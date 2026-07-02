import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Generic typed localStorage hook.
 * Handles SSR, parse errors, and quota exceeded errors gracefully.
 */
export function useLocalStorage<T>(
  key: typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS],
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getStorageItem<T>(key);
    return item !== null ? item : initialValue;
  });

  // Keep in sync if another tab changes the value
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        setStorageItem(key, next);
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
