import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [activeTab, setActiveTab] = useState('performance');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchData = async () => {
      try {
        // Mock data - in a real app, you would fetch from your business API
        const mockMetrics = {
          revenueGrowth: 28,
          customerGrowth: 12,
          overallGrowth: 18,
          activeUsers: '2.4M',
          newCustomers: '14.2K',
          retentionRate: '32%',
          monthlyMetrics: [45, 62, 78, 55, 89, 92, 85, 73, 68, 95, 82, 79],
          conversionRate: '4.28%',
          avgSessionTime: '3:42',
          bounceRate: '28.3%',
          quarters: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
          quarterGrowth: [15, 22, 18, 25]
        };
        
        setMetrics(mockMetrics);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading business metrics...</div>;
  }

  if (!metrics) {
    return <div className="error">Error loading business data</div>;
  }

  const performanceChartData = {
    labels: metrics.quarters,
    datasets: [
      {
        label: 'Quarterly Growth',
        data: metrics.quarterGrowth,
        backgroundColor: '#0066cc',
        borderColor: '#0066cc',
        tension: 0.1
      }
    ]
  };

  const insightsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Performance',
        data: metrics.monthlyMetrics,
        backgroundColor: 'rgba(0, 102, 204, 0.2)',
        borderColor: '#0066cc',
        borderWidth: 1,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="business-dashboard">
      <header className="dashboard-header">
        <h1>
          {activeTab === 'performance' && 'Performance Insights'}
          {activeTab === 'metrics' && 'Performance Metrics'}
        </h1>
        
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button
            className={activeTab === 'metrics' ? 'active' : ''}
            onClick={() => setActiveTab('metrics')}
          >
            Insights
          </button>
        </div>
      </header>

      {activeTab === 'performance' && (
        <div className="performance-view">
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-label">Revenue</div>
              <div className="kpi-value positive">+{metrics.revenueGrowth}%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Customers</div>
              <div className="kpi-value positive">+{metrics.customerGrowth}%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Growth</div>
              <div className="kpi-value positive">+{metrics.overallGrowth}%</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{metrics.activeUsers}</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{metrics.newCustomers}</div>
              <div className="stat-label">New Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{metrics.retentionRate}</div>
              <div className="stat-label">Retention Rate</div>
            </div>
          </div>

          <div className="growth-section">
            <h2>Growth Trajectory</h2>
            <div className="chart-container">
              <Bar
                data={performanceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false
                      },
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="quarter-labels">
              {metrics.quarters.map((quarter, index) => (
                <div key={index} className="quarter-label">
                  {quarter}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="metrics-view">
          <h2>Performance Metrics</h2>
          
          <div className="metrics-chart-container">
            <Line
              data={insightsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    grid: {
                      display: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>

          <div className="metrics-cards">
            <div className="metric-card">
              <div className="metric-label">Conversion Rate</div>
              <div className="metric-value">{metrics.conversionRate}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg Session Time</div>
              <div className="metric-value">{metrics.avgSessionTime}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Bounce Rate</div>
              <div className="metric-value">{metrics.bounceRate}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;