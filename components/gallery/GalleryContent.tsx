'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera } from 'lucide-react';
import { staggerContainer, staggerItem, scrollReveal, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import CTASection from '@/components/CTASection';
import TransformationStory from '@/components/TransformationStory';
import CmsImage from '@/components/CmsImage';
import type { GalleryContent as GalleryContentType } from '@/types/content';

interface GalleryContentProps {
  content: GalleryContentType;
}

const GalleryContent = ({ content: c }: GalleryContentProps) => {
  const [activeCategory, setActiveCategory] = useState('Sve');

  const filteredItems =
    activeCategory === 'Sve'
      ? c.items
      : c.items.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Hero — short editorial banner */}
      <section className="relative min-h-[50vh] flex items-end bg-charcoal overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full pb-16 md:pb-20 relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
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

      {/* Filter Pills + Bento Grid */}
      <Section background="light">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {c.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-heading font-semibold transition-all duration-300 ease-out-expo ${
                activeCategory === cat
                  ? 'bg-navy-500 text-white shadow-soft'
                  : 'bg-sand-100 text-charcoal-500 hover:bg-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  item.span === 'wide' ? 'col-span-2' : ''
                } ${item.span === 'tall' ? 'row-span-2' : ''}`}
              >
                <CmsImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 md:p-6">
                  <span className="flex items-center gap-1.5 text-sand-200 text-xs font-body mb-1.5">
                    <MapPin size={12} />
                    {item.location}
                  </span>
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-cream-50 leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-sand-300 font-body line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      {/* Before/After Transformations */}
      <Section background="cream">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow="Pre i posle"
            title="Priče o transformaciji"
            subtitle="Pogledajte kako su naši klijenti transformisali svoje prostore primenom Feng Shui principa."
            alignment="center"
          />
        </motion.div>

        <div className="space-y-8 mt-12">
          {c.transformations.map((story, index) => (
            <TransformationStory
              key={index}
              beforeImage={story.beforeImage}
              afterImage={story.afterImage}
              clientName={story.clientName}
              location={story.location}
              service={story.service}
              quote={story.quote}
              reverse={index % 2 === 1}
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
        secondaryButtonText="Pogledajte usluge"
        secondaryButtonLink="/services"
        icon={Camera}
      />
    </div>
  );
};

export default GalleryContent;
