import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'light' | 'dark' | 'primary' | 'accent' | 'cream';
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  background = 'light',
}) => {
  const backgrounds = {
    light: 'bg-cream-50',
    dark: 'bg-charcoal text-cream-50',
    primary: 'bg-navy-50',
    accent: 'bg-sand-50',
    cream: 'bg-cream-100',
  };

  return (
    <section
      id={id}
      className={`py-24 md:py-32 lg:py-40 ${backgrounds[background]} ${className}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
