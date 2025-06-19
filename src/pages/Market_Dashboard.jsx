import React, { useState, useEffect } from 'react';
import './Market_Dashboard.css';

function MarketDashboard() {
  const [activeTab, setActiveTab] = useState('allNews');
  const [timeFilter, setTimeFilter] = useState('24H');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchData = async () => {
      try {
        // Mock data - in a real app, you would fetch from news/sentiment APIs
        const mockData = {
          metrics: {
            volatilityIndex: 18.5,
            advanceDecline: 1.45,
            marketBreadth: 0.72,
            tradingVolume: '$125.8B'
          },
          news: [
            {
              id: 1,
              title: 'Fed Signals Potential Rate Cuts in 2024',
              summary: 'Federal Reserve officials indicated openness to reducing interest rates in 2024 as inflation shows signs of cooling',
              source: 'Bloomberg',
              time: '2m ago',
              category: 'Monetary Policy',
              sentiment: 'positive',
              impact: 'high',
              confidence: 95
            },
            {
              id: 2,
              title: 'Tech Stocks Rally on AI Breakthrough',
              summary: 'Major tech companies surge following announcement of breakthrough in quantum computing capabilities',
              source: 'Reuters',
              time: '15m ago',
              category: 'Technology',
              sentiment: 'positive',
              impact: 'medium',
              confidence: 85
            },
            {
              id: 3,
              title: 'Oil Prices Volatile Amid Middle East Tensions',
              summary: 'Crude oil prices fluctuate as geopolitical tensions raise supply concerns',
              source: 'Financial Times',
              time: '45m ago',
              category: 'Energy',
              sentiment: 'negative',
              impact: 'high',
              confidence: 87
            },
            {
              id: 4,
              title: 'Global Supply Chain Pressures Ease',
              summary: 'Latest indicators show significant improvement in global supply chain efficiency',
              source: 'WSJ',
              time: '1h ago',
              category: 'Economy',
              sentiment: 'positive',
              impact: 'medium',
              confidence: 78
            },
            {
              id: 5,
              title: 'Market Rally Continues',
              summary: 'Major indices extend gains as tech sector leads',
              source: 'Bloomberg',
              time: '5m ago',
              category: 'Markets',
              sentiment: 'positive',
              impact: 'high',
              confidence: 92
            },
            {
              id: 6,
              title: 'Volatility Warning',
              summary: 'VIX index shows increased market uncertainty',
              source: 'MarketWatch',
              time: '1m ago',
              category: 'Alerts',
              sentiment: 'negative',
              impact: 'high',
              confidence: 95
            }
          ],
          sentimentAnalysis: {
            overall: 65,
            institutional: 72,
            retail: 58,
            social: 81
          },
          sectorPerformance: [
            {
              name: 'Technology',
              change: '+2.8%',
              volume: '$12.4B',
              sentiment: 85,
              topStocks: ['NVDA', 'INTC']
            },
            {
              name: 'Healthcare',
              change: '+1.2%',
              volume: '$8.1B',
              sentiment: 72,
              topStocks: ['JNJ', 'PFE']
            },
            {
              name: 'Energy',
              change: '-0.9%',
              volume: '$6.2B',
              sentiment: 45,
              topStocks: ['XOM', 'CVX']
            }
          ]
        };
        
        setMarketData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNews = () => {
    if (!marketData) return [];
    
    let news = [...marketData.news];
    
    // Apply time filter
    if (timeFilter === '24H') {
      // In a real app, you would filter by actual timestamps
      news = news.slice(0, 6);
    } else if (timeFilter === '7D') {
      news = news.slice(0, 10);
    }
    
    // Apply tab filter
    if (activeTab === 'trending') {
      return news.filter(item => item.sentiment === 'positive' || item.sentiment === 'negative');
    } else if (activeTab === 'alerts') {
      return news.filter(item => item.impact === 'high');
    }
    
    return news;
  };

  if (loading) {
    return <div className="loading">Loading market intelligence...</div>;
  }

  if (!marketData) {
    return <div className="error">Error loading market data</div>;
  }

  return (
    <div className="market-intelligence">
      <header className="intelligence-header">
        <h1>Market Intelligence</h1>
        
        <div className="intelligence-tabs">
          <button
            className={activeTab === 'allNews' ? 'active' : ''}
            onClick={() => setActiveTab('allNews')}
          >
            All News
          </button>
          <button
            className={activeTab === 'trending' ? 'active' : ''}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
          <button
            className={activeTab === 'alerts' ? 'active' : ''}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
          
          <div className="time-filters">
            <button
              className={timeFilter === '24H' ? 'active' : ''}
              onClick={() => setTimeFilter('24H')}
            >
              24H
            </button>
            <button
              className={timeFilter === '7D' ? 'active' : ''}
              onClick={() => setTimeFilter('7D')}
            >
              7D
            </button>
          </div>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="market-metrics">
          <div className="metric-card">
            <div className="metric-label">Volatility Index</div>
            <div className="metric-value">{marketData.metrics.volatilityIndex}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Advance/Decline</div>
            <div className="metric-value">{marketData.metrics.advanceDecline}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Market Breadth</div>
            <div className="metric-value">{marketData.metrics.marketBreadth}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Trading Volume</div>
            <div className="metric-value">{marketData.metrics.tradingVolume}</div>
          </div>
        </div>
        
        <div className="main-content">
          <div className="news-feed">
            {filteredNews().map(item => (
              <div key={item.id} className={`news-item ${item.sentiment}`}>
                <div className="news-header">
                  <h3>{item.title}</h3>
                  {(activeTab === 'alerts' || activeTab === 'trending') && (
                    <div className={`sentiment-badge ${item.sentiment}`}>
                      {item.sentiment}
                      <span className="impact"> • {item.impact} impact</span>
                      <span className="confidence"> • AI confidence: {item.confidence}%</span>
                    </div>
                  )}
                </div>
                <p className="news-summary">{item.summary}</p>
                <div className="news-meta">
                  <span className="source">{item.source}</span>
                  <span className="time">{item.time}</span>
                  <span className="category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sidebar">
            <div className="sentiment-analysis">
              <h2>Sentiment Analysis</h2>
              <div className="sentiment-grid">
                <div className="sentiment-item">
                  <div className="sentiment-label">Overall</div>
                  <div className="sentiment-value">{marketData.sentimentAnalysis.overall}%</div>
                </div>
                <div className="sentiment-item">
                  <div className="sentiment-label">Institutional</div>
                  <div className="sentiment-value">{marketData.sentimentAnalysis.institutional}%</div>
                </div>
                <div className="sentiment-item">
                  <div className="sentiment-label">Retail</div>
                  <div className="sentiment-value">{marketData.sentimentAnalysis.retail}%</div>
                </div>
                <div className="sentiment-item">
                  <div className="sentiment-label">Social</div>
                  <div className="sentiment-value">{marketData.sentimentAnalysis.social}%</div>
                </div>
              </div>
            </div>
            
            <div className="sector-performance">
              <h2>Sector Performance</h2>
              {marketData.sectorPerformance.map(sector => (
                <div key={sector.name} className="sector-item">
                  <div className="sector-header">
                    <span className="sector-name">{sector.name}</span>
                    <span className={`sector-change ${sector.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {sector.change}
                    </span>
                  </div>
                  <div className="sector-details">
                    <span>Volume: {sector.volume}</span>
                    <span>Sentiment: {sector.sentiment}%</span>
                  </div>
                  <div className="sector-stocks">
                    {sector.topStocks.map(stock => (
                      <span key={stock} className="stock-tag">{stock}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketDashboard;