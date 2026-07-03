import { supabase } from '../supabase';
import { createUserProfile, createUserPreferences } from './profile';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export async function signUp(email: string, password: string, name: string) {
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
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
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch {
    // Ignore errors when signing out
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
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
