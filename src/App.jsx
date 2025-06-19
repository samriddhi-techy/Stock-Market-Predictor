import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css'
import Landing_Page from './pages/Landing_Page'
import Welcome_Page from './pages/Welcome_Page'
import Account_Type_Selection from './pages/Account_Type_Selection'
import Create_Account from './pages/Create_Account'
import LoginPage from './pages/Login_Page'
import Welcome_Back_Page from './pages/Welcome_Back_Page'
import Hero_Section from './pages/Hero_Section'
import MarketOverview from './pages/Market_Overview'
import StockDetail from './pages/Stock_Details'
import Watchlist from './pages/WatchList'
import CryptoDashboard from './pages/Crypto_Dashboard'
import Dashboard from './pages/Dashboard'
import PortfolioOverview from './pages/Portfolio_Overview'
import TradeStocks from './pages/Trade_Stocks'
import MarketPredictor from './pages/Market_Predictor'
import MarketDashboard from './pages/Market_Dashboard'
import UserProfile from './pages/User_Profile'
import TradingHistory from './pages/Trading_History'
import ChatBot from './pages/components/ChatBot';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
       <Route path="/landing-page" element={<Landing_Page/>} />
       <Route path="/welcome-page" element={<Welcome_Page/>} />
       <Route path="/account-type" element={<Account_Type_Selection />} />
       <Route path="/create-account" element={<Create_Account/>} />
       <Route path="/login" element={<LoginPage/>} />
       <Route path="/welcome-back-page" element={<Welcome_Back_Page/>} />
       <Route path="/hero-section" element={<Hero_Section/>} />
       <Route path="/market-overview" element={<MarketOverview/>} />
       <Route path="/stock-details" element={<StockDetail/>} />
       <Route path="/watchlist" element={<Watchlist/>} />
       <Route path="/crypto-dashboard" element={<CryptoDashboard/>} />
       <Route path="/dashboard" element={<Dashboard/>} />
       <Route path="/portfolio-overview" element={<PortfolioOverview/>} />
       <Route path="/trade-stocks" element={<TradeStocks/>} />
       <Route path="/market-preditor" element={<MarketPredictor/>} />
       <Route path="/market-dashboard" element={<MarketDashboard/>} />
       <Route path="/user-profile" element={<UserProfile/>} />
       <Route path="/trading-history" element={<TradingHistory/>} />
       <Route path="/chatbot" element={<ChatBot />} />
    </Routes>
  )
}

export default App;
