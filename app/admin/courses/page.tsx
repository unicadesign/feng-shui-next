import type { Metadata } from 'next';
import AdminCoursesContent from '@/components/admin/AdminCoursesContent';

export const metadata: Metadata = {
  title: 'Admin · Kursevi',
};

export default function AdminCoursesPage() {
  return <AdminCoursesContent />;
}
