import { supabase } from '../supabase';

export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  message: string;
  type: 'price' | 'change' | 'volume';
  is_read: boolean;
  created_at: string;
}

export interface AlertsQuery {
  isRead?: boolean;
  type?: 'price' | 'change' | 'volume';
  limit?: number;
  offset?: number;
}

export async function getAlerts(query: AlertsQuery = {}) {
  const {
    isRead,
    type,
    limit = 50,
    offset = 0
  } = query;

  let queryBuilder = supabase
    .from('alerts')
    .select('*', { count: 'exact' });

  if (isRead !== undefined) {
    queryBuilder = queryBuilder.eq('is_read', isRead);
  }

  if (type) {
    queryBuilder = queryBuilder.eq('type', type);
  }

  queryBuilder = queryBuilder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    data: data as Alert[],
    count: count || 0,
    hasMore: (count || 0) > offset + limit
  };
}

export async function createAlert(alert: {
  symbol: string;
  message: string;
  type: 'price' | 'change' | 'volume';
}) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();

  if (error) throw error;
  return data as Alert;
}

export async function markAlertAsRead(id: string) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function markAllAlertsAsRead() {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw error;
}

export async function deleteAlert(id: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
