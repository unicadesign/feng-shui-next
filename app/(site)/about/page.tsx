import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Upoznajte Draganu Jović — sertifikovanog Feng Shui konsultanta sa preko 25 godina iskustva i 1000+ realizovanih projekata u Srbiji i regionu.',
};

export default async function AboutPage() {
  const about = await getContent('about');
  return <AboutContent content={about} />;
}
