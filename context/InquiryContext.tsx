'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Inquiry, InquiryInsert } from '@/types/inquiry';

interface InquiryContextType {
  inquiries: Inquiry[];
  unreadCount: number;
  loading: boolean;
  submitInquiry: (data: InquiryInsert) => Promise<{ success: boolean; error?: string }>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  refreshInquiries: () => Promise<void>;
}

export const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = inquiries.filter((i) => i.status === 'new').length;

  const refreshInquiries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInquiries(data as Inquiry[]);
    }
    setLoading(false);
  }, []);

  const submitInquiry = async (data: InquiryInsert): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('inquiries').insert([data]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const markAsRead = async (id: string) => {
    await supabase.from('inquiries').update({ status: 'read' }).eq('id', id);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'read' as const } : i))
    );
  };

  const markAsUnread = async (id: string) => {
    await supabase.from('inquiries').update({ status: 'new' }).eq('id', id);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'new' as const } : i))
    );
  };

  useEffect(() => {
    refreshInquiries();
  }, [refreshInquiries]);

  return (
    <InquiryContext.Provider
      value={{ inquiries, unreadCount, loading, submitInquiry, markAsRead, markAsUnread, refreshInquiries }}
    >
      {children}
    </InquiryContext.Provider>
  );
};
