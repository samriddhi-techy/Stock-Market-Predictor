"use client";

import { useState } from 'react';
import Navbar from '@/components/navbar';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simulate login
    setUser({
      name: 'John Doe',
      email: email,
      avatar: undefined
    });
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // Simulate signup
    setUser({
      name: name,
      email: email,
      avatar: undefined
    });
    setIsAuthenticated(true);
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    setUser(undefined);
    setIsAuthenticated(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowLoginModal(true)}
        onSignup={() => setShowSignupModal(true)}
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {children}
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}