import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getContent('global');

  return (
    <>
      <Header content={global} />
      {children}
      <Footer content={global} />
    </>
  );
}
