import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
  service?: string;
  icon?: React.ReactNode;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  location,
  service,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-cream-50 p-6 md:p-8 shadow-card h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium">
          {icon}
          <span>{service}</span>
        </span>
      </div>

      <span className="text-5xl font-heading text-gold-400 opacity-40 leading-none block mb-2">
        &ldquo;
      </span>

      <p className="text-charcoal-600 leading-relaxed italic">{quote}</p>

      <div className="mt-6 pt-4 border-t border-sand-200">
        <p className="font-heading font-semibold text-charcoal text-sm">{author}</p>
        <p className="text-charcoal-500 text-xs mt-0.5">{location}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
