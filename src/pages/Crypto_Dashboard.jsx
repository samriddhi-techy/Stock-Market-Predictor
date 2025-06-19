import React, { useState, useEffect } from 'react';
import './Crypto_Dashboard.css';

function CryptoDashboard() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [activeView, setActiveView] = useState('overview');
  const [timeframe, setTimeframe] = useState('24h');
  const [cryptoData, setCryptoData] = useState({
    BTC: null,
    ETH: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // Replace with your actual API key
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        
        // Fetch data for Bitcoin
        const btcResponse = await fetch(
          `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${apiKey}`
        );
        const btcData = await btcResponse.json();
        
        // Fetch data for Ethereum
        const ethResponse = await fetch(
          `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=ETH&market=USD&apikey=${apiKey}`
        );
        const ethData = await ethResponse.json();
        
        // Process BTC data
        const btcTimeSeries = btcData['Time Series (Digital Currency Daily)'];
        const btcDates = Object.keys(btcTimeSeries);
        const btcLatest = btcTimeSeries[btcDates[0]];
        const btcPrev = btcTimeSeries[btcDates[1]];
        
        // Process ETH data
        const ethTimeSeries = ethData['Time Series (Digital Currency Daily)'];
        const ethDates = Object.keys(ethTimeSeries);
        const ethLatest = ethTimeSeries[ethDates[0]];
        const ethPrev = ethTimeSeries[ethDates[1]];
        
        setCryptoData({
          BTC: {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: parseFloat(btcLatest['4a. close (USD)']).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            change: calculateChange(btcLatest['4a. close (USD)'], btcPrev['4a. close (USD)']),
            volume: formatVolume(btcLatest['5. volume']),
            marketCap: '$845.2B', // Mock data - Alpha Vantage doesn't provide this
            circulatingSupply: '19.6M', // Mock data
            dominance: '52%', // Mock data
            confidence: '82%', // Mock data
            trend: 'bullish' // Mock data
          },
          ETH: {
            symbol: 'ETH',
            name: 'Ethereum',
            price: parseFloat(ethLatest['4a. close (USD)']).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            change: calculateChange(ethLatest['4a. close (USD)'], ethPrev['4a. close (USD)']),
            volume: formatVolume(ethLatest['5. volume']),
            marketCap: '$270.5B', // Mock data
            circulatingSupply: '120.2M', // Mock data
            dominance: '18%', // Mock data
            confidence: '75%', // Mock data
            trend: 'bullish' // Mock data
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const calculateChange = (current, previous) => {
    const change = ((parseFloat(current) - parseFloat(previous)) / parseFloat(previous)) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const formatVolume = (volume) => {
    const num = parseFloat(volume);
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${num.toFixed(0)}`;
  };

  const getPredictedPrice = (symbol) => {
    // Mock prediction calculation
    const current = parseFloat(cryptoData[symbol].price.replace(/[^0-9.-]+/g, ''));
    const changePercent = parseFloat(cryptoData[symbol].change);
    const predicted = current * (1 + (changePercent / 100));
    return predicted.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return <div className="loading">Loading cryptocurrency data...</div>;
  }

  return (
    <div className="crypto-dashboard">
      <header className="dashboard-header">
        <h1>
          {activeTab === 'comparison' && 'Stock Comparison'}
          {activeTab === 'analysis' && 'Market Analysis'}
        </h1>
        
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'comparison' ? 'active' : ''}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison
          </button>
          <button
            className={activeTab === 'analysis' ? 'active' : ''}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
        </div>
      </header>

      {activeTab === 'comparison' && (
        <div className="comparison-view">
          <div className="view-tabs">
            <button
              className={activeView === 'overview' ? 'active' : ''}
              onClick={() => setActiveView('overview')}
            >
              Overview
            </button>
            <button
              className={activeView === 'prediction' ? 'active' : ''}
              onClick={() => setActiveView('prediction')}
            >
              Prediction
            </button>
            <button
              className={activeView === 'fundamentals' ? 'active' : ''}
              onClick={() => setActiveView('fundamentals')}
            >
              Fundamentals
            </button>
          </div>

          <div className="crypto-cards">
            {['BTC', 'ETH'].map((symbol) => (
              <div key={symbol} className="crypto-card">
                <div className="crypto-header">
                  <div className="symbol">{symbol}</div>
                  <div className="name">{cryptoData[symbol].name}</div>
                </div>

                <div className="price-section">
                  <div className="price">{cryptoData[symbol].price}</div>
                  <div className={`change ${cryptoData[symbol].change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {cryptoData[symbol].change}
                  </div>
                </div>

                {activeView === 'overview' && (
                  <div className="overview-section">
                    <div className="metric">
                      <span className="label">24h Volume:</span>
                      <span className="value">{cryptoData[symbol].volume}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Market Cap:</span>
                      <span className="value">{cryptoData[symbol].marketCap}</span>
                    </div>
                  </div>
                )}

                {activeView === 'prediction' && (
                  <div className="prediction-section">
                    <div className="predicted-price">
                      {getPredictedPrice(symbol)}
                      <span className="predicted-change">
                        Predicted {cryptoData[symbol].change}
                      </span>
                    </div>
                    <div className="confidence">
                      <span className="label">Confidence Score</span>
                      <span className="value">{cryptoData[symbol].confidence}</span>
                    </div>
                    <div className="trend">
                      <span className="label">Trend</span>
                      <span className={`value ${cryptoData[symbol].trend}`}>
                        {cryptoData[symbol].trend.charAt(0).toUpperCase() + cryptoData[symbol].trend.slice(1)}
                      </span>
                    </div>
                    <div className="timeframe">
                      <span className="label">Timeframe</span>
                      <span className="value">{timeframe}</span>
                    </div>
                  </div>
                )}

                {activeView === 'fundamentals' && (
                  <div className="fundamentals-section">
                    <div className="metric">
                      <span className="label">Market Cap</span>
                      <span className="value">{cryptoData[symbol].marketCap}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Circulating Supply</span>
                      <span className="value">{cryptoData[symbol].circulatingSupply}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Volume (24h)</span>
                      <span className="value">{cryptoData[symbol].volume}</span>
                    </div>
                    {symbol === 'BTC' && (
                      <div className="metric">
                        <span className="label">BTC Dominance</span>
                        <span className="value">{cryptoData[symbol].dominance}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="analysis-view">
          <div className="analysis-tabs">
            <button
              className={activeView === 'prediction' ? 'active' : ''}
              onClick={() => setActiveView('prediction')}
            >
              PREDICTION
            </button>
            <button
              className={activeView === 'fundamentals' ? 'active' : ''}
              onClick={() => setActiveView('fundamentals')}
            >
              FUNDAMENTALS
            </button>
          </div>

          <div className="analysis-content">
            {activeView === 'prediction' && (
              <div className="prediction-analysis">
                <div className="crypto-header">
                  <div className="symbol">BTC</div>
                  <div className="name">Bitcoin</div>
                </div>

                <div className="predicted-price">
                  {getPredictedPrice('BTC')}
                  <span className="predicted-change">
                    Predicted {cryptoData['BTC'].change}
                  </span>
                </div>

                <div className="metrics-grid">
                  <div className="metric">
                    <div className="label">Confidence Score</div>
                    <div className="value">{cryptoData['BTC'].confidence}</div>
                  </div>
                  <div className="metric">
                    <div className="label">Trend</div>
                    <div className={`value ${cryptoData['BTC'].trend}`}>
                      {cryptoData['BTC'].trend.charAt(0).toUpperCase() + cryptoData['BTC'].trend.slice(1)}
                    </div>
                  </div>
                  <div className="metric">
                    <div className="label">Timeframe</div>
                    <div className="value">{timeframe}</div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'fundamentals' && (
              <div className="fundamentals-analysis">
                <div className="crypto-header">
                  <div className="symbol">BTC</div>
                  <div className="name">Bitcoin</div>
                </div>

                <div className="metrics-grid">
                  <div className="metric">
                    <div className="label">Market Cap</div>
                    <div className="value">{cryptoData['BTC'].marketCap}</div>
                  </div>
                  <div className="metric">
                    <div className="label">Circulating Supply</div>
                    <div className="value">{cryptoData['BTC'].circulatingSupply}</div>
                  </div>
                  <div className="metric">
                    <div className="label">Volume (24h)</div>
                    <div className="value">{cryptoData['BTC'].volume}</div>
                  </div>
                  <div className="metric">
                    <div className="label">BTC Dominance</div>
                    <div className="value">{cryptoData['BTC'].dominance}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="timeframe-selector">
        <button
          className={timeframe === '24h' ? 'active' : ''}
          onClick={() => setTimeframe('24h')}
        >
          24h
        </button>
        <button
          className={timeframe === '7d' ? 'active' : ''}
          onClick={() => setTimeframe('7d')}
        >
          7d
        </button>
        <button
          className={timeframe === '1m' ? 'active' : ''}
          onClick={() => setTimeframe('1m')}
        >
          1m
        </button>
        <button
          className={timeframe === '1y' ? 'active' : ''}
          onClick={() => setTimeframe('1y')}
        >
          1y
        </button>
      </div>
    </div>
  );
}

export default CryptoDashboard;