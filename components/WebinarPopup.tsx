'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, X } from 'lucide-react';
import { formatWebinarDate, isWebinarLive } from '@/lib/webinarDate';
import WebinarRegistrationModal from '@/components/WebinarRegistrationModal';
import type { HomeContent } from '@/types/content';

interface Props {
  content: HomeContent['webinarSection'];
}

const sessionKey = (c: HomeContent['webinarSection']) =>
  `webinar_popup_dismissed:${c.startsAt || c.title}`;
const registeredKey = (c: HomeContent['webinarSection']) =>
  `webinar_registered:${c.startsAt || c.title}`;

const SHOW_DELAY_MS = 3000;

const WebinarPopup: React.FC<Props> = ({ content }) => {
  const [visible, setVisible] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  // Re-evaluate "live" every 30s so we hide the popup the second the webinar
  // starts, even if the user is sitting on the page.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (now === null) return;
    if (!isWebinarLive(content, now)) {
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem(sessionKey(content)) === '1') return;
      if (localStorage.getItem(registeredKey(content)) === '1') return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
    // Only run once the live check passes after mount; the interval handles auto-hide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, now !== null]);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(sessionKey(content), '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, [content]);

  useEffect(() => {
    if (!visible || showRegistration) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, showRegistration, dismiss]);

  if (now === null) return null;
  if (!isWebinarLive(content, now)) return null;

  const openRegistration = () => {
    try {
      sessionStorage.setItem(sessionKey(content), '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
    setShowRegistration(true);
  };

  const handleSuccess = () => {
    try {
      localStorage.setItem(registeredKey(content), '1');
    } catch {
      /* ignore */
    }
  };

  const formattedDate = formatWebinarDate(content.startsAt);

  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
          onClick={dismiss}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-cream-50 shadow-warm border border-sand-200 p-6 md:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              aria-label="Zatvori"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-cream-100 transition-colors"
            >
              <X size={20} />
            </button>

            <span className="inline-block rounded-full bg-gold-50 text-gold-600 px-3 py-1 text-xs uppercase tracking-[0.2em] font-body font-medium mb-4">
              {content.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight leading-[1.1] text-charcoal mb-3 pr-6">
              {content.title}
            </h2>
            <p className="text-charcoal-500 font-body leading-relaxed">{content.subtitle}</p>
            {formattedDate && (
              <p className="mt-4 inline-flex items-center gap-2 text-navy-600 font-heading font-semibold">
                <CalendarCheck size={18} /> {formattedDate}
              </p>
            )}

            <button
              onClick={openRegistration}
              className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-charcoal text-cream-50 px-7 py-4 text-sm font-heading font-semibold hover:bg-charcoal/90 transition-all duration-300 ease-out-expo active:scale-[0.99]"
            >
              {content.buttonText}
            </button>
          </div>
        </div>
      )}

      <WebinarRegistrationModal
        content={content}
        open={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default WebinarPopup;
