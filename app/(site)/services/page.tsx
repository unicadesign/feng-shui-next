import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getContent } from '@/lib/content';
import { getUser } from '@/lib/auth';
import ServicesContent from '@/components/services/ServicesContent';

export const metadata: Metadata = {
  title: 'Usluge',
  description:
    'Premium Feng Shui usluge — kućne konsultacije, dizajn prostora, vođenje pri kupovini nekretnine, godišnja prognoza i drugi programi prilagođeni vašem prostoru.',
};

export default async function ServicesPage() {
  const user = await getUser();
  if (!user || user.role !== 'admin') redirect('/');
  const services = await getContent('services');
  return <ServicesContent content={services} />;
}
