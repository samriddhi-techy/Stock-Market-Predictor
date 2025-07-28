"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  profit?: number;
}

const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'buy',
    quantity: 50,
    price: 175.43,
    total: 8771.50,
    date: new Date('2024-01-15'),
    status: 'completed'
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'sell',
    quantity: 25,
    price: 140.08,
    total: 3502.00,
    date: new Date('2024-01-14'),
    status: 'completed',
    profit: 502.00
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'buy',
    quantity: 30,
    price: 378.85,
    total: 11365.50,
    date: new Date('2024-01-12'),
    status: 'completed'
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'sell',
    quantity: 15,
    price: 248.42,
    total: 3726.30,
    date: new Date('2024-01-10'),
    status: 'completed',
    profit: -234.50
  },
  {
    id: '5',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'buy',
    quantity: 40,
    price: 151.94,
    total: 6077.60,
    date: new Date('2024-01-08'),
    status: 'pending'
  }
];

export default function TradeHistoryPage() {
  const [trades] = useState<Trade[]>(MOCK_TRADES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || trade.type === filterType;
    const matchesStatus = filterStatus === 'all' || trade.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTrades = trades.length;
  const totalBuys = trades.filter(t => t.type === 'buy').length;
  const totalSells = trades.filter(t => t.type === 'sell').length;
  const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              <History className="w-8 h-8 mr-3 text-blue-600" />
              Trade History
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              View and analyze your trading activity and performance
            </p>
          </div>
          <Button className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <History className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Trades</p>
                  <p className="text-2xl font-bold">{totalTrades}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Buy Orders</p>
                  <p className="text-2xl font-bold text-green-600">{totalBuys}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <ArrowDownRight className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sell Orders</p>
                  <p className="text-2xl font-bold text-red-600">{totalSells}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total P&L</p>
                  <p className={`text-2xl font-bold ${
                    totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by symbol or company name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Trade Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy Orders</SelectItem>
                  <SelectItem value="sell">Sell Orders</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
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
      </div>

      {/* Trade List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>
            Your trading activity and transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTrades.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trades found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Your trade history will appear here once you start trading'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      trade.type === 'buy' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {trade.type === 'buy' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{trade.symbol}</h3>
                        <Badge className={`${
                          trade.type === 'buy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {trade.type.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(trade.status)}>
                          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{trade.name}</p>
                      <p className="text-sm text-slate-500">
                        {trade.quantity} shares @ ${trade.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      ${trade.total.toFixed(2)}
                    </div>
                    {trade.profit !== undefined && (
                      <div className={`text-sm ${
                        trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        P&L: {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm text-slate-500">
                      {trade.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}