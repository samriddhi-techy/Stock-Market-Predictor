/**
 * Lightweight analytics event tracking.
 * In development, events are logged to the console.
 * In production, replace with your analytics provider (e.g. GA, Mixpanel, Segment).
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

const isDev = process.env.NODE_ENV === 'development';

export function trackEvent(name: string, properties?: EventProperties): void {
  if (isDev) {
    console.log(`[Analytics] ${name}`, properties ?? {});
  }
  // TODO: Replace with actual analytics provider call
  // e.g. window.gtag?.('event', name, properties);
  // e.g. window.mixpanel?.track(name, properties);
}

// ─── Predefined Event Helpers ───────────────────────────────────────────────

export const Analytics = {
  stockSearched: (symbol: string) =>
    trackEvent('stock_searched', { symbol }),

  predictionGenerated: (symbol: string, confidence: number) =>
    trackEvent('prediction_generated', { symbol, confidence }),

  favoriteAdded: (symbol: string) =>
    trackEvent('favorite_added', { symbol }),

  favoriteRemoved: (symbol: string) =>
    trackEvent('favorite_removed', { symbol }),

  watchlistAdded: (symbol: string) =>
    trackEvent('watchlist_added', { symbol }),

  watchlistRemoved: (symbol: string) =>
    trackEvent('watchlist_removed', { symbol }),

  apiError: (endpoint: string, statusCode?: number) =>
    trackEvent('api_error', { endpoint, statusCode }),

  pageViewed: (page: string) =>
    trackEvent('page_viewed', { page }),

  themeChanged: (theme: string) =>
    trackEvent('theme_changed', { theme }),
} as const;
