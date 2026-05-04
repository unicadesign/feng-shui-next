'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import { useContent } from '@/hooks/useContent';
import { VazaContent } from '@/types/content';

const inputClasses =
  'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';
const textareaClasses = `${inputClasses} min-h-[100px] resize-y`;

const AdminContentVaza: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<VazaContent>(content.vaza);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setForm(content.vaza);
  }, [content.vaza]);

  const handleSave = () => {
    setSaving(true);
    updatePageContent('vaza', form);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('vaza');
  };

  const update = <K extends keyof VazaContent>(key: K, value: VazaContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">Vaza Izobilja — Uređivanje sadržaja</h1>
          <p className="text-sm font-body text-charcoal-500 mt-1">Uredite sadržaj stranice Vaze Izobilja.</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Tekst dugmeta</label>
                  <input type="text" className={inputClasses} value={form.hero.buttonText} onChange={(e) => update('hero', { ...form.hero, buttonText: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Link dugmeta</label>
                  <input type="text" className={inputClasses} value={form.hero.buttonLink} onChange={(e) => update('hero', { ...form.hero, buttonLink: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Mikrokopija ispod dugmeta</label>
                <input type="text" className={inputClasses} value={form.hero.primaryMicrocopy} onChange={(e) => update('hero', { ...form.hero, primaryMicrocopy: e.target.value })} />
              </div>
              <ImageUrlField label="Hero slika" value={form.hero.image} onChange={(v) => update('hero', { ...form.hero, image: v })} />
              <div>
                <label className={labelClasses}>Alt tekst hero slike</label>
                <input type="text" className={inputClasses} value={form.hero.imageAlt} onChange={(e) => update('hero', { ...form.hero, imageAlt: e.target.value })} />
              </div>
            </div>
          </ContentSection>

          {/* INTRODUCTION */}
          <ContentSection title="Uvod">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.introduction.eyebrow} onChange={(e) => update('introduction', { ...form.introduction, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.introduction.title} onChange={(e) => update('introduction', { ...form.introduction, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.introduction.subtitle} onChange={(e) => update('introduction', { ...form.introduction, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Paragrafi"
                items={form.introduction.paragraphs}
                addItem={() => ''}
                onChange={(paragraphs) => update('introduction', { ...form.introduction, paragraphs })}
                renderItem={(item, _i, updateItem) => (
                  <textarea className={textareaClasses} value={item} onChange={(e) => updateItem(e.target.value)} />
                )}
              />

              <ArrayFieldEditor
                label="Benefiti"
                items={form.introduction.benefits}
                addItem={() => ''}
                onChange={(benefits) => update('introduction', { ...form.introduction, benefits })}
                renderItem={(item, _i, updateItem) => (
                  <input type="text" className={inputClasses} value={item} onChange={(e) => updateItem(e.target.value)} />
                )}
              />

              <ImageUrlField label="Slika" value={form.introduction.image} onChange={(v) => update('introduction', { ...form.introduction, image: v })} />
              <div>
                <label className={labelClasses}>Alt tekst slike</label>
                <input type="text" className={inputClasses} value={form.introduction.imageAlt} onChange={(e) => update('introduction', { ...form.introduction, imageAlt: e.target.value })} />
              </div>
            </div>
          </ContentSection>

          {/* HOW IT WORKS */}
          <ContentSection title="Kako funkcioniše">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.howItWorks.eyebrow} onChange={(e) => update('howItWorks', { ...form.howItWorks, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.howItWorks.title} onChange={(e) => update('howItWorks', { ...form.howItWorks, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.howItWorks.subtitle} onChange={(e) => update('howItWorks', { ...form.howItWorks, subtitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov nauke</label>
                <input type="text" className={inputClasses} value={form.howItWorks.scienceTitle} onChange={(e) => update('howItWorks', { ...form.howItWorks, scienceTitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Uvodni paragraf</label>
                <textarea className={textareaClasses} value={form.howItWorks.introParagraph} onChange={(e) => update('howItWorks', { ...form.howItWorks, introParagraph: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Simboli"
                items={form.howItWorks.symbols}
                addItem={() => ({ title: '', description: '' })}
                onChange={(symbols) => update('howItWorks', { ...form.howItWorks, symbols })}
                renderItem={(item, _i, updateItem) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Naslov</label>
                      <input type="text" className={inputClasses} value={item.title} onChange={(e) => updateItem({ ...item, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Opis</label>
                      <textarea className={textareaClasses} value={item.description} onChange={(e) => updateItem({ ...item, description: e.target.value })} />
                    </div>
                  </div>
                )}
              />

              <div>
                <label className={labelClasses}>Zaključni paragraf</label>
                <textarea className={textareaClasses} value={form.howItWorks.closingParagraph} onChange={(e) => update('howItWorks', { ...form.howItWorks, closingParagraph: e.target.value })} />
              </div>
              <ImageUrlField label="Slika" value={form.howItWorks.image} onChange={(v) => update('howItWorks', { ...form.howItWorks, image: v })} />
              <div>
                <label className={labelClasses}>Alt tekst slike</label>
                <input type="text" className={inputClasses} value={form.howItWorks.imageAlt} onChange={(e) => update('howItWorks', { ...form.howItWorks, imageAlt: e.target.value })} />
              </div>
            </div>
          </ContentSection>

          {/* PRODUCTS */}
          <ContentSection title="Proizvodi">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.products.eyebrow} onChange={(e) => update('products', { ...form.products, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.products.title} onChange={(e) => update('products', { ...form.products, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.products.subtitle} onChange={(e) => update('products', { ...form.products, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Proizvodi"
                items={form.products.items}
                addItem={() => ({ title: '', description: '', features: [], image: '', imageAlt: '', highlighted: false, buttonText: 'Kontaktirajte nas', buttonLink: '/upitnik' })}
                onChange={(items) => update('products', { ...form.products, items })}
                renderItem={(item, _i, updateItem) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Naslov</label>
                      <input type="text" className={inputClasses} value={item.title} onChange={(e) => updateItem({ ...item, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Opis</label>
                      <textarea className={textareaClasses} value={item.description} onChange={(e) => updateItem({ ...item, description: e.target.value })} />
                    </div>
                    <ImageUrlField label="Slika proizvoda" value={item.image} onChange={(v) => updateItem({ ...item, image: v })} />
                    <div>
                      <label className={labelClasses}>Alt tekst slike</label>
                      <input type="text" className={inputClasses} value={item.imageAlt} onChange={(e) => updateItem({ ...item, imageAlt: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.highlighted}
                        onChange={(e) => updateItem({ ...item, highlighted: e.target.checked })}
                        className="rounded border-sand-300 text-navy-500 focus:ring-navy-500"
                      />
                      <label className="text-sm font-body text-charcoal">Istaknuto (prikazuje "najpopularniji" oznaku)</label>
                    </div>
                    <ArrayFieldEditor
                      label="Karakteristike"
                      items={item.features}
                      addItem={() => ''}
                      onChange={(features) => updateItem({ ...item, features })}
                      renderItem={(feat, _i, updateFeat) => (
                        <input type="text" className={inputClasses} value={feat} onChange={(e) => updateFeat(e.target.value)} />
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Tekst dugmeta</label>
                        <input type="text" className={inputClasses} value={item.buttonText} onChange={(e) => updateItem({ ...item, buttonText: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClasses}>Link dugmeta</label>
                        <input type="text" className={inputClasses} value={item.buttonLink} onChange={(e) => updateItem({ ...item, buttonLink: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* LABELS */}
          <ContentSection title="Zajedničke oznake">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Tekst "Najpopularniji" oznake</label>
                <input type="text" className={inputClasses} value={form.labels.popularBadge} onChange={(e) => update('labels', { ...form.labels, popularBadge: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Tekst "Uključuje" naslova</label>
                <input type="text" className={inputClasses} value={form.labels.includesLabel} onChange={(e) => update('labels', { ...form.labels, includesLabel: e.target.value })} />
              </div>
            </div>
          </ContentSection>

          {/* TESTIMONIALS */}
          <ContentSection title="Iskustva korisnika">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.testimonials.eyebrow} onChange={(e) => update('testimonials', { ...form.testimonials, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.testimonials.title} onChange={(e) => update('testimonials', { ...form.testimonials, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.testimonials.subtitle} onChange={(e) => update('testimonials', { ...form.testimonials, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Iskustva"
                items={form.testimonials.items}
                addItem={() => ({ quote: '', author: '', location: '' })}
                onChange={(items) => update('testimonials', { ...form.testimonials, items })}
                renderItem={(item, _i, updateItem) => (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>Citat</label>
                      <textarea className={textareaClasses} value={item.quote} onChange={(e) => updateItem({ ...item, quote: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Autor</label>
                        <input type="text" className={inputClasses} value={item.author} onChange={(e) => updateItem({ ...item, author: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClasses}>Lokacija</label>
                        <input type="text" className={inputClasses} value={item.location} onChange={(e) => updateItem({ ...item, location: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* HOW TO USE */}
          <ContentSection title="Kako koristiti">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.howToUse.eyebrow} onChange={(e) => update('howToUse', { ...form.howToUse, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.howToUse.title} onChange={(e) => update('howToUse', { ...form.howToUse, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.howToUse.subtitle} onChange={(e) => update('howToUse', { ...form.howToUse, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Koraci"
                items={form.howToUse.steps}
                addItem={() => ({ number: '', title: '', description: '' })}
                onChange={(steps) => update('howToUse', { ...form.howToUse, steps })}
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

              <div>
                <label className={labelClasses}>Tekst na dnu</label>
                <textarea className={textareaClasses} value={form.howToUse.bottomText} onChange={(e) => update('howToUse', { ...form.howToUse, bottomText: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Tekst dugmeta</label>
                  <input type="text" className={inputClasses} value={form.howToUse.buttonText} onChange={(e) => update('howToUse', { ...form.howToUse, buttonText: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Link dugmeta</label>
                  <input type="text" className={inputClasses} value={form.howToUse.buttonLink} onChange={(e) => update('howToUse', { ...form.howToUse, buttonLink: e.target.value })} />
                </div>
              </div>

              <ArrayFieldEditor
                label="Slike"
                items={form.howToUse.images}
                addItem={() => ({ url: '', alt: '' })}
                onChange={(images) => update('howToUse', { ...form.howToUse, images })}
                renderItem={(img, _i, updateImg) => (
                  <div className="space-y-3">
                    <ImageUrlField label={`Slika ${_i + 1}`} value={img.url} onChange={(v) => updateImg({ ...img, url: v })} />
                    <div>
                      <label className={labelClasses}>Alt tekst</label>
                      <input type="text" className={inputClasses} value={img.alt} onChange={(e) => updateImg({ ...img, alt: e.target.value })} />
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
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.faq.eyebrow} onChange={(e) => update('faq', { ...form.faq, eyebrow: e.target.value })} />
              </div>
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

export default AdminContentVaza;
