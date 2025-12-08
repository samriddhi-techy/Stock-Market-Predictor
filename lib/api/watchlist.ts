import { supabase } from '../supabase';

export interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  target_price: number | null;
  alerts_enabled: boolean;
  price_alert: boolean;
  change_alert: boolean;
  added_at: string;
  stock?: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    change_percent: number;
  };
}

export interface WatchlistQuery {
  search?: string;
  sortBy?: 'added_at' | 'symbol';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function getWatchlist(query: WatchlistQuery = {}) {
  const {
    search,
    sortBy = 'added_at',
    sortOrder = 'desc',
    limit = 50,
    offset = 0
  } = query;

  let queryBuilder = supabase
    .from('watchlist')
    .select(`
      *,
      stock:stocks(symbol, name, price, change, change_percent)
    `, { count: 'exact' });

  if (search) {
    queryBuilder = queryBuilder.or(`symbol.ilike.%${search}%`);
  }

  queryBuilder = queryBuilder
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    data: data as WatchlistItem[],
    count: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

export async function addToWatchlist(symbol: string, options?: {
  target_price?: number;
  alerts_enabled?: boolean;
  price_alert?: boolean;
  change_alert?: boolean;
}) {
  const { data, error } = await supabase
    .from('watchlist')
    .insert({
      symbol,
      target_price: options?.target_price,
      alerts_enabled: options?.alerts_enabled ?? true,
      price_alert: options?.price_alert ?? false,
      change_alert: options?.change_alert ?? true
    })
    .select()
    .single();

  if (error) throw error;
  return data as WatchlistItem;
}

export async function updateWatchlistItem(id: string, updates: {
  target_price?: number | null;
  alerts_enabled?: boolean;
  price_alert?: boolean;
  change_alert?: boolean;
}) {
  const { data, error } = await supabase
    .from('watchlist')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WatchlistItem;
}

export async function removeFromWatchlist(id: string) {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function isInWatchlist(symbol: string) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('symbol', symbol)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
