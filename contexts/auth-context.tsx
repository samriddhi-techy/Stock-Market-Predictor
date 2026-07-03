"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, onAuthStateChange, signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp, signInWithGoogle as apiSignInWithGoogle } from '@/lib/api/auth';
import { getUserProfile } from '@/lib/api/profile';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
      });

      return () => {
        try { subscription.unsubscribe(); } catch {}
      };
    } catch {
      setLoading(false);
    }
  }, []);

  async function checkUser() {
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
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    await apiSignIn(email, password);
  }

  async function signUp(name: string, email: string, password: string) {
    await apiSignUp(email, password, name);
  }

  async function signInWithGoogle() {
    await apiSignInWithGoogle();
  }

  async function signOut() {
    try {
      await apiSignOut();
    } catch {}
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      isAuthenticated: !!user
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
