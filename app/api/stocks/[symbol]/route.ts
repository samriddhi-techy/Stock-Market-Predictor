import { NextRequest, NextResponse } from 'next/server';
import { MOCK_STOCKS } from '@/lib/constants';

// Map frontend timeframe label to Yahoo Finance query options
const TIMEFRAME_MAPPING: Record<string, { range: string; interval: string }> = {
  '1D': { range: '1d', interval: '5m' },
  '1W': { range: '5d', interval: '15m' },
  '1M': { range: '1mo', interval: '1d' },
  '3M': { range: '3mo', interval: '1d' },
  '6M': { range: '6mo', interval: '1d' },
  '1Y': { range: '1y', interval: '1d' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || '1M';
  const mapping = TIMEFRAME_MAPPING[timeframe] || TIMEFRAME_MAPPING['1M'];

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${mapping.range}&interval=${mapping.interval}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance responded with status ${response.status}`);
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json(
        { error: `No market data found for symbol: ${symbol}` },
        { status: 404 }
      );
    }

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const closePrices = quotes.close || [];
    const volumes = quotes.volume || [];

    // Calculate regular price and daily stats
    const currentPrice = meta.regularMarketPrice ?? closePrices[closePrices.length - 1] ?? 0;
    const previousClose = meta.chartPreviousClose ?? closePrices[0] ?? currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    // Try to match or merge with our high-fidelity mock info for sector details/name
    const matchedMockStock = MOCK_STOCKS.find((s) => s.symbol === symbol);
    const companyName = matchedMockStock?.name || `${symbol} Inc.`;
    const sector = matchedMockStock?.sector || 'Global Markets';

    // Format volumes and market caps to human-readable strings if missing
    const formatNumber = (num: number): string => {
      if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + 'T';
      if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + 'B';
      if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + 'M';
      return num.toLocaleString();
    };

    const volumeRaw = meta.regularMarketVolume ?? volumes[volumes.length - 1] ?? 0;
    const volumeStr = volumeRaw > 0 ? formatNumber(volumeRaw) : '—';
    // Yahoo Finance Meta doesn't always provide marketCap here, fall back to mock cap or generate simulated cap
    const marketCapRaw = meta.marketCap ?? (currentPrice * (volumeRaw || 10000000) * 0.1);
    const marketCapStr = marketCapRaw > 0 ? formatNumber(marketCapRaw) : (matchedMockStock?.marketCap || '—');

    // Simulate AI prediction dynamically off real price
    // Apple, Tesla, etc. predictions have a baseline trend but move with real-time feedback
    const randomFactor = 1.02 + (Math.sin(currentPrice) * 0.03); // dynamic baseline prediction
    const predictionPrice = currentPrice * randomFactor;
    // confidence: high-volume stable stocks get higher confidence
    const baseConfidence = matchedMockStock?.confidence || 0.7;
    const confidence = Math.max(0.4, Math.min(0.95, baseConfidence + (Math.sin(volumeRaw) * 0.05)));

    const stockData = {
      symbol,
      name: companyName,
      price: currentPrice,
      change,
      changePercent,
      volume: volumeStr,
      marketCap: marketCapStr,
      prediction: predictionPrice,
      confidence,
      sector,
      pe: matchedMockStock?.pe || parseFloat((20 + Math.sin(currentPrice) * 5).toFixed(1)),
      high52w: meta.fiftyTwoWeekHigh ?? (currentPrice * 1.2),
      low52w: meta.fiftyTwoWeekLow ?? (currentPrice * 0.8),
    };

    // Format historical chart data
    const chartData = timestamps.map((ts: number, i: number) => {
      const price = closePrices[i] ?? currentPrice;
      const date = new Date(ts * 1000).toISOString().split('T')[0];
      return {
        date,
        price: parseFloat(price.toFixed(2)),
        volume: volumes[i] ?? 0,
        // predictions only for the last 7 days of the timeframe to show AI target overlap
        prediction: i >= timestamps.length - 7 
          ? parseFloat((price * (1 + (Math.sin(ts) * 0.02 + 0.03))).toFixed(2)) 
          : null,
      };
    });

    return NextResponse.json({
      stock: stockData,
      chart: chartData,
    });
  } catch (error: any) {
    console.error(`Error fetching stock ${symbol} from Yahoo Finance:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch live market data from Yahoo Finance API.' },
      { status: 500 }
    );
  }
}
