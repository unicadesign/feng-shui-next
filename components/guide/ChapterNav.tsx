'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ChapterNavProps {
  chapters: { id: string; number: number; title: string }[];
}

const ChapterNav: React.FC<ChapterNavProps> = ({ chapters }) => {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveId(top.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className="hidden lg:block sticky top-24 self-start w-56" aria-label="Sadržaj vodiča">
        <p className="text-[11px] uppercase tracking-[0.2em] font-medium font-body text-charcoal-400 mb-4">
          Sadržaj
        </p>
        <ul className="space-y-1">
          {chapters.map((ch) => {
            const isActive = activeId === ch.id;
            return (
              <li key={ch.id}>
                <button
                  onClick={() => scrollTo(ch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-all duration-200 ${
                    isActive
                      ? 'bg-navy-50 text-navy-600 font-medium border border-navy-200'
                      : 'text-charcoal-500 hover:text-charcoal hover:bg-sand-50'
                  }`}
                >
                  <span className="font-heading font-semibold mr-2">{ch.number}.</span>
                  {ch.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        ref={scrollRef}
        className="lg:hidden sticky top-16 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-sand-200 -mx-6 px-6 py-3 overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-2 min-w-max">
          {chapters.map((ch) => {
            const isActive = activeId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => scrollTo(ch.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-navy-500 text-white'
                    : 'bg-sand-100 text-charcoal-500 hover:bg-sand-200'
                }`}
              >
                {ch.number}. {ch.title}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChapterNav;
