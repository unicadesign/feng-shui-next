'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, AlertCircle } from 'lucide-react';
import { Course, Enrollment } from '@/types';
import Button from '@/components/Button';
import CmsImage from '@/components/CmsImage';

interface CourseCardProps {
  course: Course;
  enrollment: Enrollment;
  lessonsCount: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, enrollment, lessonsCount }) => {
  const startDate = new Date(enrollment.startDate);
  const now = new Date();
  const weeksElapsed = Math.max(
    0,
    Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  );

  let progress: number;
  if (enrollment.status === 'completed') {
    progress = 100;
  } else {
    progress = Math.min(100, Math.round((weeksElapsed / Math.max(lessonsCount, 1)) * 100));
  }

  const hasOverduePayment = enrollment.payments.some((p) => p.status === 'overdue');

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: { label: 'Aktivan', className: 'bg-navy-50 text-navy-600' },
    paused: { label: 'Pauziran', className: 'bg-gold-50 text-gold-500' },
    completed: { label: 'Završen', className: 'bg-gold-50 text-gold-500' },
  };

  const status = statusConfig[enrollment.status] || statusConfig.active;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-cream-100 p-1.5"
    >
      <div className="rounded-xl bg-cream-50 p-6 h-full flex flex-col">
        <div className="relative mb-4">
          <CmsImage
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-36 object-cover rounded-xl"
          />
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-charcoal mb-3 leading-snug">
          {course.title}
        </h3>

        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-charcoal-500">Napredak</span>
            <span className="text-xs font-bold text-navy-600">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sand-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] as const, delay: 0.2 }}
              className="h-full rounded-full bg-navy-500"
            />
          </div>
          <p className="text-xs text-charcoal-500 mt-1.5">
            {Math.min(weeksElapsed, lessonsCount)} od {lessonsCount} lekcija
          </p>
        </div>

        {hasOverduePayment && (
          <div className="flex items-center gap-1.5 mb-3 text-red-600">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-medium">Imate zakasnelu uplatu</span>
          </div>
        )}

        <Link href={`/course/${course.id}`}>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            icon={<Play className="w-3.5 h-3.5" />}
          >
            Nastavi
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
