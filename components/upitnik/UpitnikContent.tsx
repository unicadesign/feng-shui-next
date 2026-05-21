'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import TrustBadges from '@/components/TrustBadges';
import { supabase } from '@/lib/supabase/client';
import type { InquiryInsert } from '@/types/inquiry';

const stepLabels = ['Osnovne informacije', 'Usluge', 'Ciljevi', 'Dodatne informacije'];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  homeType: string;
  mainGoals: string[];
  challenges: string;
  heardFrom: string;
  additionalInfo: string;
  preferredContact: string;
  preferredTime: string;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  serviceType: '',
  homeType: '',
  mainGoals: [],
  challenges: '',
  heardFrom: '',
  additionalInfo: '',
  preferredContact: 'email',
  preferredTime: '',
};

const UpitnikContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        mainGoals: [...prev.mainGoals, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        mainGoals: prev.mainGoals.filter((goal) => goal !== value),
      }));
    }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Ime i prezime je obavezno.';
      if (!formData.email.trim()) {
        errors.email = 'Email adresa je obavezna.';
      } else if (!isValidEmail(formData.email)) {
        errors.email = 'Unesite ispravnu email adresu.';
      }
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    }
    if (currentStep === 2) {
      if (!formData.serviceType) errors.serviceType = 'Izaberite uslugu.';
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    }
    if (currentStep === 3) {
      if (formData.mainGoals.length === 0) errors.mainGoals = 'Izaberite bar jedan cilj.';
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    }
    setFieldErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    const payload: InquiryInsert = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      preferred_contact: formData.preferredContact,
      preferred_time: formData.preferredTime || null,
      service_type: formData.serviceType,
      home_type: formData.homeType || null,
      main_goals: formData.mainGoals,
      challenges: formData.challenges || null,
      heard_from: formData.heardFrom || null,
      additional_info: formData.additionalInfo || null,
    };

    const { error } = await supabase.from('inquiries').insert([payload]);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message || 'Došlo je do greške. Pokušajte ponovo.');
    } else {
      setIsSubmitted(true);
    }
  };

  const inputClasses = (fieldName?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 font-body text-charcoal placeholder:text-charcoal-500/50 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200 ${
      fieldName && fieldErrors[fieldName] ? 'border-red-400' : 'border-sand-300'
    }`;

  const labelClasses = 'block text-charcoal font-heading font-medium mb-2';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-cream-100 py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            animate="visible"
          >
            <SectionTitle
              eyebrow="Kontakt"
              title="Započni svoju Feng Shui transformaciju"
              subtitle="Popunite upitnik kako bismo bolje razumeli vaše potrebe i pripremili personalizovano rešenje za vas"
            />
            <TrustBadges variant="light" className="justify-start mt-2" />
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <Section background="light">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <motion.div
            className="mb-10"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ease-out-expo ${
                    currentStep >= step ? 'bg-navy-500' : 'bg-sand-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {stepLabels.map((label, i) => (
                <span
                  key={label}
                  className={`text-xs font-heading font-medium transition-colors duration-300 ${
                    currentStep >= i + 1 ? 'text-navy-600' : 'text-charcoal-500'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <form onSubmit={handleSubmit} className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-6 md:p-10">
              {/* Step 1: Basic info */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-heading font-semibold text-charcoal mb-6">Osnovne informacije</h2>

                  <div className="mb-6">
                    <label htmlFor="fullName" className={labelClasses}>Ime i prezime *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={inputClasses('fullName')}
                      required
                    />
                    {fieldErrors.fullName && <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className={labelClasses}>Email adresa *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClasses('email')}
                      required
                    />
                    {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className={labelClasses}>Broj telefona</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inputClasses()}
                    />
                  </div>

                  <div className="mb-6">
                    <label className={labelClasses}>Preferirani način kontakta</label>
                    <div className="flex gap-4">
                      <label
                        className={`flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 ${
                          formData.preferredContact === 'email'
                            ? 'border-navy-500 bg-navy-50'
                            : 'border-sand-200 bg-cream-50 hover:border-sand-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleInputChange}
                          className="accent-navy-500"
                        />
                        <span className="font-body text-charcoal">Email</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 ${
                          formData.preferredContact === 'phone'
                            ? 'border-navy-500 bg-navy-50'
                            : 'border-sand-200 bg-cream-50 hover:border-sand-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleInputChange}
                          className="accent-navy-500"
                        />
                        <span className="font-body text-charcoal">Telefon</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="preferredTime" className={labelClasses}>Preferirano vreme za kontakt</label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className={inputClasses()}
                    >
                      <option value="">Izaberite...</option>
                      <option value="morning">Jutro (9-12h)</option>
                      <option value="afternoon">Popodne (12-17h)</option>
                      <option value="evening">Veče (17-20h)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Services */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-heading font-semibold text-charcoal mb-6">Izaberite uslugu</h2>

                  <div className="mb-6">
                    <label className={labelClasses}>Koja vas usluga interesuje? *</label>
                    {fieldErrors.serviceType && <p className="text-red-500 text-sm mb-2">{fieldErrors.serviceType}</p>}

                    <div className="space-y-3">
                      <ServiceOption
                        id="homeConsultation"
                        name="serviceType"
                        value="homeConsultation"
                        checked={formData.serviceType === 'homeConsultation'}
                        onChange={handleInputChange}
                        title="Konsultacija za dom"
                        description="Analiza vašeg životnog prostora i preporuke za harmonizaciju"
                      />

                      <ServiceOption
                        id="spaceDesign"
                        name="serviceType"
                        value="spaceDesign"
                        checked={formData.serviceType === 'spaceDesign'}
                        onChange={handleInputChange}
                        title="Dizajn prostora"
                        description="Feng Shui principi za nove gradnje ili renoviranje"
                      />

                      <ServiceOption
                        id="realEstate"
                        name="serviceType"
                        value="realEstate"
                        checked={formData.serviceType === 'realEstate'}
                        onChange={handleInputChange}
                        title="Procena nekretnina"
                        description="Evaluacija nekretnina prema Feng Shui principima pre kupovine"
                      />

                      <ServiceOption
                        id="fengShuiSchool"
                        name="serviceType"
                        value="fengShuiSchool"
                        checked={formData.serviceType === 'fengShuiSchool'}
                        onChange={handleInputChange}
                        title="Feng Shui škola"
                        description="4-mesečni program obuke za Feng Shui principe i praksu"
                      />

                      <ServiceOption
                        id="vazaIzobilja"
                        name="serviceType"
                        value="vazaIzobilja"
                        checked={formData.serviceType === 'vazaIzobilja'}
                        onChange={handleInputChange}
                        title="Vaza Izobilja"
                        description="Naručivanje i konsultacija za tradicionalnu Feng Shui vazu izobilja"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="homeType" className={labelClasses}>Tip stambenog/poslovnog prostora</label>
                    <select
                      id="homeType"
                      name="homeType"
                      value={formData.homeType}
                      onChange={handleInputChange}
                      className={inputClasses()}
                    >
                      <option value="">Izaberite...</option>
                      <option value="apartment">Stan</option>
                      <option value="house">Kuća</option>
                      <option value="office">Poslovni prostor</option>
                      <option value="newConstruction">Objekat u izgradnji</option>
                      <option value="other">Drugo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-heading font-semibold text-charcoal mb-6">Vaši ciljevi</h2>

                  <div className="mb-6">
                    <label className={labelClasses}>Šta želite da postignete primenom Feng Shui principa? *</label>
                    {fieldErrors.mainGoals && <p className="text-red-500 text-sm mb-2">{fieldErrors.mainGoals}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <GoalCheckbox id="betterSleep" name="betterSleep" value="betterSleep" checked={formData.mainGoals.includes('betterSleep')} onChange={handleCheckboxChange} label="Bolji san i odmor" />
                      <GoalCheckbox id="improvedRelationships" name="improvedRelationships" value="improvedRelationships" checked={formData.mainGoals.includes('improvedRelationships')} onChange={handleCheckboxChange} label="Unapređenje odnosa" />
                      <GoalCheckbox id="increasedProsperity" name="increasedProsperity" value="increasedProsperity" checked={formData.mainGoals.includes('increasedProsperity')} onChange={handleCheckboxChange} label="Povećanje prosperiteta" />
                      <GoalCheckbox id="careerAdvancement" name="careerAdvancement" value="careerAdvancement" checked={formData.mainGoals.includes('careerAdvancement')} onChange={handleCheckboxChange} label="Napredak u karijeri" />
                      <GoalCheckbox id="betterHealth" name="betterHealth" value="betterHealth" checked={formData.mainGoals.includes('betterHealth')} onChange={handleCheckboxChange} label="Poboljšanje zdravlja" />
                      <GoalCheckbox id="reducedStress" name="reducedStress" value="reducedStress" checked={formData.mainGoals.includes('reducedStress')} onChange={handleCheckboxChange} label="Smanjenje stresa" />
                      <GoalCheckbox id="improvedFocus" name="improvedFocus" value="improvedFocus" checked={formData.mainGoals.includes('improvedFocus')} onChange={handleCheckboxChange} label="Bolja koncentracija" />
                      <GoalCheckbox id="familyHarmony" name="familyHarmony" value="familyHarmony" checked={formData.mainGoals.includes('familyHarmony')} onChange={handleCheckboxChange} label="Porodična harmonija" />
                      <GoalCheckbox id="spiritualGrowth" name="spiritualGrowth" value="spiritualGrowth" checked={formData.mainGoals.includes('spiritualGrowth')} onChange={handleCheckboxChange} label="Duhovni rast" />
                      <GoalCheckbox id="betterWorkLifeBalance" name="betterWorkLifeBalance" value="betterWorkLifeBalance" checked={formData.mainGoals.includes('betterWorkLifeBalance')} onChange={handleCheckboxChange} label="Balans posla i života" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="challenges" className={labelClasses}>Koji su trenutni izazovi u vašem prostoru?</label>
                    <textarea
                      id="challenges"
                      name="challenges"
                      value={formData.challenges}
                      onChange={handleInputChange}
                      rows={4}
                      className={inputClasses()}
                      placeholder="Npr. nedostatak svetla, loš raspored prostorija, buka..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Additional info */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-heading font-semibold text-charcoal mb-6">Dodatne informacije</h2>

                  <div className="mb-6">
                    <label htmlFor="heardFrom" className={labelClasses}>Kako ste čuli za nas?</label>
                    <select
                      id="heardFrom"
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleInputChange}
                      className={inputClasses()}
                    >
                      <option value="">Izaberite...</option>
                      <option value="friend">Preporuka prijatelja</option>
                      <option value="search">Internet pretraga</option>
                      <option value="social">Društvene mreže</option>
                      <option value="event">Predavanje ili događaj</option>
                      <option value="article">Članak ili publikacija</option>
                      <option value="other">Drugo</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="additionalInfo" className={labelClasses}>Dodatne informacije ili pitanja</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className={inputClasses()}
                      placeholder="Podelite sa nama bilo koje dodatne informacije ili pitanja koja imate..."
                    />
                  </div>

                  <div className="flex items-center mb-8">
                    <input
                      type="checkbox"
                      id="consentCheckbox"
                      className="mr-2 accent-navy-500"
                      required
                    />
                    <label htmlFor="consentCheckbox" className="text-sm text-charcoal-500 font-body">
                      Slažem se sa <a href="/about" className="text-navy-600 hover:underline">uslovima korišćenja</a> i dajem pristanak za obradu mojih podataka u svrhu pružanja usluga.
                    </label>
                  </div>
                </div>
              )}

              {isSubmitted && (
                <div className="mb-4 p-4 bg-navy-50 border border-navy-500/30 rounded-xl text-center">
                  <p className="text-navy-600 font-heading font-medium">Upitnik je uspešno poslat! Hvala vam.</p>
                </div>
              )}

              {submitError && (
                <p className="text-red-500 text-sm mb-4">{submitError}</p>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button onClick={prevStep} variant="outline" type="button" disabled={isSubmitting}>
                    <ArrowLeft size={16} className="mr-2" /> Prethodni korak
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    variant="primary"
                    type="button"
                  >
                    Sledeći korak <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" disabled={isSubmitting || isSubmitted}>
                    {isSubmitting ? 'Slanje...' : 'Pošalji upitnik'} {!isSubmitting && <Send size={16} className="ml-2" />}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </Section>

      {/* Privacy notice */}
      <Section background="primary">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="text-2xl font-heading font-semibold text-charcoal mb-4">
            Vaša privatnost nam je važna
          </h2>
          <p className="text-charcoal-500 font-body mb-2">
            Sve informacije koje podelite sa nama ostaju strogo poverljive. Vaše podatke koristimo isključivo u svrhu pružanja personalizovanog iskustva i neće biti deljeni sa trećim licima.
          </p>
          <p className="text-charcoal-500 font-body">
            Za sva pitanja o privatnosti, kontaktirajte nas putem emaila <a href="mailto:ptplan.rs@gmail.com" className="text-navy-600 hover:underline">ptplan.rs@gmail.com</a>
          </p>
        </motion.div>
      </Section>
    </div>
  );
};

const ServiceOption = ({
  id,
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
}) => {
  return (
    <label
      htmlFor={id}
      className={`block rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
        checked ? 'border-navy-500 bg-navy-50' : 'border-sand-200 bg-cream-50 hover:border-sand-300'
      }`}
    >
      <div className="flex items-start">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="mt-1 mr-3 accent-navy-500"
        />
        <div>
          <div className="font-heading font-medium text-charcoal">{title}</div>
          <div className="text-sm font-body text-charcoal-500">{description}</div>
        </div>
      </div>
    </label>
  );
};

const GoalCheckbox = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
        checked ? 'border-navy-500 bg-navy-50' : 'border-sand-200 bg-cream-50 hover:border-sand-300'
      }`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-3 accent-navy-500"
      />
      <span className="font-body text-charcoal">{label}</span>
    </label>
  );
};

export default UpitnikContent;
