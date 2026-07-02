"use client";

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Bell, BarChart3, DollarSign, TrendingUp, Target, History as HistoryIcon } from 'lucide-react';
import { MOCK_STOCKS, MockStock } from '@/lib/constants';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { usePredictionHistory } from '@/hooks/use-prediction-history';
import { StockListItem } from '@/components/stock/stock-list-item';
import { StockSearch } from '@/components/stock/stock-search';
import { RecentSearches } from '@/components/stock/recent-searches';
import { PredictionCard } from '@/components/stock/prediction-card';
import { AIExplanationPanel } from '@/components/stock/ai-explanation-panel';
import { PriceChart } from '@/components/stock/price-chart';
import { StockMetricCard } from '@/components/stock/stock-metric-card';
import { DisclaimerBanner } from '@/components/ui/disclaimer-banner';
import { PredictionHistoryTable } from '@/components/prediction/prediction-history-table';
import { formatCurrency, formatChange, formatPercent, getTrendDirection } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

export default function StockMarketApp() {
  const [selectedStock, setSelectedStock] = useState<MockStock>(MOCK_STOCKS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();
  const { history, addPrediction, clearHistory } = usePredictionHistory();

  // Filtered stocks list based on search query (actual query, not debounced — the StockSearch handles debounce internally)
  const filteredStocks = useMemo(
    () =>
      MOCK_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const handleStockSelect = useCallback(
    (stock: MockStock) => {
      setSelectedStock(stock);
      setSearchQuery('');
      addRecentSearch(stock.symbol);
    },
    [addRecentSearch]
  );

  const handleSearchSelect = useCallback(
    (symbol: string) => {
      const stock = MOCK_STOCKS.find((s) => s.symbol === symbol);
      if (stock) {
        handleStockSelect(stock);
      }
    },
    [handleStockSelect]
  );

  const handleWatchlistToggle = useCallback(
    (stock: MockStock) => {
      if (isInWatchlist(stock.symbol)) {
        removeFromWatchlist(stock.symbol);
      } else {
        addToWatchlist({ symbol: stock.symbol, name: stock.name, currentPrice: stock.price });
      }
    },
    [isInWatchlist, addToWatchlist, removeFromWatchlist]
  );

  const handleSavePrediction = useCallback(() => {
    const predChangePercent = ((selectedStock.prediction - selectedStock.price) / selectedStock.price) * 100;
    addPrediction({
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      predictedPrice: selectedStock.prediction,
      confidence: selectedStock.confidence,
      trend: getTrendDirection(predChangePercent),
      timestamp: new Date().toISOString(),
    });
  }, [selectedStock, addPrediction]);

  const isGaining = selectedStock.change >= 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Stock Market Intelligence
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Advanced analytics and AI-powered predictions for informed decisions
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <StockSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleSearchSelect}
            recentSearches={recentSearches}
            className="max-w-lg"
          />
          <RecentSearches
            searches={recentSearches}
            onSelect={handleSearchSelect}
            onRemove={removeRecentSearch}
            onClear={clearRecentSearches}
            className="max-w-lg"
          />
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Stock List ─────────────────────────────── */}
        <aside className="lg:col-span-1" aria-label="Stock list">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" aria-hidden="true" />
                Market Overview
              </CardTitle>
              <CardDescription className="text-xs">
                AI predictions updated every 15 min
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4" role="listbox" aria-label="Select a stock">
              {filteredStocks.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                  No stocks match &ldquo;{searchQuery}&rdquo;
                </p>
              ) : (
                filteredStocks.map((stock) => (
                  <StockListItem
                    key={stock.symbol}
                    stock={stock}
                    isSelected={selectedStock.symbol === stock.symbol}
                    isInWatchlist={isInWatchlist(stock.symbol)}
                    isFavorite={isFavorite(stock.symbol)}
                    onClick={handleStockSelect}
                    onWatchlistToggle={handleWatchlistToggle}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </aside>

        {/* ── Right: Detail Panel ──────────────────────────── */}
        <main className="lg:col-span-2 space-y-5" aria-label="Stock detail">
          {/* Stock header */}
          <Card>
            <CardContent className="px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedStock.symbol}
                    </h2>
                    <Badge
                      variant={isGaining ? 'default' : 'destructive'}
                      className={cn(
                        'text-xs',
                        isGaining
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : ''
                      )}
                    >
                      {formatPercent(selectedStock.changePercent)}
                    </Badge>
                    {selectedStock.sector && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {selectedStock.sector}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    {selectedStock.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedStock.price)}
                  </div>
                  <div className={cn(
                    'text-sm font-medium',
                    isGaining ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {formatChange(selectedStock.change)} today
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StockMetricCard
              icon={DollarSign}
              label="Market Cap"
              value={selectedStock.marketCap}
              iconClass="text-blue-600"
              iconBg="bg-blue-50 dark:bg-blue-950"
            />
            <StockMetricCard
              icon={Activity}
              label="Volume"
              value={selectedStock.volume}
              iconClass="text-emerald-600"
              iconBg="bg-emerald-50 dark:bg-emerald-950"
            />
            <StockMetricCard
              icon={TrendingUp}
              label="AI Prediction"
              value={formatCurrency(selectedStock.prediction)}
              subValue="7-day target"
              iconClass="text-purple-600"
              iconBg="bg-purple-50 dark:bg-purple-950"
            />
            <StockMetricCard
              icon={Target}
              label="Confidence"
              value={`${Math.round(selectedStock.confidence * 100)}%`}
              subValue={selectedStock.confidence >= 0.75 ? 'High' : selectedStock.confidence >= 0.5 ? 'Medium' : 'Low'}
              iconClass="text-amber-600"
              iconBg="bg-amber-50 dark:bg-amber-950"
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Price History & Prediction</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <PriceChart basePrice={selectedStock.price} symbol={selectedStock.symbol} />
            </CardContent>
          </Card>

          {/* Prediction card + AI Explanation */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <PredictionCard
              stock={selectedStock}
              onSavePrediction={handleSavePrediction}
            />
            <AIExplanationPanel stock={selectedStock} />
          </div>

          {/* Prediction History */}
          {history.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <CardTitle className="text-base">Prediction History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <PredictionHistoryTable history={history} onClear={clearHistory} />
              </CardContent>
            </Card>
          )}

          {/* Financial disclaimer */}
          <DisclaimerBanner />
        </main>
      </div>
    </div>
  );
}