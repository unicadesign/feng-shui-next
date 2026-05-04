'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';
import type { Lesson, Enrollment, CourseModule } from '@/types';

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId?: string;
  enrollment?: Enrollment;
  courseStartDate?: string;
  modules?: CourseModule[];
}

export function isLessonAvailable(
  lesson: Lesson,
  enrollment?: Enrollment,
  courseStartDate?: string,
): { available: boolean; reason?: 'time' | 'payment'; availableDate?: string } {
  if (!enrollment || !courseStartDate) {
    return { available: false, reason: 'payment' };
  }

  const start = new Date(courseStartDate);
  const availableAfter = new Date(start);
  availableAfter.setDate(availableAfter.getDate() + lesson.availableAfterWeeks * 7);
  const now = new Date();

  if (now < availableAfter) {
    return {
      available: false,
      reason: 'time',
      availableDate: availableAfter.toLocaleDateString('sr-Latn-RS', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }

  if (enrollment.paymentType === 'installment') {
    const requiredMonth = Math.ceil(lesson.weekNumber / 4);
    const payment = enrollment.payments.find((p) => p.month === requiredMonth);
    if (!payment || payment.status !== 'paid') {
      return { available: false, reason: 'payment' };
    }
  } else {
    const payment = enrollment.payments[0];
    if (!payment || payment.status !== 'paid') {
      return { available: false, reason: 'payment' };
    }
  }

  return { available: true };
}

function isLessonCompleted(lesson: Lesson, enrollment?: Enrollment): boolean {
  if (!enrollment || !enrollment.startDate) return false;

  const start = new Date(enrollment.startDate);
  const nextWeekDate = new Date(start);
  nextWeekDate.setDate(nextWeekDate.getDate() + (lesson.availableAfterWeeks + 1) * 7);
  return new Date() > nextWeekDate;
}

const LessonItem: React.FC<{
  lesson: Lesson;
  currentLessonId?: string;
  enrollment?: Enrollment;
  courseStartDate?: string;
}> = ({ lesson, currentLessonId, enrollment, courseStartDate }) => {
  const { available } = isLessonAvailable(lesson, enrollment, courseStartDate);
  const completed = available && isLessonCompleted(lesson, enrollment);
  const isCurrent = lesson.id === currentLessonId;
  const isVaza = lesson.isVazaIzobilja;

  const baseClasses =
    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200';

  if (!available) {
    return (
      <div className={`${baseClasses} text-charcoal-400 cursor-not-allowed opacity-60`}>
        <Lock className="w-4 h-4 flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-xs text-charcoal-400 block">
            Nedelja {lesson.weekNumber}
          </span>
          <span className="block truncate">{lesson.title}</span>
        </div>
      </div>
    );
  }

  const Icon = isVaza ? Sparkles : completed ? CheckCircle : PlayCircle;
  const iconColor = isVaza ? 'text-gold-500' : 'text-navy-500';

  return (
    <Link
      href={`/course/${lesson.courseId}/lesson/${lesson.id}`}
      className={`${baseClasses} hover:bg-navy-50/60 ${
        isCurrent ? 'bg-navy-50 border-l-2 border-navy-500 font-medium' : ''
      } ${isVaza ? 'bg-gold-50/50' : ''}`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
      <div className="min-w-0">
        <span
          className={`text-xs block ${
            isVaza ? 'text-gold-500 font-medium' : 'text-charcoal-400'
          }`}
        >
          Nedelja {lesson.weekNumber}
        </span>
        <span
          className={`block truncate ${
            isVaza ? 'text-gold-500 font-medium' : 'text-charcoal'
          }`}
        >
          {lesson.title}
        </span>
      </div>
    </Link>
  );
};

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  currentLessonId,
  enrollment,
  courseStartDate,
  modules,
}) => {
  const sortedLessons = [...lessons].sort((a, b) => a.weekNumber - b.weekNumber);
  const hasModules = modules && modules.length > 0;

  if (hasModules) {
    const sortedModules = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
      <nav className="space-y-4">
        {sortedModules.map((mod) => {
          const modLessons = sortedLessons.filter((l) => l.moduleId === mod.id);
          if (modLessons.length === 0) return null;

          return (
            <div key={mod.id}>
              <div className={`px-4 py-2 mb-1 rounded-lg ${mod.isVazaIzobilja ? 'bg-gold-50' : 'bg-navy-50/50'}`}>
                <div className="flex items-center gap-2">
                  {mod.isVazaIzobilja && <Sparkles className="w-3 h-3 text-gold-500" />}
                  <span className={`text-xs font-heading font-semibold ${mod.isVazaIzobilja ? 'text-gold-600' : 'text-navy-600'}`}>
                    Mesec {mod.orderIndex}: {mod.title}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {modLessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    currentLessonId={currentLessonId}
                    enrollment={enrollment}
                    courseStartDate={courseStartDate}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {sortedLessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          currentLessonId={currentLessonId}
          enrollment={enrollment}
          courseStartDate={courseStartDate}
        />
      ))}
    </nav>
  );
};

export default LessonList;
