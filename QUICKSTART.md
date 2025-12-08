# Quick Start Guide

Get your Stock Market Intelligence platform running in 5 minutes!

## Step 1: Get Supabase Credentials

1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Wait for it to finish setting up (2-3 minutes)
4. Go to **Project Settings** > **API**
5. Copy:
   - Project URL
   - anon/public key

## Step 2: Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual credentials from Step 1.

## Step 3: Install and Run

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 4: Test the Application

1. Click "Sign Up" and create an account
2. Browse stocks on the dashboard
3. Add stocks to your watchlist
4. Create sample trades
5. Explore all features!

## Database Note

The database schema and sample data are already set up in your Supabase project. No manual database configuration needed!

## Deployment (Optional)

### Deploy to Vercel (5 minutes)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project" and import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

Done! Your app is live on the internet.

## Troubleshooting

**Can't connect to database?**
- Verify your Supabase URL and anon key are correct
- Check that you created `.env.local` in the project root
- Restart the development server with `npm run dev`

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Make sure Node.js 18+ is installed

**Authentication not working?**
- Confirm environment variables are set correctly
- Clear your browser cache and cookies
- Try using an incognito/private window

## Features Overview

- **Dashboard**: View stock prices, charts, and AI predictions
- **Watchlist**: Track your favorite stocks with price alerts
- **Trade History**: Record and analyze your trades
- **Profile**: Manage your account and preferences
- **AI Chatbot**: Get trading insights and market analysis

## What's Next?

- Explore the codebase in `SETUP.md` for detailed documentation
- Review `IMPLEMENTATION_SUMMARY.md` for architecture details
- Customize the design and add your own features
- Deploy to production and share with others!

---

Need help? Check the troubleshooting section in `SETUP.md` or the Supabase documentation at https://supabase.com/docs
