import type { Metadata } from 'next';
import AdminContentSchool from '@/components/admin/AdminContentSchool';

export const metadata: Metadata = {
  title: 'Admin · Sadržaj — Škola',
};

export default function AdminContentSchoolPage() {
  return <AdminContentSchool />;
}
