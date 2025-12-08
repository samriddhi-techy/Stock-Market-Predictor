import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  location: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  price_alerts: boolean;
  market_news: boolean;
  portfolio_updates: boolean;
  weekly_reports: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  updated_at: string;
}

export async function getUserProfile(userId?: string) {
  let query = supabase.from('user_profiles').select('*');

  if (userId) {
    query = query.eq('id', userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

export async function createUserProfile(profile: {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(updates: {
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getUserPreferences() {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as UserPreferences | null;
}

export async function createUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}

export async function updateUserPreferences(updates: Partial<Omit<UserPreferences, 'user_id' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}
