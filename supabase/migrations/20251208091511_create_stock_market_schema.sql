/*
  # Stock Market Intelligence Database Schema

  ## Overview
  This migration creates the complete database schema for a stock market intelligence platform
  with authentication, watchlists, trade history, and alerts.

  ## New Tables
  
  ### 1. `stocks`
  Stores stock market data and AI predictions
  - `symbol` (text, primary key) - Stock ticker symbol (e.g., AAPL)
  - `name` (text) - Company name
  - `price` (decimal) - Current price
  - `change` (decimal) - Price change
  - `change_percent` (decimal) - Percentage change
  - `volume` (text) - Trading volume
  - `market_cap` (text) - Market capitalization
  - `prediction` (decimal) - AI predicted price
  - `confidence` (decimal) - Prediction confidence (0-1)
  - `last_updated` (timestamptz) - Last data update
  
  ### 2. `user_profiles`
  Extended user profile information
  - `id` (uuid, primary key, references auth.users)
  - `name` (text) - Full name
  - `bio` (text) - User biography
  - `location` (text) - User location
  - `phone` (text) - Phone number
  - `avatar_url` (text) - Avatar image URL
  - `created_at` (timestamptz) - Profile creation date
  - `updated_at` (timestamptz) - Last profile update
  
  ### 3. `watchlist`
  User's stock watchlist with alerts
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `symbol` (text, references stocks)
  - `target_price` (decimal, nullable) - Target price alert
  - `alerts_enabled` (boolean) - Whether alerts are active
  - `price_alert` (boolean) - Price target alerts
  - `change_alert` (boolean) - Price change alerts
  - `added_at` (timestamptz) - When added to watchlist
  
  ### 4. `trades`
  User's trade history
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `symbol` (text, references stocks)
  - `type` (text) - 'buy' or 'sell'
  - `quantity` (integer) - Number of shares
  - `price` (decimal) - Price per share
  - `total` (decimal) - Total transaction amount
  - `status` (text) - 'completed', 'pending', or 'cancelled'
  - `profit` (decimal, nullable) - Profit/loss for sell trades
  - `created_at` (timestamptz) - Trade timestamp
  
  ### 5. `alerts`
  System alerts and notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `symbol` (text, references stocks)
  - `message` (text) - Alert message
  - `type` (text) - 'price', 'change', or 'volume'
  - `is_read` (boolean) - Whether user has read the alert
  - `created_at` (timestamptz) - Alert creation time
  
  ### 6. `user_preferences`
  User notification and settings preferences
  - `user_id` (uuid, primary key, references auth.users)
  - `price_alerts` (boolean) - Enable price alerts
  - `market_news` (boolean) - Enable market news
  - `portfolio_updates` (boolean) - Enable portfolio updates
  - `weekly_reports` (boolean) - Enable weekly reports
  - `email_notifications` (boolean) - Enable email notifications
  - `push_notifications` (boolean) - Enable push notifications
  - `updated_at` (timestamptz) - Last settings update

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Stocks table is readable by all authenticated users
  - Proper authentication checks using auth.uid()
*/

-- Create stocks table (public reference data)
CREATE TABLE IF NOT EXISTS stocks (
  symbol text PRIMARY KEY,
  name text NOT NULL,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  change decimal(10, 2) NOT NULL DEFAULT 0,
  change_percent decimal(5, 2) NOT NULL DEFAULT 0,
  volume text NOT NULL DEFAULT '0',
  market_cap text NOT NULL DEFAULT '0',
  prediction decimal(10, 2) NOT NULL DEFAULT 0,
  confidence decimal(3, 2) NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stocks are viewable by all authenticated users"
  ON stocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert stocks"
  ON stocks FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Only admins can update stocks"
  ON stocks FOR UPDATE
  TO authenticated
  USING (false);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL REFERENCES stocks(symbol) ON DELETE CASCADE,
  target_price decimal(10, 2),
  alerts_enabled boolean DEFAULT true,
  price_alert boolean DEFAULT false,
  change_alert boolean DEFAULT true,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL REFERENCES stocks(symbol),
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  quantity integer NOT NULL CHECK (quantity > 0),
  price decimal(10, 2) NOT NULL CHECK (price > 0),
  total decimal(12, 2) NOT NULL CHECK (total > 0),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  profit decimal(12, 2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades"
  ON trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades"
  ON trades FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL REFERENCES stocks(symbol),
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('price', 'change', 'volume')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  price_alerts boolean DEFAULT true,
  market_news boolean DEFAULT true,
  portfolio_updates boolean DEFAULT true,
  weekly_reports boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_symbol ON watchlist(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);

-- Insert sample stock data
INSERT INTO stocks (symbol, name, price, change, change_percent, volume, market_cap, prediction, confidence, last_updated)
VALUES
  ('AAPL', 'Apple Inc.', 175.43, 2.31, 1.33, '64.2M', '2.78T', 182.15, 0.78, now()),
  ('GOOGL', 'Alphabet Inc.', 138.21, -1.87, -1.34, '29.8M', '1.75T', 145.30, 0.65, now()),
  ('MSFT', 'Microsoft Corporation', 378.85, 4.23, 1.13, '22.1M', '2.81T', 395.20, 0.82, now()),
  ('TSLA', 'Tesla Inc.', 248.42, -8.91, -3.46, '89.7M', '790B', 267.80, 0.59, now()),
  ('AMZN', 'Amazon.com Inc.', 151.94, 1.76, 1.17, '41.3M', '1.58T', 165.45, 0.71, now()),
  ('NVDA', 'NVIDIA Corporation', 456.78, 12.34, 2.78, '35.2M', '1.12T', 485.20, 0.85, now()),
  ('META', 'Meta Platforms Inc.', 298.65, -5.43, -1.79, '18.9M', '752B', 315.80, 0.68, now())
ON CONFLICT (symbol) DO NOTHING;
