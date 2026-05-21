import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import type { GlobalContent } from '@/types/content';

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

interface FooterProps {
  content: GlobalContent;
}

const HIDDEN_ROUTES = ['/services', '/vodic', '/galerija'];

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

      <footer className="bg-[#1a1a1a] text-sand-300 py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <span className="flex items-center gap-3">
                <Image src="/logo/logo-transparent.png" alt={siteConfig.siteName} width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-2xl font-heading font-bold text-cream-50">Dragana Jović</span>
              </span>
              <p className="text-sand-300 text-sm leading-relaxed mt-3 max-w-[40ch]">
                {footer.tagline}
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-400 hover:text-navy-400 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={18} className="stroke-[1.5px]" />
                </a>
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-400 hover:text-navy-400 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} className="stroke-[1.5px]" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-heading font-semibold text-cream-50 uppercase tracking-[0.15em] mb-6">
                {footer.exploreHeading}
              </h3>
              <ul className="space-y-1">
                {exploreLinks.map((link) => (
                  <li key={link.to}>
                    <Link href={link.to} className="text-sand-300 hover:text-navy-400 transition-colors duration-300 text-sm py-1.5 block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-heading font-semibold text-cream-50 uppercase tracking-[0.15em] mb-6">
                {footer.connectHeading}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-0.5 flex-shrink-0 text-navy-400" />
                  <span className="text-sand-300 text-sm">{siteConfig.address}</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 flex-shrink-0 text-navy-400" />
                  <span className="text-sand-300 text-sm">{siteConfig.phone}</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 flex-shrink-0 text-navy-400" />
                  <span className="text-sand-300 text-sm">{siteConfig.email}</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare size={18} className="mr-3 flex-shrink-0 text-navy-400" />
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    className="text-sand-300 hover:text-navy-400 transition-colors duration-300 text-sm"
                  >
                    {footer.whatsappLinkText}
                  </a>
                </li>
                <li className="mt-4">
                  <Link
                    href={footer.consultationButtonLink}
                    className="inline-block mt-2 text-sm font-medium px-4 py-2 border border-navy-400/50 text-navy-400 rounded-full hover:bg-navy-400/10 transition-all duration-300"
                  >
                    {footer.consultationButtonText}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6">
            <p className="text-sand-400 text-xs text-center">
              {footer.copyrightText} Powered by{' '}
              <a
                href="https://72hweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-400 hover:text-navy-300 transition-colors duration-300"
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
