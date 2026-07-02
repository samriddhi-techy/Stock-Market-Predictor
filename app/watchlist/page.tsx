"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Star, Plus, TrendingUp, TrendingDown, Bell, Trash2, Edit, Target, Activity, AlertTriangle
} from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { MOCK_STOCKS } from '@/lib/constants';
import { WatchlistItem } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { StockMetricCard } from '@/components/stock/stock-metric-card';
import { formatCurrency, formatChange, formatPercent, formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const STOCK_MAP = Object.fromEntries(MOCK_STOCKS.map((s) => [s.symbol, s]));

export default function WatchlistPage() {
  const { watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistItem, stats } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [targetPriceError, setTargetPriceError] = useState('');

  // Stats derived from watchlist
  const gainers = useMemo(
    () => watchlist.filter((item) => (STOCK_MAP[item.symbol]?.change ?? 0) > 0).length,
    [watchlist]
  );
  const losers = useMemo(
    () => watchlist.filter((item) => (STOCK_MAP[item.symbol]?.change ?? 0) < 0).length,
    [watchlist]
  );

  // Stocks not yet in watchlist
  const availableStocks = useMemo(
    () =>
      MOCK_STOCKS.filter(
        (s) =>
          !isInWatchlist(s.symbol) &&
          (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [isInWatchlist, searchQuery]
  );

  const handleSaveEdit = () => {
    if (!editingItem) return;

    if (newTargetPrice) {
      const val = parseFloat(newTargetPrice);
      if (isNaN(val) || val <= 0) {
        setTargetPriceError('Please enter a valid positive price.');
        return;
      }
      if (val < 0.01 || val > 999999) {
        setTargetPriceError('Price must be between $0.01 and $999,999.');
        return;
      }
    }

    updateWatchlistItem(editingItem.id, {
      targetPrice: newTargetPrice ? parseFloat(newTargetPrice) : undefined,
      alertsEnabled: editingItem.alertsEnabled,
    });
    setEditingItem(null);
    setNewTargetPrice('');
    setTargetPriceError('');
  };

  const handleAddStock = (symbol: string) => {
    const stock = STOCK_MAP[symbol];
    if (stock) {
      addToWatchlist({ symbol: stock.symbol, name: stock.name, currentPrice: stock.price });
    }
    setIsAddDialogOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500" aria-hidden="true" />
              </div>
              My Watchlist
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Track your favorite stocks and set price alerts
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setSearchQuery(''); }}>
            <DialogTrigger asChild>
              <Button className="gap-2 flex-shrink-0" aria-label="Add stock to watchlist">
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Stock to Watchlist</DialogTitle>
                <DialogDescription>
                  Search and select a stock to track
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Input
                    placeholder="Search by symbol or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search stocks to add"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1" role="list">
                  {availableStocks.length === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
                      {searchQuery ? `No results for "${searchQuery}"` : 'All stocks are already in your watchlist'}
                    </p>
                  ) : (
                    availableStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        role="listitem"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">{stock.symbol}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{stock.name}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {formatCurrency(stock.price)}
                            </div>
                            <div className={cn('text-xs', stock.change >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                              {formatPercent(stock.changePercent)}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleAddStock(stock.symbol)} aria-label={`Add ${stock.symbol} to watchlist`}>
                            Add
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StockMetricCard icon={Star} label="Total Stocks" value={String(stats.total)} iconClass="text-yellow-600" iconBg="bg-yellow-50 dark:bg-yellow-950" />
          <StockMetricCard icon={TrendingUp} label="Gainers" value={String(gainers)} iconClass="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
          <StockMetricCard icon={TrendingDown} label="Losers" value={String(losers)} iconClass="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
          <StockMetricCard icon={Bell} label="Active Alerts" value={String(stats.activeAlerts)} iconClass="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        </div>
      </header>

      {/* Watchlist */}
      {watchlist.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Star}
              title="Your watchlist is empty"
              description="Add stocks to track their performance, set price targets, and receive alerts when they move."
              actionLabel="Add Your First Stock"
              onAction={() => setIsAddDialogOpen(true)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3" role="list" aria-label="Watchlist items">
          {watchlist.map((item) => {
            const liveStock = STOCK_MAP[item.symbol];
            const isGaining = (liveStock?.change ?? 0) >= 0;
            const targetReached = item.targetPrice && liveStock && liveStock.price >= item.targetPrice;

            return (
              <Card
                key={item.id}
                role="listitem"
                className={cn(
                  'transition-shadow hover:shadow-md',
                  targetReached && 'border-l-4 border-l-emerald-500'
                )}
              >
                <CardContent className="px-5 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Stock info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{item.symbol[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 dark:text-white">{item.symbol}</h3>
                          {targetReached && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 text-xs gap-1">
                              <Target className="w-3 h-3" aria-hidden="true" />
                              Target Reached
                            </Badge>
                          )}
                          {item.alertsEnabled && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Bell className="w-3 h-3" aria-hidden="true" />
                              Alerts On
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Added {formatDate(item.addedDate)}</p>
                      </div>
                    </div>

                    {/* Price info */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 dark:text-slate-500">Current Price</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {liveStock ? formatCurrency(liveStock.price) : formatCurrency(item.currentPrice)}
                        </div>
                        {liveStock && (
                          <div className={cn('text-xs font-medium', isGaining ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                            {formatChange(liveStock.change)} ({formatPercent(liveStock.changePercent)})
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400 dark:text-slate-500">Target</div>
                        <div className="text-base font-semibold text-slate-700 dark:text-slate-300">
                          {item.targetPrice ? formatCurrency(item.targetPrice) : '—'}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`Edit ${item.symbol}`}
                              onClick={() => { setEditingItem(item); setNewTargetPrice(item.targetPrice?.toString() ?? ''); setTargetPriceError(''); }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit {item.symbol}</DialogTitle>
                              <DialogDescription>Update target price and alert settings</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-5 pt-2">
                              <div className="space-y-2">
                                <Label htmlFor={`target-${item.id}`}>Target Price (USD)</Label>
                                <Input
                                  id={`target-${item.id}`}
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  placeholder="e.g. 200.00"
                                  value={newTargetPrice}
                                  onChange={(e) => { setNewTargetPrice(e.target.value); setTargetPriceError(''); }}
                                  aria-describedby={targetPriceError ? `target-error-${item.id}` : undefined}
                                  aria-invalid={!!targetPriceError}
                                />
                                {targetPriceError && (
                                  <p id={`target-error-${item.id}`} className="text-xs text-red-600 dark:text-red-400" role="alert">
                                    {targetPriceError}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label htmlFor={`alerts-${item.id}`}>Enable alerts</Label>
                                  <p className="text-xs text-slate-400 dark:text-slate-500">Get notified on price movements</p>
                                </div>
                                <Switch
                                  id={`alerts-${item.id}`}
                                  checked={editingItem?.alertsEnabled ?? item.alertsEnabled}
                                  onCheckedChange={(checked) =>
                                    setEditingItem((prev) => prev ? { ...prev, alertsEnabled: checked } : null)
                                  }
                                  aria-label="Toggle price alerts"
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button onClick={handleSaveEdit} className="flex-1">Save Changes</Button>
                                <Button variant="outline" onClick={() => { setEditingItem(null); setTargetPriceError(''); }}>Cancel</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Remove ${item.symbol} from watchlist`}
                          onClick={() => removeFromWatchlist(item.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}