// ─── Stock Types ────────────────────────────────────────────────────────────

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  prediction: number;
  confidence: number;
  sector?: string;
  pe?: number;
  high52w?: number;
  low52w?: number;
}

// ─── Watchlist Types ────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice?: number;
  alertsEnabled: boolean;
  priceAlert: boolean;
  changeAlert: boolean;
  addedDate: string; // ISO string for safe localStorage serialization
}

// ─── Prediction Types ───────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TrendDirection = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface Prediction {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  predictedPrice: number;
  changePercent: number;
  confidence: number;
  riskLevel: RiskLevel;
  trend: TrendDirection;
  trendSummary: string;
  timestamp: string; // ISO string
  dataPoints: number;
  modelVersion: string;
}

export interface PredictionHistoryEntry {
  id: string;
  symbol: string;
  name: string;
  predictedPrice: number;
  actualPrice?: number;
  accuracy?: number;
  trend: TrendDirection;
  confidence: number;
  timestamp: string; // ISO string
}

// ─── Trade Types ────────────────────────────────────────────────────────────

export type TradeType = 'buy' | 'sell';
export type TradeStatus = 'completed' | 'pending' | 'cancelled';

export interface Trade {
  id: string;
  symbol: string;
  name: string;
  type: TradeType;
  quantity: number;
  price: number;
  total: number;
  date: string; // ISO string
  status: TradeStatus;
  profit?: number;
}

// ─── Alert Types ────────────────────────────────────────────────────────────

export type AlertType = 'price' | 'change' | 'volume';

export interface StockAlert {
  id: string;
  symbol: string;
  message: string;
  type: AlertType;
  timestamp: string; // ISO string
  isRead: boolean;
}

// ─── Chat Types ─────────────────────────────────────────────────────────────

export type MessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string; // ISO string
  suggestions?: string[];
  isError?: boolean;
}

// ─── UI State Types ─────────────────────────────────────────────────────────

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type Theme = 'light' | 'dark' | 'system';

// ─── Search Types ───────────────────────────────────────────────────────────

export interface SearchResult {
  symbol: string;
  name: string;
  sector?: string;
  isRecent?: boolean;
  isPopular?: boolean;
}
