import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import GalleryContent from '@/components/gallery/GalleryContent';

export const metadata: Metadata = {
  title: 'Galerija',
  description:
    'Pogledajte projekte i transformacije realizovane primenom Feng Shui principa — stanovi, kuće, poslovni prostori u Srbiji i regionu.',
};

export default async function GalerijaPage() {
  const gallery = await getContent('gallery');
  return <GalleryContent content={gallery} />;
}
