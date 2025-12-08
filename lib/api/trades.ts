import { supabase } from '../supabase';

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  profit: number | null;
  created_at: string;
  stock?: {
    name: string;
  };
}

export interface TradesQuery {
  search?: string;
  type?: 'buy' | 'sell';
  status?: 'completed' | 'pending' | 'cancelled';
  sortBy?: 'created_at' | 'total' | 'profit';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function getTrades(query: TradesQuery = {}) {
  const {
    search,
    type,
    status,
    sortBy = 'created_at',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
    dateFrom,
    dateTo
  } = query;

  let queryBuilder = supabase
    .from('trades')
    .select(`
      *,
      stock:stocks(name)
    `, { count: 'exact' });

  if (search) {
    queryBuilder = queryBuilder.ilike('symbol', `%${search}%`);
  }

  if (type) {
    queryBuilder = queryBuilder.eq('type', type);
  }

  if (status) {
    queryBuilder = queryBuilder.eq('status', status);
  }

  if (dateFrom) {
    queryBuilder = queryBuilder.gte('created_at', dateFrom);
  }

  if (dateTo) {
    queryBuilder = queryBuilder.lte('created_at', dateTo);
  }

  queryBuilder = queryBuilder
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    data: data as Trade[],
    count: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

export async function createTrade(trade: {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status?: 'completed' | 'pending' | 'cancelled';
  profit?: number;
}) {
  const total = trade.quantity * trade.price;

  const { data, error } = await supabase
    .from('trades')
    .insert({
      symbol: trade.symbol,
      type: trade.type,
      quantity: trade.quantity,
      price: trade.price,
      total,
      status: trade.status || 'completed',
      profit: trade.profit || null
    })
    .select()
    .single();

  if (error) throw error;
  return data as Trade;
}

export async function updateTrade(id: string, updates: {
  status?: 'completed' | 'pending' | 'cancelled';
  profit?: number;
}) {
  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Trade;
}

export async function deleteTrade(id: string) {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getTradeStats() {
  const { data, error } = await supabase
    .from('trades')
    .select('type, status, profit, total');

  if (error) throw error;

  const trades = data as Trade[];
  const totalTrades = trades.length;
  const totalBuys = trades.filter(t => t.type === 'buy').length;
  const totalSells = trades.filter(t => t.type === 'sell').length;
  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

  return {
    totalTrades,
    totalBuys,
    totalSells,
    totalProfit
  };
}
