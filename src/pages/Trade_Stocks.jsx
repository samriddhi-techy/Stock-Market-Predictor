import React, { useState, useEffect } from 'react';
import './Trade_Stocks.css';

function TradeStocks() {
  const [action, setAction] = useState('buy');
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch popular stocks from Alpha Vantage
    const fetchStockList = async () => {
      try {
        // Replace with your actual API key
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        
        // Fetch top tech stocks (mock implementation)
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];
        
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
            );
            const data = await response.json();
            return {
              symbol,
              name: getStockName(symbol),
              price: parseFloat(data['Global Quote']['05. price'] || 0)
            };
          })
        );
        
        setStocks(stockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockList();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      // In a real app, you would fetch the latest price here
      const stock = stocks.find(s => s.symbol === selectedStock);
      if (stock) {
        setPrice(stock.price);
      }
    }
  }, [selectedStock, stocks]);

  const getStockName = (symbol) => {
    const names = {
      AAPL: 'Apple Inc.',
      MSFT: 'Microsoft',
      GOOGL: 'Alphabet',
      AMZN: 'Amazon',
      TSLA: 'Tesla',
      META: 'Meta'
    };
    return names[symbol] || symbol;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value >= 0 ? value : 0);
  };

  const calculateTotal = () => {
    return (quantity * price).toFixed(2);
  };

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  return (
    <div className="trade-container">
      <h1>Trade Stocks</h1>
      
      <div className="action-selector">
        <button
          className={`action-btn ${action === 'buy' ? 'active' : ''}`}
          onClick={() => setAction('buy')}
        >
          Buy
        </button>
        <button
          className={`action-btn ${action === 'sell' ? 'active' : ''}`}
          onClick={() => setAction('sell')}
        >
          Sell
        </button>
      </div>
      
      <div className="trade-form">
        <div className="form-group">
          <label>Select Stock</label>
          <div className="dropdown">
            <select
              value={selectedStock || ''}
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              <option value="">Choose a stock</option>
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Quantity (Shares)</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        
        <div className="price-info">
          <div className="price-row">
            <span>Market Price</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Estimated Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
        
        <button className="review-btn">
          Review Order
        </button>
      </div>
    </div>
  );
}

export default TradeStocks;