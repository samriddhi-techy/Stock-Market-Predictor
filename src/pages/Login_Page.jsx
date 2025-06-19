import React, { useState } from 'react';
import './Login_Page.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <span className="secure-badge">● Secure Login</span>
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="signin-button">Sign In</button>
      </form>

      <div className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default LoginPage;