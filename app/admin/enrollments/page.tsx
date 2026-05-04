import type { Metadata } from 'next';
import AdminEnrollmentsContent from '@/components/admin/AdminEnrollmentsContent';

export const metadata: Metadata = {
  title: 'Admin · Upisi',
};

export default function AdminEnrollmentsPage() {
  return <AdminEnrollmentsContent />;
}
