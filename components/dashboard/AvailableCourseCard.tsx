'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/types';
import Button from '@/components/Button';
import CmsImage from '@/components/CmsImage';

interface AvailableCourseCardProps {
  course: Course;
}

const AvailableCourseCard: React.FC<AvailableCourseCardProps> = ({ course }) => {
  const typeBadge =
    course.type === 'standard'
      ? { label: 'Standardni', className: 'bg-navy-50 text-navy-600' }
      : { label: 'Jednokratni', className: 'bg-gold-50 text-gold-500' };

  const priceDisplay =
    course.type === 'standard' && course.installmentPrice
      ? `od €${course.installmentPrice}/mesečno`
      : `€${course.price.toLocaleString('de-DE')}`;

  const truncatedDescription =
    course.description.length > 120
      ? course.description.slice(0, 120).trimEnd() + '...'
      : course.description;

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
            className="w-full h-44 object-cover rounded-xl"
          />
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge.className}`}
          >
            {typeBadge.label}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-charcoal mb-2 leading-snug">
          {course.title}
        </h3>

        <p className="text-sm text-charcoal-500 leading-relaxed mb-4 flex-1">
          {truncatedDescription}
        </p>

        <div className="mb-4">
          {course.type === 'standard' && course.installmentPrice ? (
            <div>
              <span className="font-heading text-xl font-bold text-charcoal">
                &euro;{course.price.toLocaleString('de-DE')}
              </span>
              <span className="text-sm text-charcoal-500 ml-2">
                ili {priceDisplay}
              </span>
              {course.priceRsd && (
                <p className="text-xs text-charcoal-400 mt-0.5">
                  {course.priceRsd.toLocaleString('sr-Latn-RS')} RSD
                </p>
              )}
            </div>
          ) : (
            <div>
              <span className="font-heading text-xl font-bold text-charcoal">
                &euro;{course.price.toLocaleString('de-DE')}
              </span>
              {course.priceRsd && (
                <p className="text-xs text-charcoal-400 mt-0.5">
                  {course.priceRsd.toLocaleString('sr-Latn-RS')} RSD
                </p>
              )}
            </div>
          )}
        </div>

        <Link href={`/course/${course.id}`}>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Pogledaj kurs
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default AvailableCourseCard;
