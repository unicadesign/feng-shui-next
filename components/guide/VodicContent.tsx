'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { scrollReveal, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import Button from '@/components/Button';
import ChapterNav from '@/components/guide/ChapterNav';
import GuideChapter from '@/components/guide/GuideChapter';
import EmailGate from '@/components/guide/EmailGate';
import VideoEmbed from '@/components/guide/VideoEmbed';
import FengShuiQuiz from '@/components/guide/FengShuiQuiz';
import type { GuideContent } from '@/types/content';

interface VodicContentProps {
  content: GuideContent;
}

const VodicContent = ({ content: g }: VodicContentProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem('ptplan_guide_unlocked');
    if (stored) setUnlocked(true);
  }, []);

  const handleUnlock = () => setUnlocked(true);

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const chapterNavItems = g.chapters.map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title,
  }));

  const ch1 = g.chapters[0];
  const ch2 = g.chapters[1];
  const ch3 = g.chapters[2];
  const ch4 = g.chapters[3];
  const ch5 = g.chapters[4];
  const ch6 = g.chapters[5];
  const ch7 = g.chapters[6];

  return (
    <div>
      {/* Hero */}
      <Section background="cream">
        <motion.div
          className="max-w-3xl"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <span className="inline-block rounded-full bg-navy-50 text-navy-600 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium font-body mb-6">
            {g.hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-semibold text-charcoal tracking-tight leading-[1.05] mb-6">
            {g.hero.title}
          </h1>
          <p className="text-lg text-charcoal-500 leading-relaxed max-w-[60ch]">
            {g.hero.subtitle}
          </p>
        </motion.div>
      </Section>

      <Section background="light">
        <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8 lg:gap-16">
          <ChapterNav chapters={chapterNavItems} />

          <div className="max-w-3xl space-y-24">
            {/* CHAPTER 1 — always visible */}
            <GuideChapter id={ch1.id} number={ch1.number} title={ch1.title}>
              {ch1.content.map((p, i) => (
                <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                  {p}
                </p>
              ))}

              {ch1.bullets && (
                <ul className="space-y-3 mt-4">
                  {ch1.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-gold-500 mt-0.5 flex-shrink-0" />
                      <span className="text-charcoal-500 font-body leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {ch1.reflectionQuestions && (
                <div className="mt-8 rounded-2xl bg-navy-50 p-6 border border-navy-100">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-medium font-body text-navy-400 mb-4">
                    Zadatak za refleksiju
                  </p>
                  {ch1.reflectionQuestions.map((q, i) => (
                    <p key={i} className="text-xl font-heading italic text-navy-400 leading-relaxed mb-3 last:mb-0">
                      {q}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <VideoEmbed title="Bonus Video 1: Uvod u energiju prostora" />
              </div>
            </GuideChapter>

            {/* EMAIL GATE */}
            {!unlocked && (
              <div className="space-y-12">
                <EmailGate
                  onUnlock={handleUnlock}
                  title={g.emailGate.title}
                  subtitle={g.emailGate.subtitle}
                  buttonText={g.emailGate.buttonText}
                />

                <div className="relative">
                  <div className="blur-lg opacity-50 pointer-events-none select-none space-y-16">
                    {g.chapters.slice(1).map((ch) => (
                      <div key={ch.id}>
                        <span className="text-6xl font-heading font-bold text-navy-100">{ch.number}</span>
                        <h3 className="text-2xl font-heading font-semibold text-charcoal -mt-2">{ch.title}</h3>
                        <div className="h-px w-12 bg-gold-300 mt-3 mb-4" />
                        {ch.content.map((p, i) => (
                          <p key={i} className="text-charcoal-500 leading-relaxed mb-3">{p}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/60 to-cream-50" />
                </div>
              </div>
            )}

            {/* GATED CONTENT */}
            {unlocked && (
              <>
                {/* CHAPTER 2: Quiz */}
                <GuideChapter id={ch2.id} number={ch2.number} title={ch2.title}>
                  {ch2.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}
                  <div className="mt-6">
                    <FengShuiQuiz
                      questions={g.quiz.questions}
                      results={g.quiz.results}
                      footerText={g.quiz.footerText}
                    />
                  </div>
                </GuideChapter>

                {/* CHAPTER 3: Mini mapa prostora */}
                <GuideChapter id={ch3.id} number={ch3.number} title={ch3.title}>
                  {ch3.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}

                  {ch3.steps && (
                    <motion.div
                      className="space-y-6 mt-6"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportOnce}
                    >
                      {ch3.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          variants={staggerItem}
                          className="flex gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center">
                            <span className="font-heading font-bold text-navy-500">{i + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-heading font-semibold text-charcoal text-lg mb-1">{step.title}</h4>
                            <p className="text-charcoal-500 font-body leading-relaxed">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  <div className="mt-8">
                    <VideoEmbed title="Bonus Video 2: Kako napraviti mapu prostora" />
                  </div>

                  <div className="mt-6 rounded-xl bg-gold-50 border border-gold-200 p-4">
                    <p className="text-sm text-charcoal-500 font-body leading-relaxed">
                      <Sparkles size={14} className="inline text-gold-500 mr-1.5" />
                      U našem 3-mesečnom programu učimo vas kako se ovo radi potpuno precizno — sa profesionalnim alatima i personalizovanim vođenjem.
                    </p>
                  </div>
                </GuideChapter>

                {/* CHAPTER 4: Priprema prostora */}
                <GuideChapter id={ch4.id} number={ch4.number} title={ch4.title}>
                  {ch4.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}

                  {ch4.steps && (
                    <div className="space-y-2 mt-6">
                      {ch4.steps.map((step, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-sand-200 bg-cream-50 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleStep(i)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-sand-50 transition-colors"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center">
                              <span className="font-heading font-bold text-navy-500 text-sm">{i + 1}</span>
                            </span>
                            <span className="font-heading font-semibold text-charcoal flex-1">{step.title}</span>
                            <ChevronDown
                              size={18}
                              className={`text-charcoal-400 transition-transform duration-200 ${
                                expandedSteps[i] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedSteps[i] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="px-5 pb-4 pl-[4.25rem]"
                            >
                              <p className="text-charcoal-500 font-body leading-relaxed">{step.description}</p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </GuideChapter>

                {/* CHAPTER 5: Pet najčešćih blokada */}
                <GuideChapter id={ch5.id} number={ch5.number} title={ch5.title}>
                  {ch5.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}

                  {ch5.blockages && (
                    <div className="space-y-8 mt-6">
                      {ch5.blockages.map((block, i) => (
                        <motion.div
                          key={i}
                          variants={scrollReveal}
                          initial="hidden"
                          whileInView="visible"
                          viewport={viewportOnce}
                          className="rounded-2xl border border-sand-200 bg-cream-50 p-6"
                        >
                          <h4 className="text-xl font-heading font-semibold text-charcoal mb-3">
                            <span className="text-gold-500 mr-2">{i + 1}.</span>
                            {block.title}
                          </h4>
                          <ul className="space-y-2 mb-4">
                            {block.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-2 text-charcoal-500 font-body text-sm">
                                <span className="text-charcoal-300 mt-1">—</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                          <div className="rounded-xl bg-navy-50 p-4 border border-navy-100">
                            <p className="text-sm font-body">
                              <Zap size={14} className="inline text-gold-500 mr-1.5" />
                              <span className="font-semibold text-charcoal">Brzi korak: </span>
                              <span className="text-charcoal-500">{block.quickStep}</span>
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    <VideoEmbed title="Bonus Video 3: Kako ukloniti energetske blokade" />
                  </div>
                </GuideChapter>

                {/* CHAPTER 6: Refleksija */}
                <GuideChapter id={ch6.id} number={ch6.number} title={ch6.title}>
                  {ch6.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}

                  {ch6.reflectionQuestions && (
                    <div className="space-y-6 mt-8">
                      {ch6.reflectionQuestions.map((q, i) => (
                        <p key={i} className="text-2xl md:text-3xl font-heading italic text-navy-300 leading-relaxed">
                          {q}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 rounded-xl bg-sand-50 border border-sand-200 p-6">
                    <p className="font-heading font-semibold text-charcoal mb-2">Šta ova refleksija otkriva?</p>
                    <p className="text-charcoal-500 font-body leading-relaxed">
                      Ova pitanja nemaju &ldquo;tačan&rdquo; odgovor. Njihov cilj je da vam pomognu da postanete svesni onoga što ste do sada ignorisali — i da taj prvi korak ka promeni napravite sa jasnoćom, a ne iz panike.
                    </p>
                  </div>
                </GuideChapter>

                {/* CHAPTER 7: Sledeći korak */}
                <GuideChapter id={ch7.id} number={ch7.number} title={ch7.title}>
                  {ch7.content.map((p, i) => (
                    <p key={i} className="text-charcoal-500 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}

                  {ch7.programSections && (
                    <div className="mt-8">
                      <h3 className="text-xl font-heading font-semibold text-charcoal mb-6">
                        Šta dobijate u programu:
                      </h3>
                      <motion.div
                        className="space-y-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                      >
                        {ch7.programSections.map((sec, i) => (
                          <motion.div
                            key={i}
                            variants={staggerItem}
                            className="flex gap-4 items-start"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center">
                              <span className="font-heading font-bold text-gold-600 text-sm">{i + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-charcoal mb-1">{sec.title}</h4>
                              <p className="text-charcoal-500 font-body text-sm leading-relaxed">{sec.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {ch7.programBenefits && (
                    <div className="mt-10 rounded-2xl bg-navy-50 p-6 border border-navy-100">
                      <h4 className="font-heading font-semibold text-charcoal mb-4">
                        Plus: sve što dobijate tokom programa
                      </h4>
                      <ul className="space-y-2.5">
                        {ch7.programBenefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                            <span className="text-charcoal-500 font-body text-sm leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ch7.joinIfItems && (
                    <div className="mt-10">
                      <h4 className="font-heading font-semibold text-charcoal mb-4">
                        Pridruži se ako:
                      </h4>
                      <ul className="space-y-2.5">
                        {ch7.joinIfItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <ArrowRight size={16} className="text-navy-400 mt-0.5 flex-shrink-0" />
                            <span className="text-charcoal-500 font-body leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-12 rounded-2xl bg-cream-100 border border-sand-200 p-8 text-center">
                    <h3 className="text-2xl md:text-3xl font-heading font-semibold text-charcoal mb-4">
                      {g.cta.title}
                    </h3>
                    <Button
                      to={g.cta.buttonLink}
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight size={16} />}
                      microcopy="Na vaš email — besplatno, bez spama"
                    >
                      {g.cta.buttonText}
                    </Button>
                  </div>
                </GuideChapter>
              </>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default VodicContent;
