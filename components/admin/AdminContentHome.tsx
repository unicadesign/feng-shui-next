'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import { useContent } from '@/hooks/useContent';
import type { HomeContent } from '@/types/content';

const AdminContentHome: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<HomeContent>(content.home);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(content.home);
  }, [content.home]);

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
  const textareaClasses = `${inputClasses} resize-y min-h-[100px]`;
  const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';

  const handleSave = () => {
    setSaving(true);
    updatePageContent('home', form);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('home');
  };

  // Helper for nested updates
  const u = <K extends keyof HomeContent>(section: K, data: Partial<HomeContent[K]>) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  return (
    
      <div className="max-w-3xl mx-auto space-y-6">
        {saved && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-navy-500 px-6 py-3 text-white font-heading font-semibold shadow-lg">
            Sadržaj sačuvan!
          </div>
        )}

        <h1 className="font-heading text-2xl md:text-3xl text-charcoal">
          Početna stranica — Sadržaj
        </h1>

        <ContentEditorToolbar onSave={handleSave} onReset={handleReset} saving={saving} />

        {/* ═══ HERO ═══ */}
        <ContentSection title="Hero sekcija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Naslov — gornja linija</label>
              <input type="text" value={form.hero.titleTop} onChange={(e) => u('hero', { titleTop: e.target.value })} className={inputClasses} placeholder="npr. Uređenje prostora" />
            </div>
            <div>
              <label className={labelClasses}>Naslov — glavna reč (velika)</label>
              <input type="text" value={form.hero.titleMain} onChange={(e) => u('hero', { titleMain: e.target.value })} className={inputClasses} placeholder="npr. Feng Shui" />
            </div>
            <div>
              <label className={labelClasses}>Naslov — donja linija</label>
              <input type="text" value={form.hero.titleBottom} onChange={(e) => u('hero', { titleBottom: e.target.value })} className={inputClasses} placeholder="npr. Put ka miru i radosti" />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.hero.subtitle} onChange={(e) => u('hero', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Primarno dugme — tekst</label>
                <input type="text" value={form.hero.primaryButton.text} onChange={(e) => setForm({ ...form, hero: { ...form.hero, primaryButton: { ...form.hero.primaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Primarno dugme — link</label>
                <input type="text" value={form.hero.primaryButton.link} onChange={(e) => setForm({ ...form, hero: { ...form.hero, primaryButton: { ...form.hero.primaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Mikro tekst ispod dugmeta</label>
              <input type="text" value={form.hero.primaryMicrocopy} onChange={(e) => u('hero', { primaryMicrocopy: e.target.value })} className={inputClasses} placeholder="npr. Besplatno. Bez obaveze." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Sekundarno dugme — tekst</label>
                <input type="text" value={form.hero.secondaryButton.text} onChange={(e) => setForm({ ...form, hero: { ...form.hero, secondaryButton: { ...form.hero.secondaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Sekundarno dugme — link</label>
                <input type="text" value={form.hero.secondaryButton.link} onChange={(e) => setForm({ ...form, hero: { ...form.hero, secondaryButton: { ...form.hero.secondaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
            <ImageUrlField label="Pozadinska slika" value={form.hero.backgroundImage} onChange={(val) => u('hero', { backgroundImage: val })} />
          </div>
        </ContentSection>

        {/* ═══ PROBLEM / PAIN SECTION ═══ */}
        <ContentSection title="Sekcija problema">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.problemSection.badge} onChange={(e) => u('problemSection', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.problemSection.title} onChange={(e) => u('problemSection', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Bolne tačke (svaki red = jedna kartица)</label>
              {form.problemSection.painPoints.map((point, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...form.problemSection.painPoints];
                      updated[i] = e.target.value;
                      u('problemSection', { painPoints: updated });
                    }}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = form.problemSection.painPoints.filter((_, idx) => idx !== i);
                      u('problemSection', { painPoints: updated });
                    }}
                    className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => u('problemSection', { painPoints: [...form.problemSection.painPoints, ''] })}
                className="text-sm text-navy-500 hover:text-navy-600"
              >
                + Dodaj bolnu tačku
              </button>
            </div>
            <div>
              <label className={labelClasses}>Analogija (sidro)</label>
              <textarea value={form.problemSection.anchorAnalogy} onChange={(e) => u('problemSection', { anchorAnalogy: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Preokret (reframe)</label>
              <input type="text" value={form.problemSection.reframe} onChange={(e) => u('problemSection', { reframe: e.target.value })} className={inputClasses} />
            </div>
          </div>
        </ContentSection>

        {/* ═══ INTRODUCTION (Dragana) ═══ */}
        <ContentSection title="O Dragani (uvod)">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.introduction.badge} onChange={(e) => u('introduction', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.introduction.title} onChange={(e) => u('introduction', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Prvi paragraf</label>
              <textarea value={form.introduction.subtitle} onChange={(e) => u('introduction', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Drugi paragraf (kredencijali)</label>
              <textarea value={form.introduction.bodyParagraph} onChange={(e) => u('introduction', { bodyParagraph: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Bedževi autoriteta</label>
              {form.introduction.authorityBadges.map((badge, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => {
                      const updated = [...form.introduction.authorityBadges];
                      updated[i] = e.target.value;
                      u('introduction', { authorityBadges: updated });
                    }}
                    className={inputClasses}
                  />
                  <button type="button" onClick={() => u('introduction', { authorityBadges: form.introduction.authorityBadges.filter((_, idx) => idx !== i) })} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => u('introduction', { authorityBadges: [...form.introduction.authorityBadges, ''] })} className="text-sm text-navy-500 hover:text-navy-600">+ Dodaj bedž</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta</label>
                <input type="text" value={form.introduction.buttonText} onChange={(e) => u('introduction', { buttonText: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Link dugmeta</label>
                <input type="text" value={form.introduction.buttonLink} onChange={(e) => u('introduction', { buttonLink: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <ImageUrlField label="Slika" value={form.introduction.image} onChange={(val) => u('introduction', { image: val })} />
          </div>
        </ContentSection>

        {/* ═══ BLOCKQUOTE ═══ */}
        <ContentSection title="Citat klijentkinje">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Citat</label>
              <textarea value={form.blockquote.quote} onChange={(e) => u('blockquote', { quote: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Atribucija</label>
              <input type="text" value={form.blockquote.attribution} onChange={(e) => u('blockquote', { attribution: e.target.value })} className={inputClasses} />
            </div>
          </div>
        </ContentSection>

        {/* ═══ VIDEO / MEDIA ═══ */}
        <ContentSection title="Video / mediji sekcija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.video.badge} onChange={(e) => u('video', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.video.title} onChange={(e) => u('video', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Opis</label>
              <textarea value={form.video.description} onChange={(e) => u('video', { description: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Video URL</label>
              <input type="text" value={form.video.videoUrl} onChange={(e) => u('video', { videoUrl: e.target.value })} className={inputClasses} placeholder="https://www.youtube.com/embed/..." />
            </div>
            <div>
              <label className={labelClasses}>Naslov videa</label>
              <input type="text" value={form.video.videoTitle} onChange={(e) => u('video', { videoTitle: e.target.value })} className={inputClasses} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Autor</label>
                <input type="text" value={form.video.quoteAuthor} onChange={(e) => u('video', { quoteAuthor: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Atribucija</label>
                <input type="text" value={form.video.quoteAttribution} onChange={(e) => u('video', { quoteAttribution: e.target.value })} className={inputClasses} />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* ═══ THE PLAN (3-step process) ═══ */}
        <ContentSection title="Tri koraka (proces)">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.thePlan.badge} onChange={(e) => u('thePlan', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.thePlan.title} onChange={(e) => u('thePlan', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <input type="text" value={form.thePlan.subtitle} onChange={(e) => u('thePlan', { subtitle: e.target.value })} className={inputClasses} />
            </div>
            <ArrayFieldEditor
              label="Koraci"
              items={form.thePlan.steps}
              onChange={(items) => setForm({ ...form, thePlan: { ...form.thePlan, steps: items } })}
              addItem={() => ({ title: '', description: '' })}
              renderItem={(item, _index, update) => (
                <div className="space-y-3">
                  <div>
                    <label className={labelClasses}>Naslov koraka</label>
                    <input type="text" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Opis</label>
                    <textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} className={textareaClasses} />
                  </div>
                </div>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta</label>
                <input type="text" value={form.thePlan.buttonText} onChange={(e) => u('thePlan', { buttonText: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Link dugmeta</label>
                <input type="text" value={form.thePlan.buttonLink} onChange={(e) => u('thePlan', { buttonLink: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Mikro tekst</label>
              <input type="text" value={form.thePlan.buttonMicrocopy} onChange={(e) => u('thePlan', { buttonMicrocopy: e.target.value })} className={inputClasses} />
            </div>
          </div>
        </ContentSection>

        {/* ═══ SERVICES HEADER ═══ */}
        <ContentSection title="Sekcija usluga — zaglavlje">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Eyebrow tekst</label>
              <input type="text" value={form.servicesSection.eyebrow} onChange={(e) => u('servicesSection', { eyebrow: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.servicesSection.title} onChange={(e) => u('servicesSection', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.servicesSection.subtitle} onChange={(e) => u('servicesSection', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
          </div>
        </ContentSection>

        {/* ═══ SERVICE CARDS ═══ */}
        <ContentSection title="Kartice usluga">
          <ArrayFieldEditor
            label="Usluge"
            items={form.services}
            onChange={(items) => setForm({ ...form, services: items })}
            addItem={() => ({ title: '', description: '', buttonText: '', linkTo: '', image: '' })}
            renderItem={(item, _index, update) => (
              <div className="space-y-3">
                <div>
                  <label className={labelClasses}>Naslov</label>
                  <input type="text" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Opis</label>
                  <textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} className={textareaClasses} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>Tekst dugmeta</label>
                    <input type="text" value={item.buttonText} onChange={(e) => update({ ...item, buttonText: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Link</label>
                    <input type="text" value={item.linkTo} onChange={(e) => update({ ...item, linkTo: e.target.value })} className={inputClasses} />
                  </div>
                </div>
                <ImageUrlField label="Slika" value={item.image || ''} onChange={(val) => update({ ...item, image: val })} />
              </div>
            )}
          />
        </ContentSection>

        {/* ═══ SCHOOL SPOTLIGHT ═══ */}
        <ContentSection title="Škola — spotlight">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.schoolSpotlight.badge} onChange={(e) => u('schoolSpotlight', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.schoolSpotlight.title} onChange={(e) => u('schoolSpotlight', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Paragraf</label>
              <textarea value={form.schoolSpotlight.paragraph} onChange={(e) => u('schoolSpotlight', { paragraph: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Karakteristike (svaki red = jedna stavka)</label>
              {form.schoolSpotlight.features.map((feat, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={feat} onChange={(e) => { const updated = [...form.schoolSpotlight.features]; updated[i] = e.target.value; u('schoolSpotlight', { features: updated }); }} className={inputClasses} />
                  <button type="button" onClick={() => u('schoolSpotlight', { features: form.schoolSpotlight.features.filter((_, idx) => idx !== i) })} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => u('schoolSpotlight', { features: [...form.schoolSpotlight.features, ''] })} className="text-sm text-navy-500 hover:text-navy-600">+ Dodaj stavku</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Primarno dugme — tekst</label>
                <input type="text" value={form.schoolSpotlight.primaryButton.text} onChange={(e) => setForm({ ...form, schoolSpotlight: { ...form.schoolSpotlight, primaryButton: { ...form.schoolSpotlight.primaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Primarno dugme — link</label>
                <input type="text" value={form.schoolSpotlight.primaryButton.link} onChange={(e) => setForm({ ...form, schoolSpotlight: { ...form.schoolSpotlight, primaryButton: { ...form.schoolSpotlight.primaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Sekundarno dugme — tekst</label>
                <input type="text" value={form.schoolSpotlight.secondaryButton.text} onChange={(e) => setForm({ ...form, schoolSpotlight: { ...form.schoolSpotlight, secondaryButton: { ...form.schoolSpotlight.secondaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Sekundarno dugme — link</label>
                <input type="text" value={form.schoolSpotlight.secondaryButton.link} onChange={(e) => setForm({ ...form, schoolSpotlight: { ...form.schoolSpotlight, secondaryButton: { ...form.schoolSpotlight.secondaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Video URL (lokalni fajl ili URL)</label>
              <input type="text" value={form.schoolSpotlight.videoUrl} onChange={(e) => u('schoolSpotlight', { videoUrl: e.target.value })} className={inputClasses} placeholder="/images/dodela-diploma-2.mp4" />
            </div>
          </div>
        </ContentSection>

        {/* ═══ TESTIMONIALS ═══ */}
        <ContentSection title="Iskustva klijenata">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Eyebrow tekst</label>
              <input type="text" value={form.testimonials.eyebrow} onChange={(e) => u('testimonials', { eyebrow: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.testimonials.title} onChange={(e) => u('testimonials', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.testimonials.subtitle} onChange={(e) => u('testimonials', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <ArrayFieldEditor
              label="Testimonijali"
              items={form.testimonials.items}
              onChange={(items) => setForm({ ...form, testimonials: { ...form.testimonials, items } })}
              addItem={() => ({ quote: '', author: '', location: '', service: '' })}
              renderItem={(item, _index, update) => (
                <div className="space-y-3">
                  <div>
                    <label className={labelClasses}>Citat</label>
                    <textarea value={item.quote} onChange={(e) => update({ ...item, quote: e.target.value })} className={textareaClasses} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClasses}>Autor</label>
                      <input type="text" value={item.author} onChange={(e) => update({ ...item, author: e.target.value })} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Lokacija</label>
                      <input type="text" value={item.location} onChange={(e) => update({ ...item, location: e.target.value })} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Usluga</label>
                      <input type="text" value={item.service || ''} onChange={(e) => update({ ...item, service: e.target.value })} className={inputClasses} />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </ContentSection>

        {/* ═══ FREE GUIDE ═══ */}
        <ContentSection title="Besplatni vodič">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.freeGuide.badge} onChange={(e) => u('freeGuide', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.freeGuide.title} onChange={(e) => u('freeGuide', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Opis</label>
              <textarea value={form.freeGuide.description} onChange={(e) => u('freeGuide', { description: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Poglavlja</label>
              {form.freeGuide.chapters.map((ch, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-100 text-navy-600 text-xs font-heading font-semibold flex items-center justify-center">{i + 1}</span>
                  <input type="text" value={ch} onChange={(e) => { const updated = [...form.freeGuide.chapters]; updated[i] = e.target.value; u('freeGuide', { chapters: updated }); }} className={inputClasses} />
                  <button type="button" onClick={() => u('freeGuide', { chapters: form.freeGuide.chapters.filter((_, idx) => idx !== i) })} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => u('freeGuide', { chapters: [...form.freeGuide.chapters, ''] })} className="text-sm text-navy-500 hover:text-navy-600">+ Dodaj poglavlje</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta</label>
                <input type="text" value={form.freeGuide.buttonText} onChange={(e) => u('freeGuide', { buttonText: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Link dugmeta</label>
                <input type="text" value={form.freeGuide.buttonLink} onChange={(e) => u('freeGuide', { buttonLink: e.target.value })} className={inputClasses} />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* ═══ NEWSLETTER ═══ */}
        <ContentSection title="Newsletter">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.newsletter.title} onChange={(e) => u('newsletter', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.newsletter.subtitle} onChange={(e) => u('newsletter', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Placeholder (email polje)</label>
                <input type="text" value={form.newsletter.placeholder} onChange={(e) => u('newsletter', { placeholder: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Tekst dugmeta</label>
                <input type="text" value={form.newsletter.buttonText} onChange={(e) => u('newsletter', { buttonText: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Poruka uspeha</label>
              <input type="text" value={form.newsletter.successMessage} onChange={(e) => u('newsletter', { successMessage: e.target.value })} className={inputClasses} />
            </div>
          </div>
        </ContentSection>

        {/* ═══ WEBINAR CTA ═══ */}
        <ContentSection title="Vebinar (CTA)">
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-xl border border-sand-300 bg-white px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.webinarSection.enabled}
                onChange={(e) => u('webinarSection', { enabled: e.target.checked })}
                className="w-5 h-5 rounded accent-navy-500"
              />
              <span className="text-sm font-body text-charcoal">
                <span className="font-semibold">Prikaži vebinar sekciju na početnoj</span>
                <span className="block text-charcoal-500 text-xs">Uključite samo kada je vebinar aktivan za prijave.</span>
              </span>
            </label>
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.webinarSection.badge} onChange={(e) => u('webinarSection', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.webinarSection.title} onChange={(e) => u('webinarSection', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.webinarSection.subtitle} onChange={(e) => u('webinarSection', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Termin (datum i vreme)</label>
              <input
                type="datetime-local"
                value={form.webinarSection.startsAt}
                onChange={(e) => u('webinarSection', { startsAt: e.target.value })}
                className={inputClasses}
              />
              <p className="mt-1.5 text-xs font-body text-charcoal-500">
                Datum se prikazuje na sajtu i koristi za odbrojavanje. Kada ovaj trenutak prođe, vebinar sekcija (i popup, i navbar traka) se automatski sakriva svim posetiocima.
              </p>
            </div>
            <div>
              <label className={labelClasses}>Zoom link (obavezno)</label>
              <input
                type="url"
                required
                value={form.webinarSection.zoomLink}
                onChange={(e) => u('webinarSection', { zoomLink: e.target.value })}
                className={inputClasses}
                placeholder="https://us06web.zoom.us/j/..."
              />
              <p className="mt-1.5 text-xs font-body text-charcoal-500">
                Link se šalje učesnicima u potvrdi mejla. Nije vidljiv na sajtu.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta</label>
                <input type="text" value={form.webinarSection.buttonText} onChange={(e) => u('webinarSection', { buttonText: e.target.value })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Poruka uspeha</label>
                <input type="text" value={form.webinarSection.successMessage} onChange={(e) => u('webinarSection', { successMessage: e.target.value })} className={inputClasses} />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* ═══ CTA ═══ */}
        <ContentSection title="Poziv na akciju (CTA)">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Bedž tekst</label>
              <input type="text" value={form.cta.badge} onChange={(e) => u('cta', { badge: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input type="text" value={form.cta.title} onChange={(e) => u('cta', { title: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea value={form.cta.subtitle} onChange={(e) => u('cta', { subtitle: e.target.value })} className={textareaClasses} />
            </div>
            <div>
              <label className={labelClasses}>Završni paragraf (loss aversion)</label>
              <textarea value={form.cta.closingParagraph} onChange={(e) => u('cta', { closingParagraph: e.target.value })} className={textareaClasses} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Primarno dugme — tekst</label>
                <input type="text" value={form.cta.primaryButton.text} onChange={(e) => setForm({ ...form, cta: { ...form.cta, primaryButton: { ...form.cta.primaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Primarno dugme — link</label>
                <input type="text" value={form.cta.primaryButton.link} onChange={(e) => setForm({ ...form, cta: { ...form.cta, primaryButton: { ...form.cta.primaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Sekundarno dugme — tekst</label>
                <input type="text" value={form.cta.secondaryButton.text} onChange={(e) => setForm({ ...form, cta: { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, text: e.target.value } } })} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Sekundarno dugme — link</label>
                <input type="text" value={form.cta.secondaryButton.link} onChange={(e) => setForm({ ...form, cta: { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, link: e.target.value } } })} className={inputClasses} />
              </div>
            </div>
          </div>
        </ContentSection>
      </div>
    
  );
};

export default AdminContentHome;
