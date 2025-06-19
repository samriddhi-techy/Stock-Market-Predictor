import React from 'react';
import './Hero_Section.css';

function Hero_Section() {
  // Sample data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const topMovers = [
    { name: 'BTC Bitcoin', price: '$43,250.00', change: '+8.4%', volume: '$2.1B' },
    { name: 'ETH Ethereum', price: '$2,850.00', change: '+6.2%', volume: '$1.8B' },
    { name: 'SOL Solana', price: '$98.75', change: '-3.8%', volume: '$854M' },
    { name: 'AVAX Avalanche', price: '$36.20', change: '+5.1%', volume: '$445M' },
    { name: 'MATIC Polygon', price: '$0.85', change: '+4.2%', volume: '$332M' }
  ];

  return (
    <div className="portfolio-dashboard">
      {/* Portfolio Value Section */}
      <div className="portfolio-header">
        <h2>Portfolio Value</h2>
        <div className="portfolio-value">$284,750.25</div>
        <div className="performance">
          <span className="positive">+12.8%</span>
          <span className="positive">+$32,299.50</span>
        </div>
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        {months.map((month, index) => (
          <div key={index} className={`month ${index === 5 ? 'active' : ''}`}>
            {month}
          </div>
        ))}
      </div>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        <div className="timeframe active">24h</div>
        <div className="timeframe">7d</div>
        <div className="timeframe">1m</div>
        <div className="timeframe">1y</div>
        <div className="timeframe">All</div>
      </div>

      {/* Market Data Section */}
      <div className="market-data">
        <div className="market-card">
          <h3>Market Prediction</h3>
          <div className="prediction bullish">
            Bullish <span className="arrow">▲</span>
          </div>
        </div>

        <div className="market-card">
          <h3>Confidence Score</h3>
          <div className="confidence">85%</div>
        </div>

        <div className="market-card">
          <h3>Volume</h3>
          <div className="volume">$4.2B</div>
        </div>

        <div className="market-card">
          <h3>Volatility</h3>
          <div className="volatility">Medium</div>
        </div>
      </div>

      {/* Top Movers Section */}
      <div className="top-movers">
        <div className="section-header">
          <h3>Top Movers</h3>
          <button className="view-all">View All</button>
        </div>

        <div className="movers-list">
          {topMovers.map((asset, index) => (
            <div key={index} className="asset-card">
              <div className="asset-info">
                <div className="asset-name">{asset.name}</div>
                <div className="asset-price">{asset.price}</div>
              </div>
              <div className="asset-stats">
                <div className={`asset-change ${asset.change.includes('+') ? 'positive' : 'negative'}`}>
                  {asset.change}
                </div>
                <div className="asset-volume">Vol: {asset.volume}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero_Section;