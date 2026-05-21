import type { Metadata } from 'next';
import AdminWebinarContent from '@/components/admin/AdminWebinarContent';

export const metadata: Metadata = {
  title: 'Admin · Vebinar',
};

export default function AdminWebinarPage() {
  return <AdminWebinarContent />;
}
