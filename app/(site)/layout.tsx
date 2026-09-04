import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebinarPopup from '@/components/WebinarPopup';
import Script from 'next/script';
import Analitika from '@/components/Analitika';

/* Merenje posete, dodato 04.09.2026. na Markov zahtev: Google Analytics 4
   (ovde, `next/script` posle hidratacije) i Meta pixel (u `Analitika`, jer
   mora da prati i klijentsku navigaciju). Samo na javnim stranama; login,
   dashboard i admin ih nemaju. Preview deploymenti na Vercelu ne mere, da
   probe ne zagade podatke; lokalni dev meri, radi provere. */
const GA_ID = 'G-RJV846ZWZZ';
const META_PIXEL_ID = '1411230116531391';
const MERENJE_UKLJUCENO = process.env.VERCEL_ENV !== 'preview';

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
      {MERENJE_UKLJUCENO && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
          <noscript>
            {/* Rezervni beacon za posetioce bez JavaScript-a, po Metinom uputstvu;
                next/image ovde nema smisla (spoljni piksel 1×1, ne slika). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
          <Analitika />
        </>
      )}
    </>
  );
}
