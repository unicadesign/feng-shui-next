'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import Button from '@/components/Button';
import VideoPlayer from '@/components/course/VideoPlayer';
import LessonList, { isLessonAvailable } from '@/components/course/LessonList';
import PaymentGate from '@/components/course/PaymentGate';
import ZoomCallBadge from '@/components/course/ZoomCallBadge';

interface LessonViewerContentProps {
  courseId: string;
  lessonId: string;
}

const LessonViewerContent: React.FC<LessonViewerContentProps> = ({ courseId, lessonId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { courses: allCourses, lessons: allLessons, modules: allModules } = useCourses();
  const { enrollments: allEnrollments } = useEnrollments();

  const course = allCourses.find((c) => c.id === courseId);
  const lessons = allLessons
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.weekNumber - b.weekNumber);
  const modules = allModules
    .filter((m) => m.courseId === courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const lesson = lessons.find((l) => l.id === lessonId);
  const enrollment = allEnrollments.find(
    (e) => e.userId === user?.id && e.courseId === courseId
  );

  if (!course || !lesson) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-charcoal mb-2">
            Lekcija nije pronađena
          </h1>
          <p className="text-charcoal-500 mb-6">
            Ova lekcija ne postoji ili je uklonjena.
          </p>
          <Button to={`/course/${courseId}`} variant="primary">
            Nazad na kurs
          </Button>
        </div>
      </div>
    );
  }

  const access = isLessonAvailable(lesson, enrollment, enrollment?.startDate);

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const zoomLink = enrollment?.zoomLinks?.find(
    (z) => z.weekNumber === lesson.weekNumber
  );

  const paymentSummary =
    enrollment?.paymentType === 'installment' ? (
      <div className="mt-6 p-4 bg-cream-100 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-charcoal-500" />
          <span className="font-heading text-sm text-charcoal">Status uplata</span>
        </div>
        <div className="space-y-2">
          {enrollment.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">Mesec {p.month}</span>
              <span
                className={`font-medium ${
                  p.status === 'paid'
                    ? 'text-navy-500'
                    : p.status === 'overdue'
                    ? 'text-red-500'
                    : 'text-gold-500'
                }`}
              >
                {p.status === 'paid'
                  ? 'Plaćeno'
                  : p.status === 'overdue'
                  ? 'Kasni'
                  : 'Na čekanju'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/course/${courseId}`}
          className="inline-flex items-center gap-1 text-sm text-charcoal-500 hover:text-navy-500 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          {course.title}
        </Link>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-card sticky top-28">
              <h3 className="font-heading text-lg text-charcoal mb-4">
                {course.title}
              </h3>
              <LessonList
                lessons={lessons}
                currentLessonId={lessonId}
                enrollment={enrollment}
                courseStartDate={enrollment?.startDate}
                modules={modules.length > 0 ? modules : undefined}
              />
              {paymentSummary}
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-12 lg:col-span-9">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {access.available && (
                <div className="mb-8">
                  <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-3">
                    {lesson.title}
                  </h1>
                  {lesson.description && (
                    <p className="text-charcoal-500 leading-relaxed">
                      {lesson.description}
                    </p>
                  )}
                </div>
              )}

              <div className="relative mb-8">
                {!access.available ? (
                  <>
                    <div className="rounded-2xl overflow-hidden filter blur-sm opacity-50">
                      <div
                        className="w-full bg-sand-200"
                        style={{ paddingBottom: '56.25%' }}
                      />
                    </div>
                    <PaymentGate
                      type={access.reason!}
                      availableDate={access.availableDate}
                    />
                  </>
                ) : lesson.videos && lesson.videos.length > 0 ? (
                  <div className="space-y-6">
                    {lesson.videos.map((v, i) => (
                      <div key={v.id || i}>
                        {v.title && (
                          <h3 className="font-heading text-base md:text-lg text-charcoal mb-2">
                            {v.title}
                          </h3>
                        )}
                        <VideoPlayer
                          videoPath={v.videoPath}
                          videoUrl={v.videoUrl}
                          title={v.title || lesson.title}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <VideoPlayer
                    videoPath={lesson.videoPath}
                    videoUrl={lesson.videoUrl}
                    title={lesson.title}
                  />
                )}
              </div>

              {access.available && (
                <>
                  {zoomLink && (
                    <div className="mb-8 max-w-sm">
                      <ZoomCallBadge
                        url={zoomLink.url}
                        scheduledAt={zoomLink.scheduledAt}
                        weekNumber={zoomLink.weekNumber}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-sand-200 pt-6 mt-8">
                    {prevLesson ? (
                      <button
                        onClick={() =>
                          router.push(`/course/${courseId}/lesson/${prevLesson.id}`)
                        }
                        className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-navy-500 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <div className="text-left">
                          <span className="text-xs text-charcoal-400 block">
                            Prethodna
                          </span>
                          <span className="font-heading">{prevLesson.title}</span>
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}
                    {nextLesson ? (
                      <button
                        onClick={() =>
                          router.push(`/course/${courseId}/lesson/${nextLesson.id}`)
                        }
                        className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-navy-500 transition-colors"
                      >
                        <div className="text-right">
                          <span className="text-xs text-charcoal-400 block">
                            Sledeća
                          </span>
                          <span className="font-heading">{nextLesson.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </>
              )}
            </motion.div>

            {/* Mobile lesson list */}
            <div className="lg:hidden mt-10">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center justify-between bg-white rounded-2xl p-5 shadow-card"
              >
                <span className="font-heading text-charcoal">Sve lekcije</span>
                {sidebarOpen ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-500" />
                )}
              </button>
              {sidebarOpen && (
                <div className="bg-white rounded-b-2xl px-5 pb-5 shadow-card -mt-2">
                  <LessonList
                    lessons={lessons}
                    currentLessonId={lessonId}
                    enrollment={enrollment}
                    courseStartDate={enrollment?.startDate}
                    modules={modules.length > 0 ? modules : undefined}
                  />
                  {paymentSummary}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LessonViewerContent;
