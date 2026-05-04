'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { GlobalContent } from '@/types/content';

interface HeaderProps {
  content: GlobalContent;
}

const Header = ({ content }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileExpandedNav, setMobileExpandedNav] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const navLinks = content.navigation;
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-5">
      <nav
        className={`hidden md:flex items-center gap-1 rounded-full px-3 py-2 border transition-all duration-300 ease-out-expo ${
          isScrolled
            ? 'bg-cream-50/95 border-sand-200/50 shadow-lifted'
            : 'bg-cream-50/80 backdrop-blur-xl border-sand-200/50 shadow-soft'
        }`}
      >
        <Link href="/">
          <span className="text-lg font-heading font-bold text-charcoal px-3">{siteName}</span>
        </Link>

        {navLinks.map((link) => (
          link.children ? (
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
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-navy-50 transition-colors w-full text-left"
                >
                  <LogOut size={16} /> {headerLabels.logoutLabel}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-navy-500 text-white px-5 py-2 text-sm font-heading font-semibold hover:bg-navy-600 transition-all duration-300 ease-out-expo active:scale-[0.98]"
          >
            {headerLabels.loginButton}
          </Link>
        )}
      </nav>

      <div
        className={`md:hidden flex items-center justify-between rounded-full px-3 py-2 border mx-4 w-full transition-all duration-300 ease-out-expo ${
          isScrolled
            ? 'bg-cream-50/95 border-sand-200/50 shadow-lifted'
            : 'bg-cream-50/80 backdrop-blur-xl border-sand-200/50 shadow-soft'
        }`}
      >
        <Link href="/">
          <span className="text-lg font-heading font-bold text-charcoal px-3">{siteName}</span>
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

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-cream-50/95 backdrop-blur-3xl md:hidden">
          <div className="flex justify-end p-5">
            <button className="text-charcoal p-2" onClick={toggleMenu} aria-label="Close menu">
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center gap-6 mt-4">
            {navLinks.map((link, index) => (
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
                <MobileNavLink to="/dashboard" index={navLinks.length}>{headerLabels.myCoursesLabel}</MobileNavLink>
                {isAdmin && (
                  <MobileNavLink to="/admin" index={navLinks.length + 1}>{headerLabels.adminPanelLabel}</MobileNavLink>
                )}
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="mt-4 rounded-full border-2 border-navy-500 text-navy-600 px-10 py-3 text-lg font-heading font-semibold hover:bg-navy-50 transition-all duration-300 ease-out-expo w-[80%] text-center"
                  style={{
                    opacity: 0,
                    transform: 'translateY(24px)',
                    animation: `mobileNavFadeIn 0.4s ease-out ${(navLinks.length + (isAdmin ? 2 : 1)) * 0.07 + 0.1}s forwards`,
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
                  animation: `mobileNavFadeIn 0.4s ease-out ${navLinks.length * 0.07 + 0.1}s forwards`,
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
