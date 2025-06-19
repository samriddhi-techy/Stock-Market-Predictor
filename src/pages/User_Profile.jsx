import React, { useState } from 'react';
import './User_Profile.css';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [accountVisibility, setAccountVisibility] = useState('private');

  const connectedAccounts = [
    { id: 1, provider: 'Google', connected: true },
    { id: 2, provider: 'Apple', connected: false },
    { id: 3, provider: 'Microsoft', connected: true },
    { id: 4, provider: 'Twitter', connected: false }
  ];

  const toggleConnection = (id) => {
    // In a real app, this would call an API to update the connection status
    console.log(`Toggled connection for account ${id}`);
  };

  return (
    <div className={`user-profile ${darkMode ? 'dark-mode' : ''}`}>
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">120 × 120</div>
          </div>
          <div className="profile-info">
            <h2>Alex Thompson</h2>
            <p className="profile-title">Product Designer • Premium Member</p>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="sidebar-btn">View Profile</button>
          <button className="sidebar-btn">Change Password</button>
        </div>

        <div className="storage-usage">
          <div className="storage-info">
            <span>Used Space</span>
            <span>2.1 GB</span>
          </div>
          <div className="storage-bar">
            <div className="storage-used" style={{ width: '42%' }}></div>
          </div>
          <div className="storage-total">
            <span>Auto-delete old files</span>
            <span>5 GB</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={activeTab === 'privacy' ? 'active' : ''}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Security
          </button>
          <button
            className={activeTab === 'accounts' ? 'active' : ''}
            onClick={() => setActiveTab('accounts')}
          >
            Connected Accounts
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="tab-content">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-label">Name</div>
              <div className="info-value">Alex Thompson</div>
              
              <div className="info-label">Email</div>
              <div className="info-value">alex@example.com</div>
              
              <div className="info-label">Phone</div>
              <div className="info-value">+1 (555) 123-4567</div>
              
              <div className="info-label">Time Zone</div>
              <div className="info-value">Pacific Time (PT)</div>
            </div>

            <h3>Preferences</h3>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                Dark Mode
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                />
                Auto-save
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={() => setSoundEffects(!soundEffects)}
                />
                Sound Effects
              </label>
            </div>

            <h3>Accessibility</h3>
            <div className="preference-item">
              <label>Font Size</label>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={reduceAnimations}
                  onChange={() => setReduceAnimations(!reduceAnimations)}
                />
                Reduce Animations
              </label>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="tab-content">
            <h3>Notification Settings</h3>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                Email Notifications
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
                Push Notifications
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={() => setSoundEffects(!soundEffects)}
                />
                Sound Effects
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={marketingUpdates}
                  onChange={() => setMarketingUpdates(!marketingUpdates)}
                />
                Marketing Updates
              </label>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="tab-content">
            <h3>Connected Accounts</h3>
            {connectedAccounts.map(account => (
              <div key={account.id} className="account-item">
                <div className="account-provider">{account.provider}</div>
                <button
                  className={`account-btn ${account.connected ? 'connected' : 'disconnected'}`}
                  onClick={() => toggleConnection(account.id)}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="tab-content">
            <h3>Security Settings</h3>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                Two-Factor Authentication
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={loginAlerts}
                  onChange={() => setLoginAlerts(!loginAlerts)}
                />
                Login Alerts
              </label>
            </div>

            <h3>Data Collection</h3>
            <div className="preference-item">
              <label>Account Visibility</label>
              <select 
                value={accountVisibility} 
                onChange={(e) => setAccountVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;