'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, Plus, Pencil, Trash2, Check, X,
  ChevronUp, ChevronDown, ChevronRight,
  Sparkles, MessageCircleQuestion, ClipboardCheck, GraduationCap,
  Loader2,
} from 'lucide-react';
import Button from '@/components/Button';
import { useCourses } from '@/hooks/useCourses';
import type { CourseType } from '@/types';
import { normalizeStoragePath } from '@/lib/storagePath';

// ─── Local state shapes ──────────────────────────────────────

interface ModuleForm {
  _tempId: string;      // local key (temp or existing DB id)
  existingId?: string;  // DB id if editing
  orderIndex: number;
  title: string;
  description: string;
  isVazaIzobilja: boolean;
}

interface VideoForm {
  _tempId: string;
  title: string;
  videoPath: string;
  videoUrl: string;
}

interface LessonForm {
  _tempId: string;
  existingId?: string;
  _tempModuleId: string; // links to ModuleForm._tempId
  weekNumber: number;
  title: string;
  description: string;
  videos: VideoForm[];
  availableAfterWeeks: number;
  isVazaIzobilja: boolean;
  hasQandA: boolean;
  hasPracticalExercise: boolean;
  hasOnlineTest: boolean;
}

const genId = () => `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface AdminCourseFormProps {
  id?: string;
}

const AdminCourseForm: React.FC<AdminCourseFormProps> = ({ id }) => {
  const router = useRouter();
  const isEditing = Boolean(id);
  const { courses, modules: allModules, lessons: allLessons, saveCourse } = useCourses();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Course fields ──
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'standard' as CourseType,
    price: 0,
    priceRsd: 0,
    installmentPrice: 0,
    installmentPriceRsd: 0,
    installmentMonths: 4,
    zoomPriceSingle: 0,
    zoomPriceSingleRsd: 0,
    zoomPriceWeekly: 0,
    zoomPriceWeeklyRsd: 0,
    zoomSingleEnabled: true,
    zoomWeeklyEnabled: true,
    imageUrl: '',
    totalLessons: 16,
    published: false,
  });

  // ── Modules ──
  const [formModules, setFormModules] = useState<ModuleForm[]>([]);

  // ── Lessons ──
  const [formLessons, setFormLessons] = useState<LessonForm[]>([]);

  // ── Editing states ──
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [moduleEditForm, setModuleEditForm] = useState({ title: '', description: '', isVazaIzobilja: false });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonEditForm, setLessonEditForm] = useState<Partial<LessonForm>>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // ── Load existing data ──
  useEffect(() => {
    if (isEditing && id) {
      const existing = courses.find((c) => c.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          type: existing.type,
          price: existing.price,
          priceRsd: existing.priceRsd || 0,
          installmentPrice: existing.installmentPrice || 0,
          installmentPriceRsd: existing.installmentPriceRsd || 0,
          installmentMonths: existing.installmentMonths || 4,
          zoomPriceSingle: existing.zoomPriceSingle || 0,
          zoomPriceSingleRsd: existing.zoomPriceSingleRsd || 0,
          zoomPriceWeekly: existing.zoomPriceWeekly || 0,
          zoomPriceWeeklyRsd: existing.zoomPriceWeeklyRsd || 0,
          zoomSingleEnabled: existing.zoomSingleEnabled,
          zoomWeeklyEnabled: existing.zoomWeeklyEnabled,
          imageUrl: existing.imageUrl,
          totalLessons: existing.totalLessons,
          published: existing.published,
        });

        const courseModules = allModules
          .filter((m) => m.courseId === id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((m) => ({
            _tempId: m.id,
            existingId: m.id,
            orderIndex: m.orderIndex,
            title: m.title,
            description: m.description,
            isVazaIzobilja: m.isVazaIzobilja || false,
          }));
        setFormModules(courseModules);

        const courseLessons = allLessons
          .filter((l) => l.courseId === id)
          .sort((a, b) => a.weekNumber - b.weekNumber)
          .map((l) => {
            // Prefer the new lesson_videos array; fall back to legacy single-video columns.
            const videos: VideoForm[] = l.videos && l.videos.length > 0
              ? l.videos.map((v) => ({
                  _tempId: v.id,
                  title: v.title,
                  videoPath: v.videoPath || '',
                  videoUrl: v.videoUrl || '',
                }))
              : (l.videoUrl || l.videoPath)
                ? [{
                    _tempId: genId(),
                    title: '',
                    videoPath: l.videoPath || '',
                    videoUrl: l.videoUrl || '',
                  }]
                : [];
            return {
              _tempId: l.id,
              existingId: l.id,
              _tempModuleId: l.moduleId || '',
              weekNumber: l.weekNumber,
              title: l.title,
              description: l.description,
              videos,
              availableAfterWeeks: l.availableAfterWeeks,
              isVazaIzobilja: l.isVazaIzobilja || false,
              hasQandA: l.hasQandA || false,
              hasPracticalExercise: l.hasPracticalExercise || false,
              hasOnlineTest: l.hasOnlineTest || false,
            };
          });
        setFormLessons(courseLessons);

        // Expand all modules by default when editing
        setExpandedModules(new Set(courseModules.map((m) => m._tempId)));
      }
    }
  }, [id, isEditing, courses, allModules, allLessons]);

  // ── Handlers: course fields ──
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleTypeChange = (newType: CourseType) => {
    setForm((prev) => ({ ...prev, type: newType }));
  };

  // ── Handlers: modules ──
  const addModule = () => {
    const maxOrder = formModules.length > 0 ? Math.max(...formModules.map((m) => m.orderIndex)) : 0;
    const newMod: ModuleForm = {
      _tempId: genId(),
      orderIndex: maxOrder + 1,
      title: 'Novi modul',
      description: '',
      isVazaIzobilja: false,
    };
    setFormModules((prev) => [...prev, newMod]);
    // Auto-expand new module
    setExpandedModules((prev) => new Set([...prev, newMod._tempId]));
    startModuleEdit(newMod);

    // Auto-generate 4 lesson slots
    const currentMaxWeek = formLessons.length > 0 ? Math.max(...formLessons.map((l) => l.weekNumber)) : 0;
    const newLessons: LessonForm[] = Array.from({ length: 4 }, (_, i) => ({
      _tempId: genId(),
      _tempModuleId: newMod._tempId,
      weekNumber: currentMaxWeek + i + 1,
      title: '',
      description: '',
      videos: [],
      availableAfterWeeks: currentMaxWeek + i,
      isVazaIzobilja: false,
      hasQandA: false,
      hasPracticalExercise: false,
      hasOnlineTest: false,
    }));
    setFormLessons((prev) => [...prev, ...newLessons]);
  };

  const startModuleEdit = (mod: ModuleForm) => {
    setEditingModuleId(mod._tempId);
    setModuleEditForm({ title: mod.title, description: mod.description, isVazaIzobilja: mod.isVazaIzobilja });
  };

  const cancelModuleEdit = () => setEditingModuleId(null);

  const saveModuleEdit = (tempId: string) => {
    setFormModules((prev) =>
      prev.map((m) =>
        m._tempId === tempId
          ? { ...m, title: moduleEditForm.title, description: moduleEditForm.description, isVazaIzobilja: moduleEditForm.isVazaIzobilja }
          : m
      )
    );
    setEditingModuleId(null);
  };

  const removeModule = (tempId: string) => {
    setFormModules((prev) => prev.filter((m) => m._tempId !== tempId));
    setFormLessons((prev) => prev.filter((l) => l._tempModuleId !== tempId));
  };

  const moveModuleUp = (index: number) => {
    if (index <= 0) return;
    setFormModules((prev) => {
      const updated = [...prev];
      const tempOrder = updated[index].orderIndex;
      updated[index] = { ...updated[index], orderIndex: updated[index - 1].orderIndex };
      updated[index - 1] = { ...updated[index - 1], orderIndex: tempOrder };
      return updated.sort((a, b) => a.orderIndex - b.orderIndex);
    });
  };

  const moveModuleDown = (index: number) => {
    if (index >= formModules.length - 1) return;
    setFormModules((prev) => {
      const updated = [...prev];
      const tempOrder = updated[index].orderIndex;
      updated[index] = { ...updated[index], orderIndex: updated[index + 1].orderIndex };
      updated[index + 1] = { ...updated[index + 1], orderIndex: tempOrder };
      return updated.sort((a, b) => a.orderIndex - b.orderIndex);
    });
  };

  const toggleModuleExpand = (tempId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(tempId)) next.delete(tempId);
      else next.add(tempId);
      return next;
    });
  };

  // ── Handlers: lessons ──
  const addLesson = (moduleTempId: string) => {
    const moduleLessons = formLessons.filter((l) => l._tempModuleId === moduleTempId);
    const maxWeek = formLessons.length > 0 ? Math.max(...formLessons.map((l) => l.weekNumber)) : 0;
    const newLesson: LessonForm = {
      _tempId: genId(),
      _tempModuleId: moduleTempId,
      weekNumber: maxWeek + 1,
      title: '',
      description: '',
      videos: [],
      availableAfterWeeks: maxWeek,
      isVazaIzobilja: false,
      hasQandA: false,
      hasPracticalExercise: false,
      hasOnlineTest: false,
    };
    setFormLessons((prev) => [...prev, newLesson]);
    startLessonEdit(newLesson);
  };

  const startLessonEdit = (lesson: LessonForm) => {
    setEditingLessonId(lesson._tempId);
    setLessonEditForm({ ...lesson });
  };

  // ── Video helpers (operate on the in-flight lessonEditForm) ──
  const addVideoToEdit = () => {
    setLessonEditForm((f) => ({
      ...f,
      videos: [
        ...(f.videos ?? []),
        { _tempId: genId(), title: '', videoPath: '', videoUrl: '' },
      ],
    }));
  };

  const updateVideoInEdit = (videoTempId: string, patch: Partial<VideoForm>) => {
    setLessonEditForm((f) => ({
      ...f,
      videos: (f.videos ?? []).map((v) =>
        v._tempId === videoTempId ? { ...v, ...patch } : v
      ),
    }));
  };

  const removeVideoFromEdit = (videoTempId: string) => {
    setLessonEditForm((f) => ({
      ...f,
      videos: (f.videos ?? []).filter((v) => v._tempId !== videoTempId),
    }));
  };

  const moveVideoInEdit = (videoTempId: string, direction: -1 | 1) => {
    setLessonEditForm((f) => {
      const videos = [...(f.videos ?? [])];
      const idx = videos.findIndex((v) => v._tempId === videoTempId);
      const newIdx = idx + direction;
      if (idx < 0 || newIdx < 0 || newIdx >= videos.length) return f;
      [videos[idx], videos[newIdx]] = [videos[newIdx], videos[idx]];
      return { ...f, videos };
    });
  };

  const cancelLessonEdit = () => setEditingLessonId(null);

  const saveLessonEdit = (tempId: string) => {
    setFormLessons((prev) =>
      prev.map((l) =>
        l._tempId === tempId
          ? { ...l, ...lessonEditForm, _tempId: l._tempId, _tempModuleId: l._tempModuleId }
          : l
      )
    );
    setEditingLessonId(null);
  };

  const removeLesson = (tempId: string) => {
    setFormLessons((prev) => prev.filter((l) => l._tempId !== tempId));
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const courseData = {
      id: isEditing ? id : undefined,
      title: form.title,
      description: form.description,
      type: form.type,
      price: form.price,
      price_rsd: form.priceRsd || null,
      installment_price: form.type === 'standard' ? form.installmentPrice || null : null,
      installment_price_rsd: form.type === 'standard' ? form.installmentPriceRsd || null : null,
      installment_months: form.type === 'standard' ? form.installmentMonths : null,
      zoom_price_single: form.zoomPriceSingle || null,
      zoom_price_single_rsd: form.zoomPriceSingleRsd || null,
      zoom_price_weekly: form.zoomPriceWeekly || null,
      zoom_price_weekly_rsd: form.zoomPriceWeeklyRsd || null,
      zoom_single_enabled: form.zoomSingleEnabled,
      zoom_weekly_enabled: form.zoomWeeklyEnabled,
      total_lessons: form.totalLessons,
      image_url: form.imageUrl,
      published: form.published,
    };

    const modulesData = formModules.map((m) => ({
      id: m.existingId,
      _tempId: m._tempId,
      order_index: m.orderIndex,
      title: m.title,
      description: m.description,
      is_vaza_izobilja: m.isVazaIzobilja,
    }));

    const lessonsData = formLessons.map((l) => ({
      id: l.existingId,
      _tempModuleId: l._tempModuleId,
      week_number: l.weekNumber,
      title: l.title,
      description: l.description,
      // Legacy single-video columns left empty — videos array is authoritative.
      video_url: '',
      video_path: null,
      is_vaza_izobilja: l.isVazaIzobilja,
      available_after_weeks: l.availableAfterWeeks,
      has_qand_a: l.hasQandA,
      has_practical_exercise: l.hasPracticalExercise,
      has_online_test: l.hasOnlineTest,
      videos: l.videos.map((v, i) => {
        const cleanedPath = normalizeStoragePath(v.videoPath);
        return {
          sort_order: i,
          title: v.title,
          video_path: cleanedPath || null,
          video_url: v.videoUrl,
        };
      }),
    }));

    const result = await saveCourse(courseData, modulesData, lessonsData);

    setSaving(false);

    if (result.success) {
      router.push('/admin/courses');
    } else {
      setError(result.error || 'Greška pri čuvanju kursa');
    }
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  const smallInputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">
          {isEditing ? 'Izmeni kurs' : 'Novi kurs'}
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ═══════════════════════════════════════════════════
              SECTION 1: Course Details
              ═══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-6 md:p-8 space-y-6 mb-8"
          >
            <h2 className="font-heading text-lg text-charcoal border-b border-sand-200 pb-3">
              Osnovne informacije
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-body font-semibold text-charcoal mb-2">Naziv kursa</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClasses} placeholder="Unesite naziv kursa" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-body font-semibold text-charcoal mb-2">Opis</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className={inputClasses} placeholder="Kratki opis kursa" />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-body font-semibold text-charcoal mb-3">Tip kursa</label>
              <div className="flex gap-4">
                {(['standard', 'one-time'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="courseType" checked={form.type === t} onChange={() => handleTypeChange(t)} className="w-4 h-4 text-navy-500 focus:ring-navy-500 border-sand-300" />
                    <span className="text-sm font-body text-charcoal">{t === 'standard' ? 'Standardni' : 'Jednokratni'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price EUR + RSD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-semibold text-charcoal mb-2">Cena (&euro;)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} required className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-charcoal mb-2">Cena (RSD)</label>
                <input type="number" name="priceRsd" value={form.priceRsd} onChange={handleChange} min={0} className={inputClasses} />
              </div>
            </div>

            {/* Installment (standard only) */}
            {form.type === 'standard' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Cena rate (&euro;/mesec)</label>
                    <input type="number" name="installmentPrice" value={form.installmentPrice} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Cena rate (RSD/mesec)</label>
                    <input type="number" name="installmentPriceRsd" value={form.installmentPriceRsd} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-charcoal mb-2">Broj rata</label>
                  <input type="number" name="installmentMonths" value={form.installmentMonths} onChange={handleChange} min={1} className={`${inputClasses} max-w-[200px]`} />
                </div>
              </>
            )}

            {/* Zoom — single */}
            <div className="rounded-xl border border-sand-200 p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.zoomSingleEnabled}
                  onChange={(e) => setForm((f) => ({ ...f, zoomSingleEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500"
                />
                <span className="text-sm font-body font-semibold text-charcoal">Uključi „Jedan Zoom poziv" u ponudu</span>
              </label>
              {form.zoomSingleEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Zoom - jedan (&euro;)</label>
                    <input type="number" name="zoomPriceSingle" value={form.zoomPriceSingle} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Zoom - jedan (RSD)</label>
                    <input type="number" name="zoomPriceSingleRsd" value={form.zoomPriceSingleRsd} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                </div>
              )}
            </div>

            {/* Zoom — weekly */}
            <div className="rounded-xl border border-sand-200 p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.zoomWeeklyEnabled}
                  onChange={(e) => setForm((f) => ({ ...f, zoomWeeklyEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500"
                />
                <span className="text-sm font-body font-semibold text-charcoal">Uključi „Nedeljne Zoom pozive" u ponudu</span>
              </label>
              {form.zoomWeeklyEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Zoom - nedeljno (&euro;)</label>
                    <input type="number" name="zoomPriceWeekly" value={form.zoomPriceWeekly} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold text-charcoal mb-2">Zoom - nedeljno (RSD)</label>
                    <input type="number" name="zoomPriceWeeklyRsd" value={form.zoomPriceWeeklyRsd} onChange={handleChange} min={0} className={inputClasses} />
                  </div>
                </div>
              )}
            </div>

            {/* Image + Total lessons */}
            <div>
              <label className="block text-sm font-body font-semibold text-charcoal mb-2">URL slike</label>
              <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputClasses} placeholder="https://example.com/slika.jpg" />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-charcoal mb-2">Broj nedelja</label>
              <input type="number" name="totalLessons" value={form.totalLessons} onChange={handleChange} min={1} className={`${inputClasses} max-w-[200px]`} />
              <p className="text-xs font-body text-charcoal-500 mt-1">Ukupan broj nedelja u kursu</p>
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input type="checkbox" name="published" id="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500" />
              <label htmlFor="published" className="text-sm font-body text-charcoal cursor-pointer">Objavljen</label>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════
              SECTION 2 + 3: Modules with Inline Lessons
              ═══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-lg text-charcoal">Moduli i lekcije</h2>
                <p className="text-xs font-body text-charcoal-500 mt-0.5">Organizujte kurs po mesecima. Svaki modul automatski dobija 4 lekcije.</p>
              </div>
              <button type="button" onClick={addModule} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors">
                <Plus className="w-4 h-4" />
                Dodaj modul
              </button>
            </div>

            <div className="space-y-4">
              {formModules.map((mod, modIndex) => {
                const modLessons = formLessons
                  .filter((l) => l._tempModuleId === mod._tempId)
                  .sort((a, b) => a.weekNumber - b.weekNumber);
                const isExpanded = expandedModules.has(mod._tempId);

                return (
                  <div key={mod._tempId} className={`rounded-xl border overflow-hidden ${mod.isVazaIzobilja ? 'border-gold-400 ring-1 ring-gold-400' : 'border-sand-200'}`}>
                    {/* ── Module Header ── */}
                    {editingModuleId === mod._tempId ? (
                      <div className="p-4 space-y-3 bg-white">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy-500 text-white text-xs font-heading font-bold">{mod.orderIndex}</span>
                          <span className="text-sm font-body text-charcoal-500">Mesec {mod.orderIndex}</span>
                        </div>
                        <div>
                          <label className="block text-xs font-body font-semibold text-charcoal mb-1">Naziv modula</label>
                          <input type="text" value={moduleEditForm.title} onChange={(e) => setModuleEditForm((f) => ({ ...f, title: e.target.value }))} className={smallInputClasses} />
                        </div>
                        <div>
                          <label className="block text-xs font-body font-semibold text-charcoal mb-1">Opis</label>
                          <textarea value={moduleEditForm.description} onChange={(e) => setModuleEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={smallInputClasses} />
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" id={`vaza-${mod._tempId}`} checked={moduleEditForm.isVazaIzobilja} onChange={(e) => setModuleEditForm((f) => ({ ...f, isVazaIzobilja: e.target.checked }))} className="w-4 h-4 rounded border-sand-300 text-gold-500 focus:ring-gold-500" />
                          <label htmlFor={`vaza-${mod._tempId}`} className="text-sm font-body text-charcoal cursor-pointer flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-gold-500" />Vaza Izobilja mesec
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => saveModuleEdit(mod._tempId)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors">
                            <Check className="w-4 h-4" />Sačuvaj
                          </button>
                          <button type="button" onClick={cancelModuleEdit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sand-200 text-charcoal text-sm font-body hover:bg-sand-300 transition-colors">
                            <X className="w-4 h-4" />Otkaži
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-4 flex items-center gap-3 cursor-pointer ${mod.isVazaIzobilja ? 'bg-gold-50' : 'bg-white'}`}
                        onClick={() => toggleModuleExpand(mod._tempId)}
                      >
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                          <button type="button" onClick={(e) => { e.stopPropagation(); moveModuleUp(modIndex); }} disabled={modIndex === 0} className="p-0.5 rounded text-charcoal-500 hover:text-charcoal disabled:opacity-30 transition-colors">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-heading font-bold ${mod.isVazaIzobilja ? 'bg-gold-400 text-white' : 'bg-navy-500 text-white'}`}>{mod.orderIndex}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); moveModuleDown(modIndex); }} disabled={modIndex === formModules.length - 1} className="p-0.5 rounded text-charcoal-500 hover:text-charcoal disabled:opacity-30 transition-colors">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-sm text-charcoal truncate">{mod.title}</h3>
                            {mod.isVazaIzobilja && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-50 text-gold-600 text-xs font-semibold"><Sparkles className="w-3 h-3" />Vaza</span>}
                            <span className="text-xs text-charcoal-400">{modLessons.length} lekcija</span>
                          </div>
                          {mod.description && <p className="text-xs font-body text-charcoal-500 truncate mt-0.5">{mod.description}</p>}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button type="button" onClick={(e) => { e.stopPropagation(); startModuleEdit(mod); }} className="p-2 rounded-xl text-charcoal-500 hover:bg-sand-200 hover:text-charcoal transition-all" title="Izmeni">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeModule(mod._tempId); }} className="p-2 rounded-xl text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all" title="Ukloni">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className={`w-4 h-4 text-charcoal-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    )}

                    {/* ── Lessons inside module ── */}
                    {isExpanded && editingModuleId !== mod._tempId && (
                      <div className="border-t border-sand-200 bg-cream-50/50 p-4 space-y-3">
                        {modLessons.length === 0 && (
                          <p className="text-sm font-body text-charcoal-400 text-center py-3">Nema lekcija u ovom modulu.</p>
                        )}

                        {modLessons.map((lesson) => (
                          <div key={lesson._tempId} className={`rounded-xl border border-sand-200 bg-white overflow-hidden ${lesson.isVazaIzobilja ? 'ring-1 ring-gold-400' : ''}`}>
                            {editingLessonId === lesson._tempId ? (
                              /* Lesson edit mode */
                              <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy-500 text-white text-xs font-heading font-bold">{lesson.weekNumber}</span>
                                  <span className="text-xs font-body text-charcoal-500">Nedelja {lesson.weekNumber}</span>
                                </div>
                                <div>
                                  <label className="block text-xs font-body font-semibold text-charcoal mb-1">Naziv lekcije</label>
                                  <input type="text" value={lessonEditForm.title || ''} onChange={(e) => setLessonEditForm((f) => ({ ...f, title: e.target.value }))} className={smallInputClasses} placeholder="Naziv nedelje" />
                                </div>
                                <div>
                                  <label className="block text-xs font-body font-semibold text-charcoal mb-1">Tekst / Opis</label>
                                  <textarea value={lessonEditForm.description || ''} onChange={(e) => setLessonEditForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={smallInputClasses} placeholder="Sadržaj lekcije, opis teme..." />
                                </div>
                                <div className="space-y-2 rounded-xl border border-sand-200 bg-sand-50/50 p-3">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-body font-semibold text-charcoal">Video lekcije (možete dodati više)</label>
                                    <button type="button" onClick={addVideoToEdit} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-500 text-white text-[11px] font-body hover:bg-navy-600 transition-colors">
                                      + Dodaj video
                                    </button>
                                  </div>
                                  {(lessonEditForm.videos ?? []).length === 0 && (
                                    <p className="text-[11px] text-charcoal-400 italic">Nema dodatih videa. Kliknite "Dodaj video" da biste dodali prvi.</p>
                                  )}
                                  {(lessonEditForm.videos ?? []).map((v, vi) => (
                                    <div key={v._tempId} className="rounded-lg bg-white border border-sand-200 p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-body font-semibold text-charcoal-500">Video {vi + 1}</span>
                                        <div className="flex items-center gap-1">
                                          <button type="button" disabled={vi === 0} onClick={() => moveVideoInEdit(v._tempId, -1)} className="p-1 rounded text-charcoal-500 hover:bg-sand-200 disabled:opacity-30" title="Pomeri gore">↑</button>
                                          <button type="button" disabled={vi === (lessonEditForm.videos ?? []).length - 1} onClick={() => moveVideoInEdit(v._tempId, 1)} className="p-1 rounded text-charcoal-500 hover:bg-sand-200 disabled:opacity-30" title="Pomeri dole">↓</button>
                                          <button type="button" onClick={() => removeVideoFromEdit(v._tempId)} className="p-1 rounded text-red-500 hover:bg-red-50" title="Ukloni video">
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-body text-charcoal-500 mb-1">Naslov (opcionalno)</label>
                                        <input type="text" value={v.title} onChange={(e) => updateVideoInEdit(v._tempId, { title: e.target.value })} className={smallInputClasses} placeholder="npr. Deo 1: Uvod" />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-body text-charcoal-500 mb-1">Putanja u Supabase (preporučeno)</label>
                                        <input type="text" value={v.videoPath} onChange={(e) => updateVideoInEdit(v._tempId, { videoPath: e.target.value })} className={smallInputClasses} placeholder="npr. lekcija-1.mp4 ili course-1/lekcija-1.mp4" />
                                        <p className="text-[10px] text-charcoal-400 mt-1">Naziv fajla u <span className="font-mono">course-videos</span> bucket-u. Ako nalepite ceo Supabase URL, automatski se skraćuje pri snimanju.</p>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-body text-charcoal-500 mb-1">Video URL (alternativa)</label>
                                        <input type="text" value={v.videoUrl} onChange={(e) => updateVideoInEdit(v._tempId, { videoUrl: e.target.value })} className={smallInputClasses} placeholder="https://rumble.com/embed/..." />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-body font-semibold text-charcoal mb-1">Nedelja br.</label>
                                    <input type="number" value={lessonEditForm.weekNumber || 1} onChange={(e) => setLessonEditForm((f) => ({ ...f, weekNumber: Number(e.target.value) }))} min={1} className={smallInputClasses} />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-body font-semibold text-charcoal mb-1">Otključava posle (nedelja)</label>
                                    <input type="number" value={lessonEditForm.availableAfterWeeks ?? 0} onChange={(e) => setLessonEditForm((f) => ({ ...f, availableAfterWeeks: Number(e.target.value) }))} min={0} className={smallInputClasses} />
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-x-5 gap-y-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={lessonEditForm.hasQandA || false} onChange={(e) => setLessonEditForm((f) => ({ ...f, hasQandA: e.target.checked }))} className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500" />
                                    <span className="text-xs font-body text-charcoal">Q&A sesija</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={lessonEditForm.hasPracticalExercise || false} onChange={(e) => setLessonEditForm((f) => ({ ...f, hasPracticalExercise: e.target.checked }))} className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500" />
                                    <span className="text-xs font-body text-charcoal">Praktična vežba</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={lessonEditForm.hasOnlineTest || false} onChange={(e) => setLessonEditForm((f) => ({ ...f, hasOnlineTest: e.target.checked }))} className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500" />
                                    <span className="text-xs font-body text-charcoal">Online test</span>
                                  </label>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button type="button" onClick={() => saveLessonEdit(lesson._tempId)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-500 text-white text-xs font-body hover:bg-navy-600 transition-colors">
                                    <Check className="w-3.5 h-3.5" />Sačuvaj
                                  </button>
                                  <button type="button" onClick={cancelLessonEdit} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sand-200 text-charcoal text-xs font-body hover:bg-sand-300 transition-colors">
                                    <X className="w-3.5 h-3.5" />Otkaži
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Lesson view mode */
                              <div className="p-3 flex items-start gap-3">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-heading font-bold flex-shrink-0 ${lesson.isVazaIzobilja ? 'bg-gold-400 text-white' : 'bg-navy-100 text-navy-600'}`}>
                                  {lesson.weekNumber}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-heading text-sm text-charcoal truncate">
                                      {lesson.title || <span className="text-charcoal-400 italic">Bez naziva</span>}
                                    </span>
                                    {lesson.hasQandA && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-navy-50 text-navy-600 text-[10px] font-semibold"><MessageCircleQuestion className="w-2.5 h-2.5" />Q&A</span>}
                                    {lesson.hasPracticalExercise && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-semibold"><ClipboardCheck className="w-2.5 h-2.5" />Vežba</span>}
                                    {lesson.hasOnlineTest && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-semibold"><GraduationCap className="w-2.5 h-2.5" />Test</span>}
                                  </div>
                                  {lesson.videos.length === 0 ? (
                                    <p className="text-[11px] font-body text-charcoal-400 italic mt-0.5">Bez videa</p>
                                  ) : (
                                    <p className="text-[11px] font-body text-navy-500 truncate mt-0.5">
                                      🎬 {lesson.videos.length} {lesson.videos.length === 1 ? 'video' : 'videa'}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                  <button type="button" onClick={() => startLessonEdit(lesson)} className="p-1.5 rounded-lg text-charcoal-500 hover:bg-sand-200 hover:text-charcoal transition-all" title="Izmeni">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button type="button" onClick={() => removeLesson(lesson._tempId)} className="p-1.5 rounded-lg text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all" title="Ukloni">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <button type="button" onClick={() => addLesson(mod._tempId)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body text-navy-500 hover:bg-navy-50 transition-colors">
                          <Plus className="w-3.5 h-3.5" />Dodaj lekciju
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {formModules.length === 0 && (
                <p className="text-sm font-body text-charcoal-500 text-center py-8">
                  Dodajte module da organizujete lekcije po mesecima. Svaki modul automatski dobija 4 prazne lekcije.
                </p>
              )}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════
              SAVE BUTTON
              ═══════════════════════════════════════════════════ */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={saving}
              icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? 'Čuvanje...' : 'Sačuvaj kurs'}
            </Button>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              className="text-sm font-body text-charcoal-500 hover:text-charcoal transition-colors"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    
  );
};

export default AdminCourseForm;
