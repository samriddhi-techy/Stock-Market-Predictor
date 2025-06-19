import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './Stock_Details.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function StockDetail() {
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('1M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stock data from Alpha Vantage API
    const fetchStockData = async () => {
      try {
        // Replace with your actual API key
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        
        // Fetch quote data
        const quoteResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${apiKey}`
        );
        const quoteData = await quoteResponse.json();
        
        // Fetch time series data for chart
        const chartResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&outputsize=compact&apikey=${apiKey}`
        );
        const chartData = await chartResponse.json();
        
        // Process the data
        const processedStockData = {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: quoteData['Global Quote']['05. price'],
          change: quoteData['Global Quote']['09. change'],
          changePercent: quoteData['Global Quote']['10. change percent'],
          previousClose: quoteData['Global Quote']['08. previous close'],
          exchange: 'NASDAQ',
          sector: 'Technology',
          marketStatus: 'Market Open',
          hours: 'EST 09:30 - 16:00'
        };
        
        // Process chart data
        const timeSeries = chartData['Time Series (Daily)'];
        const labels = Object.keys(timeSeries).reverse();
        const prices = labels.map(date => parseFloat(timeSeries[date]['4. close']));
        
        setStockData(processedStockData);
        setChartData({
          labels: labels,
          datasets: [{
            label: 'AAPL Price',
            data: prices,
            borderColor: '#0066cc',
            tension: 0.1,
            pointRadius: 0
          }]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [timeRange]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stockData || !chartData) {
    return <div className="error">Error loading stock data</div>;
  }

  const isPositive = parseFloat(stockData.change) >= 0;

  return (
    <div className="stock-detail">
      <header className="stock-header">
        <h1>{stockData.name}</h1>
        <div className="stock-meta">
          <span>{stockData.exchange} - {stockData.sector}</span>
          <span>{stockData.marketStatus}</span>
          <span>{stockData.hours}</span>
        </div>
      </header>

      <div className="stock-price-section">
        <div className="current-price">${stockData.price}</div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{stockData.change} ({stockData.changePercent})
        </div>
        <div className="previous-close">vs Previous Close ${stockData.previousClose}</div>
      </div>

      <div className="stock-chart">
        {chartData && (
          <Line 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  display: false
                },
                y: {
                  display: false
                }
              }
            }}
          />
        )}
      </div>

      <div className="time-range-selector">
        <button 
          className={timeRange === '1D' ? 'active' : ''}
          onClick={() => setTimeRange('1D')}
        >
          1D
        </button>
        <button 
          className={timeRange === '1W' ? 'active' : ''}
          onClick={() => setTimeRange('1W')}
        >
          1W
        </button>
        <button 
          className={timeRange === '1M' ? 'active' : ''}
          onClick={() => setTimeRange('1M')}
        >
          1M
        </button>
        <button 
          className={timeRange === '3M' ? 'active' : ''}
          onClick={() => setTimeRange('3M')}
        >
          3M
        </button>
        <button 
          className={timeRange === '1Y' ? 'active' : ''}
          onClick={() => setTimeRange('1Y')}
        >
          1Y
        </button>
      </div>
    </div>
  );
}

export default StockDetail;