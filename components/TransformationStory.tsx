'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Quote } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import CmsImage from '@/components/CmsImage';

interface TransformationStoryProps {
  beforeImage: string;
  afterImage: string;
  clientName: string;
  location: string;
  service: string;
  quote: string;
  reverse?: boolean;
}

const TransformationStory: React.FC<TransformationStoryProps> = ({
  beforeImage,
  afterImage,
  clientName,
  location,
  service,
  quote,
  reverse = false,
}) => {
  return (
    <motion.div
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="rounded-2xl bg-cream-100 p-1.5 shadow-warm"
    >
      <div className="rounded-xl bg-cream-50 p-6 md:p-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 ${reverse ? 'md:direction-rtl' : ''}`}>
          <div className={`relative rounded-xl overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
            <CmsImage
              src={beforeImage}
              alt="Pre transformacije"
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
            />
            <span className="absolute top-4 left-4 rounded-full bg-charcoal/80 text-cream-50 px-3 py-1 text-xs uppercase tracking-[0.15em] font-medium font-body">
              Pre
            </span>
          </div>

          <div className={`relative rounded-xl overflow-hidden ${reverse ? 'md:order-1' : ''}`}>
            <CmsImage
              src={afterImage}
              alt="Posle transformacije"
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
            />
            <span className="absolute top-4 left-4 rounded-full bg-gold-500 text-white px-3 py-1 text-xs uppercase tracking-[0.15em] font-medium font-body">
              Posle
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-sand-200">
          <div className="flex items-start gap-3 mb-4">
            <Quote size={20} className="text-gold-400 mt-1 flex-shrink-0" />
            <p className="text-charcoal-500 leading-relaxed italic font-body">
              {quote}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-heading font-semibold text-charcoal">
              {clientName}
            </span>
            <span className="flex items-center gap-1 text-sm text-charcoal-500">
              <MapPin size={13} />
              {location}
            </span>
            <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium font-body">
              {service}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransformationStory;
