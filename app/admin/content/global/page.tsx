import type { Metadata } from 'next';
import AdminContentGlobal from '@/components/admin/AdminContentGlobal';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — Podešavanja',
};

export default function AdminContentGlobalPage() {
  return <AdminContentGlobal />;
}
