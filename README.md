# Stock Market Intelligence Platform

A full-stack, production-ready stock market intelligence platform with AI-powered predictions, real-time data, and comprehensive portfolio management.

![Stock Market Intelligence](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop)

## Features

### Backend
- **Authentication & Authorization**: Secure user authentication with Supabase
- **CRUD Operations**: Complete data management for stocks, trades, watchlists, and alerts
- **Advanced Querying**: Filtering, searching, sorting, and pagination on all resources
- **Row Level Security**: Database-level security ensuring data privacy

### Database
- **PostgreSQL**: Relational database with proper schema design
- **Supabase Hosted**: Fully managed, scalable database solution
- **RLS Policies**: User data isolation and security
- **Sample Data**: Pre-populated with stock market data

### Frontend
- **Multi-Page Application**: Dashboard, watchlist, profile, trade history, AI chatbot
- **Dynamic Data Fetching**: Real-time updates from Supabase
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with Next.js, React, TailwindCSS, and shadcn/ui

## Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup and configuration guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete technical documentation

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **UI Components**: shadcn/ui, Recharts
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Project Structure

```
/
├── app/                    # Next.js pages
├── components/             # React components
├── contexts/               # React contexts (Auth)
├── lib/                    # Utilities and API
│   ├── api/               # API modules
│   └── supabase.ts        # Database client
├── .env.local             # Environment variables
└── docs/                  # Documentation
```

## Key Capabilities

### Authentication & Authorization
- Email/password authentication
- Secure session management
- Automatic profile creation
- Row-level data security

### CRUD Operations
- **Create**: Add stocks to watchlist, record trades, create alerts
- **Read**: View stocks, watchlists, trade history, user profiles
- **Update**: Modify watchlist items, update trade status, change preferences
- **Delete**: Remove watchlist items, delete trades and alerts

### Advanced Querying
- **Filtering**: By type, status, date ranges, symbols
- **Searching**: Full-text search on symbols and company names
- **Sorting**: By price, date, profit, volume, and more
- **Pagination**: Configurable page sizes with total counts

## Screenshots

### Dashboard
Real-time stock data with AI predictions and interactive charts.

### Watchlist
Track favorite stocks with custom price alerts and notifications.

### Trade History
Complete transaction history with advanced filtering and sorting.

### Profile
Manage account settings and notification preferences.

### AI Chatbot
Get instant market insights and trading recommendations.

## Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

- **stocks**: Stock market data with AI predictions
- **user_profiles**: Extended user information
- **watchlist**: User's tracked stocks with alerts
- **trades**: Buy/sell transaction history
- **alerts**: Price and market notifications
- **user_preferences**: Notification settings

All tables include Row Level Security (RLS) policies.

## API Reference

### Authentication
- `signUp(email, password, name)`
- `signIn(email, password)`
- `signOut()`
- `getCurrentUser()`

### Stocks
- `getStocks(query)` - with filtering, sorting, pagination
- `getStock(symbol)`
- `getStocksBySymbols(symbols[])`

### Watchlist
- `getWatchlist(query)`
- `addToWatchlist(symbol, options)`
- `updateWatchlistItem(id, updates)`
- `removeFromWatchlist(id)`

### Trades
- `getTrades(query)` - with filtering, sorting, pagination
- `createTrade(trade)`
- `updateTrade(id, updates)`
- `deleteTrade(id)`
- `getTradeStats()`

### More APIs
See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for complete API documentation.

## Security

- Row Level Security (RLS) on all database tables
- JWT-based authentication
- Secure password hashing (handled by Supabase)
- SQL injection protection
- XSS protection via React
- Environment variable security

## Performance

- Database indexes on frequently queried columns
- Pagination to prevent excessive data loading
- Static page generation where possible
- Code splitting and lazy loading
- Optimized production builds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a production-ready template. Feel free to:
- Customize the design
- Add new features
- Integrate with real stock market APIs
- Deploy for your own use

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

- **Issues**: Check troubleshooting section in SETUP.md
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **Deployment**: See SETUP.md

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)

---

Made with care for production use. Start building your stock market platform today!
