/**
 * Format a number as a USD currency string.
 * e.g. 175.43 → "$175.43"
 */
export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as a percentage string with sign.
 * e.g. 1.33 → "+1.33%", -3.46 → "-3.46%"
 */
export function formatPercent(value: number, decimals = 2, includeSign = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a change value with sign and optional decimals.
 * e.g. 2.31 → "+2.31", -8.91 → "-8.91"
 */
export function formatChange(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
}

/**
 * Format a Date or ISO string as a relative "time ago" string.
 * e.g. "2 minutes ago", "3 hours ago", "yesterday"
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return 'yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a Date or ISO string as a short date.
 * e.g. "Jan 15, 2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Format a Date or ISO string as a short date + time.
 * e.g. "Jan 15, 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Derive risk level from confidence score.
 * High confidence → Low risk, Low confidence → High risk
 */
export function getRiskLevel(confidence: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (confidence >= 0.75) return 'LOW';
  if (confidence >= 0.5) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Derive trend direction from change percent.
 */
export function getTrendDirection(changePercent: number): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
  if (changePercent > 0.5) return 'BULLISH';
  if (changePercent < -0.5) return 'BEARISH';
  return 'NEUTRAL';
}

/**
 * Calculate the accuracy percentage between predicted and actual price.
 */
export function calculateAccuracy(predicted: number, actual: number): number {
  if (actual === 0) return 0;
  const error = Math.abs(predicted - actual) / actual;
  return clamp((1 - error) * 100, 0, 100);
}
