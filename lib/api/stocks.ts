import { supabase } from '../supabase';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: string;
  market_cap: string;
  prediction: number;
  confidence: number;
  last_updated: string;
}

export interface StocksQuery {
  search?: string;
  sortBy?: 'symbol' | 'price' | 'change_percent' | 'volume';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function getStocks(query: StocksQuery = {}) {
  const {
    search,
    sortBy = 'symbol',
    sortOrder = 'asc',
    limit = 50,
    offset = 0
  } = query;

  let queryBuilder = supabase
    .from('stocks')
    .select('*', { count: 'exact' });

  if (search) {
    queryBuilder = queryBuilder.or(`symbol.ilike.%${search}%,name.ilike.%${search}%`);
  }

  queryBuilder = queryBuilder
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    data: data as Stock[],
    count: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

export async function getStock(symbol: string) {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('symbol', symbol)
    .maybeSingle();

  if (error) throw error;
  return data as Stock | null;
}

export async function getStocksBySymbols(symbols: string[]) {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .in('symbol', symbols);

  if (error) throw error;
  return data as Stock[];
}
