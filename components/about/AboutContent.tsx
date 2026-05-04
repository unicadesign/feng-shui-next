'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Compass,
  Gem,
  Tv,
  Heart,
  GraduationCap,
  Mail,
  Phone,
  Triangle,
} from 'lucide-react';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import CTASection from '@/components/CTASection';
import type { AboutContent as AboutContentType } from '@/types/content';

interface AboutContentProps {
  content: AboutContentType;
}

const AboutContent = ({ content: c }: AboutContentProps) => {
  const credentialIcons = [
    <GraduationCap key="g" size={14} />,
    <Compass key="c" size={14} />,
    <Gem key="gem" size={14} />,
    <Tv key="t" size={14} />,
    <Heart key="h" size={14} />,
  ];

  return (
    <div className="pt-20">
      {/* Hero — short editorial banner */}
      <section className="relative min-h-[50vh] flex items-end bg-charcoal overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full pb-16 md:pb-20 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={staggerItem}
              className="inline-block rounded-full bg-navy-50/10 text-sand-300 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-5"
            >
              {c.hero.eyebrow}
            </motion.span>
            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-cream-50 tracking-tight leading-[1.05] mb-4"
            >
              {c.hero.title}
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="text-xl text-sand-300 max-w-2xl font-body font-light"
            >
              {c.hero.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Bio — asymmetric 2-column */}
      <Section background="cream">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="md:col-span-5 order-1">
              <img
                src={c.bio.image}
                alt="Dragana Jović"
                className="w-full rounded-2xl shadow-warm"
                loading="lazy"
              />
            </div>

            <div className="md:col-span-7 order-2">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-charcoal tracking-tight mb-6">
                {c.bio.heading}
              </h2>

              {c.bio.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-charcoal-500 font-body ${
                    index < c.bio.paragraphs.length - 1 ? 'mb-5' : 'mb-8'
                  } leading-relaxed`}
                >
                  {paragraph}
                </p>
              ))}

              <div className="flex flex-wrap gap-2 mb-8">
                {c.bio.credentials.map((credential, index) => (
                  <CredentialBadge
                    key={index}
                    icon={credentialIcons[index] || <Award size={14} />}
                    text={credential}
                  />
                ))}
              </div>

              <div className="mb-8 p-6 bg-navy-50 rounded-2xl">
                <p className="text-charcoal italic font-heading text-lg leading-relaxed">
                  &ldquo;{c.bio.quote}&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <ContactItem icon={<Mail size={18} />} text={c.bio.email} />
                <ContactItem icon={<Phone size={18} />} text={c.bio.phone} />
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Philosophy — full-width zig-zag numbered list */}
      <Section background="light">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.philosophy.eyebrow}
            title={c.philosophy.title}
            subtitle={c.philosophy.subtitle}
          />

          <p className="text-charcoal-500 font-body mb-16 max-w-[65ch] leading-relaxed">
            {c.philosophy.description}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-12 md:space-y-16 max-w-5xl mx-auto"
        >
          {c.philosophy.items.map((item, index) => (
            <PhilosophyItem
              key={index}
              number={item.number}
              title={item.title}
              description={item.description}
              align={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </motion.div>
      </Section>

      {/* Timeline */}
      <Section background="cream">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.timeline.eyebrow}
            title={c.timeline.title}
            subtitle={c.timeline.subtitle}
          />
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-sand-200 transform md:translate-x-[-0.5px] z-0" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-14 relative z-10"
          >
            {c.timeline.entries.map((entry, index) => (
              <TimelineItem
                key={index}
                year={entry.year}
                title={entry.title}
                description={entry.description}
                position={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <CTASection
        title={c.cta.title}
        subtitle={c.cta.subtitle}
        primaryButtonText={c.cta.primaryButton.text}
        primaryButtonLink={c.cta.primaryButton.link}
        secondaryButtonText={c.cta.secondaryButton.text}
        secondaryButtonLink={c.cta.secondaryButton.link}
        primaryMicrocopy={c.cta.primaryMicrocopy}
        icon={Triangle}
      />
    </div>
  );
};

const PhilosophyItem = ({
  number,
  title,
  description,
  align,
}: {
  number: string;
  title: string;
  description: string;
  align: 'left' | 'right';
}) => {
  return (
    <motion.div
      variants={staggerItem}
      className={`flex flex-col md:flex-row items-start gap-6 ${
        align === 'right' ? 'md:flex-row-reverse md:text-right' : ''
      }`}
    >
      <span className="text-7xl font-heading text-navy-100 font-bold leading-none select-none shrink-0">
        {number}
      </span>
      <div className="max-w-lg">
        <h3 className="text-2xl font-heading font-semibold text-charcoal mb-2">{title}</h3>
        <p className="text-charcoal-500 font-body leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const TimelineItem = ({
  year,
  title,
  description,
  position,
}: {
  year: string;
  title: string;
  description: string;
  position: 'left' | 'right';
}) => {
  return (
    <motion.div variants={staggerItem} className="relative flex items-start">
      <div
        className={`
          absolute z-10
          left-0 md:left-1/2 md:transform md:-translate-x-1/2
        `}
      >
        <div className="rounded-full bg-navy-500 text-white w-10 h-10 flex items-center justify-center text-xs font-heading font-semibold">
          {year.slice(-2)}
        </div>
      </div>

      <div
        className={`
          pl-16 md:pl-0 w-full md:w-[calc(50%-30px)]
          ${position === 'right' ? 'md:ml-auto md:pl-10' : 'md:mr-auto md:pr-10 md:text-right'}
        `}
      >
        <div className="bg-white p-5 rounded-2xl shadow-soft">
          <span className="text-sm font-heading font-medium text-navy-600 mb-1 block">{year}</span>
          <h3 className="text-xl font-heading font-semibold mb-2 text-charcoal">{title}</h3>
          <p className="text-charcoal-500 font-body leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const CredentialBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <span className="inline-flex items-center gap-1.5 bg-navy-50 text-navy-600 rounded-full px-3 py-1 text-xs font-body">
      {icon}
      {text}
    </span>
  );
};

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-soft">
      <div className="mr-3 text-navy-500">{icon}</div>
      <span className="text-charcoal font-body">{text}</span>
    </div>
  );
};

export default AboutContent;
