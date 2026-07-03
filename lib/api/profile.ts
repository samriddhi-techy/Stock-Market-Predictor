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
  if (!userId) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  if (!userId) throw new Error('No user ID provided');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getUserPreferences() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserPreferences | null;
}

export async function createUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({ 
      user_id: userId,
      price_alerts: true,
      market_news: true,
      portfolio_updates: true,
      weekly_reports: false,
      email_notifications: true,
      push_notifications: true
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}

export async function updateUserPreferences(updates: Partial<Omit<UserPreferences, 'user_id' | 'updated_at'>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}
