'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GuideQuizQuestion, GuideQuizResult } from '@/types/content';

interface FengShuiQuizProps {
  questions: GuideQuizQuestion[];
  results: GuideQuizResult[];
  footerText: string;
}

const FengShuiQuiz: React.FC<FengShuiQuizProps> = ({ questions, results, footerText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (yes: boolean) => {
    const newYes = yes ? yesCount + 1 : yesCount;
    setYesCount(newYes);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const getResult = (): GuideQuizResult => {
    const count = yesCount;
    return results.find((r) => count >= r.range[0] && count <= r.range[1]) ?? results[0];
  };

  const progress = finished ? 100 : (currentIndex / questions.length) * 100;

  return (
    <div className="rounded-2xl bg-cream-50 border border-sand-200 shadow-warm overflow-hidden">
      <div className="h-1.5 bg-sand-100">
        <motion.div
          className="h-full bg-navy-500 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium font-body text-charcoal-400 mb-4">
                Pitanje {currentIndex + 1} od {questions.length}
              </p>

              <p className="text-xl md:text-2xl font-heading font-medium text-charcoal leading-relaxed mb-8">
                {questions[currentIndex].text}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-3.5 rounded-full text-base font-heading font-semibold border-2 border-navy-500 text-navy-600 hover:bg-navy-50 active:bg-navy-100 transition-all duration-200 active:scale-[0.98]"
                >
                  Da
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-3.5 rounded-full text-base font-heading font-semibold border-2 border-sand-300 text-charcoal-500 hover:bg-sand-50 active:bg-sand-100 transition-all duration-200 active:scale-[0.98]"
                >
                  Ne
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="rounded-2xl bg-navy-50 p-6 md:p-8 mb-6">
                <p className="text-[11px] uppercase tracking-[0.2em] font-medium font-body text-navy-400 mb-2">
                  Vaš rezultat: {yesCount} od {questions.length} &ldquo;Da&rdquo; odgovora
                </p>
                <p className="text-gold-500 font-heading font-semibold text-lg mb-1">
                  {getResult().type}
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold text-charcoal mb-4">
                  {getResult().title}
                </h3>
                <p className="text-charcoal-500 leading-relaxed font-body">
                  {getResult().description}
                </p>
              </div>

              <p className="text-sm text-charcoal-400 leading-relaxed font-body italic">
                {footerText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FengShuiQuiz;
