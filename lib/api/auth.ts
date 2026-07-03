import { supabase, isSupabaseConfigured } from '../supabase';
import { createUserProfile, createUserPreferences } from './profile';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Mock user for development when Supabase isn't configured
const MOCK_USER_ID = 'mock-user-123';
const MOCK_USER_EMAIL = 'demo@stockai.app';
const MOCK_USER_NAME = 'Demo User';

export async function signUp(email: string, password: string, name: string) {
  if (!isSupabaseConfigured) {
    // Mock signup for development
    console.log('Mock signup (Supabase not configured)');
    return { user: { id: MOCK_USER_ID, email, user_metadata: { name } }, session: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (error) throw error;

  if (data.user) {
    try {
      await createUserProfile({
        id: data.user.id,
        name,
        bio: '',
        location: '',
        phone: '',
        avatar_url: ''
      });
  
      await createUserPreferences(data.user.id);
    } catch (err) {
      console.log('Profile/preferences may already exist:', err);
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    // Mock signin for development
    console.log('Mock signin (Supabase not configured)');
    return { 
      user: { id: MOCK_USER_ID, email, user_metadata: { name: MOCK_USER_NAME } }, 
      session: { user: { id: MOCK_USER_ID, email, user_metadata: { name: MOCK_USER_NAME } } } 
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    // Mock Google signin for development
    console.log('Mock Google signin (Supabase not configured)');
    return { 
      user: { id: MOCK_USER_ID, email: MOCK_USER_EMAIL, user_metadata: { name: MOCK_USER_NAME, avatar_url: '' } }, 
      session: { user: { id: MOCK_USER_ID, email: MOCK_USER_EMAIL, user_metadata: { name: MOCK_USER_NAME, avatar_url: '' } } } 
    };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      scopes: 'email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    // Mock signout
    console.log('Mock signout (Supabase not configured)');
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch {
    // Ignore errors when signing out
  }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    // Mock user
    console.log('Mock getCurrentUser (Supabase not configured)');
    return null; // We'll handle mock user in auth context instead
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Password reset requires Supabase configuration');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Password update requires Supabase configuration');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!isSupabaseConfigured) {
    // Mock listener - do nothing
    console.log('Mock onAuthStateChange (Supabase not configured)');
    return { unsubscribe: () => {} };
  }

  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // For OAuth users, make sure we create their profile if it doesn't exist
        const name = session.user.user_metadata.name || session.user.email?.split('@')[0] || '';
        const avatar_url = session.user.user_metadata.avatar_url || '';
        
        try {
          await createUserProfile({
            id: session.user.id,
            name,
            bio: '',
            location: '',
            phone: '',
            avatar_url
          });
          
          await createUserPreferences(session.user.id);
        } catch (err) {
          // Ignore errors if profile already exists
          console.log('Profile may already exist:', err);
        }
        
        callback({
          id: session.user.id,
          email: session.user.email || '',
          name
        });
      } else {
        callback(null);
      }
    });

    return subscription;
  } catch (err) {
    console.error('Error setting up auth state change listener:', err);
    // Return a dummy subscription object with unsubscribe
    return { unsubscribe: () => {} };
  }
}
