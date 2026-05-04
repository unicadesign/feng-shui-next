import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import ServicesContent from '@/components/services/ServicesContent';

export const metadata: Metadata = {
  title: 'Usluge',
  description:
    'Premium Feng Shui usluge — kućne konsultacije, dizajn prostora, vođenje pri kupovini nekretnine, godišnja prognoza i drugi programi prilagođeni vašem prostoru.',
};

export default async function ServicesPage() {
  const services = await getContent('services');
  return <ServicesContent content={services} />;
}
