'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  ArrowLeft,
  LogOut,
  X,
  Home,
  User,
  Briefcase,
  Gift,
  Settings,
  Inbox,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInquiries } from '@/hooks/useInquiries';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Kontrolna tabla', icon: LayoutDashboard, path: '/admin' },
  { label: 'Upiti', icon: Inbox, path: '/admin/inquiries', showBadge: true },
  { label: 'Kursevi', icon: BookOpen, path: '/admin/courses' },
  { label: 'Korisnici', icon: Users, path: '/admin/users' },
  { label: 'Upisi', icon: GraduationCap, path: '/admin/enrollments' },
];

const contentNavItems = [
  { label: 'Početna', icon: Home, path: '/admin/content/home' },
  { label: 'O nama', icon: User, path: '/admin/content/about' },
  { label: 'Usluge', icon: Briefcase, path: '/admin/content/services' },
  { label: 'Škola', icon: GraduationCap, path: '/admin/content/school' },
  { label: 'Vaza Izobilja', icon: Gift, path: '/admin/content/vaza' },
  { label: 'Podešavanja', icon: Settings, path: '/admin/content/global' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { unreadCount } = useInquiries();

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 w-60 bg-charcoal text-sand-300 min-h-screen
          flex flex-col transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/admin" className="font-heading text-xl text-cream-50 tracking-wide">
            ptPLAN Admin
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-sand-300 hover:text-cream-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const badge = item.showBadge && unreadCount > 0;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-body
                  transition-all duration-200
                  ${active
                    ? 'bg-navy-500/20 text-navy-400'
                    : 'text-sand-300 hover:bg-white/5 hover:text-cream-50'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center px-1.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-white/10" />

        <nav className="px-3 py-2 space-y-1">
          <div className="text-[10px] uppercase tracking-[0.15em] text-sand-400 px-4 mt-4 mb-2">
            Sadržaj sajta
          </div>
          {contentNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-body
                  transition-all duration-200
                  ${active
                    ? 'bg-navy-500/20 text-navy-400'
                    : 'text-sand-300 hover:bg-white/5 hover:text-cream-50'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-white/10" />

        <div className="px-3 py-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-body text-sand-300 hover:bg-white/5 hover:text-cream-50 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span>Nazad na sajt</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-body text-sand-300 hover:bg-white/5 hover:text-cream-50 transition-all duration-200 w-full text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Odjava</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
