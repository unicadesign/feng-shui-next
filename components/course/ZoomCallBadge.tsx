'use client';

import React from 'react';
import { Video } from 'lucide-react';

interface ZoomCallBadgeProps {
  url: string;
  scheduledAt: string;
  weekNumber: number;
}

const ZoomCallBadge: React.FC<ZoomCallBadgeProps> = ({
  url,
  scheduledAt,
  weekNumber,
}) => {
  const date = new Date(scheduledAt);
  const formattedDate = date.toLocaleDateString('sr-Latn-RS', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const formattedTime = date.toLocaleTimeString('sr-Latn-RS', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-navy-50 rounded-xl p-4 border border-navy-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-navy-500/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-navy-600" />
        </div>
        <div>
          <p className="font-heading font-semibold text-charcoal text-sm">
            Zoom poziv — Nedelja {weekNumber}
          </p>
          <p className="text-xs text-charcoal-500">
            {formattedDate}, {formattedTime}
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full mt-2 px-4 py-2 rounded-full bg-navy-500 text-white text-sm font-heading font-semibold hover:bg-navy-600 transition-colors duration-200"
      >
        Pridružite se
      </a>
    </div>
  );
};

export default ZoomCallBadge;
