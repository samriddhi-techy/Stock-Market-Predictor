"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, onAuthStateChange, signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp, signInWithGoogle as apiSignInWithGoogle } from '@/lib/api/auth';
import { getUserProfile } from '@/lib/api/profile';
import { isSupabaseConfigured } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState<User | null>(null); // For demo mode

  // Demo mode user
  const DEMO_USER: User = {
    id: 'demo-user-123',
    email: 'demo@stockai.app',
    name: 'Demo User'
  };

  // Check localStorage for demo mode user on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isSupabaseConfigured) {
      const savedDemoUser = localStorage.getItem('demoUser');
      if (savedDemoUser) {
        setLocalUser(JSON.parse(savedDemoUser));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      checkUser();

      try {
        const subscription = onAuthStateChange(async (authUser) => {
          if (authUser) {
            try {
              const profile = await getUserProfile(authUser.id);
              setUser({
                id: authUser.id,
                email: authUser.email,
                name: profile?.name || authUser.name || authUser.email,
                avatar: profile?.avatar_url
              });
            } catch {
              setUser({
                id: authUser.id,
                email: authUser.email,
                name: authUser.name || authUser.email,
                avatar: authUser.user_metadata?.avatar_url
              });
            }
          } else {
            setUser(null);
          }
        });

        return () => {
          try { subscription.unsubscribe(); } catch {}
        };
      } catch {
        // Ignore
      }
    }
  }, []);

  async function checkUser() {
    if (!isSupabaseConfigured) return;

    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        try {
          const profile = await getUserProfile(authUser.id);
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile?.name || authUser.user_metadata?.name || authUser.email || '',
            avatar: profile?.avatar_url
          });
        } catch {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email || '',
            avatar: authUser.user_metadata?.avatar_url
          });
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      // Demo login
      const newLocalUser = { ...DEMO_USER, email };
      setLocalUser(newLocalUser);
      localStorage.setItem('demoUser', JSON.stringify(newLocalUser));
    } else {
      await apiSignIn(email, password);
    }
  }

  async function signUp(name: string, email: string, password: string) {
    if (!isSupabaseConfigured) {
      // Demo signup
      const newLocalUser = { ...DEMO_USER, email, name };
      setLocalUser(newLocalUser);
      localStorage.setItem('demoUser', JSON.stringify(newLocalUser));
    } else {
      await apiSignUp(email, password, name);
    }
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) {
      // Demo Google login
      setLocalUser(DEMO_USER);
      localStorage.setItem('demoUser', JSON.stringify(DEMO_USER));
    } else {
      await apiSignInWithGoogle();
    }
  }

  async function signOut() {
    if (!isSupabaseConfigured) {
      // Demo logout
      setLocalUser(null);
      localStorage.removeItem('demoUser');
    } else {
      try {
        await apiSignOut();
      } catch {}
      setUser(null);
    }
  }

  const activeUser = isSupabaseConfigured ? user : localUser;

  return (
    <AuthContext.Provider value={{
      user: activeUser,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      isAuthenticated: !!activeUser,
      isDemoMode: !isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
