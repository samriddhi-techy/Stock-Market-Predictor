"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Search, Bell, Plus, Target, BarChart3, AlertTriangle, DollarSign, Activity } from 'lucide-react';

// Mock stock data
const MOCK_STOCKS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.31,
    changePercent: 1.33,
    volume: '64.2M',
    marketCap: '2.78T',
    prediction: 182.15,
    confidence: 0.78
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
    confidence: 0.65
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
    confidence: 0.82
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
    confidence: 0.59
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
    confidence: 0.71
  }
];

// Generate mock historical data
const generateHistoricalData = (basePrice: number, days: number = 30) => {
  const data = [];
  let price = basePrice;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some realistic price movement
    const change = (Math.random() - 0.5) * 0.1 * price;
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      prediction: i < 7 ? parseFloat((price * (1 + (Math.random() - 0.3) * 0.1)).toFixed(2)) : null
    });
  }
  
  return data;
};

interface WatchlistItem {
  symbol: string;
  targetPrice?: number;
  alertEnabled: boolean;
}

interface Alert {
  id: string;
  symbol: string;
  message: string;
  type: 'price' | 'change' | 'volume';
  timestamp: Date;
}

export default function StockMarketApp() {
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [historicalData, setHistoricalData] = useState(generateHistoricalData(selectedStock.price));
  const [timeframe, setTimeframe] = useState('30D');

  useEffect(() => {
    setHistoricalData(generateHistoricalData(selectedStock.price));
  }, [selectedStock]);

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('stock-watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    // Simulate real-time alerts
    const alertInterval = setInterval(() => {
      const randomStock = MOCK_STOCKS[Math.floor(Math.random() * MOCK_STOCKS.length)];
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          symbol: randomStock.symbol,
          message: `${randomStock.symbol} moved ${Math.abs(randomStock.change).toFixed(2)} (${Math.abs(randomStock.changePercent).toFixed(2)}%)`,
          type: 'change',
          timestamp: new Date()
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 15000);

    return () => clearInterval(alertInterval);
  }, []);

  const addToWatchlist = (symbol: string) => {
    const newItem: WatchlistItem = {
      symbol,
      alertEnabled: true
    };
    const updatedWatchlist = [...watchlist, newItem];
    setWatchlist(updatedWatchlist);
    localStorage.setItem('stock-watchlist', JSON.stringify(updatedWatchlist));
  };

  const removeFromWatchlist = (symbol: string) => {
    const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('stock-watchlist', JSON.stringify(updatedWatchlist));
  };

  const filteredStocks = MOCK_STOCKS.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isInWatchlist = (symbol: string) => watchlist.some(item => item.symbol === symbol);

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Stock Market Intelligence
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Advanced analytics and AI-powered predictions for informed trading decisions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="w-4 h-4 mr-2" />
                Live Data
              </Badge>
              {alerts.length > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  <Bell className="w-4 h-4 mr-2" />
                  {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search stocks by symbol or company name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Recent Alerts
            </h3>
            <div className="grid gap-2">
              {alerts.slice(0, 3).map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.symbol}</AlertTitle>
                  <AlertDescription>
                    {alert.message} • {alert.timestamp.toLocaleTimeString()}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stock List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Market Overview
                </CardTitle>
                <CardDescription>
                  Top performing stocks with AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedStock.symbol === stock.symbol
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{stock.symbol}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {stock.name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isInWatchlist(stock.symbol) ? "destructive" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInWatchlist(stock.symbol)) {
                            removeFromWatchlist(stock.symbol);
                          } else {
                            addToWatchlist(stock.symbol);
                          }
                        }}
                      >
                        {isInWatchlist(stock.symbol) ? (
                          <Target className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">
                          ${stock.price.toFixed(2)}
                        </span>
                        <div className={`flex items-center text-sm ${
                          stock.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div className="text-slate-600 dark:text-slate-400">
                          Prediction
                        </div>
                        <div className="font-semibold text-blue-600">
                          ${stock.prediction.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {(stock.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Stock Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      {selectedStock.symbol}
                      <Badge className="ml-3" variant={selectedStock.change >= 0 ? "default" : "destructive"}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {selectedStock.name}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      ${selectedStock.price.toFixed(2)}
                    </div>
                    <div className={`text-lg ${
                      selectedStock.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Market Cap</p>
                      <p className="text-lg font-semibold">{selectedStock.marketCap}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Volume</p>
                      <p className="text-lg font-semibold">{selectedStock.volume}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">AI Prediction</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ${selectedStock.prediction.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Confidence</p>
                      <p className="text-lg font-semibold">
                        {(selectedStock.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Price Chart & Predictions</CardTitle>
                  <Tabs value={timeframe} onValueChange={setTimeframe}>
                    <TabsList>
                      <TabsTrigger value="7D">7D</TabsTrigger>
                      <TabsTrigger value="30D">30D</TabsTrigger>
                      <TabsTrigger value="90D">90D</TabsTrigger>
                      <TabsTrigger value="1Y">1Y</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: any, name: string) => [
                          `$${parseFloat(value).toFixed(2)}`,
                          name === 'price' ? 'Actual Price' : 'AI Prediction'
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        name="Actual Price"
                      />
                      <Line
                        type="monotone"
                        dataKey="prediction"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        name="AI Prediction"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}