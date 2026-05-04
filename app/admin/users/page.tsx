import type { Metadata } from 'next';
import AdminUsersContent from '@/components/admin/AdminUsersContent';

export const metadata: Metadata = {
  title: 'Admin · Korisnici',
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
