'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BookOpen,
  Check,
  Calendar,
  Users,
  Award,
  ChevronDown,
  Compass,
  Sparkles,
  BookMarked,
  GraduationCap,
  Zap,
  KeyRound,
  Shield,
  Moon,
  Leaf,
  type LucideIcon,
} from 'lucide-react';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import CTASection from '@/components/CTASection';
import CmsImage from '@/components/CmsImage';
import type { SchoolContent as SchoolContentType } from '@/types/content';

interface SchoolContentProps {
  content: SchoolContentType;
}

const SchoolContent = ({ content: c }: SchoolContentProps) => {
  const featureIcons: LucideIcon[] = [Zap, Compass, BookMarked, KeyRound, GraduationCap];
  const benefitIcons: LucideIcon[] = [Shield, Leaf, Moon];
  const formatIcons = [
    <Calendar key="cal" size={24} />,
    <BookOpen key="bo" size={24} />,
    <Users key="us" size={24} />,
    <Award key="aw" size={24} />,
  ];

  return (
    <div className="pt-20">
      {/* Hero — split-screen */}
      <section className="relative bg-cream-50 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <motion.div
              className="md:col-span-7"
              variants={scrollReveal}
              initial="hidden"
              animate="visible"
            >
              <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
                {c.hero.eyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-6">
                {c.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-charcoal-500 mb-8 max-w-[55ch] leading-relaxed">
                {c.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button to={c.hero.primaryButton.link} variant="primary" size="lg" microcopy={c.hero.primaryMicrocopy}>
                  {c.hero.primaryButton.text}
                </Button>
                <Button to={c.hero.secondaryButton.link} variant="outline" size="lg">
                  {c.hero.secondaryButton.text}
                </Button>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-gold-600 mt-4">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                {c.hero.limitedSpotsText}
              </span>
            </motion.div>

            <motion.div
              className="md:col-span-5 grid grid-cols-2 gap-4"
              variants={scrollReveal}
              initial="hidden"
              animate="visible"
            >
              {c.hero.images.map((img, index) => (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden shadow-card relative group ${index % 2 !== 0 ? 'mt-6' : ''}`}
                >
                  <CmsImage
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="text-white text-sm p-3 font-medium">{img.caption}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <Section background="light">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={staggerItem}>
            <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-3">
              {c.overview.title}
            </h2>

            <p className="text-xl text-navy-600 mb-6 font-light">
              {c.overview.subtitle}
            </p>

            <p className="text-charcoal-500 mb-6">
              {c.overview.description}
            </p>

            <div className="space-y-4 mb-8">
              {c.overview.features.map((feature, index) => (
                <FeatureItem key={index} icon={featureIcons[index] || Zap} text={feature} />
              ))}
            </div>

            <Button to={c.overview.buttonLink} variant="primary" className="group">
              <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                {c.overview.buttonText}
              </span>
            </Button>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-4" variants={staggerItem}>
            {c.hero.images.map((img, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden shadow-card relative group ${index % 2 !== 0 ? 'mt-6' : ''}`}
              >
                <CmsImage
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="text-white text-sm p-3 font-medium">{img.caption}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* Benefits */}
      <Section background="primary">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.benefits.eyebrow}
            title={c.benefits.title}
            subtitle={c.benefits.subtitle}
            alignment="center"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.benefits.items.map((item, index) => (
            <TrustCard
              key={index}
              icon={benefitIcons[index] || Shield}
              title={item.title}
              description={item.description}
            />
          ))}
        </motion.div>
      </Section>

      {/* Curriculum */}
      <Section background="light" id="curriculum">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.curriculum.eyebrow}
            title={c.curriculum.title}
            subtitle={c.curriculum.subtitle}
            alignment="center"
          />
        </motion.div>

        <div className="relative">
          {c.curriculum.months.map((month, index) => (
            <CurriculumMonth
              key={index}
              monthNumber={month.monthNumber}
              title={month.title}
              subtitle={month.subtitle}
              bgColor="bg-cream-100"
              imageUrl={month.image}
              imageAlt={month.imageAlt}
              weeks={month.weeks}
              isReversed={index % 2 !== 0}
              isFinal={index === c.curriculum.months.length - 1}
              graduationNote={c.curriculum.graduationNote}
              weekLabel={c.curriculum.weekLabel}
              qaNote={c.curriculum.qaNote}
            />
          ))}
        </div>
      </Section>

      {/* Format */}
      <Section background="accent">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="order-2 lg:order-1" variants={staggerItem}>
            <img
              src={c.format.image}
              alt={c.format.imageAlt}
              className="rounded-2xl shadow-warm"
              loading="lazy"
            />
          </motion.div>

          <motion.div className="order-1 lg:order-2" variants={staggerItem}>
            <SectionTitle
              eyebrow={c.format.eyebrow}
              title={c.format.title}
              subtitle={c.format.subtitle}
              alignment="left"
            />

            <div className="space-y-6">
              {c.format.items.map((item, index) => (
                <FormatItem
                  key={index}
                  icon={formatIcons[index] || <Calendar size={24} />}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section background="primary">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.faq.eyebrow}
            title={c.faq.title}
            subtitle={c.faq.subtitle}
          />
        </motion.div>

        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.faq.items.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </motion.div>
      </Section>

      {/* Testimonials — horizontal snap scroll */}
      <Section background="cream">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.testimonials.eyebrow}
            title={c.testimonials.title}
            subtitle={c.testimonials.subtitle}
          />
        </motion.div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
          {c.testimonials.items.map((item, index) => (
            <TestimonialCard
              key={index}
              quote={item.quote}
              author={item.author}
              location={item.location}
            />
          ))}
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
        background="accent"
        icon={Sparkles}
      />
    </div>
  );
};

const CurriculumMonth = ({
  monthNumber,
  title,
  subtitle,
  bgColor,
  imageUrl,
  imageAlt,
  weeks,
  isReversed = false,
  isFinal = false,
  graduationNote = '',
  weekLabel = 'Nedelja',
  qaNote = '',
}: {
  monthNumber: string;
  title: string;
  subtitle: string;
  bgColor: string;
  imageUrl: string;
  imageAlt: string;
  weeks: { number: string; title: string; bullets: string[] }[];
  isReversed?: boolean;
  isFinal?: boolean;
  graduationNote?: string;
  weekLabel?: string;
  qaNote?: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${bgColor} rounded-2xl overflow-hidden mb-12 shadow-card transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`p-8 md:p-10 ${isReversed ? 'md:order-2' : ''}`}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-navy-500 text-white flex items-center justify-center font-heading text-xl font-semibold mr-4">
              {monthNumber}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-charcoal">{title}</h3>
              <p className="text-navy-600 italic font-light">{subtitle}</p>
            </div>
          </div>

          <div className="space-y-6 mt-8">
            {weeks.map((week, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-2">
                  <span className="text-xs uppercase tracking-wider text-gold-600 font-medium bg-gold-50 px-2 py-1 rounded-full mr-3">
                    {weekLabel} {week.number}
                  </span>
                  <h4 className="font-medium text-charcoal text-lg">{week.title}</h4>
                </div>

                <ul className="space-y-2 ml-6">
                  {week.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mt-1 mr-2 flex-shrink-0 text-navy-500">
                        <Check size={16} />
                      </div>
                      <span className="text-charcoal-500 text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {qaNote && (
                  <div className="text-xs text-navy-600 mt-2 flex items-center">
                    <Check size={12} className="mr-1" />
                    <span>{qaNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isFinal && graduationNote && (
            <div className="mt-8 bg-gold-50 p-4 rounded-xl border border-gold-400/30">
              <p className="text-gold-600 text-sm font-medium">
                {graduationNote}
              </p>
            </div>
          )}
        </div>

        <div className={`relative ${isReversed ? 'md:order-1' : ''}`}>
          <CmsImage
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full rounded-2xl shadow-warm object-cover min-h-[300px]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => {
  return (
    <div className="flex items-start">
      <div className="mt-1 mr-3 flex-shrink-0 text-navy-500">
        <Icon size={18} />
      </div>
      <span className="text-charcoal-500">{text}</span>
    </div>
  );
};

const TrustCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div variants={staggerItem}>
      <div
        ref={ref}
        className={`rounded-2xl bg-cream-100 p-1.5 h-full transition-all duration-700 transform ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="rounded-xl bg-cream-50 p-6 h-full flex flex-col">
          <div className="mb-5 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-navy-50 flex items-center justify-center text-navy-500">
              <Icon size={32} />
            </div>
          </div>
          <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal text-center">
            {title}
          </h3>
          <p className="text-charcoal-500 text-center mt-auto">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const FormatItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex">
      <div className="mr-4 text-navy-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-charcoal mb-1">{title}</h3>
        <p className="text-charcoal-500">{description}</p>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div className="border-b border-sand-200 py-4" variants={staggerItem}>
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-charcoal">{question}</h3>
        <ChevronDown
          size={20}
          className={`text-navy-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="mt-2">
          <p className="text-charcoal-500">{answer}</p>
        </div>
      )}
    </motion.div>
  );
};

const TestimonialCard = ({
  quote,
  author,
  location,
}: {
  quote: string;
  author: string;
  location: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`min-w-[320px] snap-start flex-shrink-0 rounded-2xl bg-cream-100 p-1.5 transition-all duration-700 transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="rounded-xl bg-cream-50 p-6 h-full flex flex-col">
        <div className="text-gold-500 mb-4 text-3xl">&ldquo;</div>
        <p className="text-charcoal-500 mb-6 italic flex-grow">{quote}</p>
        <div className="flex items-center mt-auto">
          <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 font-medium">
            {author.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium text-charcoal">{author}</p>
            <p className="text-sm text-charcoal-500">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolContent;
