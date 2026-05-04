import type { Metadata } from 'next';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

export const metadata: Metadata = {
  title: 'Admin · Kontrolna tabla',
};

export default function AdminPage() {
  return <AdminDashboardContent />;
}
