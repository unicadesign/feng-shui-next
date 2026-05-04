import type { Metadata } from 'next';
import LessonViewerContent from '@/components/course/LessonViewerContent';

export const metadata: Metadata = {
  title: 'Lekcija',
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  return <LessonViewerContent courseId={id} lessonId={lessonId} />;
}
