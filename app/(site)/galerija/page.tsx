import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getContent } from '@/lib/content';
import { getUser } from '@/lib/auth';
import GalleryContent from '@/components/gallery/GalleryContent';

export const metadata: Metadata = {
  title: 'Galerija',
  description:
    'Pogledajte projekte i transformacije realizovane primenom Feng Shui principa — stanovi, kuće, poslovni prostori u Srbiji i regionu.',
};

export default async function GalerijaPage() {
  const user = await getUser();
  if (!user || user.role !== 'admin') redirect('/');
  const gallery = await getContent('gallery');
  return <GalleryContent content={gallery} />;
}
