'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck } from 'lucide-react';
import { isWebinarLive, countdownString } from '@/lib/webinarDate';
import WebinarRegistrationModal from '@/components/WebinarRegistrationModal';
import type { HomeContent } from '@/types/content';

interface Props {
  content: HomeContent['webinarSection'];
}

const registeredKey = (c: HomeContent['webinarSection']) =>
  `webinar_registered:${c.startsAt || c.title}`;

// Pill bar that sits attached to the bottom of the navbar — top edge tucked
// behind the navbar (via negative margin + lower z-index), bottom edge peeks
// out. Countdown ticks every 30s; the whole bar disappears the moment the
// webinar starts (isWebinarLive flips to false).
const WebinarNavbarBar: React.FC<Props> = ({ content }) => {
  const [now, setNow] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // During SSR / pre-mount, fall back to enabled-only so the bar renders in
  // initial HTML (no hydration mismatch — both server and first client render
  // take the same `now === null` branch). After mount, the full live check
  // takes over and hides the bar if startsAt has passed.
  const live = now === null ? content.enabled : isWebinarLive(content, now);
  if (!live) return null;

  const cd = now === null ? '' : countdownString(now, content.startsAt);

  const handleSuccess = () => {
    try {
      localStorage.setItem(registeredKey(content), '1');
    } catch {
      /* ignore */
    }
  };

  // Sits directly below the navbar pill (no overlap) — the navbar's
  // translucent background made any hidden top edge bleed through, so the
  // bar's top now starts at the navbar's bottom with a small visual gap.
  const label = cd ? 'VEBINAR POČINJE ZA' : 'PRIJAVI SE NA BESPLATAN VEBINAR';
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Prijavite se za besplatan vebinar"
        className="
          mt-1
          inline-flex items-center justify-center gap-2
          rounded-full bg-navy-500 text-cream-50
          px-5 sm:px-7 py-2
          text-[11px] sm:text-xs font-heading font-semibold
          uppercase tracking-[0.15em]
          shadow-soft hover:bg-navy-600 transition-colors
          max-w-[calc(100%-2rem)]
        "
      >
        <CalendarCheck size={14} className="flex-shrink-0" />
        <span className="truncate">
          {label}
          {cd && <> · <span className="font-bold tabular-nums normal-case tracking-normal">{cd}</span></>}
        </span>
      </button>

      <WebinarRegistrationModal
        content={content}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default WebinarNavbarBar;
