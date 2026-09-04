'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import WebinarNavbarBar from '@/components/WebinarNavbarBar';
import { requestEnroll } from '@/components/sajt/enrollTrigger';
import type { GlobalContent, HomeContent } from '@/types/content';

interface HeaderProps {
  content: GlobalContent;
  webinar?: HomeContent['webinarSection'];
}

const HIDDEN_ROUTES = ['/services', '/vodic', '/galerija'];

// Sidra koja su do 27.08. nosili bež krugovi ispod heroja. Krugovi su
// izbačeni, pa se ista navigacija seli u padajući meni pod „Škola".
// Meni se otvara na prelazak mišem, kao i ostali padajući meniji u
// navigaciji, a strelica pored naziva ga otvara klikom — zbog tastature
// i dodira, gde prelaska mišem nema. Klik na sam naziv vodi na /school.
const SKOLA_SIDRA: { to: string; label: string }[] = [
  { to: '/school#program', label: 'Program' },
  { to: '/school#za-koga', label: 'Za koga je' },
  { to: '/school#rezultati', label: 'Rezultati' },
  /* „O meni" i „Upis" su izbačeni 31.08.: te dve sekcije su sakrivene na
     strani, pa bi sidra vodila u prazno. Vraćaju se zajedno sa sekcijama. */
  { to: '/school#faq', label: 'Pitanja' },
];

const Header = ({ content, webinar }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileExpandedNav, setMobileExpandedNav] = useState<string | null>(null);
  const [skolaOpen, setSkolaOpen] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const skolaRef = useRef<HTMLDivElement>(null);
  const skolaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  const filteredNav = content.navigation
    .filter((link) => !HIDDEN_ROUTES.includes(link.to))
    .map((link) => ({
      ...link,
      children: link.children?.filter((child) => !HIDDEN_ROUTES.includes(child.to)),
    }));
  const navLinks = filteredNav.some((link) => link.to === '/school')
    ? filteredNav
    : [{ to: '/school', label: 'Škola', children: undefined }, ...filteredNav];
  /**
   * Modal za prijavu živi u komponenti strane, a Header ga doziva
   * događajem (`enrollTrigger`). Nemaju ga sve strane: `/uplata` i `/hvala`
   * se otvaraju POSLE prijave, a `/upitnik` ima sopstveni obrazac, pa bi na
   * njima dugme „Sačuvaj svoje mesto" slalo događaj koji niko ne sluša.
   * Tamo isto dugme vodi na stranicu škole.
   */
  const imaModalZaPrijavu = pathname === '/' || pathname === '/school' || pathname === '/about';
  /**
   * „Početna" u navigaciji. Dodaje se ovde a ne u admin panelu jer admin
   * po dogovoru čeka svoju fazu (PLAN-PRELAZAK.md, faza 11). Potrebna je
   * jer je naziv „Dragana Jović" pored znaka izbačen na zahtev klijenta,
   * pa bi se bez nje na početnu moglo samo preko znaka.
   */
  const navLinksResolved = navLinks.some((link) => link.to === '/')
    ? navLinks
    : [{ to: '/', label: 'Početna', children: undefined }, ...navLinks];
  const siteName = content.siteConfig.siteName;
  const headerLabels = content.header;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setHoveredNav(null);
    setMobileExpandedNav(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Padajući meni „Škola" se otvara na klik, pa mora i da se zatvori:
  // klikom izvan njega i tasterom Escape.
  useEffect(() => {
    if (!skolaOpen) return;
    const naKlik = (e: MouseEvent) => {
      if (skolaRef.current && !skolaRef.current.contains(e.target as Node)) {
        setSkolaOpen(false);
      }
    };
    const naTaster = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSkolaOpen(false);
    };
    document.addEventListener('mousedown', naKlik);
    document.addEventListener('keydown', naTaster);
    return () => {
      document.removeEventListener('mousedown', naKlik);
      document.removeEventListener('keydown', naTaster);
    };
  }, [skolaOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredNav(label);
  };

  const handleNavMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 150);
  };

  const otkaziZatvaranjeSkole = () => {
    if (skolaTimeoutRef.current) {
      clearTimeout(skolaTimeoutRef.current);
      skolaTimeoutRef.current = null;
    }
  };
  const otvoriSkolu = () => {
    otkaziZatvaranjeSkole();
    setSkolaOpen(true);
  };
  /* Zatvaranje ide sa odlaganjem. Bez njega je meni bio praktično
     neupotrebljiv: put od naziva „Škola" do stavke u panelu ide
     dijagonalno i usput na tren izađe iz oba elementa, pa se meni
     zatvarao pre nego što klik stigne. 260ms je taman da pokrije
     taj prelaz, a da meni ne visi kad se miš stvarno skloni. */
  const zatvoriSkoluSaOdlaganjem = () => {
    otkaziZatvaranjeSkole();
    skolaTimeoutRef.current = setTimeout(() => setSkolaOpen(false), 260);
  };
  const zatvoriSkoluOdmah = () => {
    otkaziZatvaranjeSkole();
    setSkolaOpen(false);
  };
  useEffect(() => otkaziZatvaranjeSkole, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-5">
      <div className="flex flex-col items-center w-full px-4 md:w-auto md:px-0">
      <nav
        className={`hidden md:flex relative z-10 items-center gap-1 rounded-full px-3 py-2 border transition-all duration-300 ease-out-expo ${
          isScrolled
            ? 'bg-cream-50/95 border-sand-200/50 shadow-lifted'
            : 'bg-cream-50/80 backdrop-blur-xl border-sand-200/50 shadow-soft'
        }`}
      >
        <Link href="/">
          {/* `py-2 -my-2` uvecava povrsinu za dodir sa 32px na 48px a da
              ne pomeri raspored: negativna margina poništi dodati prostor.
              Pošto je naziv pored znaka izbačen, znak je ostao jedina
              prečica do početne i mora da se pogodi prstom. */}
          <span className="flex items-center gap-2 px-3 py-2 -my-2">
            {/* Zlatni znak ima providnu pozadinu; stari `logo-transparent.png`
                (obrisan 09.2026.) je uprkos imenu bio bez alfa kanala, odatle beli kvadrat iza znaka. */}
            <Image src="/logo/logo-zlatni.png" alt={siteName} width={32} height={32} className="h-8 w-8 object-contain" priority />
            {/* Naziv pored znaka je izbačen na zahtev klijenta; ostaje samo znak.
                Link i dalje vodi na početnu, a pristupačno ime mu daje
                `alt` na slici, pa link ne ostaje bezimen. */}
          </span>
        </Link>

        {navLinksResolved.map((link) => (
          link.to === '/school' ? (
            /* „Škola" nosi padajući meni sa sidrima koja su
               ranije bili bež krugovi ispod heroja. Naziv je link i vodi na
               stranu škole; padajući meni otvara strelica pored njega, kao i
               prelazak mišem. Jedan element ne može oboje — klik bi ili
               navigirao ili otvarao meni, ne oba. */
            <div
              key={link.to}
              className="relative"
              ref={skolaRef}
              onMouseEnter={otvoriSkolu}
              onMouseLeave={zatvoriSkoluSaOdlaganjem}
            >
              <span
                className={`text-sm font-body font-medium pl-3 pr-2 py-1.5 rounded-full transition-all duration-300 ease-out-expo inline-flex items-center gap-0.5 ${
                  pathname === link.to ? 'text-navy-500 bg-navy-50' : 'text-charcoal-500 hover:text-navy-500'
                }`}
              >
                <Link href={link.to} onClick={zatvoriSkoluOdmah} className="cursor-pointer">
                  {link.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={skolaOpen}
                  aria-haspopup="true"
                  aria-label={`${link.label}: otvori podmeni`}
                  onClick={() => (skolaOpen ? zatvoriSkoluOdmah() : otvoriSkolu())}
                  className="cursor-pointer inline-flex items-center p-1 -m-1"
                >
                  <ChevronDown size={14} className={`transition-transform duration-200 ${skolaOpen ? 'rotate-180' : ''}`} />
                </button>
              </span>
              {/* Razmak do panela je `pt-2` UNUTAR ovog omotača, a ne `mt-2`
                  spolja. Spoljna margina nije ničiji element, pa je miš na
                  putu nadole prelazio preko 8px praznine, izlazio iz oba
                  elementa i rušio hover. Ovako je put neprekidan. */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  skolaOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-48 rounded-xl bg-cream-50 border border-sand-200 shadow-card py-2">
                  {SKOLA_SIDRA.map((s) => (
                    <Link
                      key={s.to}
                      href={s.to}
                      onClick={zatvoriSkoluOdmah}
                      className="block px-4 py-2.5 text-sm text-charcoal-500 hover:text-navy-500 hover:bg-navy-50 transition-colors duration-200"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : link.children ? (
            <div
              key={link.to}
              className="relative"
              onMouseEnter={() => handleNavMouseEnter(link.label)}
              onMouseLeave={handleNavMouseLeave}
            >
              <NavLinkWithArrow to={link.to} label={link.label} isOpen={hoveredNav === link.label} />
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl bg-cream-50 border border-sand-200 shadow-card py-2 transition-all duration-200 ${
                  hoveredNav === link.label
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                {link.children.map((child) => (
                  <Link
                    key={child.to + child.label}
                    href={child.to}
                    className="block px-4 py-2.5 text-sm text-charcoal-500 hover:text-navy-500 hover:bg-navy-50 transition-colors duration-200"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
          )
        ))}

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-full bg-navy-50 text-navy-600 px-3 py-1.5 text-sm font-heading font-semibold hover:bg-navy-100 transition-all duration-300 ease-out-expo"
            >
              <span className="w-6 h-6 rounded-full bg-navy-500 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </span>
              {user.name.split(' ')[0]}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-cream-50 border border-sand-200 shadow-warm py-2 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-navy-50 transition-colors">
                  <LayoutDashboard size={16} /> {headerLabels.myCoursesLabel}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-navy-50 transition-colors">
                    <Shield size={16} /> {headerLabels.adminPanelLabel}
                  </Link>
                )}
                <div className="border-t border-sand-200 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-navy-50 transition-colors w-full text-left"
                >
                  <LogOut size={16} /> {headerLabels.logoutLabel}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Gornji poziv na akciju vodi u prijavu za kurs, a ne na /login:
             prijava se otvara kao modal, na licu mesta, pa posetilac ne
             napušta prodajnu stranu. Samo desktop — na telefonu tu ulogu ima
             lepljiva traka pri dnu. Natpis je u kodu; u admin ide u admin
             fazi (PLAN-PRELAZAK.md, faza 11). Polaznice do /login stižu iz
             mobilnog menija ili kucanjem adrese (odluka 0.3, pravilo 1:1). */
          imaModalZaPrijavu ? (
            <button
              type="button"
              onClick={requestEnroll}
              className="rounded-full bg-navy-500 text-white px-5 py-2 text-sm font-heading font-semibold hover:bg-navy-600 transition-all duration-300 ease-out-expo active:scale-[0.98]"
            >
              Sačuvaj svoje mesto
            </button>
          ) : (
            /* Strane bez modala (`/upitnik`, `/uplata`, `/hvala`): isto dugme
               vodi na školu umesto da ne radi ništa. */
            <Link
              href="/school"
              className="rounded-full bg-navy-500 text-white px-5 py-2 text-sm font-heading font-semibold hover:bg-navy-600 transition-all duration-300 ease-out-expo active:scale-[0.98]"
            >
              Sačuvaj svoje mesto
            </Link>
          )
        )}
      </nav>

      <div
        className={`md:hidden relative z-10 flex items-center justify-between rounded-full px-3 py-2 border w-full transition-all duration-300 ease-out-expo ${
          isScrolled
            ? 'bg-cream-50/95 border-sand-200/50 shadow-lifted'
            : 'bg-cream-50/80 backdrop-blur-xl border-sand-200/50 shadow-soft'
        }`}
      >
        <Link href="/">
          {/* `py-2 -my-2` uvecava povrsinu za dodir sa 32px na 48px a da
              ne pomeri raspored: negativna margina poništi dodati prostor.
              Pošto je naziv pored znaka izbačen, znak je ostao jedina
              prečica do početne i mora da se pogodi prstom. */}
          <span className="flex items-center gap-2 px-3 py-2 -my-2">
            <Image src="/logo/logo-zlatni.png" alt={siteName} width={32} height={32} className="h-8 w-8 object-contain" priority />
            {/* Naziv pored znaka je izbačen na zahtev klijenta; ostaje samo znak.
                Link i dalje vodi na početnu, a pristupačno ime mu daje
                `alt` na slici, pa link ne ostaje bezimen. */}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="w-7 h-7 rounded-full bg-navy-500 text-white flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </span>
          )}
          <button
            className="text-charcoal p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {webinar && <WebinarNavbarBar content={webinar} />}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-cream-50/95 backdrop-blur-3xl md:hidden">
          <div className="flex justify-end p-5">
            <button className="text-charcoal p-2" onClick={toggleMenu} aria-label="Close menu">
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center gap-6 mt-4">
            {navLinksResolved.map((link, index) => (
              link.children ? (
                <div key={link.to} className="flex flex-col items-center">
                  <button
                    onClick={() => setMobileExpandedNav(mobileExpandedNav === link.label ? null : link.label)}
                    className="text-2xl font-heading font-semibold tracking-tight text-charcoal flex items-center gap-2"
                    style={{
                      opacity: 0,
                      transform: 'translateY(24px)',
                      animation: `mobileNavFadeIn 0.4s ease-out ${index * 0.07 + 0.1}s forwards`,
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${mobileExpandedNav === link.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileExpandedNav === link.label && (
                    <div className="flex flex-col items-center gap-3 mt-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.to + child.label}
                          href={child.to}
                          className="text-lg font-heading text-charcoal-500 hover:text-navy-500 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <MobileNavLink key={link.to} to={link.to} index={index}>{link.label}</MobileNavLink>
              )
            ))}

            {user ? (
              <>
                <MobileNavLink to="/dashboard" index={navLinksResolved.length}>{headerLabels.myCoursesLabel}</MobileNavLink>
                {isAdmin && (
                  <MobileNavLink to="/admin" index={navLinksResolved.length + 1}>{headerLabels.adminPanelLabel}</MobileNavLink>
                )}
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                  className="mt-4 rounded-full border-2 border-navy-500 text-navy-600 px-10 py-3 text-lg font-heading font-semibold hover:bg-navy-50 transition-all duration-300 ease-out-expo w-[80%] text-center"
                  style={{
                    opacity: 0,
                    transform: 'translateY(24px)',
                    animation: `mobileNavFadeIn 0.4s ease-out ${(navLinksResolved.length + (isAdmin ? 2 : 1)) * 0.07 + 0.1}s forwards`,
                  }}
                >
                  {headerLabels.logoutLabel}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-4 rounded-full bg-navy-500 text-white px-10 py-3.5 text-lg font-heading font-semibold hover:bg-navy-600 transition-all duration-300 ease-out-expo active:scale-[0.98] w-[80%] text-center"
                style={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  animation: `mobileNavFadeIn 0.4s ease-out ${navLinksResolved.length * 0.07 + 0.1}s forwards`,
                }}
              >
                {headerLabels.loginButton}
              </Link>
            )}
          </nav>

          <style>{`
            @keyframes mobileNavFadeIn {
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </header>
  );
};

const NavLinkWithArrow = ({ to, label, isOpen }: { to: string; label: string; isOpen: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      href={to}
      className={`text-sm font-body font-medium px-3 py-1.5 rounded-full transition-all duration-300 ease-out-expo inline-flex items-center gap-1 ${
        isActive ? 'text-navy-500 bg-navy-50' : 'text-charcoal-500 hover:text-navy-500'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </Link>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  return (
    <Link
      href={to}
      className={`text-sm font-body font-medium px-3 py-1.5 rounded-full transition-all duration-300 ease-out-expo ${
        isActive ? 'text-navy-500 bg-navy-50' : 'text-charcoal-500 hover:text-navy-500'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, index }: { to: string; children: React.ReactNode; index: number }) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  return (
    <Link
      href={to}
      className={`text-2xl font-heading font-semibold tracking-tight transition-all duration-300 ease-out-expo ${
        isActive ? 'text-navy-500' : 'text-charcoal'
      }`}
      aria-current={isActive ? 'page' : undefined}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        animation: `mobileNavFadeIn 0.4s ease-out ${index * 0.07 + 0.1}s forwards`,
      }}
    >
      {children}
    </Link>
  );
};

export default Header;
