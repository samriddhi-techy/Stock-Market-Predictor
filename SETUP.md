# Stock Market Intelligence Platform - Setup Guide

This is a full-stack stock market intelligence platform with authentication, database, and dynamic data fetching capabilities.

## Features

- **Authentication & Authorization**: Secure user authentication with Supabase Auth
- **Database**: PostgreSQL database with Row Level Security (RLS)
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for all resources
- **Advanced Querying**: Filtering, searching, sorting, and pagination
- **Real-time Data**: Dynamic fetching of stock data, watchlists, and trade history
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **UI Components**: shadcn/ui, Recharts for data visualization
- **Deployment**: Vercel (Frontend), Supabase (Backend & Database)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available at https://supabase.com)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at https://supabase.com
2. Go to Project Settings > API
3. Copy your Project URL and anon/public key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholders with your actual Supabase credentials.

### 5. Database Setup

The database schema has already been created with the migration. It includes:

- **stocks**: Stock market data with AI predictions
- **user_profiles**: Extended user information
- **watchlist**: User's stock watchlist with alerts
- **trades**: Trade history and transactions
- **alerts**: Price and market alerts
- **user_preferences**: User notification settings

All tables have Row Level Security (RLS) enabled for data protection.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for Production

```bash
npm run build
```

## API Reference

### Authentication

- `signUp(email, password, name)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user

### Stocks

- `getStocks(query)` - Get all stocks with filtering/sorting/pagination
  - Query params: `search`, `sortBy`, `sortOrder`, `limit`, `offset`
- `getStock(symbol)` - Get single stock by symbol
- `getStocksBySymbols(symbols[])` - Get multiple stocks

### Watchlist

- `getWatchlist(query)` - Get user's watchlist with filtering
- `addToWatchlist(symbol, options)` - Add stock to watchlist
- `updateWatchlistItem(id, updates)` - Update watchlist item
- `removeFromWatchlist(id)` - Remove from watchlist
- `isInWatchlist(symbol)` - Check if stock is in watchlist

### Trades

- `getTrades(query)` - Get trade history with filtering
  - Query params: `search`, `type`, `status`, `sortBy`, `sortOrder`, `limit`, `offset`, `dateFrom`, `dateTo`
- `createTrade(trade)` - Create new trade
- `updateTrade(id, updates)` - Update trade status/profit
- `deleteTrade(id)` - Delete trade
- `getTradeStats()` - Get aggregated trade statistics

### Alerts

- `getAlerts(query)` - Get user alerts with filtering
- `createAlert(alert)` - Create new alert
- `markAlertAsRead(id)` - Mark alert as read
- `markAllAlertsAsRead()` - Mark all alerts as read
- `deleteAlert(id)` - Delete alert

### User Profile

- `getUserProfile(userId?)` - Get user profile
- `createUserProfile(profile)` - Create user profile
- `updateUserProfile(updates)` - Update user profile
- `getUserPreferences()` - Get notification preferences
- `updateUserPreferences(updates)` - Update preferences

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Database (Supabase)

Your Supabase database is already hosted and managed by Supabase. No additional deployment needed.

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## Security Features

- **Row Level Security (RLS)**: All tables have RLS policies
- **Authentication Required**: Most operations require authentication
- **User Isolation**: Users can only access their own data
- **Secure Passwords**: Minimum 6 characters enforced
- **SQL Injection Protection**: Using parameterized queries
- **XSS Protection**: React's built-in XSS protection

## Database Schema

### stocks
- Stock ticker symbols (AAPL, GOOGL, etc.)
- Real-time price data
- AI predictions and confidence scores
- Public read access for authenticated users

### user_profiles
- Extended user information beyond auth
- Bio, location, phone, avatar
- User can only access their own profile

### watchlist
- User's tracked stocks
- Target prices and alerts
- Unique constraint per user-symbol pair

### trades
- Complete trade history
- Buy/sell transactions
- Profit/loss tracking
- Status management (completed, pending, cancelled)

### alerts
- Price and market alerts
- Read/unread status
- Type categorization (price, change, volume)

### user_preferences
- Notification settings
- Email and push notification preferences
- Market news and report subscriptions

## Features Breakdown

### Authentication & Authorization
- Email/password authentication
- Automatic profile creation on signup
- Secure session management
- Protected routes and API endpoints

### CRUD Operations
- **Create**: Add stocks to watchlist, create trades, generate alerts
- **Read**: View stocks, watchlist, trade history, alerts
- **Update**: Edit watchlist items, update trade status, mark alerts as read
- **Delete**: Remove watchlist items, delete trades and alerts

### Filtering & Searching
- Search stocks by symbol or company name
- Filter trades by type (buy/sell) and status
- Filter alerts by read status and type
- Date range filtering for trade history

### Sorting
- Sort stocks by price, change, symbol
- Sort trades by date, total, profit
- Sort watchlist by date added or symbol

### Pagination
- Configurable page sizes (limit parameter)
- Offset-based pagination
- Total count for UI pagination controls
- "Has more" indicator

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
Run `npm install` to install dependencies.

### "Invalid JWT" or Authentication Errors
1. Check that your Supabase URL and keys are correct in `.env.local`
2. Make sure you're using the anon key, not the service role key
3. Restart the development server after changing environment variables

### Database Connection Errors
1. Verify your Supabase project is active
2. Check that the database migration was applied
3. Ensure your IP is allowed in Supabase settings (or disable IP restrictions for development)

### Build Errors
1. Run `npm run build` to see detailed error messages
2. Check that all dependencies are installed
3. Verify TypeScript types are correct

## Support

For issues or questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review Next.js documentation: https://nextjs.org/docs
3. Check the console for error messages
