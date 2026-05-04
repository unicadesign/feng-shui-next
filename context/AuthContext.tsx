'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(authUser: { id: string; email?: string }): Promise<User> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return {
    id: authUser.id,
    email: authUser.email || '',
    name: data?.name || '',
    role: data?.role || 'user',
    createdAt: data?.created_at?.split('T')[0] || '',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // IMPORTANT: this callback must NOT await anything async (DB calls, etc.).
    // Supabase's signInWithPassword waits for all listeners to finish, so an
    // await here deadlocks the login flow. Schedule async work via .then().
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'INITIAL_SESSION') {
        setIsLoading(false);
      }

      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        return;
      }

      if (event === 'TOKEN_REFRESHED') return;

      // Background profile fetch — never blocks the auth flow
      fetchProfile(session.user)
        .then((profile) => {
          if (mounted) setUser(profile);
        })
        .catch((e) => console.error('[Auth] Profile fetch error:', e));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: 'Pogrešna email adresa ili lozinka.' };
    }
    if (data.user) {
      const profile = await fetchProfile(data.user);
      setUser(profile);
    }
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Korisnik sa ovom email adresom već postoji.' };
      }
      return { success: false, error: error.message };
    }
    if (data.user) {
      await supabase
        .from('profiles')
        .upsert({ id: data.user.id, name, role: 'user' }, { onConflict: 'id' });
      const profile = await fetchProfile(data.user);
      setUser(profile);
    }
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {}, []);
  const loginWithFacebook = useCallback(async () => {}, []);

  // Logout: clear UI state immediately, then notify Supabase in the background.
  // No await — a slow or failing network call must not block the UI.
  const logout = useCallback(async () => {
    setUser(null);
    supabase.auth.signOut().catch((e) => console.error('[Auth] signOut error:', e));
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, loginWithGoogle, loginWithFacebook, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
