'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import { useContent } from '@/hooks/useContent';
import { ServicesContent } from '@/types/content';

const inputClasses =
  'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';
const textareaClasses = `${inputClasses} min-h-[100px] resize-y`;

const AdminContentServices: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<ServicesContent>(content.services);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState(0);

  useEffect(() => {
    setForm(content.services);
  }, [content.services]);

  const handleSave = () => {
    setSaving(true);
    updatePageContent('services', form);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('services');
  };

  const update = <K extends keyof ServicesContent>(key: K, value: ServicesContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">Usluge — Uređivanje sadržaja</h1>
          <p className="text-sm font-body text-charcoal-500 mt-1">Uredite sadržaj stranice usluga.</p>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed top-6 right-6 z-50 rounded-xl bg-navy-500 px-6 py-3 text-white text-sm font-body shadow-lg animate-in fade-in slide-in-from-top-2">
            Sadržaj je uspešno sačuvan!
          </div>
        )}

        <ContentEditorToolbar onSave={handleSave} onReset={handleReset} saving={saving} />

        <div className="space-y-6">
          {/* HERO */}
          <ContentSection title="Hero sekcija">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.hero.eyebrow} onChange={(e) => update('hero', { ...form.hero, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.hero.title} onChange={(e) => update('hero', { ...form.hero, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.hero.subtitle} onChange={(e) => update('hero', { ...form.hero, subtitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Tagline</label>
                <input type="text" className={inputClasses} value={form.hero.tagline} onChange={(e) => update('hero', { ...form.hero, tagline: e.target.value })} />
              </div>
            </div>
          </ContentSection>

          {/* OVERVIEW */}
          <ContentSection title="Pregled usluga">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.overview.eyebrow} onChange={(e) => update('overview', { ...form.overview, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.overview.title} onChange={(e) => update('overview', { ...form.overview, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.overview.subtitle} onChange={(e) => update('overview', { ...form.overview, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Kartice pregleda"
                items={form.overview.cards}
                addItem={() => ({ title: '', description: '', buttonText: '', linkTo: '' })}
                onChange={(cards) => update('overview', { ...form.overview, cards })}
                renderItem={(card, _i, updateCard) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Naslov</label>
                      <input type="text" className={inputClasses} value={card.title} onChange={(e) => updateCard({ ...card, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Opis</label>
                      <textarea className={textareaClasses} value={card.description} onChange={(e) => updateCard({ ...card, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Tekst dugmeta</label>
                        <input type="text" className={inputClasses} value={card.buttonText} onChange={(e) => updateCard({ ...card, buttonText: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClasses}>Link</label>
                        <input type="text" className={inputClasses} value={card.linkTo} onChange={(e) => updateCard({ ...card, linkTo: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* SERVICE DETAILS */}
          <ContentSection title="Detalji usluga">
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {form.serviceDetails.map((service, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveServiceTab(idx)}
                    className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-colors ${
                      activeServiceTab === idx
                        ? 'bg-navy-500 text-white'
                        : 'bg-sand-100 text-charcoal hover:bg-sand-200'
                    }`}
                  >
                    {idx + 1}. {service.title || `Usluga ${idx + 1}`}
                  </button>
                ))}
              </div>

              {/* Active service form */}
              {form.serviceDetails[activeServiceTab] && (() => {
                const svc = form.serviceDetails[activeServiceTab];
                const updateSvc = (patch: Partial<typeof svc>) => {
                  const updated = [...form.serviceDetails];
                  updated[activeServiceTab] = { ...svc, ...patch };
                  update('serviceDetails', updated);
                };
                return (
                  <div className="rounded-xl border border-sand-200 bg-white p-5 space-y-4">
                    <div>
                      <label className={labelClasses}>Naslov</label>
                      <input type="text" className={inputClasses} value={svc.title} onChange={(e) => updateSvc({ title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Podnaslov</label>
                      <input type="text" className={inputClasses} value={svc.subtitle} onChange={(e) => updateSvc({ subtitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Opis</label>
                      <textarea className={textareaClasses} value={svc.description} onChange={(e) => updateSvc({ description: e.target.value })} />
                    </div>

                    <ImageUrlField label="Slika" value={svc.image} onChange={(v) => updateSvc({ image: v })} />

                    <div>
                      <label className={labelClasses}>Alt tekst slike</label>
                      <input type="text" className={inputClasses} value={svc.imageAlt} onChange={(e) => updateSvc({ imageAlt: e.target.value })} placeholder="Opis slike za pristupačnost" />
                    </div>

                    {/* Included Items */}
                    <ArrayFieldEditor
                      label="Uključene stavke"
                      items={svc.includedItems}
                      addItem={() => ''}
                      onChange={(items) => updateSvc({ includedItems: items })}
                      renderItem={(item, _i, updateItem) => (
                        <input type="text" className={inputClasses} value={item} onChange={(e) => updateItem(e.target.value)} />
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Tekst dugmeta</label>
                        <input type="text" className={inputClasses} value={svc.buttonText} onChange={(e) => updateSvc({ buttonText: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClasses}>Link dugmeta</label>
                        <input type="text" className={inputClasses} value={svc.buttonLink} onChange={(e) => updateSvc({ buttonLink: e.target.value })} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </ContentSection>

          {/* LABELS */}
          <ContentSection title="Zajedničke oznake">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov "Šta je uključeno"</label>
                <input type="text" className={inputClasses} value={form.labels.includedHeading} onChange={(e) => update('labels', { ...form.labels, includedHeading: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Mikrokopija ispod dugmadi za kontakt</label>
                <input type="text" className={inputClasses} value={form.labels.primaryButtonMicrocopy} onChange={(e) => update('labels', { ...form.labels, primaryButtonMicrocopy: e.target.value })} placeholder="npr. Besplatna energetska procena vašeg doma" />
              </div>
            </div>
          </ContentSection>

          {/* PROCESS */}
          <ContentSection title="Proces">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.process.title} onChange={(e) => update('process', { ...form.process, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.process.subtitle} onChange={(e) => update('process', { ...form.process, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Koraci"
                items={form.process.steps}
                addItem={() => ({ number: '', title: '', description: '' })}
                onChange={(steps) => update('process', { ...form.process, steps })}
                renderItem={(step, _i, updateStep) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className={labelClasses}>Broj</label>
                        <input type="text" className={inputClasses} value={step.number} onChange={(e) => updateStep({ ...step, number: e.target.value })} />
                      </div>
                      <div className="col-span-3">
                        <label className={labelClasses}>Naslov</label>
                        <input type="text" className={inputClasses} value={step.title} onChange={(e) => updateStep({ ...step, title: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Opis</label>
                      <textarea className={textareaClasses} value={step.description} onChange={(e) => updateStep({ ...step, description: e.target.value })} />
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* FAQ */}
          <ContentSection title="Često postavljana pitanja">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.faq.title} onChange={(e) => update('faq', { ...form.faq, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.faq.subtitle} onChange={(e) => update('faq', { ...form.faq, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Pitanja i odgovori"
                items={form.faq.items}
                addItem={() => ({ question: '', answer: '' })}
                onChange={(items) => update('faq', { ...form.faq, items })}
                renderItem={(item, _i, updateItem) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Pitanje</label>
                      <input type="text" className={inputClasses} value={item.question} onChange={(e) => updateItem({ ...item, question: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Odgovor</label>
                      <textarea className={textareaClasses} value={item.answer} onChange={(e) => updateItem({ ...item, answer: e.target.value })} />
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* OBJECTIONS */}
          <ContentSection title="Česta razmišljanja (odgovori na dileme)">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.objections.eyebrow} onChange={(e) => update('objections', { ...form.objections, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.objections.title} onChange={(e) => update('objections', { ...form.objections, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.objections.subtitle} onChange={(e) => update('objections', { ...form.objections, subtitle: e.target.value })} />
              </div>
              <ArrayFieldEditor
                label="Pitanja i odgovori"
                items={form.objections.items}
                addItem={() => ({ question: '', answer: '' })}
                onChange={(items) => update('objections', { ...form.objections, items })}
                renderItem={(item, _i, updateItem) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Pitanje</label>
                      <input type="text" className={inputClasses} value={item.question} onChange={(e) => updateItem({ ...item, question: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Odgovor</label>
                      <textarea className={textareaClasses} value={item.answer} onChange={(e) => updateItem({ ...item, answer: e.target.value })} />
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* CONTACT FORM LABELS */}
          <ContentSection title="Kontakt forma">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.contactForm.title} onChange={(e) => update('contactForm', { ...form.contactForm, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <input type="text" className={inputClasses} value={form.contactForm.subtitle} onChange={(e) => update('contactForm', { ...form.contactForm, subtitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Opis</label>
                <textarea className={textareaClasses} value={form.contactForm.description} onChange={(e) => update('contactForm', { ...form.contactForm, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Etiketa polja "Ime"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.nameLabel} onChange={(e) => update('contactForm', { ...form.contactForm, nameLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Placeholder polja "Ime"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.namePlaceholder} onChange={(e) => update('contactForm', { ...form.contactForm, namePlaceholder: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Etiketa polja "Email"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.emailLabel} onChange={(e) => update('contactForm', { ...form.contactForm, emailLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Placeholder polja "Email"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.emailPlaceholder} onChange={(e) => update('contactForm', { ...form.contactForm, emailPlaceholder: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Etiketa polja "Poruka"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.messageLabel} onChange={(e) => update('contactForm', { ...form.contactForm, messageLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Placeholder polja "Poruka"</label>
                  <input type="text" className={inputClasses} value={form.contactForm.messagePlaceholder} onChange={(e) => update('contactForm', { ...form.contactForm, messagePlaceholder: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Tekst dugmeta za slanje</label>
                  <input type="text" className={inputClasses} value={form.contactForm.submitText} onChange={(e) => update('contactForm', { ...form.contactForm, submitText: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Tekst tokom slanja</label>
                  <input type="text" className={inputClasses} value={form.contactForm.submittingText} onChange={(e) => update('contactForm', { ...form.contactForm, submittingText: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Poruka o uspehu</label>
                <input type="text" className={inputClasses} value={form.contactForm.successMessage} onChange={(e) => update('contactForm', { ...form.contactForm, successMessage: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podtekst poruke o uspehu</label>
                <input type="text" className={inputClasses} value={form.contactForm.successSubtext} onChange={(e) => update('contactForm', { ...form.contactForm, successSubtext: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClasses}>Greška: ime obavezno</label>
                  <input type="text" className={inputClasses} value={form.contactForm.nameRequired} onChange={(e) => update('contactForm', { ...form.contactForm, nameRequired: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Greška: email obavezan</label>
                  <input type="text" className={inputClasses} value={form.contactForm.emailRequired} onChange={(e) => update('contactForm', { ...form.contactForm, emailRequired: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Greška: nevažeći email</label>
                  <input type="text" className={inputClasses} value={form.contactForm.emailInvalid} onChange={(e) => update('contactForm', { ...form.contactForm, emailInvalid: e.target.value })} />
                </div>
              </div>
            </div>
          </ContentSection>

          {/* CTA */}
          <ContentSection title="Poziv na akciju (CTA)">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.cta.title} onChange={(e) => update('cta', { ...form.cta, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.cta.subtitle} onChange={(e) => update('cta', { ...form.cta, subtitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Mikrokopija ispod primarnog dugmeta</label>
                <input type="text" className={inputClasses} value={form.cta.primaryMicrocopy ?? ''} onChange={(e) => update('cta', { ...form.cta, primaryMicrocopy: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Primarno dugme — tekst</label>
                  <input type="text" className={inputClasses} value={form.cta.primaryButton.text} onChange={(e) => update('cta', { ...form.cta, primaryButton: { ...form.cta.primaryButton, text: e.target.value } })} />
                </div>
                <div>
                  <label className={labelClasses}>Primarno dugme — link</label>
                  <input type="text" className={inputClasses} value={form.cta.primaryButton.link} onChange={(e) => update('cta', { ...form.cta, primaryButton: { ...form.cta.primaryButton, link: e.target.value } })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Sekundarno dugme — tekst</label>
                  <input type="text" className={inputClasses} value={form.cta.secondaryButton.text} onChange={(e) => update('cta', { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, text: e.target.value } })} />
                </div>
                <div>
                  <label className={labelClasses}>Sekundarno dugme — link</label>
                  <input type="text" className={inputClasses} value={form.cta.secondaryButton.link} onChange={(e) => update('cta', { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, link: e.target.value } })} />
                </div>
              </div>
            </div>
          </ContentSection>
        </div>

        <ContentEditorToolbar onSave={handleSave} onReset={handleReset} saving={saving} />
      </div>
    
  );
};

export default AdminContentServices;
