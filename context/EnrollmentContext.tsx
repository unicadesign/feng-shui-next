'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type {
  Enrollment, EnrollmentRow, PaymentRow, ZoomLinkRow,
  PaymentStatus, EnrollmentStatus,
} from '@/types';
import { toEnrollment, toZoomLink } from '@/types';

export interface AddEnrollmentParams {
  userId: string;
  courseId: string;
  paymentType: 'full' | 'installment';
  zoomOption: 'none' | 'single' | 'weekly';
  startDate: string;
  amount: number;
  installmentMonths?: number;
  markAsPaid: boolean;
}

interface EnrollmentContextType {
  enrollments: Enrollment[];
  loading: boolean;
  refreshEnrollments: () => Promise<void>;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus, paidAt?: string) => Promise<void>;
  addZoomLink: (enrollmentId: string, link: { week_number: number; url: string; scheduled_at: string }) => Promise<void>;
  updateEnrollmentStatus: (enrollmentId: string, status: EnrollmentStatus) => Promise<void>;
  addEnrollment: (params: AddEnrollmentParams) => Promise<{ success: boolean; error?: string }>;
}

export const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshEnrollments = useCallback(async () => {
    setLoading(true);

    const [enrollRes, payRes, zoomRes] = await Promise.all([
      supabase.from('enrollments').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('month', { ascending: true }),
      supabase.from('zoom_links').select('*').order('week_number', { ascending: true }),
    ]);

    if (!enrollRes.error && enrollRes.data) {
      const paymentRows = (payRes.data || []) as PaymentRow[];
      const zoomRows = (zoomRes.data || []) as ZoomLinkRow[];

      const mapped = (enrollRes.data as EnrollmentRow[]).map((row) => {
        const rowPayments = paymentRows.filter((p) => p.enrollment_id === row.id);
        const rowZoomLinks = zoomRows.filter((z) => z.enrollment_id === row.id);
        return toEnrollment(row, rowPayments, rowZoomLinks);
      });

      setEnrollments(mapped);
    }

    setLoading(false);
  }, []);

  const updatePaymentStatus = useCallback(async (paymentId: string, status: PaymentStatus, paidAt?: string) => {
    const updateData: Record<string, unknown> = { status };
    if (paidAt) updateData.paid_at = paidAt;
    if (status === 'paid' && !paidAt) updateData.paid_at = new Date().toISOString();

    await supabase.from('payments').update(updateData).eq('id', paymentId);

    setEnrollments((prev) =>
      prev.map((e) => ({
        ...e,
        payments: e.payments.map((p) =>
          p.id === paymentId ? { ...p, status, paidAt: (updateData.paid_at as string) || p.paidAt } : p
        ),
      }))
    );
  }, []);

  const addZoomLink = useCallback(async (
    enrollmentId: string,
    link: { week_number: number; url: string; scheduled_at: string }
  ) => {
    const { data, error } = await supabase
      .from('zoom_links')
      .insert([{ enrollment_id: enrollmentId, ...link }])
      .select()
      .single();

    if (!error && data) {
      const row = data as ZoomLinkRow;
      const appLink = toZoomLink(row);
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId
            ? { ...e, zoomLinks: [...(e.zoomLinks || []), appLink] }
            : e
        )
      );
    }
  }, []);

  const updateEnrollmentStatus = useCallback(async (enrollmentId: string, status: EnrollmentStatus) => {
    await supabase.from('enrollments').update({ status }).eq('id', enrollmentId);
    setEnrollments((prev) =>
      prev.map((e) => (e.id === enrollmentId ? { ...e, status } : e))
    );
  }, []);

  const addEnrollment = useCallback(
    async (params: AddEnrollmentParams): Promise<{ success: boolean; error?: string }> => {
      const { data: enrollmentRow, error: enrollErr } = await supabase
        .from('enrollments')
        .insert({
          user_id: params.userId,
          course_id: params.courseId,
          payment_type: params.paymentType,
          zoom_option: params.zoomOption,
          start_date: params.startDate,
          status: 'active',
        })
        .select()
        .single();

      if (enrollErr || !enrollmentRow) {
        return { success: false, error: enrollErr?.message || 'Greška pri kreiranju upisa.' };
      }

      const now = new Date().toISOString();
      const paidStatus: PaymentStatus = params.markAsPaid ? 'paid' : 'pending';
      const paidAt = params.markAsPaid ? now : null;

      const months = params.paymentType === 'installment' ? (params.installmentMonths ?? 1) : 1;
      const paymentInserts = Array.from({ length: months }, (_, i) => ({
        enrollment_id: enrollmentRow.id,
        amount: params.amount,
        month: i + 1,
        status: paidStatus,
        paid_at: paidAt,
      }));

      const { error: payErr } = await supabase.from('payments').insert(paymentInserts);
      if (payErr) {
        await supabase.from('enrollments').delete().eq('id', enrollmentRow.id);
        return { success: false, error: payErr.message };
      }

      await refreshEnrollments();
      return { success: true };
    },
    [refreshEnrollments]
  );

  useEffect(() => {
    refreshEnrollments();
  }, [refreshEnrollments]);

  return (
    <EnrollmentContext.Provider
      value={{ enrollments, loading, refreshEnrollments, updatePaymentStatus, addZoomLink, updateEnrollmentStatus, addEnrollment }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
