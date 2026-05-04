'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { scrollReveal, viewportOnce } from '@/lib/animations';

interface GuideChapterProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}

const GuideChapter: React.FC<GuideChapterProps> = ({ id, number, title, children }) => {
  return (
    <motion.section
      id={id}
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="scroll-mt-24"
    >
      <div className="mb-8">
        <span className="text-8xl font-heading font-bold text-navy-100 leading-none select-none">
          {number}
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-charcoal tracking-tight leading-tight -mt-4">
          {title}
        </h2>
        <div className="h-px w-16 bg-gold-300 mt-4" />
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
};

export default GuideChapter;
