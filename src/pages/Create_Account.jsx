import React, { useState } from 'react';
import './Create_Account.css';

function Create_Account() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ email, password });
  };

  return (
    <div className="account-creation">
      <header className="header">
        <h1>Create Your Account</h1>
      </header>

      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label htmlFor="email">Enter your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Create password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
          />
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <label htmlFor="terms">
            By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="submit-button">
          Get Started Now
        </button>
      </form>
    </div>
  );
}

export default Create_Account;