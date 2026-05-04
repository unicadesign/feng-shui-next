import type { Metadata } from 'next';
import AdminCourseForm from '@/components/admin/AdminCourseForm';

export const metadata: Metadata = {
  title: 'Admin · Izmeni kurs',
};

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminCourseForm id={id} />;
}
