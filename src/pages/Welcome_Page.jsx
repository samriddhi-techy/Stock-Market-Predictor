import React from 'react';
import './Welcome_Page.css';

function Welcome_Page() {
  return (
    <div className="trade-pro">
      <header className="header">
        <h1>Welcome to TradePro</h1>
        <p className="subtitle">
          Experience the next generation of trading with our powerful platform
        </p>
      </header>

      <div className="features-container">
        <div className="feature">
          <h3>Advanced Analytics</h3>
          <p>Best-time market analysts and predictive insights to inform your trading decisions</p>
        </div>
        
        <div className="feature">
          <h3>Secure Trading</h3>
          <p>Built-grade security protocols protecting your assets and transactions</p>
        </div>
        
        <div className="feature">
          <h3>Portfolio Management</h3>
          <p>Comprehensive tools to track and optimize your investment portfolio</p>
        </div>
        
        <div className="feature">
          <h3>24/7 Support</h3>
          <p>Expert assistance available around the clock to help you succeed</p>
        </div>
      </div>

      <button className="cta-button">Get Started Now</button>
    </div>
  );
}

export default Welcome_Page;