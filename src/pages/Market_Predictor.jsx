import React, { useState, useEffect } from 'react';
import './Market_Predictor.css';

function MarketPredictor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFrame, setTimeFrame] = useState(30);
  const [riskLevel, setRiskLevel] = useState(50);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for assets - in a real app, you would fetch from an API
  const mockAssets = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft', type: 'Stock' },
    { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto' },
    { symbol: 'ETH', name: 'Ethereum', type: 'Crypto' },
    { symbol: 'SPY', name: 'S&P 500 ETF', type: 'ETF' },
    { symbol: 'TSLA', name: 'Tesla', type: 'Stock' },
    { symbol: 'GLD', name: 'Gold ETF', type: 'ETF' },
  ];

  useEffect(() => {
    // Simulate API call to fetch assets
    setAssets(mockAssets);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTimeFrameChange = (e) => {
    setTimeFrame(parseInt(e.target.value));
  };

  const handleRiskLevelChange = (e) => {
    setRiskLevel(parseInt(e.target.value));
  };

  const generatePrediction = () => {
    if (!selectedAsset) return;
    
    setLoading(true);
    
    // Simulate AI prediction with timeout
    setTimeout(() => {
      const mockPredictions = [
        { direction: 'up', confidence: 72, priceTarget: '15% higher', keyFactors: ['Strong earnings', 'Market trend', 'Sector growth'] },
        { direction: 'down', confidence: 68, priceTarget: '10% lower', keyFactors: ['Market volatility', 'Sector rotation', 'Economic indicators'] },
        { direction: 'neutral', confidence: 55, priceTarget: '±5% change', keyFactors: ['Mixed signals', 'Balanced volume', 'Stable sector'] }
      ];
      
      const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      
      setPrediction({
        asset: selectedAsset,
        timeFrame,
        riskLevel,
        ...randomPrediction
      });
      setLoading(false);
    }, 1500);
  };

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="market-predictor">
      <header className="predictor-header">
        <h1>Market Predictor</h1>
        <p className="subtitle">Advanced market analysis powered by AI</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {searchTerm && (
          <div className="search-results">
            {filteredAssets.map(asset => (
              <div 
                key={asset.symbol} 
                className={`asset-result ${selectedAsset?.symbol === asset.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedAsset(asset)}
              >
                <span className="asset-symbol">{asset.symbol}</span>
                <span className="asset-name">{asset.name}</span>
                <span className="asset-type">{asset.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="prediction-params">
        <div className="param-group">
          <label>Time Frame (Days)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={timeFrame}
            onChange={handleTimeFrameChange}
          />
        </div>

        <div className="param-group">
          <label>Risk Level</label>
          <div className="risk-slider">
            <input
              type="range"
              min="0"
              max="100"
              value={riskLevel}
              onChange={handleRiskLevelChange}
            />
            <span className="risk-value">{riskLevel}%</span>
          </div>
        </div>
      </div>

      <button 
        className="generate-btn"
        onClick={generatePrediction}
        disabled={!selectedAsset || loading}
      >
        {loading ? 'Analyzing...' : 'Generate Prediction'}
      </button>

      {prediction && (
        <div className="prediction-result">
          <h3>AI Prediction for {prediction.asset.symbol}</h3>
          
          <div className="prediction-summary">
            <div className={`direction ${prediction.direction}`}>
              {prediction.direction === 'up' ? '↑ Bullish' : 
               prediction.direction === 'down' ? '↓ Bearish' : '↔ Neutral'}
            </div>
            <div className="confidence">
              Confidence: {prediction.confidence}%
            </div>
          </div>

          <div className="prediction-details">
            <div className="detail-item">
              <span className="detail-label">Time Frame:</span>
              <span className="detail-value">{prediction.timeFrame} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Risk Level:</span>
              <span className="detail-value">{prediction.riskLevel}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price Target:</span>
              <span className="detail-value">{prediction.priceTarget}</span>
            </div>
          </div>

          <div className="key-factors">
            <h4>Key Factors Considered:</h4>
            <ul>
              {prediction.keyFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketPredictor;