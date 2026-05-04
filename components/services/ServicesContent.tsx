'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Home,
  Building,
  Compass,
  Check,
  Sparkles,
  ArrowRight,
  Key,
  Home as HomeIcon,
  GraduationCap,
  Clock,
  Gift,
  Send,
  ChevronDown,
} from 'lucide-react';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import CTASection from '@/components/CTASection';
import type { ServicesContent as ServicesContentType } from '@/types/content';

interface ServicesContentProps {
  content: ServicesContentType;
}

const ServicesContent = ({ content: c }: ServicesContentProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateContactForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = c.contactForm.nameRequired;
    if (!formData.email.trim()) {
      errors.email = c.contactForm.emailRequired;
    } else if (!isValidEmail(formData.email)) {
      errors.email = c.contactForm.emailInvalid;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateContactForm()) return;

    setIsSubmitting(true);

    // Simulated submit — same as Vite app. A future polish pass should
    // wire this to inquiries via Supabase or a server action.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      }, 5000);
    }, 1500);
  };

  const overviewIcons = [
    <Home key="h" size={28} className="text-navy-600" />,
    <Building key="b" size={28} className="text-gold-500" />,
    <Compass key="c" size={28} className="text-navy-600" />,
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-charcoal py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <span className="text-sm uppercase tracking-widest text-gold-400 font-heading font-medium mb-4 block">
              {c.hero.eyebrow}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium mb-6 text-cream-50">
              {c.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-sand-300 leading-relaxed">
              {c.hero.subtitle}
            </p>
            <p className="text-sm uppercase tracking-wider text-gold-400 font-light">
              {c.hero.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <Section background="cream">
        <SectionTitle
          eyebrow={c.overview.eyebrow}
          title={c.overview.title}
          subtitle={c.overview.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {c.overview.cards.map((card, index) => (
            <TransformationCard
              key={index}
              title={card.title}
              description={card.description}
              icon={overviewIcons[index] || <Home size={28} className="text-navy-600" />}
              buttonText={card.buttonText}
              linkTo={card.linkTo}
            />
          ))}
        </motion.div>
      </Section>

      {/* Home Consultations */}
      <section id="home-consultations" className="py-24 md:py-32 bg-navy-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                {c.serviceDetails[0].title}
              </h2>
              <p className="text-xl text-navy-600 mb-6 font-light">
                {c.serviceDetails[0].subtitle}
              </p>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[0].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center mr-3">
                    <Check size={18} className="text-navy-600" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[0].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[0].buttonLink} variant="primary" size="lg" className="group" microcopy={c.labels.primaryButtonMicrocopy}>
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[0].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm">
                <ImageWithFadeIn
                  src={c.serviceDetails[0].image}
                  alt={c.serviceDetails[0].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Space Design */}
      <section className="py-24 md:py-32 bg-cream-50" id="space-design">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-2 lg:order-1 relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm border border-gold-50">
                <ImageWithFadeIn
                  src={c.serviceDetails[1].image}
                  alt={c.serviceDetails[1].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                {c.serviceDetails[1].title}
              </h2>
              <p className="text-xl text-navy-600 mb-6 font-light">
                {c.serviceDetails[1].subtitle}
              </p>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[1].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center mr-3">
                    <Check size={18} className="text-navy-600" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[1].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[1].buttonLink} variant="primary" size="lg" className="group" microcopy={c.labels.primaryButtonMicrocopy}>
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[1].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real Estate Guidance */}
      <section className="py-24 md:py-32 bg-navy-50" id="real-estate-guidance">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div className="relative">
                <AnimatedIcon />

                <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                  {c.serviceDetails[2].title}
                </h2>
                <p className="text-xl text-navy-600 mb-6 font-light">
                  {c.serviceDetails[2].subtitle}
                </p>
              </div>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[2].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center mr-3">
                    <Check size={18} className="text-navy-600" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[2].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[2].buttonLink} variant="primary" size="lg" className="group" microcopy={c.labels.primaryButtonMicrocopy}>
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[2].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm border border-navy-50">
                <ImageWithFadeIn
                  src={c.serviceDetails[2].image}
                  alt={c.serviceDetails[2].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feng Shui School */}
      <section className="py-24 md:py-32 bg-gold-50" id="feng-shui-school">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-2 lg:order-1 relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm border border-sand-200">
                <ImageWithFadeIn
                  src={c.serviceDetails[3].image}
                  alt={c.serviceDetails[3].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-1 lg:order-2 relative"
            >
              <div className="w-16 h-1 bg-gold-400 mb-8" />

              <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                {c.serviceDetails[3].title}
              </h2>
              <p className="text-xl text-gold-500 mb-6 font-light">
                {c.serviceDetails[3].subtitle}
              </p>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[3].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-50 rounded-full flex items-center justify-center mr-3">
                    <GraduationCap size={18} className="text-gold-500" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[3].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[3].buttonLink} variant="secondary" size="lg" className="group">
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[3].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Time-based Feng Shui */}
      <section className="py-24 md:py-32 bg-navy-50" id="time-based-feng-shui">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div className="relative">
                <div className="w-16 h-1 bg-navy-500 mb-8" />

                <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                  {c.serviceDetails[4].title}
                </h2>
                <p className="text-xl text-navy-600 mb-6 font-light">
                  {c.serviceDetails[4].subtitle}
                </p>
              </div>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[4].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center mr-3">
                    <Clock size={18} className="text-navy-600" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[4].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[4].buttonLink} variant="primary" size="lg" className="group" microcopy={c.labels.primaryButtonMicrocopy}>
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[4].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm border border-navy-50">
                <ImageWithFadeIn
                  src={c.serviceDetails[4].image}
                  alt={c.serviceDetails[4].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Abundance Vase */}
      <section className="py-24 md:py-32 bg-gold-50" id="abundance-vase">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-warm border border-sand-200">
                <ImageWithFadeIn
                  src={c.serviceDetails[5].image}
                  alt={c.serviceDetails[5].imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div className="w-16 h-1 bg-gold-400 mb-8" />

              <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                {c.serviceDetails[5].title}
              </h2>
              <p className="text-xl text-gold-500 mb-6 font-light">
                {c.serviceDetails[5].subtitle}
              </p>

              <p className="text-charcoal-500 mb-6">
                {c.serviceDetails[5].description}
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card mb-6">
                <h3 className="text-xl font-medium text-charcoal mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-50 rounded-full flex items-center justify-center mr-3">
                    <Gift size={18} className="text-gold-500" />
                  </span>
                  {c.labels.includedHeading}
                </h3>
                <ul className="space-y-3 mb-0">
                  {c.serviceDetails[5].includedItems.map((item, i) => (
                    <ServiceFeature key={i} text={item} />
                  ))}
                </ul>
              </div>

              <Button to={c.serviceDetails[5].buttonLink} variant="secondary" size="lg" className="group">
                <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                  {c.serviceDetails[5].buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 bg-cream-100 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-4">
              {c.process.title}
            </h2>
            <p className="text-xl text-charcoal-500 max-w-2xl mx-auto">
              {c.process.subtitle}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-navy-500/30 transform md:translate-x-[-0.5px] z-10" />

            <div className="space-y-12 md:space-y-24">
              {c.process.steps.map((step, index) => (
                <TimelineProcessStep
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  left={index % 2 !== 0}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-sand-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-4">
              {c.faq.title}
            </h2>
            <p className="text-lg text-charcoal-500 max-w-2xl mx-auto">
              {c.faq.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-4">
              {c.faq.items.map((item, index) => (
                <FaqAccordionItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={expandedFaq === index}
                  toggleFaq={() => toggleFaq(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objections */}
      <Section background="light">
        <SectionTitle
          eyebrow={c.objections.eyebrow}
          title={c.objections.title}
          subtitle={c.objections.subtitle}
          alignment="center"
        />
        <motion.div
          className="max-w-3xl mx-auto mt-12 space-y-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {c.objections.items.map((item, i) => (
            <motion.div key={i} variants={staggerItem} className="rounded-2xl bg-cream-50 border border-sand-200 p-6 md:p-8">
              <h3 className="text-lg font-heading font-semibold text-charcoal mb-3">
                {item.question}
              </h3>
              <p className="text-charcoal-500 font-body leading-relaxed">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Contact form */}
      <section className="py-24 md:py-32 bg-cream-50 relative overflow-hidden" id="guidance">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-charcoal mb-3">
                {c.contactForm.title}
              </h2>
              <p className="text-xl text-navy-600 mb-6 font-light">
                {c.contactForm.subtitle}
              </p>
              <p className="text-charcoal-500 mb-6">
                {c.contactForm.description}
              </p>
            </motion.div>

            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="bg-white rounded-2xl shadow-warm p-8 border border-sand-200 relative"
            >
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-navy-50 text-navy-600">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-charcoal mb-2">{c.contactForm.successMessage}</h3>
                  <p className="text-charcoal-500">
                    {c.contactForm.successSubtext}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm text-charcoal font-heading font-medium mb-1">
                        {c.contactForm.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all ${fieldErrors.name ? 'border-red-500' : 'border-sand-300'}`}
                        placeholder={c.contactForm.namePlaceholder}
                        required
                      />
                      {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-charcoal font-heading font-medium mb-1">
                        {c.contactForm.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all ${fieldErrors.email ? 'border-red-500' : 'border-sand-300'}`}
                        placeholder={c.contactForm.emailPlaceholder}
                        required
                      />
                      {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm text-charcoal font-heading font-medium mb-1">
                        {c.contactForm.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-xl border border-sand-300 focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
                        placeholder={c.contactForm.messagePlaceholder}
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-600 text-sm mb-4">{submitError}</p>
                    )}

                    <div className="text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="group w-full sm:w-auto flex justify-center items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {c.contactForm.submittingText}
                          </span>
                        ) : (
                          <span className="group-hover:translate-x-1 transition-all duration-300 inline-flex items-center">
                            {c.contactForm.submitText}
                            <Send size={16} className="ml-2" />
                          </span>
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-center text-charcoal-500 mt-2">
                      {c.contactForm.successSubtext}
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title={c.cta.title}
        subtitle={c.cta.subtitle}
        primaryButtonText={c.cta.primaryButton.text}
        primaryButtonLink={c.cta.primaryButton.link}
        secondaryButtonText={c.cta.secondaryButton.text}
        secondaryButtonLink={c.cta.secondaryButton.link}
        primaryMicrocopy={c.cta.primaryMicrocopy}
        icon={Sparkles}
        background="light"
      />
    </div>
  );
};

const FaqAccordionItem = ({
  question,
  answer,
  isOpen,
  toggleFaq,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleFaq: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-card border-b border-sand-200 overflow-hidden transition-all duration-300">
      <button
        className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
        onClick={toggleFaq}
      >
        <h3 className="text-lg font-heading font-medium text-charcoal">{question}</h3>
        <ChevronDown
          size={20}
          className={`text-navy-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 pt-1 text-charcoal-500">
          <div className="h-px w-full bg-sand-200 mb-4" />
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

const TimelineProcessStep = ({
  number,
  title,
  description,
  left,
}: {
  number: string;
  title: string;
  description: string;
  left: boolean;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div ref={ref} className="relative flex items-center">
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-20">
        <div
          className={`
            w-10 h-10 rounded-full bg-navy-500 text-white flex items-center justify-center font-heading font-medium
            shadow-card border-2 border-white
            transition-all duration-700 ${inView ? 'scale-100' : 'scale-0'}
          `}
        >
          {number}
        </div>
      </div>

      <div
        className={`
          md:w-5/12 pl-16 md:pl-0
          ${left ? 'md:text-right md:pr-10 md:mr-auto' : 'md:text-left md:pl-10 md:ml-auto'}
          transition-all duration-700 transform
          ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <h3 className="text-xl font-heading font-medium text-navy-600 mb-2">
          {title}
        </h3>
        <p className="text-charcoal-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const AnimatedIcon = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="flex items-center mb-4">
      <div
        className={`
          w-14 h-14 rounded-full bg-navy-50
          flex items-center justify-center shadow-card relative mr-3
          ${inView ? 'animate-pulse' : ''}
        `}
      >
        <div
          className={`
            transition-all duration-1000 transform
            ${inView ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}
          `}
        >
          <HomeIcon size={24} className="text-navy-600" />
        </div>
      </div>
      <div
        className={`
          w-10 h-10 rounded-full bg-gold-50
          flex items-center justify-center shadow-soft -ml-4
          transition-all duration-1000 transform
          ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <Key size={18} className="text-gold-500" />
      </div>
    </div>
  );
};

const ImageWithFadeIn = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="w-full h-full">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className ?? ''} transition-all duration-1000 transform ${
          inView ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};

const TransformationCard = ({
  title,
  description,
  icon,
  buttonText,
  linkTo,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  linkTo: string;
}) => {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl p-8 shadow-warm border border-sand-200 transition-all duration-500 transform hover:shadow-card-hover hover:border-navy-50 group relative overflow-hidden"
    >
      <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      <h3 className="text-xl font-heading font-medium text-center mb-3 text-charcoal">
        {title}
      </h3>

      <p className="text-charcoal-500 text-center mb-6">
        {description}
      </p>

      <div className="text-center">
        <Button
          to={linkTo}
          variant="primary"
          className="group-hover:bg-navy-600 transition-colors duration-300"
        >
          <span className="inline-flex items-center">
            {buttonText}
            <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

const ServiceFeature = ({ text }: { text: string }) => {
  return (
    <li className="flex items-start">
      <div className="mt-1 mr-3 flex-shrink-0 text-navy-500">
        <Check size={18} />
      </div>
      <span className="text-charcoal-500">{text}</span>
    </li>
  );
};

export default ServicesContent;
