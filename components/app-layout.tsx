"use client";

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import Navbar from '@/components/navbar';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const switchToSignup = () => { setShowLoginModal(false); setShowSignupModal(true); };
  const switchToLogin = () => { setShowSignupModal(false); setShowLoginModal(true); };

  const handleLogout = async () => {
    try { await signOut(); } catch { /* Ignore */ }
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowLoginModal(true)}
        onSignup={() => setShowSignupModal(true)}
        onLogout={handleLogout}
        user={user ? { name: user.name, email: user.email, avatar: user.avatar } : undefined}
      />
      <main
        id="main-content"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        {children}
      </main>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSwitchToSignup={switchToSignup} />
      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} onSwitchToLogin={switchToLogin} />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}