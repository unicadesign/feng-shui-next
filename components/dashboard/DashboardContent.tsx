'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CreditCard, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import CourseCard from '@/components/dashboard/CourseCard';
import AvailableCourseCard from '@/components/dashboard/AvailableCourseCard';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { courses: allCourses, lessons: allLessons } = useCourses();
  const { enrollments: allEnrollments } = useEnrollments();

  if (!user) return null;

  const userEnrollments = allEnrollments.filter((e) => e.userId === user.id);
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId);

  const enrolledCourses = userEnrollments.flatMap((enrollment) => {
    const course = allCourses.find((c) => c.id === enrollment.courseId);
    if (!course) return [];
    const lessonsCount = allLessons.filter((l) => l.courseId === course.id).length;
    return [{ course, enrollment, lessonsCount }];
  });

  const availableCourses = allCourses.filter(
    (c) => c.published && !enrolledCourseIds.includes(c.id)
  );

  const allPayments = userEnrollments.flatMap((enrollment) => {
    const course = allCourses.find((c) => c.id === enrollment.courseId);
    return enrollment.payments.map((payment) => ({
      ...payment,
      courseName: course?.title || 'Nepoznat kurs',
    }));
  });

  const userInitial = user.name.charAt(0).toUpperCase();

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-navy-50 text-navy-600',
      pending: 'bg-gold-50 text-gold-500',
      overdue: 'bg-red-50 text-red-600',
    };
    const labels: Record<string, string> = {
      paid: 'Plaćeno',
      pending: 'Na čekanju',
      overdue: 'Zakasnelo',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const } },
  };

  return (
    <div className="bg-cream-50 min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-navy-500 flex items-center justify-center text-white font-heading font-bold text-xl shadow-soft">
                {userInitial}
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
                  Dobrodošli, {user.name.split(' ')[0]}
                </h1>
                <p className="text-charcoal-500 text-sm mt-0.5">
                  Upravljajte svojim kursevima i praćite napredak
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enrolled */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-center gap-2.5 mb-6">
              <BookOpen className="w-5 h-5 text-navy-500" />
              <h2 className="font-heading text-xl font-bold text-charcoal">Moji kursevi</h2>
            </div>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(({ course, enrollment, lessonsCount }) => (
                  <CourseCard
                    key={enrollment.id}
                    course={course}
                    enrollment={enrollment}
                    lessonsCount={lessonsCount}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-cream-100 p-1.5">
                <div className="rounded-xl bg-cream-50 p-8 text-center">
                  <GraduationCap className="w-10 h-10 text-sand-300 mx-auto mb-3" />
                  <p className="text-charcoal-500">
                    Još uvek niste upisani ni na jedan kurs. Pogledajte dostupne kurseve ispod.
                  </p>
                </div>
              </div>
            )}
          </motion.section>

          {/* Available */}
          {availableCourses.length > 0 && (
            <motion.section variants={itemVariants} className="mb-12">
              <div className="flex items-center gap-2.5 mb-6">
                <GraduationCap className="w-5 h-5 text-gold-500" />
                <h2 className="font-heading text-xl font-bold text-charcoal">Dostupni kursevi</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <AvailableCourseCard key={course.id} course={course} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Payments */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-2.5 mb-6">
              <CreditCard className="w-5 h-5 text-navy-500" />
              <h2 className="font-heading text-xl font-bold text-charcoal">Vaša plaćanja</h2>
            </div>
            {allPayments.length > 0 ? (
              <div className="rounded-2xl bg-cream-100 p-1.5">
                <div className="rounded-xl bg-cream-50 overflow-hidden">
                  <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-sand-50 border-b border-sand-200 text-xs font-semibold text-charcoal-500 uppercase tracking-wide">
                    <span>Kurs</span>
                    <span>Mesec</span>
                    <span>Iznos</span>
                    <span>Datum</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-sand-100">
                    {allPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 hover:bg-sand-50/50 transition-colors"
                      >
                        <div className="font-medium text-charcoal text-sm">
                          <span className="md:hidden text-charcoal-500 text-xs mr-1">Kurs:</span>
                          {payment.courseName}
                        </div>
                        <div className="text-charcoal-500 text-sm">
                          <span className="md:hidden text-charcoal-500 text-xs mr-1">Mesec:</span>
                          {payment.month}. rata
                        </div>
                        <div className="font-semibold text-charcoal text-sm">
                          <span className="md:hidden text-charcoal-500 text-xs font-normal mr-1">Iznos:</span>
                          &euro;{payment.amount}
                        </div>
                        <div className="text-charcoal-500 text-sm">
                          <span className="md:hidden text-charcoal-500 text-xs mr-1">Datum:</span>
                          {payment.paidAt
                            ? new Date(payment.paidAt).toLocaleDateString('sr-Latn-RS')
                            : '—'}
                        </div>
                        <div>
                          <span className="md:hidden text-charcoal-500 text-xs mr-1">Status:</span>
                          {statusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-cream-100 p-1.5">
                <div className="rounded-xl bg-cream-50 p-8 text-center">
                  <CreditCard className="w-10 h-10 text-sand-300 mx-auto mb-3" />
                  <p className="text-charcoal-500">Nemate zabeležena plaćanja.</p>
                </div>
              </div>
            )}
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardContent;
