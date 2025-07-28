"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TrendingUp, TrendingDown, Star, Plus, Target, Bell, Trash2, Edit, AlertTriangle } from 'lucide-react';

// Mock stock data
const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.31, changePercent: 1.33 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.87, changePercent: -1.34 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 4.23, changePercent: 1.13 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -8.91, changePercent: -3.46 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: 1.76, changePercent: 1.17 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 456.78, change: 12.34, changePercent: 2.78 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 298.65, change: -5.43, changePercent: -1.79 },
];

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice?: number;
  alertsEnabled: boolean;
  priceAlert: boolean;
  changeAlert: boolean;
  addedDate: Date;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('stock-watchlist-detailed');
    if (savedWatchlist) {
      const parsed = JSON.parse(savedWatchlist);
      setWatchlist(parsed.map((item: any) => ({
        ...item,
        addedDate: new Date(item.addedDate)
      })));
    }
  }, []);

  const saveWatchlist = (newWatchlist: WatchlistItem[]) => {
    setWatchlist(newWatchlist);
    localStorage.setItem('stock-watchlist-detailed', JSON.stringify(newWatchlist));
  };

  const addToWatchlist = (stock: typeof AVAILABLE_STOCKS[0]) => {
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.price,
      alertsEnabled: true,
      priceAlert: false,
      changeAlert: true,
      addedDate: new Date()
    };
    saveWatchlist([...watchlist, newItem]);
    setIsAddDialogOpen(false);
  };

  const removeFromWatchlist = (id: string) => {
    saveWatchlist(watchlist.filter(item => item.id !== id));
  };

  const updateWatchlistItem = (id: string, updates: Partial<WatchlistItem>) => {
    saveWatchlist(watchlist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingItem(null);
    setNewTargetPrice('');
  };

  const filteredStocks = AVAILABLE_STOCKS.filter(stock =>
    !watchlist.some(item => item.symbol === stock.symbol) &&
    (stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getAlertStatus = (item: WatchlistItem) => {
    const alerts = [];
    if (item.targetPrice && item.currentPrice >= item.targetPrice) {
      alerts.push('Target reached');
    }
    if (Math.abs((AVAILABLE_STOCKS.find(s => s.symbol === item.symbol)?.changePercent || 0)) > 5) {
      alerts.push('High volatility');
    }
    return alerts;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              <Star className="w-8 h-8 mr-3 text-yellow-500" />
              My Watchlist
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Track your favorite stocks and set price alerts
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Stock to Watchlist</DialogTitle>
                <DialogDescription>
                  Search and select a stock to add to your watchlist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {stock.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stock.price.toFixed(2)}</div>
                        <div className={`text-sm ${
                          stock.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToWatchlist(stock)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Stocks</p>
                  <p className="text-2xl font-bold">{watchlist.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gainers</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {watchlist.filter(item => {
                      const stock = AVAILABLE_STOCKS.find(s => s.symbol === item.symbol);
                      return stock && stock.change > 0;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Losers</p>
                  <p className="text-2xl font-bold text-red-600">
                    {watchlist.filter(item => {
                      const stock = AVAILABLE_STOCKS.find(s => s.symbol === item.symbol);
                      return stock && stock.change < 0;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Alerts</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {watchlist.filter(item => item.alertsEnabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Watchlist Items */}
      {watchlist.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Add stocks to track their performance and set price alerts
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Stock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {watchlist.map((item) => {
            const currentStock = AVAILABLE_STOCKS.find(s => s.symbol === item.symbol);
            const alerts = getAlertStatus(item);
            
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-xl font-bold flex items-center">
                          {item.symbol}
                          {alerts.length > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Alert
                            </Badge>
                          )}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          Added {item.addedDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Current Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${currentStock?.price.toFixed(2) || item.currentPrice.toFixed(2)}
                        </div>
                        {currentStock && (
                          <div className={`flex items-center ${
                            currentStock.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {currentStock.change >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} 
                            ({currentStock.changePercent.toFixed(2)}%)
                          </div>
                        )}
                      </div>

                      {/* Target Price */}
                      <div className="text-right">
                        <div className="text-sm text-slate-600 dark:text-slate-400">Target</div>
                        <div className="text-lg font-semibold">
                          {item.targetPrice ? `$${item.targetPrice.toFixed(2)}` : 'Not set'}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingItem(item);
                              setNewTargetPrice(item.targetPrice?.toString() || '');
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit {item.symbol}</DialogTitle>
                              <DialogDescription>
                                Update target price and alert settings
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="targetPrice">Target Price</Label>
                                <Input
                                  id="targetPrice"
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter target price"
                                  value={newTargetPrice}
                                  onChange={(e) => setNewTargetPrice(e.target.value)}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="alerts"
                                  checked={editingItem?.alertsEnabled || false}
                                  onCheckedChange={(checked) => 
                                    setEditingItem(prev => prev ? {...prev, alertsEnabled: checked} : null)
                                  }
                                />
                                <Label htmlFor="alerts">Enable alerts</Label>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => {
                                    if (editingItem) {
                                      updateWatchlistItem(editingItem.id, {
                                        targetPrice: newTargetPrice ? parseFloat(newTargetPrice) : undefined,
                                        alertsEnabled: editingItem.alertsEnabled
                                      });
                                    }
                                  }}
                                >
                                  Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => setEditingItem(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {alerts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {alerts.map((alert, index) => (
                        <Alert key={index} className="border-l-4 border-l-amber-400">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Alert</AlertTitle>
                          <AlertDescription>{alert}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}