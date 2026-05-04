import type { Metadata } from 'next';
import AdminInquiriesContent from '@/components/admin/AdminInquiriesContent';

export const metadata: Metadata = {
  title: 'Admin · Upiti',
};

export default function AdminInquiriesPage() {
  return <AdminInquiriesContent />;
}
