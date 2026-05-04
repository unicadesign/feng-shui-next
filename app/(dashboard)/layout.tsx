import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DashboardProviders } from './providers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const global = await getContent('global');

  return (
    <>
      <Header content={global} />
      <DashboardProviders>{children}</DashboardProviders>
      <Footer content={global} />
    </>
  );
}
