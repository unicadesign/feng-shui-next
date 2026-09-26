import type { Metadata } from 'next';
import PocetnaContent from '@/components/sajt/PocetnaContent';
import { getContent } from '@/lib/content';
import { isWebinarLive } from '@/lib/webinarDate';

export const metadata: Metadata = {
  title: 'Feng Shui: put ka miru i radosti | Dragana Jović',
  description:
    'Feng Shui konsultacije, škola i harmonizacija prostora sa Draganom Jović. Zakažite besplatnu konsultaciju i uskladite svoj dom sa sobom.',
};

export default async function PocetnaPage() {
  /* Jedino što početna čita iz baze jeste vebinar: ostali tekst je u
     komponenti. Odluka da li je živ donosi se ovde, na serveru, kao i za
     traku ispod navbara, da sekcija ne bljesne pa nestane. */
  const home = await getContent('home');
  const vebinar = isWebinarLive(home.webinarSection) ? home.webinarSection : null;

  return <PocetnaContent vebinar={vebinar} />;
}
