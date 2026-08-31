import type { Metadata } from 'next';
import HvalaCContent from '@/components/fs-c/HvalaCContent';

/**
 * Zahvalnica za upite koji nisu upis u školu. Zaseban link da bi se ta
 * konverzija merila odvojeno od `/uplata-c`. Neindeksirana istim
 * postupkom kao i ona (meta oznaka, ne robots.txt).
 */
export const metadata: Metadata = {
  title: 'Hvala na prijavi | Dragana Jović',
  description: 'Vaša prijava je primljena. Dragana će vam se javiti lično.',
  robots: { index: false, follow: false },
};

export default function HvalaCPage() {
  return <HvalaCContent />;
}
