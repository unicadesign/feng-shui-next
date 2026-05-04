import type { Metadata } from 'next';
import CourseOverviewContent from '@/components/course/CourseOverviewContent';

export const metadata: Metadata = {
  title: 'Kurs',
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseOverviewContent courseId={id} />;
}
