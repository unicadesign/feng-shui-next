'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? 'none' : '0px');

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        const timer = setTimeout(() => setMaxHeight('none'), 300);
        return () => clearTimeout(timer);
      }
    } else {
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setMaxHeight('0px');
          });
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-heading font-semibold text-charcoal text-lg">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-charcoal-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight, overflow: maxHeight === 'none' ? 'visible' : 'hidden' }}
        className="transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
};

export default ContentSection;
