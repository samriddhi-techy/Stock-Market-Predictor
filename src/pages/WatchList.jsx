import React, { useState, useEffect } from 'react';
import './WatchList.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample watchlist data structure
  const initialWatchlist = [
    { symbol: 'AAPL', name: 'Apple Inc', marketCap: '2.6T' },
    { symbol: 'MSFT', name: 'Microsoft', marketCap: '2.9T' },
    { symbol: 'TSLA', name: 'Tesla', marketCap: '788B' },
    { symbol: 'AMZN', name: 'Amazon', marketCap: '1.5T' },
    { symbol: 'NVDA', name: 'NVIDIA', marketCap: '1.2T' }
  ];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Replace with your actual API key
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        
        // Fetch data for each stock in watchlist
        const updatedWatchlist = await Promise.all(
          initialWatchlist.map(async (stock) => {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`
            );
            const data = await response.json();
            
            // Generate random prediction for demo purposes
            const changePercent = parseFloat(data['Global Quote']['10. change percent'] || '0');
            const prediction = generatePrediction(changePercent);
            
            return {
              ...stock,
              price: data['Global Quote']['05. price'] || 'N/A',
              change: data['Global Quote']['10. change percent'] || '0%',
              prediction: prediction.text,
              trend: prediction.trend
            };
          })
        );
        
        setWatchlist(updatedWatchlist);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Helper function to generate prediction (mock for demo)
  const generatePrediction = (changePercent) => {
    const absChange = Math.abs(changePercent);
    if (absChange > 3) {
      return { text: `${changePercent.toFixed(1)}% Bullish`, trend: 'bullish' };
    } else if (absChange > 1) {
      return { text: `${changePercent.toFixed(1)}% Neutral`, trend: 'neutral' };
    } else {
      return { text: `${changePercent.toFixed(1)}% Bearish`, trend: 'bearish' };
    }
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedWatchlist = React.useMemo(() => {
    if (!sortConfig.key) return watchlist;
    
    return [...watchlist].sort((a, b) => {
      // Special handling for price (remove $ and parse as number)
      if (sortConfig.key === 'price') {
        const aValue = parseFloat(a.price.replace('$', ''));
        const bValue = parseFloat(b.price.replace('$', ''));
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Special handling for change (remove % and parse as number)
      if (sortConfig.key === 'change') {
        const aValue = parseFloat(a.change.replace('%', ''));
        const bValue = parseFloat(b.change.replace('%', ''));
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default string comparison
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [watchlist, sortConfig]);

  if (loading) {
    return <div className="loading">Loading watchlist data...</div>;
  }

  return (
    <div className="watchlist">
      <h1>Watchlist</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>
                Company {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('symbol')}>
                Ticker {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('price')}>
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('change')}>
                24h Change Prediction {sortConfig.key === 'change' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedWatchlist.map((stock, index) => (
              <React.Fragment key={stock.symbol}>
                <tr>
                  <td>{stock.name}</td>
                  <td>{stock.symbol}</td>
                  <td>${stock.price}</td>
                  <td className={`prediction ${stock.trend}`}>
                    {stock.prediction}
                  </td>
                </tr>
                <tr className="market-cap-row">
                  <td colSpan="4">Market Cap: ${stock.marketCap}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="sort-note">Sort by clicking headers</div>
    </div>
  );
}

export default Watchlist;