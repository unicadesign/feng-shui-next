'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import { useContent } from '@/hooks/useContent';
import { SchoolContent } from '@/types/content';
import { ChevronDown } from 'lucide-react';

const inputClasses =
  'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';
const textareaClasses = `${inputClasses} min-h-[100px] resize-y`;

const AdminContentSchool: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<SchoolContent>(content.school);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeMonthTab, setActiveMonthTab] = useState(0);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setForm(content.school);
  }, [content.school]);

  const handleSave = () => {
    setSaving(true);
    updatePageContent('school', form);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('school');
  };

  const update = <K extends keyof SchoolContent>(key: K, value: SchoolContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleWeek = (key: string) => {
    setExpandedWeeks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">Škola — Uređivanje sadržaja</h1>
          <p className="text-sm font-body text-charcoal-500 mt-1">Uredite sadržaj stranice Feng Shui škole.</p>
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
                  <label className={labelClasses}>Primarno dugme — tekst</label>
                  <input type="text" className={inputClasses} value={form.hero.primaryButton.text} onChange={(e) => update('hero', { ...form.hero, primaryButton: { ...form.hero.primaryButton, text: e.target.value } })} />
                </div>
                <div>
                  <label className={labelClasses}>Primarno dugme — link</label>
                  <input type="text" className={inputClasses} value={form.hero.primaryButton.link} onChange={(e) => update('hero', { ...form.hero, primaryButton: { ...form.hero.primaryButton, link: e.target.value } })} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Mikrokopija ispod primarnog dugmeta</label>
                <input type="text" className={inputClasses} value={form.hero.primaryMicrocopy} onChange={(e) => update('hero', { ...form.hero, primaryMicrocopy: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Sekundarno dugme — tekst</label>
                  <input type="text" className={inputClasses} value={form.hero.secondaryButton.text} onChange={(e) => update('hero', { ...form.hero, secondaryButton: { ...form.hero.secondaryButton, text: e.target.value } })} />
                </div>
                <div>
                  <label className={labelClasses}>Sekundarno dugme — link</label>
                  <input type="text" className={inputClasses} value={form.hero.secondaryButton.link} onChange={(e) => update('hero', { ...form.hero, secondaryButton: { ...form.hero.secondaryButton, link: e.target.value } })} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Tekst o ograničenim mestima</label>
                <input type="text" className={inputClasses} value={form.hero.limitedSpotsText} onChange={(e) => update('hero', { ...form.hero, limitedSpotsText: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Hero slike"
                items={form.hero.images}
                addItem={() => ({ url: '', alt: '', caption: '' })}
                onChange={(images) => update('hero', { ...form.hero, images })}
                renderItem={(img, _i, updateImg) => (
                  <div className="space-y-3">
                    <ImageUrlField label="URL slike" value={img.url} onChange={(v) => updateImg({ ...img, url: v })} />
                    <div>
                      <label className={labelClasses}>Alt tekst</label>
                      <input type="text" className={inputClasses} value={img.alt} onChange={(e) => updateImg({ ...img, alt: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Natpis</label>
                      <input type="text" className={inputClasses} value={img.caption} onChange={(e) => updateImg({ ...img, caption: e.target.value })} />
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* OVERVIEW */}
          <ContentSection title="Pregled programa">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.overview.title} onChange={(e) => update('overview', { ...form.overview, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.overview.subtitle} onChange={(e) => update('overview', { ...form.overview, subtitle: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Opis</label>
                <textarea className={textareaClasses} value={form.overview.description} onChange={(e) => update('overview', { ...form.overview, description: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Karakteristike"
                items={form.overview.features}
                addItem={() => ''}
                onChange={(features) => update('overview', { ...form.overview, features })}
                renderItem={(item, _i, updateItem) => (
                  <input type="text" className={inputClasses} value={item} onChange={(e) => updateItem(e.target.value)} />
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Tekst dugmeta</label>
                  <input type="text" className={inputClasses} value={form.overview.buttonText} onChange={(e) => update('overview', { ...form.overview, buttonText: e.target.value })} />
                </div>
                <div>
                  <label className={labelClasses}>Link dugmeta</label>
                  <input type="text" className={inputClasses} value={form.overview.buttonLink} onChange={(e) => update('overview', { ...form.overview, buttonLink: e.target.value })} />
                </div>
              </div>

              <ArrayFieldEditor
                label="Pregled — slike"
                items={form.overview.images}
                addItem={() => ({ url: '', alt: '', caption: '' })}
                onChange={(images) => update('overview', { ...form.overview, images })}
                renderItem={(img, _i, updateImg) => (
                  <div className="space-y-3">
                    <ImageUrlField label="URL slike" value={img.url} onChange={(v) => updateImg({ ...img, url: v })} />
                    <div>
                      <label className={labelClasses}>Alt tekst</label>
                      <input type="text" className={inputClasses} value={img.alt} onChange={(e) => updateImg({ ...img, alt: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClasses}>Natpis</label>
                      <input type="text" className={inputClasses} value={img.caption} onChange={(e) => updateImg({ ...img, caption: e.target.value })} />
                    </div>
                  </div>
                )}
              />
            </div>
          </ContentSection>

          {/* BENEFITS */}
          <ContentSection title="Prednosti">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.benefits.eyebrow} onChange={(e) => update('benefits', { ...form.benefits, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.benefits.title} onChange={(e) => update('benefits', { ...form.benefits, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.benefits.subtitle} onChange={(e) => update('benefits', { ...form.benefits, subtitle: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Stavke prednosti"
                items={form.benefits.items}
                addItem={() => ({ title: '', description: '' })}
                onChange={(items) => update('benefits', { ...form.benefits, items })}
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
            </div>
          </ContentSection>

          {/* CURRICULUM */}
          <ContentSection title="Kurikulum">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.curriculum.eyebrow} onChange={(e) => update('curriculum', { ...form.curriculum, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.curriculum.title} onChange={(e) => update('curriculum', { ...form.curriculum, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.curriculum.subtitle} onChange={(e) => update('curriculum', { ...form.curriculum, subtitle: e.target.value })} />
              </div>

              {/* Month tabs */}
              <div className="flex gap-2">
                {form.curriculum.months.map((month, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMonthTab(idx)}
                    className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-colors ${
                      activeMonthTab === idx
                        ? 'bg-navy-500 text-white'
                        : 'bg-sand-100 text-charcoal hover:bg-sand-200'
                    }`}
                  >
                    Mesec {month.monthNumber}
                  </button>
                ))}
              </div>

              {/* Active month content */}
              {form.curriculum.months[activeMonthTab] && (() => {
                const month = form.curriculum.months[activeMonthTab];
                const updateMonth = (patch: Partial<typeof month>) => {
                  const updated = [...form.curriculum.months];
                  updated[activeMonthTab] = { ...month, ...patch };
                  update('curriculum', { ...form.curriculum, months: updated });
                };
                return (
                  <div className="rounded-xl border border-sand-200 bg-white p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Broj meseca</label>
                        <input type="text" className={inputClasses} value={month.monthNumber} onChange={(e) => updateMonth({ monthNumber: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClasses}>Naslov</label>
                        <input type="text" className={inputClasses} value={month.title} onChange={(e) => updateMonth({ title: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Podnaslov</label>
                      <textarea className={textareaClasses} value={month.subtitle} onChange={(e) => updateMonth({ subtitle: e.target.value })} />
                    </div>
                    <ImageUrlField label="Slika meseca" value={month.image} onChange={(v) => updateMonth({ image: v })} />
                    <div>
                      <label className={labelClasses}>Alt tekst slike meseca</label>
                      <input type="text" className={inputClasses} value={month.imageAlt} onChange={(e) => updateMonth({ imageAlt: e.target.value })} />
                    </div>

                    {/* Weeks */}
                    <div className="space-y-3">
                      <label className="text-sm font-body font-semibold text-charcoal">Nedelje</label>
                      {month.weeks.map((week, wIdx) => {
                        const weekKey = `${activeMonthTab}-${wIdx}`;
                        const isExpanded = expandedWeeks[weekKey] ?? false;
                        return (
                          <div key={wIdx} className="rounded-xl border border-sand-200 bg-cream-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleWeek(weekKey)}
                              className="flex w-full items-center justify-between px-4 py-3 text-left"
                            >
                              <span className="text-sm font-heading font-semibold text-charcoal">
                                Nedelja {week.number}: {week.title || '(bez naslova)'}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-charcoal-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 space-y-3">
                                <div className="grid grid-cols-4 gap-3">
                                  <div>
                                    <label className={labelClasses}>Broj</label>
                                    <input
                                      type="text"
                                      className={inputClasses}
                                      value={week.number}
                                      onChange={(e) => {
                                        const updatedWeeks = [...month.weeks];
                                        updatedWeeks[wIdx] = { ...week, number: e.target.value };
                                        updateMonth({ weeks: updatedWeeks });
                                      }}
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <label className={labelClasses}>Naslov</label>
                                    <input
                                      type="text"
                                      className={inputClasses}
                                      value={week.title}
                                      onChange={(e) => {
                                        const updatedWeeks = [...month.weeks];
                                        updatedWeeks[wIdx] = { ...week, title: e.target.value };
                                        updateMonth({ weeks: updatedWeeks });
                                      }}
                                    />
                                  </div>
                                </div>
                                <ArrayFieldEditor
                                  label="Tačke"
                                  items={week.bullets}
                                  addItem={() => ''}
                                  onChange={(bullets) => {
                                    const updatedWeeks = [...month.weeks];
                                    updatedWeeks[wIdx] = { ...week, bullets };
                                    updateMonth({ weeks: updatedWeeks });
                                  }}
                                  renderItem={(bullet, _i, updateBullet) => (
                                    <input type="text" className={inputClasses} value={bullet} onChange={(e) => updateBullet(e.target.value)} />
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className={labelClasses}>Napomena o diplomiranju</label>
                <textarea className={textareaClasses} value={form.curriculum.graduationNote} onChange={(e) => update('curriculum', { ...form.curriculum, graduationNote: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Etiketa nedelje (prefiks)</label>
                  <input type="text" className={inputClasses} value={form.curriculum.weekLabel} onChange={(e) => update('curriculum', { ...form.curriculum, weekLabel: e.target.value })} placeholder="npr. Nedelja" />
                </div>
                <div>
                  <label className={labelClasses}>Napomena ispod nedelje</label>
                  <input type="text" className={inputClasses} value={form.curriculum.qaNote} onChange={(e) => update('curriculum', { ...form.curriculum, qaNote: e.target.value })} placeholder="npr. Uključena sesija pitanja i odgovora uživo" />
                </div>
              </div>
            </div>
          </ContentSection>

          {/* FORMAT */}
          <ContentSection title="Format programa">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Eyebrow</label>
                <input type="text" className={inputClasses} value={form.format.eyebrow} onChange={(e) => update('format', { ...form.format, eyebrow: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Naslov</label>
                <input type="text" className={inputClasses} value={form.format.title} onChange={(e) => update('format', { ...form.format, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>Podnaslov</label>
                <textarea className={textareaClasses} value={form.format.subtitle} onChange={(e) => update('format', { ...form.format, subtitle: e.target.value })} />
              </div>
              <ImageUrlField label="Slika" value={form.format.image} onChange={(v) => update('format', { ...form.format, image: v })} />
              <div>
                <label className={labelClasses}>Alt tekst slike</label>
                <input type="text" className={inputClasses} value={form.format.imageAlt} onChange={(e) => update('format', { ...form.format, imageAlt: e.target.value })} />
              </div>

              <ArrayFieldEditor
                label="Stavke formata"
                items={form.format.items}
                addItem={() => ({ title: '', description: '' })}
                onChange={(items) => update('format', { ...form.format, items })}
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

          {/* TESTIMONIALS */}
          <ContentSection title="Iskustva studenata">
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

export default AdminContentSchool;
