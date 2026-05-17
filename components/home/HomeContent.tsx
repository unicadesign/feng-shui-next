'use client';

import React from 'react';
import {
  ArrowRight,
  Home as HomeIcon,
  School,
  Users,
  Wind,
  Sparkles,
  MapPin,
  CheckCircle,
  Play,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import SocialProofBar from '@/components/SocialProofBar';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import ServiceCard from '@/components/home/ServiceCard';
import TestimonialCard from '@/components/home/TestimonialCard';
import CmsImage from '@/components/CmsImage';
import type { HomeContent as HomeContentType } from '@/types/content';

interface HomeContentProps {
  content: HomeContentType;
}

const HIDDEN_ROUTES = ['/services', '/vodic', '/galerija'];
const isHidden = (link: string | undefined) => !!link && HIDDEN_ROUTES.includes(link);

const HomeContent = ({ content: c }: HomeContentProps) => {
  return (
    <div>
      {/* SECTION 1: SCROLL-ANIMATED HERO */}
      <div className="relative flex flex-col overflow-hidden bg-cream-50">
        <img
          src="/images/bg-hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
        />
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center pt-[100px]">
              <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
                {c.hero.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-heading font-bold text-charcoal tracking-tighter leading-[0.95] max-w-4xl">
                {c.hero.title}
              </h1>

              <p className="text-lg md:text-xl text-charcoal-500 max-w-[55ch] leading-relaxed mt-6">
                {c.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-[100px]">
                <Button to={c.hero.primaryButton.link} variant="primary" size="lg" microcopy={c.hero.primaryMicrocopy}>
                  {c.hero.primaryButton.text}
                </Button>
                <Button to={c.hero.secondaryButton.link} variant="outline" size="lg" disabled={isHidden(c.hero.secondaryButton.link)}>
                  {c.hero.secondaryButton.text}
                </Button>
              </div>
            </div>
          }
        >
          <CmsImage
            src={c.hero.backgroundImage}
            alt="Feng Shui harmonizovan prostor"
            className="mx-auto rounded-2xl object-cover h-full w-full object-center"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* SECTION 2: SOCIAL PROOF BAR */}
      <SocialProofBar />

      {/* SECTION 3: PROBLEM */}
      <Section background="cream">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-gold-50 text-gold-600 px-3 py-1 text-xs uppercase tracking-[0.2em] font-body font-medium mb-6">
              {c.problemSection.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal">
              {c.problemSection.title}
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {c.problemSection.painPoints.map((text, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-start gap-4 rounded-xl bg-cream-50 p-5 shadow-card"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                </span>
                <p className="text-charcoal-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 pt-8 border-t border-sand-200 text-center space-y-4"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <p className="text-lg text-charcoal-500 leading-relaxed">
              {c.problemSection.anchorAnalogy}
            </p>
            <p className="text-xl md:text-2xl font-heading font-medium text-charcoal tracking-tight max-w-2xl mx-auto">
              {c.problemSection.reframe}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* SECTION 4: THE GUIDE */}
      <Section background="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            className="lg:col-span-5 order-2 lg:order-1"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <CmsImage
                src={c.introduction.image}
                alt="Dragana Jović — Feng Shui konsultant"
                className="w-full h-auto object-cover aspect-[4/5]"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 order-1 lg:order-2"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
              {c.introduction.badge}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-6">
              {c.introduction.title}
            </h2>

            <p className="text-lg text-charcoal-500 leading-relaxed mb-6 max-w-[55ch]">
              {c.introduction.subtitle}
            </p>

            <p className="text-charcoal-500 leading-relaxed mb-8 max-w-[55ch]">
              {c.introduction.bodyParagraph}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {c.introduction.authorityBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 text-navy-600 px-3 py-1.5 text-xs font-medium"
                >
                  <CheckCircle size={12} />
                  {badge}
                </span>
              ))}
            </div>

            <Button to={c.introduction.buttonLink} variant="ghost" size="sm">
              {c.introduction.buttonText} <ArrowRight size={16} className="ml-1" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 5: BLOCKQUOTE */}
      <motion.section
        className="bg-cream-100 py-16 md:py-24"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-7xl md:text-8xl font-heading text-gold-400 opacity-30 leading-none block mb-4">&ldquo;</span>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium text-charcoal tracking-tight leading-[1.15]">
            {c.blockquote.quote}
          </blockquote>
          <footer className="mt-8">
            <p className="text-charcoal-500 text-base">
              {c.blockquote.attribution}
            </p>
          </footer>
        </div>
      </motion.section>

      {/* SECTION 6: VIDEO */}
      <motion.section
        className="bg-charcoal py-12 md:py-16"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-full bg-white/10 text-sand-300 px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-medium font-body mb-5">
                {c.video.badge}
              </span>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-cream-50 tracking-tight leading-[1.1] mb-4">
                {c.video.title}
              </h3>
              <p className="text-sand-300 leading-relaxed max-w-[45ch]">
                {c.video.description}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={c.video.videoUrl}
                  title={c.video.videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Play size={14} className="text-gold-400" />
                <p className="text-sand-300 text-sm">
                  <span className="text-cream-100 font-medium">{c.video.quoteAuthor}</span>
                  {' · '}
                  {c.video.quoteAttribution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 7: THE PLAN */}
      <Section background="light">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.thePlan.badge}
            title={c.thePlan.title}
            subtitle={c.thePlan.subtitle}
            alignment="center"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.thePlan.steps.map((item, i) => {
            const icons = [<MapPin key="m" size={24} />, <Sparkles key="s" size={24} />, <Wind key="w" size={24} />];
            const stepNum = String(i + 1).padStart(2, '0');
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="relative text-center rounded-2xl bg-cream-100 p-8 shadow-card"
              >
                <span className="text-8xl font-heading font-bold text-navy-500/[0.04] absolute top-2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                  {stepNum}
                </span>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-500 mx-auto mb-5">
                    {icons[i] || <MapPin size={24} />}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-3">
                    {item.title}
                  </h3>
                  <p className="text-charcoal-500 leading-relaxed max-w-[35ch] mx-auto">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-14"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Button to={c.thePlan.buttonLink} variant="primary" size="lg" microcopy={c.thePlan.buttonMicrocopy}>
            {c.thePlan.buttonText}
          </Button>
        </motion.div>
      </Section>

      {/* SECTION 8: SERVICES */}
      <Section background="cream">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionTitle
            eyebrow={c.servicesSection.eyebrow}
            title={c.servicesSection.title}
            subtitle={c.servicesSection.subtitle}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="md:col-span-2" variants={staggerItem}>
            <div className="rounded-2xl bg-cream-100 p-1.5 shadow-card hover:shadow-card-hover transition-all duration-500 ease-out-expo">
              <div className="rounded-xl bg-cream-50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy-500 mb-5">
                    <HomeIcon size={24} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-charcoal mb-3">
                    {c.services[0].title}
                  </h3>
                  <p className="text-sm text-charcoal-500 leading-relaxed mb-5">
                    {c.services[0].description}
                  </p>
                  <Button to={c.services[0].linkTo} variant="ghost" size="sm" disabled>
                    {c.services[0].buttonText} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <CmsImage
                    src={c.services[0].image}
                    alt="Feng Shui consultation"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <ServiceCard
              icon={<School size={24} />}
              title={c.services[1].title}
              description={c.services[1].description}
              linkTo={c.services[1].linkTo}
              buttonText={c.services[1].buttonText}
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <ServiceCard
              icon={<Users size={24} />}
              title={c.services[2].title}
              description={c.services[2].description}
              linkTo={c.services[2].linkTo}
              buttonText={c.services[2].buttonText}
              disabled
            />
          </motion.div>
        </motion.div>
      </Section>

      {/* SECTION 9: SCHOOL SPOTLIGHT */}
      <section className="bg-gold-950 py-24 md:py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              className="lg:col-span-7"
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <span className="inline-block rounded-full bg-gold-500/20 text-gold-300 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
                {c.schoolSpotlight.badge}
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-cream-50 tracking-tight leading-[1.05] mb-6">
                {c.schoolSpotlight.title}
              </h2>

              <p className="text-lg text-gold-200/60 leading-relaxed mb-6 max-w-[55ch]">
                {c.schoolSpotlight.paragraph}
              </p>

              <div className="space-y-3 mb-8">
                {c.schoolSpotlight.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                    <span className="text-gold-100/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button to={c.schoolSpotlight.primaryButton.link} variant="primary" size="lg" className="!bg-gold-400 !text-gold-950 hover:!bg-gold-300">
                  {c.schoolSpotlight.primaryButton.text}
                </Button>
                <Button to={c.schoolSpotlight.secondaryButton.link} variant="outline" size="lg" className="!border-gold-400/30 !text-gold-100 hover:!bg-gold-400/10">
                  {c.schoolSpotlight.secondaryButton.text}
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div className="rounded-2xl overflow-hidden shadow-warm">
                <video
                  className="w-full h-auto object-cover aspect-[9/16] max-h-[480px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={c.schoolSpotlight.videoUrl}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 10: TESTIMONIALS */}
      <Section background="light" id="testimonials">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.testimonials.items.map((item, index) => {
            const icons = [<HomeIcon key="h" size={12} />, <School key="s" size={12} />, <Users key="u" size={12} />];
            return (
              <motion.div key={index} variants={staggerItem}>
                <TestimonialCard
                  quote={item.quote}
                  author={item.author}
                  location={item.location}
                  service={item.service}
                  icon={icons[index] || <HomeIcon size={12} />}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* SECTION 11: FREE GUIDE */}
      <section className="relative bg-navy-50 py-24 md:py-32 lg:py-40 overflow-hidden">
        <img
          src="/images/logo-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[120%] w-auto opacity-20 pointer-events-none"
          style={{ maskImage: 'linear-gradient(to right, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)' }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full bg-gold-50 text-gold-600 px-3 py-1 text-xs uppercase tracking-[0.2em] font-body font-medium mb-4">
                  {c.freeGuide.badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-4">
                  {c.freeGuide.title}
                </h2>
                <p className="text-charcoal-500 font-body leading-relaxed mb-6 max-w-[55ch]">
                  {c.freeGuide.description}
                </p>
                <Button to={c.freeGuide.buttonLink} variant="primary" size="lg" disabled>
                  {c.freeGuide.buttonText}
                </Button>
              </div>
              <div className="relative">
                <div className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-6 md:p-8">
                  <div className="space-y-3">
                    {c.freeGuide.chapters.map((ch, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-navy-100 text-navy-600 text-xs font-heading font-semibold flex items-center justify-center">{i + 1}</span>
                        <span className="text-sm text-charcoal-500 font-body">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 12: FINAL CTA */}
      <Section background="accent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            className="lg:col-span-7"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
              {c.cta.badge}
            </span>

            <h2 className="text-3xl md:text-5xl font-heading font-semibold text-charcoal tracking-tight leading-[1.05] mb-4">
              {c.cta.title}
            </h2>

            <p className="text-lg text-charcoal-500 max-w-[55ch] leading-relaxed mb-3">
              {c.cta.subtitle}
            </p>

            <p className="text-charcoal-400 leading-relaxed mb-8 max-w-[55ch]">
              {c.cta.closingParagraph}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button to={c.cta.primaryButton.link} variant="primary" size="lg" microcopy={c.hero.primaryMicrocopy}>
                {c.cta.primaryButton.text}
              </Button>
              <Button to={c.cta.secondaryButton.link} variant="outline" size="lg">
                {c.cta.secondaryButton.text}
              </Button>
            </div>
          </motion.div>

          <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
            <Wind
              size={280}
              className="text-navy-200 rotate-12 opacity-60"
              strokeWidth={0.75}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HomeContent;
