import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebinarPopup from '@/components/WebinarPopup';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [global, home] = await Promise.all([
    getContent('global'),
    getContent('home'),
  ]);

  return (
    <>
      <Header content={global} webinar={home.webinarSection} />
      {children}
      <Footer content={global} />
      <WebinarPopup content={home.webinarSection} />
    </>
  );
}
