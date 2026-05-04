import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import SchoolContent from '@/components/school/SchoolContent';

export const metadata: Metadata = {
  title: 'Feng Shui škola',
  description:
    '4-mesečni online program Feng Shui obrazovanja sa ličnim mentorstvom, sertifikacijom i živim Q&A susretima — od osnovnih principa do primene na realnim prostorima.',
};

export default async function SchoolPage() {
  const school = await getContent('school');
  return <SchoolContent content={school} />;
}
