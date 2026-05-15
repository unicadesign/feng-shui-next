'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Heart, Star, Gift, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import CTASection from '@/components/CTASection';
import CmsImage from '@/components/CmsImage';
import type { VazaContent as VazaContentType } from '@/types/content';

interface VazaContentProps {
  content: VazaContentType;
}

const VazaContent = ({ content: c }: VazaContentProps) => {
  const benefitIcons = [
    <DollarSign key="d" size={18} />,
    <Heart key="h" size={18} />,
    <Star key="s" size={18} />,
    <Gift key="g" size={18} />,
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-cream-100 py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <motion.div
              className="md:col-span-7"
              initial="hidden"
              animate="visible"
              variants={scrollReveal}
            >
              <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
                {c.hero.eyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-6">
                {c.hero.title}
              </h1>
              <p className="text-xl text-charcoal-500 max-w-[55ch] leading-relaxed mb-8">
                {c.hero.subtitle}
              </p>
              <Button
                to={c.hero.buttonLink}
                variant="primary"
                size="lg"
                icon={<ArrowRight size={16} />}
                microcopy={c.hero.primaryMicrocopy}
              >
                {c.hero.buttonText}
              </Button>
            </motion.div>

            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-warm">
                <CmsImage
                  src={c.hero.image}
                  alt={c.hero.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <Section background="light">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div
            className="md:col-span-5"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <SectionTitle
              eyebrow={c.introduction.eyebrow}
              title={c.introduction.title}
              subtitle={c.introduction.subtitle}
              alignment="left"
            />

            {c.introduction.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-charcoal-500 ${
                  index < c.introduction.paragraphs.length - 1 ? 'mb-4' : 'mb-6'
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="flex flex-wrap gap-3 mb-6">
              {c.introduction.benefits.map((benefit, index) => (
                <BenefitPill
                  key={index}
                  icon={benefitIcons[index] || <Star size={18} />}
                  text={benefit}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-7"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <CmsImage
                src={c.introduction.image}
                alt={c.introduction.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* How It Works */}
      <Section background="primary">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.howItWorks.eyebrow}
            title={c.howItWorks.title}
            subtitle={c.howItWorks.subtitle}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div
            className="order-2 md:order-1 md:col-span-5"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <CmsImage
                src={c.howItWorks.image}
                alt={c.howItWorks.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 md:col-span-7"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h3 className="text-xl font-heading font-semibold mb-4 text-navy-600">{c.howItWorks.scienceTitle}</h3>
            <p className="text-charcoal-500 mb-6">
              {c.howItWorks.introParagraph}
            </p>

            <motion.ul
              className="space-y-4 mb-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {c.howItWorks.symbols.map((symbol, index) => (
                <SymbolItem
                  key={index}
                  title={symbol.title}
                  description={symbol.description}
                />
              ))}
            </motion.ul>

            <p className="text-charcoal-500">
              {c.howItWorks.closingParagraph}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Product Options */}
      <Section background="light">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.products.eyebrow}
            title={c.products.title}
            subtitle={c.products.subtitle}
            alignment="center"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.products.items.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              features={product.features}
              image={product.image}
              imageAlt={product.imageAlt}
              highlighted={product.highlighted}
              buttonText={product.buttonText}
              buttonLink={product.buttonLink}
              popularBadge={c.labels.popularBadge}
              includesLabel={c.labels.includesLabel}
            />
          ))}
        </motion.div>
      </Section>

      {/* Testimonials */}
      <Section background="accent">
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

        <motion.div
          className="max-w-3xl space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.testimonials.items.map((item, index) => (
            <TestimonialCard
              key={index}
              quote={item.quote}
              author={item.author}
              location={item.location}
            />
          ))}
        </motion.div>
      </Section>

      {/* How to Use */}
      <Section background="light">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <SectionTitle
              eyebrow={c.howToUse.eyebrow}
              title={c.howToUse.title}
              subtitle={c.howToUse.subtitle}
              alignment="left"
            />

            <div className="space-y-6">
              {c.howToUse.steps.map((step, index) => (
                <InstructionStep
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>

            <div className="mt-8">
              <p className="text-charcoal-500 mb-4">
                {c.howToUse.bottomText}
              </p>
              <Button to={c.howToUse.buttonLink} variant="primary" icon={<ArrowRight size={16} />}>
                {c.howToUse.buttonText}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {c.howToUse.images.map((img, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl overflow-hidden shadow-warm ${index % 2 !== 0 ? 'mt-6' : ''}`}
                variants={staggerItem}
              >
                <CmsImage
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* FAQ */}
      <Section background="cream">
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
            alignment="center"
          />
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
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

      {/* CTA */}
      <CTASection
        title={c.cta.title}
        subtitle={c.cta.subtitle}
        primaryButtonText={c.cta.primaryButton.text}
        primaryButtonLink={c.cta.primaryButton.link}
        secondaryButtonText={c.cta.secondaryButton.text}
        secondaryButtonLink={c.cta.secondaryButton.link}
        primaryMicrocopy={c.cta.primaryMicrocopy}
      />
    </div>
  );
};

const BenefitPill = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="flex items-center bg-navy-50 text-navy-600 rounded-full px-3 py-1.5 text-sm">
      <div className="mr-1.5">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
};

const SymbolItem = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.li variants={staggerItem}>
      <h4 className="font-heading font-semibold text-navy-600 mb-1">{title}</h4>
      <p className="text-charcoal-500">{description}</p>
    </motion.li>
  );
};

const ProductCard = ({
  title,
  description,
  features,
  image,
  imageAlt,
  highlighted = false,
  buttonText,
  buttonLink,
  popularBadge,
  includesLabel,
}: {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  highlighted?: boolean;
  buttonText: string;
  buttonLink: string;
  popularBadge: string;
  includesLabel: string;
}) => {
  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ease-out-expo hover:shadow-card-hover ${
        highlighted
          ? 'border-2 border-gold-400 relative shadow-card-hover'
          : 'border border-sand-200 shadow-card'
      }`}
    >
      {highlighted && popularBadge && (
        <div className="absolute top-4 right-4 z-10 rounded-full bg-gold-500 text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-heading font-bold">
          {popularBadge}
        </div>
      )}

      <div className="h-48 overflow-hidden">
        <CmsImage
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {highlighted && <div className="h-1 bg-gold-50" />}

      <div className="p-6 bg-white">
        <h3 className="text-xl font-heading font-semibold mb-2 text-charcoal">{title}</h3>
        <p className="text-charcoal-500 mb-4">{description}</p>

        <div className="mb-6">
          <h4 className="font-heading font-semibold text-charcoal mb-2 text-sm">{includesLabel}</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="mt-1 mr-2 flex-shrink-0 text-gold-500">
                  <Check size={16} />
                </div>
                <span className="text-charcoal-500 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          to={buttonLink}
          variant={highlighted ? 'secondary' : 'outline'}
          fullWidth
        >
          {buttonText}
        </Button>
      </div>
    </motion.div>
  );
};

const InstructionStep = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="flex">
      <div className="mr-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-navy-500 text-white flex items-center justify-center font-heading font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-heading font-semibold text-charcoal mb-1">{title}</h3>
        <p className="text-charcoal-500">{description}</p>
      </div>
    </div>
  );
};

const TestimonialCard = ({ quote, author, location }: { quote: string; author: string; location: string }) => {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl p-8 shadow-card border border-sand-200"
    >
      <div className="text-gold-400 text-4xl font-heading leading-none mb-3">&ldquo;</div>
      <p className="text-charcoal-500 mb-6 italic leading-relaxed">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 font-heading font-bold">
          {author.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="font-heading font-semibold text-charcoal">{author}</p>
          <p className="text-sm text-charcoal-500">{location}</p>
        </div>
      </div>
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={staggerItem} className="border-b border-sand-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <h3 className="text-lg font-heading font-semibold text-charcoal pr-4 group-hover:text-navy-600 transition-colors duration-300 ease-out-expo">
          {question}
        </h3>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-charcoal-500 transition-transform duration-300 ease-out-expo ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out-expo ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-charcoal-500 leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  );
};

export default VazaContent;
