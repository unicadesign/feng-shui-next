import type { Metadata } from 'next';
import AdminContentVaza from '@/components/admin/AdminContentVaza';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — Vaza Izobilja',
};

export default function AdminContentVazaPage() {
  return <AdminContentVaza />;
}
