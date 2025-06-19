import React, { useState } from 'react';
import './Account_Type_Selection.css';

function Account_Type_Selection() {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accountTypes = [
    {
      id: 'personal',
      title: 'Personal Account',
      description: 'Perfect for individual traders. Access basic trading features and personal portfolio management.'
    },
    {
      id: 'professional',
      title: 'Professional Account',
      description: 'Advanced features for serious traders, includes real-time analytics and priority support.'
    },
    {
      id: 'institutional',
      title: 'Institutional Account',
      description: 'Enterprise-grade solutions for organizations. Full suite of trading tools and dedicated support team.'
    }
  ];

  return (
    <div className="account-selection">
      <header className="header">
        <h1>Choose Your Account Type</h1>
        <p className="subtitle">
          Select the account type that best fits your trading needs
        </p>
      </header>

      <div className="account-options">
        {accountTypes.map((account) => (
          <div 
            key={account.id}
            className={`account-card ${selectedAccount === account.id ? 'selected' : ''}`}
            onClick={() => setSelectedAccount(account.id)}
          >
            <h3>{account.title}</h3>
            <p>{account.description}</p>
          </div>
        ))}
      </div>

      <button className="continue-button" disabled={!selectedAccount}>
        Continue
      </button>
    </div>
  );
}

export default Account_Type_Selection;