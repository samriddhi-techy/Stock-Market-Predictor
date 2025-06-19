import React from 'react';
import './Welcome_Back_Page.css';

function Welcome_Back_Page() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back</h1>
        <p className="greeting">Your portfolio is looking great today</p>
      </header>

      <div className="balance-card">
        <div className="balance-header">
          <span>Total Balance</span>
        </div>
        <div className="balance-amount">
          $284,750.25
        </div>
        <div className="performance-indicator positive">
          +12.8%
        </div>
      </div>

      <div className="change-card">
        <div className="change-label">24h Change</div>
        <div className="change-amount positive">+$32,299.50</div>
      </div>

      <button className="details-button">View Details</button>
    </div>
  );
}

export default Welcome_Back_Page;
