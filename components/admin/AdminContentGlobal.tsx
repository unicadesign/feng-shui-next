'use client';

import React, { useState, useEffect } from 'react';
import ContentSection from '@/components/admin/ContentSection';
import ArrayFieldEditor from '@/components/admin/ArrayFieldEditor';
import ContentEditorToolbar from '@/components/admin/ContentEditorToolbar';
import { useContent } from '@/hooks/useContent';
import type { GlobalContent } from '@/types/content';

const AdminContentGlobal: React.FC = () => {
  const { content, updatePageContent, resetPageContent } = useContent();
  const [form, setForm] = useState<GlobalContent>(content.global);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(content.global);
  }, [content.global]);

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
  const textareaClasses = `${inputClasses} resize-y min-h-[100px]`;
  const labelClasses = 'block text-sm font-heading font-medium text-charcoal mb-1';

  const handleSave = () => {
    setSaving(true);
    updatePageContent('global', form);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    resetPageContent('global');
  };

  return (
    
      <div className="max-w-3xl mx-auto space-y-6">
        {saved && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-navy-500 px-6 py-3 text-white font-heading font-semibold shadow-lg">
            Sadrzaj sacuvan!
          </div>
        )}

        <h1 className="font-heading text-2xl md:text-3xl text-charcoal">
          Globalna podesavanja — Sadrzaj
        </h1>

        <ContentEditorToolbar onSave={handleSave} onReset={handleReset} saving={saving} />

        {/* Site Config */}
        <ContentSection title="Konfiguracija sajta">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Naziv sajta (logo)</label>
              <input
                type="text"
                value={form.siteConfig.siteName}
                onChange={(e) =>
                  setForm({ ...form, siteConfig: { ...form.siteConfig, siteName: e.target.value } })
                }
                className={inputClasses}
                placeholder="ptPLAN"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Telefon</label>
                <input
                  type="text"
                  value={form.siteConfig.phone}
                  onChange={(e) =>
                    setForm({ ...form, siteConfig: { ...form.siteConfig, phone: e.target.value } })
                  }
                  className={inputClasses}
                  placeholder="+381 63 380 098"
                />
              </div>
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  value={form.siteConfig.email}
                  onChange={(e) =>
                    setForm({ ...form, siteConfig: { ...form.siteConfig, email: e.target.value } })
                  }
                  className={inputClasses}
                  placeholder="ptplan.rs@gmail.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>WhatsApp</label>
                <input
                  type="text"
                  value={form.siteConfig.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, siteConfig: { ...form.siteConfig, whatsapp: e.target.value } })
                  }
                  className={inputClasses}
                  placeholder="38163380098"
                />
              </div>
              <div>
                <label className={labelClasses}>Adresa</label>
                <input
                  type="text"
                  value={form.siteConfig.address}
                  onChange={(e) =>
                    setForm({ ...form, siteConfig: { ...form.siteConfig, address: e.target.value } })
                  }
                  className={inputClasses}
                  placeholder="Beograd, Srbija"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Facebook URL</label>
                <input
                  type="text"
                  value={form.siteConfig.socialLinks.facebook}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      siteConfig: {
                        ...form.siteConfig,
                        socialLinks: { ...form.siteConfig.socialLinks, facebook: e.target.value },
                      },
                    })
                  }
                  className={inputClasses}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className={labelClasses}>Instagram URL</label>
                <input
                  type="text"
                  value={form.siteConfig.socialLinks.instagram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      siteConfig: {
                        ...form.siteConfig,
                        socialLinks: { ...form.siteConfig.socialLinks, instagram: e.target.value },
                      },
                    })
                  }
                  className={inputClasses}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Navigation */}
        <ContentSection title="Navigacija">
          <ArrayFieldEditor<GlobalContent['navigation'][number]>
            label="Linkovi navigacije"
            items={form.navigation}
            onChange={(items) => setForm({ ...form, navigation: items })}
            addItem={() => ({ to: '/', label: '' })}
            renderItem={(item, _index, update) => (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>Putanja</label>
                    <input
                      type="text"
                      value={item.to}
                      onChange={(e) => update({ ...item, to: e.target.value })}
                      className={inputClasses}
                      placeholder="/about"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Oznaka</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => update({ ...item, label: e.target.value })}
                      className={inputClasses}
                      placeholder="O meni"
                    />
                  </div>
                </div>
                <ArrayFieldEditor
                  label="Pod-meni (dropdown)"
                  items={item.children ?? []}
                  onChange={(children) => update({ ...item, children: children.length > 0 ? children : undefined })}
                  addItem={() => ({ to: '/', label: '' })}
                  renderItem={(child, _ci, updateChild) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Putanja</label>
                        <input
                          type="text"
                          value={child.to}
                          onChange={(e) => updateChild({ ...child, to: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Oznaka</label>
                        <input
                          type="text"
                          value={child.label}
                          onChange={(e) => updateChild({ ...child, label: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          />
        </ContentSection>

        {/* Header */}
        <ContentSection title="Header (zaglavlje)">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta "Prijava"</label>
                <input
                  type="text"
                  value={form.header.loginButton}
                  onChange={(e) => setForm({ ...form, header: { ...form.header, loginButton: e.target.value } })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>"Moji kursevi" link</label>
                <input
                  type="text"
                  value={form.header.myCoursesLabel}
                  onChange={(e) => setForm({ ...form, header: { ...form.header, myCoursesLabel: e.target.value } })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>"Admin panel" link</label>
                <input
                  type="text"
                  value={form.header.adminPanelLabel}
                  onChange={(e) => setForm({ ...form, header: { ...form.header, adminPanelLabel: e.target.value } })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>"Odjava" dugme</label>
                <input
                  type="text"
                  value={form.header.logoutLabel}
                  onChange={(e) => setForm({ ...form, header: { ...form.header, logoutLabel: e.target.value } })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Footer */}
        <ContentSection title="Footer">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Tekst socijalnog dokaza</label>
              <input
                type="text"
                value={form.footer.socialProofText}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, socialProofText: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Tagline</label>
              <textarea
                value={form.footer.tagline}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, tagline: e.target.value } })
                }
                className={textareaClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Naslov "Istražite" kolone</label>
              <input
                type="text"
                value={form.footer.exploreHeading}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, exploreHeading: e.target.value } })
                }
                className={inputClasses}
              />
            </div>

            <ArrayFieldEditor
              label="Linkovi u 'Istražite' koloni"
              items={form.footer.exploreLinks}
              onChange={(items) =>
                setForm({ ...form, footer: { ...form.footer, exploreLinks: items } })
              }
              addItem={() => ({ to: '/', label: '' })}
              renderItem={(item, _index, update) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>Putanja</label>
                    <input
                      type="text"
                      value={item.to}
                      onChange={(e) => update({ ...item, to: e.target.value })}
                      className={inputClasses}
                      placeholder="/services"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Oznaka</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => update({ ...item, label: e.target.value })}
                      className={inputClasses}
                      placeholder="Usluge"
                    />
                  </div>
                </div>
              )}
            />

            <div>
              <label className={labelClasses}>Naslov "Povežimo se" kolone</label>
              <input
                type="text"
                value={form.footer.connectHeading}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, connectHeading: e.target.value } })
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>WhatsApp link tekst</label>
              <input
                type="text"
                value={form.footer.whatsappLinkText}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, whatsappLinkText: e.target.value } })
                }
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tekst dugmeta za konsultaciju</label>
                <input
                  type="text"
                  value={form.footer.consultationButtonText}
                  onChange={(e) =>
                    setForm({ ...form, footer: { ...form.footer, consultationButtonText: e.target.value } })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Link dugmeta za konsultaciju</label>
                <input
                  type="text"
                  value={form.footer.consultationButtonLink}
                  onChange={(e) =>
                    setForm({ ...form, footer: { ...form.footer, consultationButtonLink: e.target.value } })
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Tekst autorskih prava</label>
              <input
                type="text"
                value={form.footer.copyrightText}
                onChange={(e) =>
                  setForm({ ...form, footer: { ...form.footer, copyrightText: e.target.value } })
                }
                className={inputClasses}
              />
            </div>
          </div>
        </ContentSection>
      </div>
    
  );
};

export default AdminContentGlobal;
