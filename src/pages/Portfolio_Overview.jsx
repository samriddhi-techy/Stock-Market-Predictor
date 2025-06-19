import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Portfolio_Overview.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PortfolioOverview() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchData = async () => {
      try {
        // Mock data - in a real app, you would fetch from your brokerage API
        const mockData = {
          totalValue: 1800000,
          sectors: [
            { name: 'Technology', percentage: 35 },
            { name: 'Healthcare', percentage: 25 },
            { name: 'Finance', percentage: 20 },
            { name: 'Consumer', percentage: 12 },
            { name: 'Energy', percentage: 8 }
          ],
          totalGain: 312847,
          totalGainPercentage: 38.4,
          todaysGain: 18392,
          todaysGainPercentage: 2.3,
          ytdGain: 32.8,
          recentGain: 15.2
        };
        
        setPortfolioData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading portfolio data...</div>;
  }

  if (!portfolioData) {
    return <div className="error">Error loading portfolio data</div>;
  }

  const pieChartData = {
    labels: portfolioData.sectors.map(sector => sector.name),
    datasets: [
      {
        data: portfolioData.sectors.map(sector => sector.percentage),
        backgroundColor: [
          '#0066cc',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#6f42c1'
        ],
        borderWidth: 0
      }
    ]
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="portfolio-dashboard">
      <div className="portfolio-container">
        <div className="portfolio-overview">
          <h1>Portfolio Overview</h1>
          
          <div className="total-value">
            {formatCurrency(portfolioData.totalValue)}
            <div className="value-label">Total Portfolio Value</div>
          </div>
          
          <div className="sector-allocation">
            <div className="sectors-list">
              {portfolioData.sectors.map((sector, index) => (
                <div key={index} className="sector-item">
                  <span className="sector-name">• {sector.name}</span>
                </div>
              ))}
            </div>
            
            <div className="percentages-list">
              {portfolioData.sectors.map((sector, index) => (
                <div key={index} className="percentage-item">
                  {sector.percentage}%
                </div>
              ))}
            </div>
          </div>
          
          <div className="pie-chart-container">
            <Pie 
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="performance-metrics">
          <h1>Performance Metrics</h1>
          
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Total Gain</th>
                <th>Today's Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-value positive">
                  {formatCurrency(portfolioData.totalGain)}
                </td>
                <td className="metric-value positive">
                  {formatCurrency(portfolioData.todaysGain)}
                </td>
              </tr>
              <tr>
                <td className="metric-percentage positive">
                  +{portfolioData.totalGainPercentage}%
                </td>
                <td className="metric-percentage positive">
                  +{portfolioData.todaysGainPercentage}%
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="additional-metrics">
            <div className="metric-item">
              <span className="metric-change positive">+{portfolioData.recentGain}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-ytd">+{portfolioData.ytdGain}% YTD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioOverview;