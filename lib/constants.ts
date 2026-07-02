// ─── Stock Data ────────────────────────────────────────────────────────────

export interface MockStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  prediction: number;
  confidence: number;
  sector: string;
  pe: number;
  high52w: number;
  low52w: number;
}

export const MOCK_STOCKS: MockStock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.31,
    changePercent: 1.33,
    volume: '64.2M',
    marketCap: '2.78T',
    prediction: 182.15,
    confidence: 0.78,
    sector: 'Technology',
    pe: 28.4,
    high52w: 198.23,
    low52w: 124.17,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.87,
    changePercent: -1.34,
    volume: '29.8M',
    marketCap: '1.75T',
    prediction: 145.30,
    confidence: 0.65,
    sector: 'Technology',
    pe: 24.1,
    high52w: 155.78,
    low52w: 102.21,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.23,
    changePercent: 1.13,
    volume: '22.1M',
    marketCap: '2.81T',
    prediction: 395.20,
    confidence: 0.82,
    sector: 'Technology',
    pe: 35.2,
    high52w: 420.00,
    low52w: 275.43,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: -8.91,
    changePercent: -3.46,
    volume: '89.7M',
    marketCap: '790B',
    prediction: 267.80,
    confidence: 0.59,
    sector: 'Consumer Discretionary',
    pe: 62.1,
    high52w: 313.80,
    low52w: 101.81,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 151.94,
    change: 1.76,
    changePercent: 1.17,
    volume: '41.3M',
    marketCap: '1.58T',
    prediction: 165.45,
    confidence: 0.71,
    sector: 'Consumer Discretionary',
    pe: 58.9,
    high52w: 189.77,
    low52w: 101.26,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 456.78,
    change: 12.34,
    changePercent: 2.78,
    volume: '51.2M',
    marketCap: '1.13T',
    prediction: 492.30,
    confidence: 0.74,
    sector: 'Technology',
    pe: 110.3,
    high52w: 502.66,
    low52w: 108.13,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 298.65,
    change: -5.43,
    changePercent: -1.79,
    volume: '18.4M',
    marketCap: '769B',
    prediction: 318.90,
    confidence: 0.68,
    sector: 'Communication Services',
    pe: 22.8,
    high52w: 384.33,
    low52w: 88.09,
  },
];

export const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META'];

// ─── Chart Timeframes ───────────────────────────────────────────────────────

export const TIMEFRAMES = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
] as const;

export type TimeframeLabel = typeof TIMEFRAMES[number]['label'];

// ─── LocalStorage Keys ──────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  WATCHLIST: 'smp_watchlist',
  FAVORITES: 'smp_favorites',
  RECENT_SEARCHES: 'smp_recent_searches',
  PREDICTION_HISTORY: 'smp_prediction_history',
  THEME: 'smp_theme',
  DISMISSED_DISCLAIMER: 'smp_disclaimer_dismissed',
} as const;

// ─── App Config ─────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  MAX_RECENT_SEARCHES: 10,
  MAX_FAVORITES: 20,
  SEARCH_DEBOUNCE_MS: 300,
  MAX_PREDICTION_HISTORY: 50,
  APP_NAME: 'StockAI',
  APP_TAGLINE: 'AI-Powered Market Intelligence',
} as const;

// ─── Risk Levels ────────────────────────────────────────────────────────────

export const RISK_LEVELS = {
  LOW: { label: 'Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
  MEDIUM: { label: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800' },
  HIGH: { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800' },
} as const;

// ─── Confidence Thresholds ──────────────────────────────────────────────────

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,   // >= 75% → high confidence
  MEDIUM: 0.5,  // >= 50% → medium confidence
  // < 50% → low confidence
} as const;

// ─── Financial Disclaimer ───────────────────────────────────────────────────

export const FINANCIAL_DISCLAIMER =
  'Predictions are generated using historical market data and machine learning models. ' +
  'They are intended for educational purposes only and should not be considered financial advice. ' +
  'Always do your own research before making investment decisions.';
