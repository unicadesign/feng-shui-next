import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'ptPLAN - Feng Shui Konsalting & Škola',
  description:
    'ptPLAN nudi premium Feng Shui konsalting usluge i 4-mesečnu online Feng Shui školu za transformaciju vašeg prostora i unapređenje života.',
};

export default async function HomePage() {
  const home = await getContent('home');
  return <HomeContent content={home} />;
}
