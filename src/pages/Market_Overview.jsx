import React, { useState } from 'react';
import './Market_Overview.css';

function MarketOverview() {
  const [searchQuery, setSearchQuery] = useState('');

  const stocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: '$182.89',
      change: '+3.5%',
      sector: 'Technology',
      volume: '45.2M'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: '$338.11',
      change: '+1.2%',
      sector: 'Technology',
      volume: '22.1M'
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan',
      price: '$146.45',
      change: '-0.8%',
      sector: 'Finance',
      volume: '8.4M'
    },
    {
      symbol: 'CVX',
      name: 'Chevron',
      price: '$152.24',
      change: '+2.1%',
      sector: 'Energy',
      volume: '5.9M'
    }
  ];

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="market-overview">
      <header className="market-header">
        <h1>Market Overview</h1>
        <p className="subtitle">Track and analyze your favorite stocks</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stocks-list">
        {filteredStocks.map((stock, index) => (
          <div key={index} className="stock-card">
            <div className="stock-header">
              <h2 className="stock-symbol">{stock.symbol}</h2>
              <div className="stock-name">{stock.name}</div>
            </div>
            <div className="stock-price">{stock.price}</div>
            <div className={`stock-change ${stock.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stock.change}
            </div>
            <div className="stock-details">
              <div className="stock-sector">{stock.sector}</div>
              <div className="stock-volume">Vol: {stock.volume}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketOverview;