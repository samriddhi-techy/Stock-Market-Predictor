"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  History, TrendingUp, TrendingDown, DollarSign, Download,
  Search, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { StockMetricCard } from '@/components/stock/stock-metric-card';
import { Trade, TradeType, TradeStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const MOCK_TRADES: Trade[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', type: 'buy', quantity: 50, price: 175.43, total: 8771.50, date: '2024-01-15T10:30:00Z', status: 'completed' },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'sell', quantity: 25, price: 140.08, total: 3502.00, date: '2024-01-14T14:15:00Z', status: 'completed', profit: 502.00 },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', type: 'buy', quantity: 30, price: 378.85, total: 11365.50, date: '2024-01-12T09:45:00Z', status: 'completed' },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', type: 'sell', quantity: 15, price: 248.42, total: 3726.30, date: '2024-01-10T11:00:00Z', status: 'completed', profit: -234.50 },
  { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'buy', quantity: 40, price: 151.94, total: 6077.60, date: '2024-01-08T13:20:00Z', status: 'pending' },
];

const STATUS_CONFIG: Record<TradeStatus, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800' },
};

const TYPE_CONFIG: Record<TradeType, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  buy: { label: 'BUY', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', Icon: ArrowUpRight },
  sell: { label: 'SELL', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300', Icon: ArrowDownRight },
};

function downloadCSV(trades: Trade[]) {
  const headers = ['Date', 'Symbol', 'Company', 'Type', 'Qty', 'Price', 'Total', 'P&L', 'Status'];
  const rows = trades.map((t) => [
    formatDate(t.date), t.symbol, t.name, t.type.toUpperCase(),
    t.quantity, t.price.toFixed(2), t.total.toFixed(2),
    t.profit != null ? t.profit.toFixed(2) : '', t.status
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trade-history.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function TradeHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTrades = useMemo(() =>
    MOCK_TRADES.filter((t) => {
      const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    }),
    [searchQuery, filterType, filterStatus]
  );

  const totalBuys = MOCK_TRADES.filter((t) => t.type === 'buy').length;
  const totalSells = MOCK_TRADES.filter((t) => t.type === 'sell').length;
  const totalProfit = MOCK_TRADES.reduce((sum, t) => sum + (t.profit ?? 0), 0);

  const hasFilters = searchQuery || filterType !== 'all' || filterStatus !== 'all';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl">
                <History className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              Trade History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              View and analyze your trading activity
            </p>
          </div>
          <Button
            onClick={() => downloadCSV(filteredTrades)}
            variant="outline"
            className="gap-2 flex-shrink-0"
            aria-label="Export trade history as CSV"
            disabled={filteredTrades.length === 0}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StockMetricCard icon={History} label="Total Trades" value={String(MOCK_TRADES.length)} iconClass="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
          <StockMetricCard icon={ArrowUpRight} label="Buy Orders" value={String(totalBuys)} iconClass="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
          <StockMetricCard icon={ArrowDownRight} label="Sell Orders" value={String(totalSells)} iconClass="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
          <StockMetricCard
            icon={DollarSign}
            label="Total P&L"
            value={`${totalProfit >= 0 ? '+' : ''}${formatCurrency(totalProfit)}`}
            iconClass={totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}
            iconBg={totalProfit >= 0 ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-red-50 dark:bg-red-950'}
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3" role="search" aria-label="Filter trades">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <Input
                  placeholder="Search by symbol or company..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search trades"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-36" aria-label="Filter by trade type">
                  <Filter className="w-4 h-4 mr-1 text-slate-400" aria-hidden="true" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy Orders</SelectItem>
                  <SelectItem value="sell">Sell Orders</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-36" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Trade list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filteredTrades.length} {filteredTrades.length === 1 ? 'Trade' : 'Trades'}
            {hasFilters && <span className="text-slate-400 dark:text-slate-500 font-normal text-sm ml-1">(filtered)</span>}
          </CardTitle>
          <CardDescription className="text-xs">Your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {filteredTrades.length === 0 ? (
            <EmptyState
              icon={History}
              title="No trades found"
              description={hasFilters
                ? 'Try adjusting your filters to see more results.'
                : 'Your trade history will appear here once you start trading.'}
              actionLabel={hasFilters ? 'Clear Filters' : undefined}
              onAction={hasFilters ? () => { setSearchQuery(''); setFilterType('all'); setFilterStatus('all'); } : undefined}
            />
          ) : (
            <div className="space-y-2" role="list" aria-label="Trade list">
              {filteredTrades.map((trade) => {
                const typeConfig = TYPE_CONFIG[trade.type];
                const statusConfig = STATUS_CONFIG[trade.status];
                const TypeIcon = typeConfig.Icon;

                return (
                  <div
                    key={trade.id}
                    role="listitem"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-xl flex-shrink-0',
                        trade.type === 'buy' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950'
                      )}>
                        <TypeIcon className={cn('w-5 h-5', trade.type === 'buy' ? 'text-emerald-600' : 'text-red-600')} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{trade.symbol}</h3>
                          <Badge className={cn('text-xs', typeConfig.className)}>
                            {typeConfig.label}
                          </Badge>
                          <Badge className={cn('text-xs', statusConfig.className)}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{trade.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {trade.quantity} shares @ {formatCurrency(trade.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(trade.total)}
                      </div>
                      {trade.profit != null && (
                        <div className={cn('text-sm font-medium', trade.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                          P&L: {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                        </div>
                      )}
                      <div className="text-xs text-slate-400 dark:text-slate-500">{formatDate(trade.date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}