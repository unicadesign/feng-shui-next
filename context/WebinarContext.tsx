'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { WebinarRegistration } from '@/types/webinar';

interface WebinarContextType {
  registrations: WebinarRegistration[];
  newCount: number;
  loading: boolean;
  refreshRegistrations: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
}

export const WebinarContext = createContext<WebinarContextType | undefined>(undefined);

export const WebinarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(false);

  const newCount = registrations.filter((r) => r.status === 'new').length;

  const refreshRegistrations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRegistrations(data as WebinarRegistration[]);
    }
    setLoading(false);
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('webinar_registrations').update({ status: 'read' }).eq('id', id);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'read' as const } : r)),
    );
  };

  const markAsUnread = async (id: string) => {
    await supabase.from('webinar_registrations').update({ status: 'new' }).eq('id', id);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'new' as const } : r)),
    );
  };

  const deleteRegistration = async (id: string) => {
    await supabase.from('webinar_registrations').delete().eq('id', id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    refreshRegistrations();
  }, [refreshRegistrations]);

  return (
    <WebinarContext.Provider
      value={{ registrations, newCount, loading, refreshRegistrations, markAsRead, markAsUnread, deleteRegistration }}
    >
      {children}
    </WebinarContext.Provider>
  );
};
