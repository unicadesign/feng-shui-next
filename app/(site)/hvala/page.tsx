import type { Metadata } from 'next';
import HvalaContent from '@/components/sajt/HvalaContent';

/**
 * Zahvalnica za upite koji nisu upis u školu. Zaseban link da bi se ta
 * konverzija merila odvojeno od `/uplata`. Neindeksirana istim
 * postupkom kao i ona (meta oznaka, ne robots.txt).
 */
export const metadata: Metadata = {
  title: 'Hvala na prijavi | Dragana Jović',
  description: 'Vaša prijava je primljena. Dragana će vam se javiti lično.',
  robots: { index: false, follow: false },
};

export default function HvalaPage() {
  return <HvalaContent />;
}
