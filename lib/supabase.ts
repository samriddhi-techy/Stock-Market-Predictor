import { createClient } from '@supabase/supabase-js';

const SUPABASE_PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const SUPABASE_PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_PLACEHOLDER_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PLACEHOLDER_KEY;

export const isSupabaseConfigured = supabaseUrl !== SUPABASE_PLACEHOLDER_URL && 
                                  supabaseAnonKey !== SUPABASE_PLACEHOLDER_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      stocks: {
        Row: {
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
        };
      };
      user_profiles: {
        Row: {
          id: string;
          name: string;
          bio: string;
          location: string;
          phone: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          target_price: number | null;
          alerts_enabled: boolean;
          price_alert: boolean;
          change_alert: boolean;
          added_at: string;
        };
      };
      trades: {
        Row: {
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
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          message: string;
          type: 'price' | 'change' | 'volume';
          is_read: boolean;
          created_at: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          price_alerts: boolean;
          market_news: boolean;
          portfolio_updates: boolean;
          weekly_reports: boolean;
          email_notifications: boolean;
          push_notifications: boolean;
          updated_at: string;
        };
      };
    };
  };
};
