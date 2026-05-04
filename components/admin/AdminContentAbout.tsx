'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import { useContent } from '@/hooks/useContent';
import type { AboutContent } from '@/types/content';

const AdminContentAbout: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<AboutContent>(content.about);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(content.about);
  }, [content.about]);

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
  const textareaClasses = `${inputClasses} resize-y min-h-[100px]`;
  const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';

  const handleSave = () => {
    setSaving(true);
    updatePageContent('about', form);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('about');
  };

  return (
    
      <div className="max-w-3xl mx-auto space-y-6">
        {saved && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-navy-500 px-6 py-3 text-white font-heading font-semibold shadow-lg">
            Sadrzaj sacuvan!
          </div>
        )}

        <h1 className="font-heading text-2xl md:text-3xl text-charcoal">
          O meni — Sadrzaj
        </h1>

        <ContentEditorToolbar onSave={handleSave} onReset={handleReset} saving={saving} />

        {/* Hero Section */}
        <ContentSection title="Hero sekcija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Eyebrow tekst</label>
              <input
                type="text"
                value={form.hero.eyebrow}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, eyebrow: e.target.value } })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input
                type="text"
                value={form.hero.title}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea
                value={form.hero.subtitle}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
                className={textareaClasses}
              />
            </div>
          </div>
        </ContentSection>

        {/* Bio Section */}
        <ContentSection title="Biografija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Zaglavlje</label>
              <input
                type="text"
                value={form.bio.heading}
                onChange={(e) => setForm({ ...form, bio: { ...form.bio, heading: e.target.value } })}
                className={inputClasses}
              />
            </div>

            <ArrayFieldEditor
              label="Paragrafi"
              items={form.bio.paragraphs}
              onChange={(items) => setForm({ ...form, bio: { ...form.bio, paragraphs: items } })}
              addItem={() => ''}
              renderItem={(item, _index, update) => (
                <div>
                  <label className={labelClasses}>Tekst paragrafa</label>
                  <textarea
                    value={item}
                    onChange={(e) => update(e.target.value)}
                    className={textareaClasses}
                  />
                </div>
              )}
            />

            <ImageUrlField
              label="Slika"
              value={form.bio.image}
              onChange={(val) => setForm({ ...form, bio: { ...form.bio, image: val } })}
            />

            <ArrayFieldEditor
              label="Kvalifikacije"
              items={form.bio.credentials}
              onChange={(items) => setForm({ ...form, bio: { ...form.bio, credentials: items } })}
              addItem={() => ''}
              renderItem={(item, _index, update) => (
                <div>
                  <label className={labelClasses}>Kvalifikacija</label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => update(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              )}
            />

            <div>
              <label className={labelClasses}>Citat</label>
              <textarea
                value={form.bio.quote}
                onChange={(e) => setForm({ ...form, bio: { ...form.bio, quote: e.target.value } })}
                className={textareaClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  value={form.bio.email}
                  onChange={(e) => setForm({ ...form, bio: { ...form.bio, email: e.target.value } })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Telefon</label>
                <input
                  type="text"
                  value={form.bio.phone}
                  onChange={(e) => setForm({ ...form, bio: { ...form.bio, phone: e.target.value } })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Philosophy Section */}
        <ContentSection title="Filozofija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Eyebrow tekst</label>
              <input
                type="text"
                value={form.philosophy.eyebrow}
                onChange={(e) =>
                  setForm({ ...form, philosophy: { ...form.philosophy, eyebrow: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input
                type="text"
                value={form.philosophy.title}
                onChange={(e) =>
                  setForm({ ...form, philosophy: { ...form.philosophy, title: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <input
                type="text"
                value={form.philosophy.subtitle}
                onChange={(e) =>
                  setForm({ ...form, philosophy: { ...form.philosophy, subtitle: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Opis</label>
              <textarea
                value={form.philosophy.description}
                onChange={(e) =>
                  setForm({ ...form, philosophy: { ...form.philosophy, description: e.target.value } })
                }
                className={textareaClasses}
              />
            </div>

            <ArrayFieldEditor
              label="Stavke filozofije"
              items={form.philosophy.items}
              onChange={(items) =>
                setForm({ ...form, philosophy: { ...form.philosophy, items } })
              }
              addItem={() => ({ number: '', title: '', description: '' })}
              renderItem={(item, _index, update) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className={labelClasses}>Broj</label>
                      <input
                        type="text"
                        value={item.number}
                        onChange={(e) => update({ ...item, number: e.target.value })}
                        className={inputClasses}
                        placeholder="01"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className={labelClasses}>Naslov</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => update({ ...item, title: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Opis</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => update({ ...item, description: e.target.value })}
                      className={textareaClasses}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </ContentSection>

        {/* Timeline Section */}
        <ContentSection title="Vremenska linija">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Eyebrow tekst</label>
              <input
                type="text"
                value={form.timeline.eyebrow}
                onChange={(e) =>
                  setForm({ ...form, timeline: { ...form.timeline, eyebrow: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Naslov</label>
              <input
                type="text"
                value={form.timeline.title}
                onChange={(e) =>
                  setForm({ ...form, timeline: { ...form.timeline, title: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea
                value={form.timeline.subtitle}
                onChange={(e) =>
                  setForm({ ...form, timeline: { ...form.timeline, subtitle: e.target.value } })
                }
                className={textareaClasses}
              />
            </div>

            <ArrayFieldEditor
              label="Unosi na vremenskoj liniji"
              items={form.timeline.entries}
              onChange={(items) =>
                setForm({ ...form, timeline: { ...form.timeline, entries: items } })
              }
              addItem={() => ({ year: '', title: '', description: '' })}
              renderItem={(item, _index, update) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className={labelClasses}>Godina</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => update({ ...item, year: e.target.value })}
                        className={inputClasses}
                        placeholder="2020"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className={labelClasses}>Naslov</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => update({ ...item, title: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Opis</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => update({ ...item, description: e.target.value })}
                      className={textareaClasses}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </ContentSection>

        {/* CTA Section */}
        <ContentSection title="Poziv na akciju (CTA)">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Naslov</label>
              <input
                type="text"
                value={form.cta.title}
                onChange={(e) => setForm({ ...form, cta: { ...form.cta, title: e.target.value } })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Podnaslov</label>
              <textarea
                value={form.cta.subtitle}
                onChange={(e) => setForm({ ...form, cta: { ...form.cta, subtitle: e.target.value } })}
                className={textareaClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Mikrokopija ispod primarnog dugmeta</label>
              <input
                type="text"
                value={form.cta.primaryMicrocopy ?? ''}
                onChange={(e) => setForm({ ...form, cta: { ...form.cta, primaryMicrocopy: e.target.value } })}
                className={inputClasses}
                placeholder="npr. Besplatan razgovor, 15 minuta"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Primarno dugme — tekst</label>
                <input
                  type="text"
                  value={form.cta.primaryButton.text}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cta: { ...form.cta, primaryButton: { ...form.cta.primaryButton, text: e.target.value } },
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Primarno dugme — link</label>
                <input
                  type="text"
                  value={form.cta.primaryButton.link}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cta: { ...form.cta, primaryButton: { ...form.cta.primaryButton, link: e.target.value } },
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Sekundarno dugme — tekst</label>
                <input
                  type="text"
                  value={form.cta.secondaryButton.text}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cta: { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, text: e.target.value } },
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Sekundarno dugme — link</label>
                <input
                  type="text"
                  value={form.cta.secondaryButton.link}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cta: { ...form.cta, secondaryButton: { ...form.cta.secondaryButton, link: e.target.value } },
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </ContentSection>
      </div>
    
  );
};

export default AdminContentAbout;
