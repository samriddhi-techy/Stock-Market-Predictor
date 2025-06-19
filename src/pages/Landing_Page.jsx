import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing_Page.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartTrading = () => {
    navigate('/welcome-page');
  };

  const handleWatchDemo = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // Replace with real demo
  };

  return (
    <main className="hero">
      <div className="hero-content fade-in">
        {/* Badge */}
        <div className="badge">
          <span className="dot"></span> Next-Gen Trading Platform
        </div>

        {/* Headline */}
        <h1 className="headline">
          Transform Your <span className="gradient-text">Trading</span> Journey
        </h1>

        {/* Description */}
        <p className="description">
          Experience professional-grade tools, real-time analytics, and institutional-level insights in one powerful platform.
        </p>

        {/* Call to Action */}
        <div className="cta-buttons">
          <button className="btn primary" onClick={handleStartTrading}>
            Start Trading Now
          </button>
          <button className="btn secondary" onClick={handleWatchDemo}>
            Watch Demo
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats">
          <div className="stat">
            <h2>2.4M+</h2>
            <p>Active Traders</p>
          </div>
          <div className="stat">
            <h2>$850B+</h2>
            <p>Trading Volume</p>
          </div>
          <div className="stat">
            <h2>150+</h2>
            <p>Global Markets</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
