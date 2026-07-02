import { useState, useEffect, useCallback } from 'react';
import { Stock } from '@/lib/types';
import { MOCK_STOCKS, MockStock } from '@/lib/constants';
import { toast } from 'sonner';

interface ChartPoint {
  date: string;
  price: number;
  volume: number;
  prediction: number | null;
}

export function useStocks(symbol: string, timeframe: string = '1M') {
  const [stock, setStock] = useState<Stock | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stocks/${symbol}?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStock(data.stock);
      setChart(data.chart);
    } catch (err: any) {
      console.warn(`Failed to fetch live stock data for ${symbol}, falling back to mock data.`, err);
      
      // Fallback logic
      const fallback = MOCK_STOCKS.find((s) => s.symbol === symbol) || MOCK_STOCKS[0];
      
      // Convert MockStock to Stock format
      const mappedStock: Stock = {
        symbol: fallback.symbol,
        name: fallback.name,
        price: fallback.price,
        change: fallback.change,
        changePercent: fallback.changePercent,
        volume: fallback.volume,
        marketCap: fallback.marketCap,
        prediction: fallback.prediction,
        confidence: fallback.confidence,
        sector: fallback.sector,
        pe: fallback.pe,
        high52w: fallback.high52w,
        low52w: fallback.low52w,
      };

      setStock(mappedStock);
      setError('Live connection failed. Using cached/offline mock data.');
      
      // Notify user unobtrusively
      toast.warning(`Could not fetch live updates for ${symbol}. Showing cached data.`);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  return { stock, chart, loading, error, refetch: fetchStockData };
}
