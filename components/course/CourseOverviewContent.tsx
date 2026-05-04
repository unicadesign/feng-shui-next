'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CreditCard,
  CheckCircle,
  Sparkles,
  Video,
  Phone,
  PhoneOff,
} from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import Button from '@/components/Button';
import LessonList from '@/components/course/LessonList';
import ZoomCallBadge from '@/components/course/ZoomCallBadge';
import type { ZoomOption } from '@/types';

const formatRsd = (amount: number) => amount.toLocaleString('sr-Latn-RS');

interface CourseOverviewContentProps {
  courseId: string;
}

const CourseOverviewContent: React.FC<CourseOverviewContentProps> = ({ courseId }) => {
  const { user } = useAuth();
  const { courses: allCourses, lessons: allLessons, modules: allModules } = useCourses();
  const { enrollments: allEnrollments } = useEnrollments();

  const course = allCourses.find((c) => c.id === courseId);
  const lessons = allLessons.filter((l) => l.courseId === courseId);
  const modules = allModules
    .filter((m) => m.courseId === courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const enrollment = allEnrollments.find(
    (e) => e.userId === user?.id && e.courseId === courseId
  );

  const [paymentOption, setPaymentOption] = useState<'full' | 'installment'>('full');
  const [zoomOption, setZoomOption] = useState<ZoomOption>('none');

  const totalPrice = useMemo(() => {
    if (!course) return 0;

    let base =
      paymentOption === 'full'
        ? course.price
        : (course.installmentPrice ?? 0) * (course.installmentMonths ?? 1);

    if (zoomOption === 'single') base += course.zoomPriceSingle ?? 0;
    if (zoomOption === 'weekly') base += course.zoomPriceWeekly ?? 0;

    return base;
  }, [course, paymentOption, zoomOption]);

  const totalPriceRsd = useMemo(() => {
    if (!course || !course.priceRsd) return null;

    let base =
      paymentOption === 'full'
        ? course.priceRsd
        : (course.installmentPriceRsd ?? 0) * (course.installmentMonths ?? 1);

    if (zoomOption === 'single') base += course.zoomPriceSingleRsd ?? 0;
    if (zoomOption === 'weekly') base += course.zoomPriceWeeklyRsd ?? 0;

    return base;
  }, [course, paymentOption, zoomOption]);

  if (!course) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-charcoal mb-2">
            Kurs nije pronađen
          </h1>
          <p className="text-charcoal-500">
            Ovaj kurs ne postoji ili je uklonjen.
          </p>
          <Button to="/school" variant="primary" className="mt-6">
            Nazad na školu
          </Button>
        </div>
      </div>
    );
  }

  // ENROLLED VIEW
  if (enrollment) {
    const paidCount = enrollment.payments.filter((p) => p.status === 'paid').length;
    const totalPayments = enrollment.payments.length;
    const nextZoom = enrollment.zoomLinks
      ?.filter((z) => new Date(z.scheduledAt) > new Date())
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )[0];

    return (
      <div className="pt-24 min-h-screen bg-cream-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="mb-10">
              <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-3">
                {course.title}
              </h1>
              <p className="text-charcoal-500 max-w-2xl">
                {course.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-1">
                  <BookOpen className="w-5 h-5 text-navy-500" />
                  <span className="text-sm text-charcoal-500">Lekcije</span>
                </div>
                <p className="font-heading text-xl text-charcoal">
                  {lessons.length} lekcija
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-1">
                  <CreditCard className="w-5 h-5 text-navy-500" />
                  <span className="text-sm text-charcoal-500">Plaćanje</span>
                </div>
                <p className="font-heading text-xl text-charcoal">
                  {paidCount}/{totalPayments} uplata
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-1">
                  <CheckCircle className="w-5 h-5 text-navy-500" />
                  <span className="text-sm text-charcoal-500">Status</span>
                </div>
                <p className="font-heading text-xl text-charcoal capitalize">
                  {enrollment.status === 'active'
                    ? 'Aktivan'
                    : enrollment.status === 'paused'
                    ? 'Pauziran'
                    : 'Završen'}
                </p>
              </div>
            </div>

            {nextZoom && (
              <div className="mb-10 max-w-sm">
                <ZoomCallBadge
                  url={nextZoom.url}
                  scheduledAt={nextZoom.scheduledAt}
                  weekNumber={nextZoom.weekNumber}
                />
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-heading text-xl text-charcoal mb-4">
                Program kursa
              </h2>
              <LessonList
                lessons={lessons}
                enrollment={enrollment}
                courseStartDate={enrollment.startDate}
                modules={modules.length > 0 ? modules : undefined}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // NOT-ENROLLED VIEW
  const hasInstallment =
    course.installmentPrice != null && course.installmentMonths != null;
  const showSingle = course.zoomSingleEnabled && course.zoomPriceSingle != null;
  const showWeekly = course.zoomWeeklyEnabled && course.zoomPriceWeekly != null;
  const hasZoom = showSingle || showWeekly;

  const zoomOptions: { value: ZoomOption; label: string; price: number; priceRsd?: number }[] = [
    { value: 'none', label: 'Bez poziva', price: 0 },
    ...(showSingle
      ? [
          {
            value: 'single' as ZoomOption,
            label: 'Jedan poziv',
            price: course.zoomPriceSingle!,
            priceRsd: course.zoomPriceSingleRsd,
          },
        ]
      : []),
    ...(showWeekly
      ? [
          {
            value: 'weekly' as ZoomOption,
            label: 'Nedeljni pozivi',
            price: course.zoomPriceWeekly!,
            priceRsd: course.zoomPriceWeeklyRsd,
          },
        ]
      : []),
  ];

  const zoomIcons: Record<ZoomOption, React.ReactNode> = {
    none: <PhoneOff className="w-4 h-4" />,
    single: <Phone className="w-4 h-4" />,
    weekly: <Video className="w-4 h-4" />,
  };

  const sortedLessons = [...lessons].sort((a, b) => a.weekNumber - b.weekNumber);
  const hasModules = modules.length > 0;

  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
                {course.title}
              </h1>
              <p className="text-charcoal-500 text-lg leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-charcoal-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-navy-500" />
                  {course.totalLessons} nedelja
                </span>
                {modules.some((m) => m.isVazaIzobilja) && (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    Uključuje Vazu Izobilja
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal text-center mb-10">
              Izaberite način plaćanja
            </h2>

            <div
              className={`grid gap-6 mb-10 ${
                hasInstallment ? 'md:grid-cols-2' : 'max-w-md mx-auto'
              }`}
            >
              <button
                onClick={() => setPaymentOption('full')}
                className={`text-left rounded-2xl p-6 border-2 transition-all duration-200 ${
                  paymentOption === 'full'
                    ? 'border-navy-500 bg-navy-50 shadow-soft'
                    : 'border-sand-200 bg-cream-50 hover:border-sand-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg text-charcoal">
                    Plaćanje u celosti
                  </h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentOption === 'full'
                        ? 'border-navy-500 bg-navy-500'
                        : 'border-sand-300'
                    }`}
                  >
                    {paymentOption === 'full' && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <p className="font-heading text-3xl text-charcoal mb-1">
                  {course.price}&euro;
                </p>
                {course.priceRsd && (
                  <p className="text-sm text-charcoal-500 mb-2">
                    {formatRsd(course.priceRsd)} RSD
                  </p>
                )}
                <ul className="space-y-2 text-sm text-charcoal-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-navy-500" />
                    Pristup svim lekcijama
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-navy-500" />
                    Jedna uplata
                  </li>
                  {hasInstallment && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-navy-500" />
                      Ušteda u odnosu na rate
                    </li>
                  )}
                </ul>
              </button>

              {hasInstallment && (
                <button
                  onClick={() => setPaymentOption('installment')}
                  className={`text-left rounded-2xl p-6 border-2 transition-all duration-200 ${
                    paymentOption === 'installment'
                      ? 'border-navy-500 bg-navy-50 shadow-soft'
                      : 'border-sand-200 bg-cream-50 hover:border-sand-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg text-charcoal">Na rate</h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentOption === 'installment'
                          ? 'border-navy-500 bg-navy-500'
                          : 'border-sand-300'
                      }`}
                    >
                      {paymentOption === 'installment' && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <p className="font-heading text-3xl text-charcoal mb-1">
                    {course.installmentPrice}&euro;
                    <span className="text-base text-charcoal-500 font-body font-normal">
                      /mesečno
                    </span>
                  </p>
                  {course.installmentPriceRsd && (
                    <p className="text-sm text-charcoal-500 mb-1">
                      {formatRsd(course.installmentPriceRsd)} RSD/mesečno
                    </p>
                  )}
                  <p className="text-sm text-charcoal-500 mb-3">
                    {course.installmentMonths} meseca
                  </p>
                  <ul className="space-y-2 text-sm text-charcoal-500">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-navy-500" />
                      Pristup svim lekcijama
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-navy-500" />
                      Fleksibilno plaćanje
                    </li>
                  </ul>
                </button>
              )}
            </div>

            {hasZoom && (
              <div className="mb-10">
                <h3 className="font-heading text-lg text-charcoal mb-4">
                  Zoom konsultacije
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {zoomOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setZoomOption(opt.value)}
                      className={`flex items-center gap-3 rounded-xl p-4 border-2 transition-all duration-200 text-left ${
                        zoomOption === opt.value
                          ? 'border-navy-500 bg-navy-50'
                          : 'border-sand-200 bg-cream-50 hover:border-sand-300'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          zoomOption === opt.value
                            ? 'bg-navy-500 text-white'
                            : 'bg-sand-200 text-charcoal-500'
                        }`}
                      >
                        {zoomIcons[opt.value]}
                      </div>
                      <div>
                        <p className="font-heading text-sm text-charcoal">
                          {opt.label}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          {opt.price === 0
                            ? 'Besplatno'
                            : `+${opt.price}€${opt.priceRsd ? ` / ${formatRsd(opt.priceRsd)} RSD` : ''}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-cream-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-charcoal-500 mb-1">Ukupna cena</p>
                <p className="font-heading text-3xl text-charcoal">
                  {totalPrice}&euro;
                  {paymentOption === 'installment' && (
                    <span className="text-base text-charcoal-500 font-body font-normal ml-2">
                      ({course.installmentPrice}&euro; x {course.installmentMonths}{' '}
                      meseca
                      {zoomOption !== 'none' && ' + Zoom'})
                    </span>
                  )}
                </p>
                {totalPriceRsd != null && totalPriceRsd > 0 && (
                  <p className="text-sm text-charcoal-500 mt-1">
                    {formatRsd(totalPriceRsd)} RSD
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  alert('PayPal integracija u pripremi. Hvala na interesovanju!')
                }
              >
                Kupi kurs putem PayPal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal text-center mb-10">
              Program kursa
            </h2>

            {hasModules ? (
              <div className="space-y-8">
                {modules.map((mod) => {
                  const modLessons = sortedLessons.filter((l) => l.moduleId === mod.id);
                  if (modLessons.length === 0) return null;

                  return (
                    <div key={mod.id}>
                      <div className={`rounded-xl p-5 mb-3 ${mod.isVazaIzobilja ? 'bg-gold-50 border border-gold-200' : 'bg-navy-50 border border-navy-100'}`}>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-heading font-bold ${mod.isVazaIzobilja ? 'bg-gold-400 text-white' : 'bg-navy-500 text-white'}`}>
                            {mod.orderIndex}
                          </span>
                          <h3 className={`font-heading text-lg ${mod.isVazaIzobilja ? 'text-gold-600' : 'text-charcoal'}`}>
                            {mod.title}
                          </h3>
                          {mod.isVazaIzobilja && <Sparkles className="w-4 h-4 text-gold-500" />}
                        </div>
                        <p className="text-sm text-charcoal-500 ml-11">{mod.description}</p>
                      </div>

                      <div className="space-y-3 ml-2">
                        {modLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center gap-4 rounded-xl p-4 ${
                              lesson.isVazaIzobilja
                                ? 'bg-gold-50 border border-gold-400/30'
                                : 'bg-white shadow-card'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-semibold flex-shrink-0 ${
                                lesson.isVazaIzobilja
                                  ? 'bg-gold-400 text-white'
                                  : 'bg-navy-50 text-navy-600'
                              }`}
                            >
                              {lesson.isVazaIzobilja ? (
                                <Sparkles className="w-5 h-5" />
                              ) : (
                                lesson.weekNumber
                              )}
                            </div>
                            <div>
                              <p
                                className={`font-heading text-sm ${
                                  lesson.isVazaIzobilja
                                    ? 'text-gold-500'
                                    : 'text-charcoal'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p className="text-xs text-charcoal-500">
                                Nedelja {lesson.weekNumber}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 rounded-xl p-4 ${
                      lesson.isVazaIzobilja
                        ? 'bg-gold-50 border border-gold-400/30'
                        : 'bg-white shadow-card'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-semibold ${
                        lesson.isVazaIzobilja
                          ? 'bg-gold-400 text-white'
                          : 'bg-navy-50 text-navy-600'
                      }`}
                    >
                      {lesson.isVazaIzobilja ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        lesson.weekNumber
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-heading text-sm ${
                          lesson.isVazaIzobilja
                            ? 'text-gold-500'
                            : 'text-charcoal'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-charcoal-500">
                        Nedelja {lesson.weekNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CourseOverviewContent;
