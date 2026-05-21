'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { NewsletterSubscriber } from '@/types/newsletter';

interface NewsletterContextType {
  subscribers: NewsletterSubscriber[];
  loading: boolean;
  refreshSubscribers: () => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
}

export const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const NewsletterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshSubscribers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubscribers(data as NewsletterSubscriber[]);
    }
    setLoading(false);
  }, []);

  const deleteSubscriber = async (id: string) => {
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    refreshSubscribers();
  }, [refreshSubscribers]);

  return (
    <NewsletterContext.Provider value={{ subscribers, loading, refreshSubscribers, deleteSubscriber }}>
      {children}
    </NewsletterContext.Provider>
  );
};
