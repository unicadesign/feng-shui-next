'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useEnrollments } from '@/hooks/useEnrollments';
import type { User } from '@/types';

type RoleFilter = 'all' | 'admin' | 'user';

interface ProfileRow {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

const AdminUsersContent: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { enrollments: allEnrollments } = useEnrollments();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(
          (data as ProfileRow[]).map((p) => ({
            id: p.id,
            email: '',
            name: p.name || '',
            role: (p.role || 'user') as 'admin' | 'user',
            createdAt: p.created_at?.split('T')[0] || '',
          }))
        );
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const getEnrollmentCount = (userId: string) =>
    allEnrollments.filter((e) => e.userId === userId).length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const roleBadge = (role: User['role']) => {
    const styles =
      role === 'admin'
        ? 'bg-gold-50 text-gold-600'
        : 'bg-navy-50 text-navy-600';
    const label = role === 'admin' ? 'Admin' : 'Korisnik';
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
        {label}
      </span>
    );
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 pl-10 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">Korisnici</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pretraži po imenu..."
            className={inputClasses}
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'admin', 'user'] as RoleFilter[]).map((role) => {
            const labels: Record<RoleFilter, string> = {
              all: 'Svi',
              admin: 'Admini',
              user: 'Korisnici',
            };
            return (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-sm font-body transition-all ${
                  roleFilter === role
                    ? 'bg-navy-500 text-white'
                    : 'bg-sand-200 text-charcoal hover:bg-sand-300'
                }`}
              >
                {labels[role]}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-500">Učitavanje...</div>
      ) : (
        <div className="rounded-2xl bg-cream-50 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-charcoal-500 border-b border-sand-200">
                  <th className="px-6 py-4 font-semibold w-8"></th>
                  <th className="px-6 py-4 font-semibold">Ime</th>
                  <th className="px-6 py-4 font-semibold">Uloga</th>
                  <th className="px-6 py-4 font-semibold">Datum registracije</th>
                  <th className="px-6 py-4 font-semibold">Broj upisa</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => {
                  const isExpanded = expandedUserId === user.id;
                  const userEnrollments = allEnrollments.filter((e) => e.userId === user.id);

                  return (
                    <React.Fragment key={user.id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => toggleExpand(user.id)}
                        className="border-b border-sand-100 hover:bg-cream-100/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-charcoal-500">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-charcoal font-semibold">
                          {user.name || '(bez imena)'}
                        </td>
                        <td className="px-6 py-4">{roleBadge(user.role)}</td>
                        <td className="px-6 py-4 text-charcoal-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('sr-RS') : '—'}
                        </td>
                        <td className="px-6 py-4 text-charcoal">{getEnrollmentCount(user.id)}</td>
                      </motion.tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-cream-100/30 px-6 py-4">
                            {userEnrollments.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-xs font-body font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                                  Upisi korisnika
                                </p>
                                {userEnrollments.map((enrollment) => (
                                  <Link
                                    key={enrollment.id}
                                    href="/admin/enrollments"
                                    className="flex items-center justify-between p-3 rounded-xl bg-cream-50 hover:shadow-soft transition-all"
                                  >
                                    <span className="text-sm font-body text-charcoal">
                                      {enrollment.courseId}
                                    </span>
                                    <span
                                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        enrollment.status === 'active'
                                          ? 'bg-navy-50 text-navy-600'
                                          : enrollment.status === 'completed'
                                          ? 'bg-gold-50 text-gold-600'
                                          : 'bg-sand-200 text-charcoal-500'
                                      }`}
                                    >
                                      {enrollment.status === 'active'
                                        ? 'Aktivan'
                                        : enrollment.status === 'completed'
                                        ? 'Završen'
                                        : 'Pauziran'}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm font-body text-charcoal-500">
                                Korisnik nema aktivnih upisa.
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-charcoal-500">Nema korisnika koji odgovaraju pretrazi.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersContent;
