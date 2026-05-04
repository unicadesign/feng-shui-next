import type { Metadata } from 'next';
import AdminContentServices from '@/components/admin/AdminContentServices';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — Usluge',
};

export default function AdminContentServicesPage() {
  return <AdminContentServices />;
}
