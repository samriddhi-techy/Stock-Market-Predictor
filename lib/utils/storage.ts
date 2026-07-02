import { STORAGE_KEYS } from '@/lib/constants';

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Safely gets a typed value from localStorage.
 * Returns null on parse errors or missing keys.
 */
export function getStorageItem<T>(key: StorageKey): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Safely sets a typed value in localStorage.
 * Silently fails if storage is unavailable (e.g. private mode quota exceeded).
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

/**
 * Safely removes a key from localStorage.
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}
