'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Euro, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';

const AdminDashboardContent: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const { courses } = useCourses();
  const { enrollments } = useEnrollments();
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p: { id: string; name: string }) => {
            map[p.id] = p.name;
          });
          setUserNames(map);
        }
      });

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user')
      .then(({ count }) => {
        setTotalUsers(count || 0);
      });
  }, []);

  const activeEnrollments = enrollments.filter((e) => e.status === 'active').length;
  const totalRevenue = enrollments.reduce(
    (sum, e) =>
      sum + e.payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    0
  );
  const publishedCourses = courses.filter((c) => c.published).length;

  const stats = [
    { label: 'Ukupno korisnika', value: totalUsers, icon: Users, color: 'text-navy-500' },
    { label: 'Aktivni upisi', value: activeEnrollments, icon: GraduationCap, color: 'text-gold-500' },
    { label: 'Prihod', value: `${totalRevenue.toLocaleString('sr-RS')}€`, icon: Euro, color: 'text-navy-600' },
    { label: 'Objavljeni kursevi', value: publishedCourses, icon: BookOpen, color: 'text-gold-400' },
  ];

  const recentEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const getUserName = (userId: string) => userNames[userId] || 'Korisnik';
  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Nepoznat';

  const getOverallPaymentStatus = (enrollment: typeof enrollments[0]) => {
    const statuses = enrollment.payments.map((p) => p.status);
    if (statuses.includes('overdue')) return 'overdue';
    if (statuses.includes('pending')) return 'pending';
    return 'paid';
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-navy-50 text-navy-600',
      pending: 'bg-gold-50 text-gold-600',
      overdue: 'bg-red-50 text-red-600',
    };
    const labels: Record<string, string> = {
      paid: 'Plaćeno',
      pending: 'Na čekanju',
      overdue: 'Kasni',
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">Kontrolna tabla</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-cream-50 shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-cream-100 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-heading text-charcoal mb-1">{stat.value}</div>
              <div className="text-sm font-body text-charcoal-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-cream-50 shadow-card overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-sand-200">
          <h2 className="font-heading text-lg text-charcoal">Poslednji upisi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-charcoal-500 border-b border-sand-200">
                <th className="px-6 py-3 font-semibold">Korisnik</th>
                <th className="px-6 py-3 font-semibold">Kurs</th>
                <th className="px-6 py-3 font-semibold">Datum</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-b border-sand-100 hover:bg-cream-100/50 transition-colors"
                >
                  <td className="px-6 py-4 text-charcoal">{getUserName(enrollment.userId)}</td>
                  <td className="px-6 py-4 text-charcoal">{getCourseName(enrollment.courseId)}</td>
                  <td className="px-6 py-4 text-charcoal-500">
                    {new Date(enrollment.startDate).toLocaleDateString('sr-RS')}
                  </td>
                  <td className="px-6 py-4">{statusBadge(getOverallPaymentStatus(enrollment))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-sand-200">
          <Link
            href="/admin/enrollments"
            className="text-sm font-body text-navy-500 hover:text-navy-600 transition-colors"
          >
            Pogledaj sve upise →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardContent;
