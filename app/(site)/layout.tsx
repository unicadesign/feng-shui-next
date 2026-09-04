import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebinarPopup from '@/components/WebinarPopup';
import Script from 'next/script';
import Analitika from '@/components/Analitika';

/* Merenje posete, dodato 04.09.2026. na Markov zahtev: Google Analytics 4 i
   Meta pixel. Samo na javnim stranama (ovaj layout); login, dashboard i admin
   ih nemaju. Oba se učitavaju posle hidratacije (`afterInteractive`), pa ne
   usporavaju prvi prikaz. Promenu rute za pixel prati `Analitika`. */
const GA_ID = 'G-8V0PQW65GG';
const META_PIXEL_ID = '1411230116531391';

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
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
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
  );
}
