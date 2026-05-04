import type { Metadata } from 'next';
import AdminContentHome from '@/components/admin/AdminContentHome';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — Početna',
};

export default function AdminContentHomePage() {
  return <AdminContentHome />;
}
