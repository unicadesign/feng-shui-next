import type { Metadata } from 'next';
import AdminCourseForm from '@/components/admin/AdminCourseForm';

export const metadata: Metadata = {
  title: 'Admin · Novi kurs',
};

export default function AdminCourseNewPage() {
  return <AdminCourseForm />;
}
