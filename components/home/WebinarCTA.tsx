'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import WebinarRegistrationModal from '@/components/WebinarRegistrationModal';
import type { HomeContent } from '@/types/content';

interface WebinarCTAProps {
  content: HomeContent['webinarSection'];
}

// One registration flag per webinar instance, keyed by its date/title so a new
// webinar (new date) shows the CTA again to returning visitors.
const registeredKey = (content: HomeContent['webinarSection']) =>
  `webinar_registered:${content.dateText || content.title}`;

const WebinarCTA: React.FC<WebinarCTAProps> = ({ content }) => {
  const [open, setOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(registeredKey(content)) === '1') setRegistered(true);
    } catch {
      /* ignore */
    }
  }, [content]);

  if (!content.enabled) return null;

  const handleSuccess = () => {
    try {
      localStorage.setItem(registeredKey(content), '1');
    } catch {
      /* ignore */
    }
    setRegistered(true);
  };

  return (
    <section className="bg-navy-50 py-20 md:py-28">
      <motion.div
        className="max-w-2xl mx-auto px-6 lg:px-8 text-center"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <span className="inline-block rounded-full bg-gold-50 text-gold-600 px-3 py-1 text-xs uppercase tracking-[0.2em] font-body font-medium mb-4">
          {content.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-3">
          {content.title}
        </h2>
        <p className="text-charcoal-500 font-body leading-relaxed max-w-[55ch] mx-auto">
          {content.subtitle}
        </p>
        {content.dateText && (
          <p className="mt-4 inline-flex items-center gap-2 text-navy-600 font-heading font-semibold">
            <CalendarCheck size={18} /> {content.dateText}
          </p>
        )}

        <div className="mt-8">
          {registered ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-cream-50 border border-sand-200 px-6 py-3 text-charcoal font-heading font-semibold">
              <CheckCircle size={20} className="text-green-600" />
              Hvala što ste se prijavili!
            </p>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-charcoal text-cream-50 px-8 py-4 text-sm font-heading font-semibold hover:bg-charcoal/90 transition-all duration-300 ease-out-expo active:scale-[0.98]"
            >
              {content.buttonText}
            </button>
          )}
        </div>
      </motion.div>

      <WebinarRegistrationModal
        content={content}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  );
};

export default WebinarCTA;
