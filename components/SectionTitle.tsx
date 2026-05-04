import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  alignment?: 'left' | 'center' | 'right';
  dark?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  eyebrow,
  alignment = 'left',
  dark = false,
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignmentClasses[alignment]}`}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-4">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl md:text-5xl font-heading font-semibold tracking-tight leading-[1.05] ${
          dark ? 'text-cream-50' : 'text-charcoal'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-[55ch] leading-relaxed mt-4 ${
            dark ? 'text-sand-300' : 'text-charcoal-500'
          } ${alignment === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
