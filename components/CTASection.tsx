import React from 'react';
import { Wind, LucideIcon } from 'lucide-react';
import Section from './Section';
import Button from './Button';
import TrustBadges from './TrustBadges';

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  primaryMicrocopy?: string;
  background?: 'light' | 'dark' | 'primary' | 'accent' | 'cream';
  icon?: LucideIcon;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  primaryMicrocopy,
  background = 'accent',
  icon: Icon = Wind,
  className = '',
}) => {
  return (
    <Section background={background} className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7">
          <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
            Spremni ste?
          </span>

          <h2 className="text-3xl md:text-5xl font-heading font-semibold text-charcoal tracking-tight leading-[1.05] mb-4">
            {title}
          </h2>

          <p className="text-lg text-charcoal-500 max-w-[55ch] leading-relaxed mb-8">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button to={primaryButtonLink} variant="primary" size="lg" microcopy={primaryMicrocopy}>
              {primaryButtonText}
            </Button>

            <Button to={secondaryButtonLink} variant="outline" size="lg">
              {secondaryButtonText}
            </Button>
          </div>

          <div className="mt-8">
            <TrustBadges />
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
          <Icon
            size={280}
            className="text-navy-200 rotate-12 opacity-60"
            strokeWidth={0.75}
          />
        </div>
      </div>
    </Section>
  );
};

export default CTASection;
