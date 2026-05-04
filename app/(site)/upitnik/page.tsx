import type { Metadata } from 'next';
import UpitnikContent from '@/components/upitnik/UpitnikContent';

export const metadata: Metadata = {
  title: 'Upitnik',
  description:
    'Popunite upitnik za personalizovanu Feng Shui konsultaciju — 4 kratka koraka i Dragana će vam se javiti sa preporukama prilagođenim vašem prostoru.',
};

export default function UpitnikPage() {
  return <UpitnikContent />;
}
