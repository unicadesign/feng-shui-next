import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import VodicContent from '@/components/guide/VodicContent';

export const metadata: Metadata = {
  title: 'Besplatni vodič',
  description:
    'Sedam poglavlja o energiji prostora, kvizu za samoanalizu, tri bonus videa i prvi koraci ka harmonizaciji vašeg doma kroz Feng Shui.',
};

export default async function VodicPage() {
  const guide = await getContent('guide');
  return <VodicContent content={guide} />;
}
