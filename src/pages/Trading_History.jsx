import React, { useState, useEffect } from 'react';
import './Trading_History.css';

function TradingHistory() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30D');
  const [assetFilter, setAssetFilter] = useState('ALL');

  useEffect(() => {
    // Simulate API call with timeout
    const fetchTradingHistory = async () => {
      try {
        // Mock data - in a real app, you would fetch from your brokerage API
        const mockTrades = [
          {
            id: 1,
            date: '2024-01-15',
            asset: 'AAPL',
            type: 'Stock',
            action: 'Buy',
            quantity: 100,
            price: 185.92,
            profitLoss: 1250
          },
          {
            id: 2,
            date: '2024-01-14',
            asset: 'BTC',
            type: 'Crypto',
            action: 'Sell',
            quantity: 0.5,
            price: 42800,
            profitLoss: -800
          },
          {
            id: 3,
            date: '2024-01-12',
            asset: 'NVDA',
            type: 'Stock',
            action: 'Buy',
            quantity: 50,
            price: 547.1,
            profitLoss: 3200
          },
          {
            id: 4,
            date: '2024-01-10',
            asset: 'ETH',
            type: 'Crypto',
            action: 'Sell',
            quantity: 2,
            price: 2580,
            profitLoss: 450
          },
          {
            id: 5,
            date: '2024-01-08',
            asset: 'MSFT',
            type: 'Stock',
            action: 'Sell',
            quantity: 75,
            price: 390.27,
            profitLoss: 2800
          },
          {
            id: 6,
            date: '2024-01-05',
            asset: 'TSLA',
            type: 'Stock',
            action: 'Buy',
            quantity: 25,
            price: 248.42,
            profitLoss: -350
          },
          {
            id: 7,
            date: '2024-01-03',
            asset: 'SOL',
            type: 'Crypto',
            action: 'Sell',
            quantity: 5,
            price: 98.75,
            profitLoss: 1200
          }
        ];
        
        // Apply time filter (mock implementation)
        let filteredTrades = [...mockTrades];
        if (timeFilter === '7D') {
          filteredTrades = filteredTrades.slice(0, 3);
        } else if (timeFilter === '30D') {
          filteredTrades = filteredTrades.slice(0, 5);
        }
        
        // Apply asset filter
        if (assetFilter !== 'ALL') {
          filteredTrades = filteredTrades.filter(trade => trade.type === assetFilter);
        }
        
        setTrades(filteredTrades);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trading history:', error);
        setLoading(false);
      }
    };

    fetchTradingHistory();
  }, [timeFilter, assetFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCrypto = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(value);
  };

  if (loading) {
    return <div className="loading">Loading trading history...</div>;
  }

  return (
    <div className="trading-history">
      <h2>Trading History</h2>
      
      <div className="history-filters">
        <div className="filter-group">
          <label>Time Period:</label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last 90 Days</option>
            <option value="ALL">All Time</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Asset Type:</label>
          <select value={assetFilter} onChange={(e) => setAssetFilter(e.target.value)}>
            <option value="ALL">All Assets</option>
            <option value="Stock">Stocks</option>
            <option value="Crypto">Cryptocurrencies</option>
          </select>
        </div>
      </div>
      
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id}>
                <td>{trade.date}</td>
                <td>{trade.asset}</td>
                <td>{trade.type}</td>
                <td>
                  <span className={`action ${trade.action.toLowerCase()}`}>
                    {trade.action}
                  </span>
                </td>
                <td>{trade.type === 'Crypto' ? formatCrypto(trade.quantity) : trade.quantity}</td>
                <td>{formatCurrency(trade.price)}</td>
                <td className={trade.profitLoss >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(trade.profitLoss)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {trades.length === 0 && (
          <div className="no-results">No trades found for the selected filters</div>
        )}
      </div>
      
      <div className="history-summary">
        <div className="summary-item">
          <span>Total Trades:</span>
          <span>{trades.length}</span>
        </div>
        <div className="summary-item">
          <span>Net Profit/Loss:</span>
          <span className={
            trades.reduce((sum, trade) => sum + trade.profitLoss, 0) >= 0 ? 'positive' : 'negative'
          }>
            {formatCurrency(trades.reduce((sum, trade) => sum + trade.profitLoss, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TradingHistory;