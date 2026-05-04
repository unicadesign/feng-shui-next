import type { Metadata } from 'next';
import AdminContentAbout from '@/components/admin/AdminContentAbout';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — O nama',
};

export default function AdminContentAboutPage() {
  return <AdminContentAbout />;
}
