import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import type { GlobalContent } from '@/types/content';
import NewsletterForm from './NewsletterForm';

// Lucide v1 dropped brand icons (trademark concerns) — re-inlining the
// original outline-style SVGs so footer styling stays identical.
const FacebookIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* Oznake uz naslove kolona: kvadrat / krug / trougao iz brend simbola.
   Geometrija je IZMERENA iz brend simbola (`simbol-20.png`, čuva se van
   repoa u feng-shui-izvori), ne crtana od oka:
   krug je upisan u kvadrat (odnos prečnika i stranice 1,0000), a trougao je
   jednakostraničan i upisan u krug, temenom nagore (osnovica na 0,7495
   stranice, široka 0,8666 — teorijski 0,7500 i 0,8660). Trougao je pomeren
   naniže da mu okvir optički stoji u sredini pored druge dve forme. */
const Oznaka = ({ oblik }: { oblik: 'kvadrat' | 'krug' | 'trougao' }) => (
  <svg
    width={13}
    height={13}
    viewBox="0 0 14 14"
    fill="none"
    stroke="#6B5518"
    strokeWidth={1}
    className="flex-none"
    aria-hidden="true"
  >
    {oblik === 'kvadrat' && <rect x="1.5" y="1.5" width="11" height="11" />}
    {oblik === 'krug' && <circle cx="7" cy="7" r="5.5" />}
    {oblik === 'trougao' && <polygon points="7,2.88 11.76,11.12 2.24,11.12" />}
  </svg>
);

interface FooterProps {
  content: GlobalContent;
}

// `/vaza-izobilja` je dodat 27.08. na klijentov zahtev („Izbaciti Vazu
// Izobilja"). Strana i dalje postoji, samo se više ne pominje u podnožju.
const HIDDEN_ROUTES = ['/services', '/vodic', '/galerija', '/vaza-izobilja'];

/* Paleta podnožja stoji doslovno u klasama, ne preko Tailwind tokena i ne
   preko konstanti: tokeni su na javnim stranama (`.fs-c`) preusmereni na
   novu paletu a na login, dashboard i admin stranama nose staru, pa bi
   podnožje ispalo dvojako; a konstante
   ne bi radile jer Tailwind klase čita iz izvornog teksta i ne vidi ime
   sastavljeno kroz šablon.
     #3E2A1E  naslovi i ime            13,51:1 na beloj
     #665243  tekst i linkovi           7,36:1
     #6B5518  ikonice, zlatni naglasak  7,00:1
     #DCC5A6  linija                    ukras
*/

const Footer = ({ content }: FooterProps) => {
  const siteConfig = content.siteConfig;
  const footer = content.footer;
  const filteredExploreLinks = footer.exploreLinks.filter(
    (link) => !HIDDEN_ROUTES.includes(link.to),
  );
  const exploreLinks = filteredExploreLinks.some((link) => link.to === '/school')
    ? filteredExploreLinks
    : [{ to: '/school', label: 'Feng Shui Škola' }, ...filteredExploreLinks];

  return (
    <>
      <section className="bg-cream-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-sm text-charcoal-500 text-center font-body">
            {footer.socialProofText}
          </p>
        </div>
      </section>

      {/* Podnožje je 27.08. prešlo sa braon na belo sa braon slovima.
          Deljeno je sa ostatkom sajta, pa se vidi i na starim stranama. */}
      <footer className="bg-white py-16 text-[#665243]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <span className="flex items-center gap-3">
                <Image src="/logo/logo-zlatni.png" alt={siteConfig.siteName} width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-2xl font-heading font-bold text-[#3E2A1E]">Dragana Jović</span>
              </span>
              {/* Opis („Harmonizacija domova…") je izbačen na zahtev. */}
              <div className="flex gap-3.5 mt-6">
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#DCC5A6] text-[#6B5518] hover:text-[#3E2A1E] hover:border-[#6B5518] transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={17} className="stroke-[1.6px]" />
                </a>
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#DCC5A6] text-[#6B5518] hover:text-[#3E2A1E] hover:border-[#6B5518] transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={17} className="stroke-[1.6px]" />
                </a>
              </div>

              {/* Prijava na newsletter stoji baš ovde: ova kolona drži
                  `md:col-span-2`, dakle pola širine podnožja, a logotip i
                  dve ikonice popunjavaju oko 200x100px. Podnožje nije
                  delovalo siromašno zato što ima malo sadržaja, nego zato
                  što mu je leva polovina bila prazna. */}
              <div className="mt-8 max-w-[420px] border-t border-[#DCC5A6] pt-6">
                <h3 className="flex items-center gap-2.5 text-sm font-heading font-semibold text-[#3E2A1E] uppercase tracking-[0.15em]">
                  <Oznaka oblik="trougao" />
                  Newsletter
                </h3>
                <p className="mt-3 text-sm text-[#665243] leading-relaxed">
                  Povremeno, saveti o protoku energije, ritualima i usklađenom životu.
                </p>
                <div className="mt-4">
                  <NewsletterForm />
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2.5 text-sm font-heading font-semibold text-[#3E2A1E] uppercase tracking-[0.15em] mb-6">
                <Oznaka oblik="kvadrat" />
                {footer.exploreHeading}
              </h3>
              <ul className="space-y-1">
                {exploreLinks.map((link) => (
                  <li key={link.to}>
                    <Link href={link.to} className="text-[#665243] hover:text-[#6B5518] transition-colors duration-300 text-sm py-1.5 block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2.5 text-sm font-heading font-semibold text-[#3E2A1E] uppercase tracking-[0.15em] mb-6">
                <Oznaka oblik="krug" />
                {footer.connectHeading}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-0.5 flex-shrink-0 text-[#6B5518]" />
                  <span className="text-[#665243] text-sm">{siteConfig.address}</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 flex-shrink-0 text-[#6B5518]" />
                  <span className="text-[#665243] text-sm">{siteConfig.phone}</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 flex-shrink-0 text-[#6B5518]" />
                  <span className="text-[#665243] text-sm">{siteConfig.email}</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare size={18} className="mr-3 flex-shrink-0 text-[#6B5518]" />
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    className="text-[#665243] hover:text-[#6B5518] transition-colors duration-300 text-sm"
                  >
                    {footer.whatsappLinkText}
                  </a>
                </li>
                <li className="mt-4">
                  <Link
                    href={footer.consultationButtonLink}
                    className="inline-block mt-2 text-sm font-medium px-4 py-2 border border-[#6B5518]/50 text-[#6B5518] rounded-full hover:bg-[#6B5518]/10 transition-all duration-300"
                  >
                    {footer.consultationButtonText}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#DCC5A6] mt-12 pt-6">
            <p className="text-[#665243] text-xs text-center">
              {footer.copyrightText} Powered by{' '}
              <a
                href="https://72hweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B5518] hover:text-[#3E2A1E] transition-colors duration-300"
              >
                72hweb.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
