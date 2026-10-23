'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, Plus, Pencil, Trash2, Check, X,
  ChevronUp, ChevronDown, ChevronRight,
  Sparkles, MessageCircleQuestion, ClipboardCheck, GraduationCap,
  Loader2, FileText, Upload,
} from 'lucide-react';
import Button from '@/components/Button';
import { useCourses } from '@/hooks/useCourses';
import type { CourseType, LessonItemKind } from '@/types';
import { normalizeStoragePath } from '@/lib/storagePath';
import { supabase } from '@/lib/supabase/client';
import { proveriVideo, putanjaVidea, imeZaPutanju } from '@/lib/proveraVidea';

// ─── Local state shapes ──────────────────────────────────────

interface ModuleForm {
  _tempId: string;      // local key (temp or existing DB id)
  existingId?: string;  // DB id if editing
  orderIndex: number;
  title: string;
  description: string;
  isVazaIzobilja: boolean;
}

/**
 * Stavka sadržaja lekcije: video ili PDF (od 13.10.2026.). PDF se podiže sa
 * računara u `course-videos/dokumenti/`, a putanja ide u `videoPath`, da bi
 * ga štitilo isto pravilo pristupa kao video.
 */
interface VideoForm {
  _tempId: string;
  kind: LessonItemKind;
  title: string;
  videoPath: string;
  videoUrl: string;
  /** Originalno ime PDF fajla. */
  fileName: string;
}

const MAX_PDF_MB = 50;

/** Putanja novog PDF-a u `course-videos`; vreme sprečava da se dva fajla istog imena pregaze. */
const novaPutanjaPdf = (ime: string) => `dokumenti/${Date.now()}-${imeZaPutanju(ime)}.pdf`;

/**
 * Upload videa u delovima (tus), direktno na Supabase Storage. Direktan
 * host `<projekat>.storage.supabase.co` je Supabase-ova preporuka za velike
 * fajlove. Delovi moraju biti tačno 6 MB.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const TUS_ENDPOINT = `${SUPABASE_URL.replace('.supabase.co', '.storage.supabase.co')}/storage/v1/upload/resumable`;
const DEO_UPLOADA = 6 * 1024 * 1024;

/** Stanje uploada jednog videa u formi. */
interface StanjeVidea {
  poslato: number;
  ukupno: number;
  pocetak: number;
  aktivan: boolean;
  greska?: string;
  upozorenja: string[];
}

const mb = (b: number) => (b / 1024 / 1024).toFixed(0);

/** Početno stanje uploada; vreme početka služi za procenu preostalog. */
const novoStanjeVidea = (ukupno: number, greska: string | undefined, upozorenja: string[]): StanjeVidea => ({
  poslato: 0,
  ukupno,
  pocetak: Date.now(),
  aktivan: !greska,
  greska,
  upozorenja,
});

/** „još oko 6 min" iz dosadašnje brzine. */
function preostalo(st: StanjeVidea): string {
  const proteklo = (Date.now() - st.pocetak) / 1000;
  if (st.poslato < DEO_UPLOADA || proteklo < 3) return '';
  const sekundi = ((st.ukupno - st.poslato) / st.poslato) * proteklo;
  if (sekundi < 60) return ' · još manje od minuta';
  return ` · još oko ${Math.round(sekundi / 60)} min`;
}

/**
 * „Otisak" sadržaja kursa: ID-jevi modula, lekcija i stavki lekcija. Admin
 * pri snimanju briše i ponovo pravi sve lekcije, pa se svaka izmena sa
 * druge strane (druga kartica, upis spolja) vidi kao drugačiji otisak.
 */
function otisak(moduli: string[], lekcije: { id: string; stavke: string[] }[]): string {
  const l = lekcije.map((x) => `${x.id}:${[...x.stavke].sort().join(',')}`).sort();
  return `${[...moduli].sort().join(',')}|${l.join(';')}`;
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
  /** Stanje učitavanja PDF-a po stavci: 'u toku' ili poruka o grešci. */
  const [otpremanje, setOtpremanje] = useState<Record<string, string>>({});
  const [greskaSadrzaja, setGreskaSadrzaja] = useState<string | null>(null);
  /** Upload videa po stavci (napredak, upozorenja, greška). */
  const [videoUpload, setVideoUpload] = useState<Record<string, StanjeVidea>>({});
  const uploadi = useRef<Record<string, { abort: (prekiniNaServeru?: boolean) => Promise<void> }>>({});
  /** Otisak kursa kakav je bio kad je forma popunjena; vidi `otisak`. */
  const ucitaniOtisak = useRef<string | null>(null);
  const imaAktivnihUploada =
    Object.values(otpremanje).includes('u toku') || Object.values(videoUpload).some((v) => v.aktivan);

  // Zatvaranje kartice usred uploada traži potvrdu pretraživača.
  useEffect(() => {
    if (!imaAktivnihUploada) return;
    const upozori = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', upozori);
    return () => window.removeEventListener('beforeunload', upozori);
  }, [imaAktivnihUploada]);
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
                  kind: v.kind,
                  title: v.title,
                  videoPath: v.videoPath || '',
                  videoUrl: v.videoUrl || '',
                  fileName: v.fileName || '',
                }))
              : (l.videoUrl || l.videoPath)
                ? [{
                    _tempId: genId(),
                    kind: 'video' as const,
                    title: '',
                    videoPath: l.videoPath || '',
                    videoUrl: l.videoUrl || '',
                    fileName: '',
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
        ucitaniOtisak.current = otisak(
          courseModules.map((m) => m._tempId),
          allLessons
            .filter((l) => l.courseId === id)
            .map((l) => ({ id: l.id, stavke: l.videos.map((v) => v.id) }))
        );

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
    if (imaAktivnihUploada) {
      setGreskaSadrzaja('Sačekajte da se upload završi ili ga otkažite.');
      return;
    }
    setEditingLessonId(lesson._tempId);
    setLessonEditForm({ ...lesson });
  };

  // ── Video helpers (operate on the in-flight lessonEditForm) ──
  const addVideoToEdit = () => {
    setLessonEditForm((f) => ({
      ...f,
      videos: [
        ...(f.videos ?? []),
        { _tempId: genId(), kind: 'video', title: '', videoPath: '', videoUrl: '', fileName: '' },
      ],
    }));
  };

  const addDocumentToEdit = () => {
    setLessonEditForm((f) => ({
      ...f,
      videos: [
        ...(f.videos ?? []),
        { _tempId: genId(), kind: 'document', title: '', videoPath: '', videoUrl: '', fileName: '' },
      ],
    }));
  };

  /**
   * PDF ide direktno iz pretraživača u Supabase; admin ima pravo upisa u
   * `course-videos`. Ime u bucket-u je vreme + očišćeno ime, da se dva
   * fajla istog imena ne pregaze; originalno ime se čuva za prikaz.
   */
  const otpremiPdf = async (tempId: string, fajl: File) => {
    const jePdf = fajl.type === 'application/pdf' || /\.pdf$/i.test(fajl.name);
    if (!jePdf) {
      setOtpremanje((p) => ({ ...p, [tempId]: 'Izaberite PDF fajl.' }));
      return;
    }
    if (fajl.size > MAX_PDF_MB * 1024 * 1024) {
      setOtpremanje((p) => ({ ...p, [tempId]: `PDF je veći od ${MAX_PDF_MB} MB.` }));
      return;
    }
    setOtpremanje((p) => ({ ...p, [tempId]: 'u toku' }));
    const putanja = novaPutanjaPdf(fajl.name);
    const { error: upErr } = await supabase.storage
      .from('course-videos')
      .upload(putanja, fajl, { contentType: 'application/pdf', upsert: false });
    if (upErr) {
      setOtpremanje((p) => ({ ...p, [tempId]: `Učitavanje nije uspelo: ${upErr.message}` }));
      return;
    }
    updateVideoInEdit(tempId, { videoPath: putanja, fileName: fajl.name });
    setOtpremanje((p) => {
      const novo = { ...p };
      delete novo[tempId];
      return novo;
    });
  };

  /**
   * Video ide iz pretraživača pravo u Supabase, u delovima od 6 MB. Ako
   * veza pukne, tus sam pokušava ponovo; ako se kartica zatvori, ponovni izbor
   * ISTOG fajla nastavlja odakle je stao (putanja je ista za isti fajl, a tus
   * pamti započet upload u pretraživaču). Pre slanja se proverava format.
   */
  const otpremiVideo = async (tempId: string, fajl: File) => {
    const citaj = async (od: number, doBajta: number) =>
      new Uint8Array(await fajl.slice(od, doBajta).arrayBuffer());
    let provera: { greska?: string; upozorenja: string[] };
    try {
      provera = await proveriVideo(fajl.name, fajl.size, fajl.type, citaj);
    } catch {
      provera = { upozorenja: [], greska: 'Fajl nije moguće pročitati. Izvezite ga ponovo kao MP4.' };
    }
    const novo = novoStanjeVidea(fajl.size, provera.greska, provera.upozorenja);
    setVideoUpload((p) => ({ ...p, [tempId]: novo }));
    if (provera.greska) return;

    const putanja = putanjaVidea(fajl.name, fajl.size, fajl.lastModified);
    const zavrsi = () => {
      delete uploadi.current[tempId];
      updateVideoInEdit(tempId, { videoPath: putanja, fileName: fajl.name, videoUrl: '' });
      setVideoUpload((p) => ({
        ...p,
        [tempId]: { ...p[tempId], aktivan: false, poslato: fajl.size, greska: undefined },
      }));
    };

    const { Upload } = await import('tus-js-client');
    const upload = new Upload(fajl, {
      endpoint: TUS_ENDPOINT,
      chunkSize: DEO_UPLOADA,
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: { 'x-upsert': 'false' },
      metadata: {
        bucketName: 'course-videos',
        objectName: putanja,
        contentType: 'video/mp4',
        cacheControl: '3600',
      },
      // Token se uzima pred svaki deo: Supabase prijava traje sat vremena i
      // sama se obnavlja, pa i upload duži od sata šalje važeći token.
      onBeforeRequest: async (req) => {
        const { data } = await supabase.auth.getSession();
        req.setHeader('authorization', `Bearer ${data.session?.access_token ?? ''}`);
        req.setHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
      },
      onProgress: (poslato, ukupno) => {
        setVideoUpload((p) => (p[tempId] ? { ...p, [tempId]: { ...p[tempId], poslato, ukupno } } : p));
      },
      onSuccess: zavrsi,
      onError: (err) => {
        const status = (err as { originalResponse?: { getStatus: () => number } | null })
          .originalResponse?.getStatus();
        // 409: isti fajl je već ceo u Supabase-u (ista putanja za isti fajl).
        if (status === 409) {
          zavrsi();
          return;
        }
        delete uploadi.current[tempId];
        setVideoUpload((p) => ({
          ...p,
          [tempId]: {
            ...p[tempId],
            aktivan: false,
            greska: 'Upload je prekinut. Izaberite isti fajl ponovo: nastaviće se tamo gde je stao.',
          },
        }));
      },
    });
    uploadi.current[tempId] = upload;
    const zapoceti = await upload.findPreviousUploads();
    if (zapoceti.length > 0) upload.resumeFromPreviousUpload(zapoceti[0]);
    upload.start();
  };

  const otkaziVideo = (tempId: string) => {
    // `true` briše i započeti deo na serveru.
    uploadi.current[tempId]?.abort(true).catch(() => {});
    delete uploadi.current[tempId];
    setVideoUpload((p) => {
      const novo = { ...p };
      delete novo[tempId];
      return novo;
    });
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

  const cancelLessonEdit = () => {
    if (imaAktivnihUploada) {
      setGreskaSadrzaja('Sačekajte da se upload završi ili ga otkažite.');
      return;
    }
    setEditingLessonId(null);
  };

  const saveLessonEdit = (tempId: string) => {
    if (imaAktivnihUploada) {
      setGreskaSadrzaja('Sačekajte da se upload završi ili ga otkažite.');
      return;
    }
    const bezFajla = (lessonEditForm.videos ?? []).findIndex(
      (v) => v.kind === 'document' && !v.videoPath
    );
    if (bezFajla >= 0) {
      setGreskaSadrzaja(`Stavka ${bezFajla + 1} je PDF bez fajla: izaberite fajl ili je uklonite.`);
      return;
    }
    setGreskaSadrzaja(null);
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
    if (imaAktivnihUploada) {
      setError('Sačekajte da se upload završi, pa sačuvajte kurs.');
      return;
    }
    setSaving(true);
    setError(null);

    // Snimanje briše i ponovo pravi sve lekcije iz ove forme. Ako je kurs u
    // međuvremenu menjan (druga kartica, materijal dodat spolja), snimanje
    // bi te izmene obrisalo, pa se prvo proverava da li je baza ista kao
    // kad je strana otvorena.
    if (isEditing && id && ucitaniOtisak.current !== null) {
      const [lekcijeRes, moduliRes] = await Promise.all([
        supabase.from('lessons').select('id, lesson_videos(id)').eq('course_id', id),
        supabase.from('course_modules').select('id').eq('course_id', id),
      ]);
      if (lekcijeRes.error || moduliRes.error) {
        setSaving(false);
        setError('Nije moguće proveriti kurs pre snimanja. Proverite internet i pokušajte ponovo.');
        return;
      }
      const svez = otisak(
        (moduliRes.data ?? []).map((m: { id: string }) => m.id),
        (lekcijeRes.data ?? []).map((l: { id: string; lesson_videos: { id: string }[] | null }) => ({
          id: l.id,
          stavke: (l.lesson_videos ?? []).map((v) => v.id),
        }))
      );
      if (svez !== ucitaniOtisak.current) {
        setSaving(false);
        setError(
          'Kurs je u međuvremenu izmenjen (u drugoj kartici ili spolja). Snimanje bi obrisalo te izmene, pa je zaustavljeno. Osvežite stranu i ponovite svoje izmene.'
        );
        return;
      }
    }

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
          video_url: v.kind === 'document' ? '' : v.videoUrl,
          kind: v.kind,
          file_name: v.kind === 'document' ? v.fileName || null : null,
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
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label className="block text-xs font-body font-semibold text-charcoal">Sadržaj lekcije (video i PDF, redom kako se prikazuje)</label>
                                    <div className="flex items-center gap-1.5">
                                      <button type="button" onClick={addVideoToEdit} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-500 text-white text-[11px] font-body hover:bg-navy-600 transition-colors">
                                        + Dodaj video
                                      </button>
                                      <button type="button" onClick={addDocumentToEdit} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-500 text-white text-[11px] font-body hover:bg-navy-600 transition-colors">
                                        + Dodaj PDF
                                      </button>
                                    </div>
                                  </div>
                                  {(lessonEditForm.videos ?? []).length === 0 && (
                                    <p className="text-[11px] text-charcoal-400 italic">Lekcija još nema sadržaj. Dodajte video ili PDF.</p>
                                  )}
                                  {(lessonEditForm.videos ?? []).map((v, vi) => {
                                    const status = otpremanje[v._tempId];
                                    const vStanje = videoUpload[v._tempId];
                                    const ucitava = status === 'u toku' || !!vStanje?.aktivan;
                                    return (
                                    <div key={v._tempId} className="rounded-lg bg-white border border-sand-200 p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-body font-semibold text-charcoal-500">
                                          {v.kind === 'document' ? <FileText className="w-3 h-3" /> : <span aria-hidden="true">🎬</span>}
                                          {vi + 1}. {v.kind === 'document' ? 'PDF dokument' : 'Video'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <button type="button" disabled={vi === 0} onClick={() => moveVideoInEdit(v._tempId, -1)} className="p-1 rounded text-charcoal-500 hover:bg-sand-200 disabled:opacity-30" title="Pomeri gore">↑</button>
                                          <button type="button" disabled={vi === (lessonEditForm.videos ?? []).length - 1} onClick={() => moveVideoInEdit(v._tempId, 1)} className="p-1 rounded text-charcoal-500 hover:bg-sand-200 disabled:opacity-30" title="Pomeri dole">↓</button>
                                          <button type="button" disabled={ucitava} onClick={() => removeVideoFromEdit(v._tempId)} className="p-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-30" title="Ukloni">
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-body text-charcoal-500 mb-1">Naslov (opcionalno)</label>
                                        <input type="text" value={v.title} onChange={(e) => updateVideoInEdit(v._tempId, { title: e.target.value })} className={smallInputClasses} placeholder={v.kind === 'document' ? 'npr. Radni list za nedelju 1' : 'npr. Deo 1: Uvod'} />
                                      </div>
                                      {v.kind === 'document' ? (
                                        <div className="space-y-1.5">
                                          {v.videoPath && (
                                            <p className="flex items-center gap-1.5 text-[11px] font-body text-charcoal break-all">
                                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-navy-500" />
                                              {v.fileName || v.videoPath}
                                            </p>
                                          )}
                                          <label className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sand-300 bg-sand-50 text-[11px] font-body text-charcoal transition-colors ${ucitava ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-sand-100'}`}>
                                            {ucitava ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                            {ucitava ? 'Učitavam PDF…' : v.videoPath ? 'Zameni PDF' : 'Izaberi PDF sa računara'}
                                            <input
                                              type="file"
                                              accept="application/pdf,.pdf"
                                              className="sr-only"
                                              disabled={ucitava}
                                              onChange={(e) => {
                                                const fajl = e.target.files?.[0];
                                                e.target.value = '';
                                                if (fajl) otpremiPdf(v._tempId, fajl);
                                              }}
                                            />
                                          </label>
                                          {status && !ucitava && (
                                            <p className="text-[11px] font-body text-red-600">{status}</p>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-1.5">
                                          {v.videoPath && !vStanje?.aktivan && (
                                            <p className="flex items-center gap-1.5 text-[11px] font-body text-charcoal break-all">
                                              <span aria-hidden="true">🎬</span>
                                              {v.fileName || v.videoPath}
                                            </p>
                                          )}
                                          {vStanje?.aktivan ? (
                                            <div className="space-y-1">
                                              <div className="h-2 w-full rounded-full bg-sand-200 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((vStanje.poslato / vStanje.ukupno) * 100)}>
                                                <div className="h-full bg-navy-500 transition-[width] duration-300" style={{ width: `${(vStanje.poslato / vStanje.ukupno) * 100}%` }} />
                                              </div>
                                              <div className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-body text-charcoal-500">
                                                  Učitavam {mb(vStanje.poslato)} / {mb(vStanje.ukupno)} MB · {Math.round((vStanje.poslato / vStanje.ukupno) * 100)}%{preostalo(vStanje)}
                                                </span>
                                                <button type="button" onClick={() => otkaziVideo(v._tempId)} className="text-[11px] font-body text-red-600 hover:underline">
                                                  Otkaži
                                                </button>
                                              </div>
                                              <p className="text-[10px] text-charcoal-400">Ne zatvarajte ovu karticu dok upload traje. Ako veza pukne, nastaviće se sam.</p>
                                            </div>
                                          ) : (
                                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sand-300 bg-sand-50 text-[11px] font-body text-charcoal cursor-pointer hover:bg-sand-100 transition-colors">
                                              <Upload className="w-3 h-3" />
                                              {v.videoPath || v.videoUrl ? 'Zameni video' : 'Izaberi video sa računara'}
                                              <input
                                                type="file"
                                                accept="video/mp4,.mp4,video/quicktime,.mov"
                                                className="sr-only"
                                                onChange={(e) => {
                                                  const fajl = e.target.files?.[0];
                                                  e.target.value = '';
                                                  if (fajl) otpremiVideo(v._tempId, fajl);
                                                }}
                                              />
                                            </label>
                                          )}
                                          {vStanje?.greska && (
                                            <p className="text-[11px] font-body text-red-600">{vStanje.greska}</p>
                                          )}
                                          {vStanje?.upozorenja.map((u) => (
                                            <p key={u} className="text-[11px] font-body text-amber-700 bg-amber-50 rounded px-2 py-1">⚠ {u}</p>
                                          ))}
                                          {/* Ručni unos ostaje za stare videe i Rumble (Marko 23.10.2026.). */}
                                          <details className="pt-1">
                                            <summary className="text-[11px] font-body text-charcoal-500 cursor-pointer select-none">Napredno: ručna putanja ili Rumble link</summary>
                                            <div className="space-y-2 pt-2">
                                              <div>
                                                <label className="block text-[11px] font-body text-charcoal-500 mb-1">Putanja u Supabase</label>
                                                <input type="text" value={v.videoPath} disabled={ucitava} onChange={(e) => updateVideoInEdit(v._tempId, { videoPath: e.target.value, fileName: '' })} className={smallInputClasses} placeholder="npr. lekcija-1.mp4 ili course-1/lekcija-1.mp4" />
                                                <p className="text-[10px] text-charcoal-400 mt-1">Naziv fajla u <span className="font-mono">course-videos</span> bucket-u, slovo po slovo. Ako nalepite ceo Supabase URL, automatski se skraćuje pri snimanju.</p>
                                              </div>
                                              <div>
                                                <label className="block text-[11px] font-body text-charcoal-500 mb-1">Video URL (alternativa)</label>
                                                <input type="text" value={v.videoUrl} disabled={ucitava} onChange={(e) => updateVideoInEdit(v._tempId, { videoUrl: e.target.value })} className={smallInputClasses} placeholder="https://rumble.com/embed/..." />
                                              </div>
                                            </div>
                                          </details>
                                        </div>
                                      )}
                                    </div>
                                    );
                                  })}
                                  {greskaSadrzaja && (
                                    <p className="text-[11px] font-body text-red-600">{greskaSadrzaja}</p>
                                  )}
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
                                  {(() => {
                                    const brVidea = lesson.videos.filter((v) => v.kind !== 'document').length;
                                    const brPdf = lesson.videos.length - brVidea;
                                    if (lesson.videos.length === 0) {
                                      return <p className="text-[11px] font-body text-charcoal-400 italic mt-0.5">Bez sadržaja</p>;
                                    }
                                    return (
                                      <p className="text-[11px] font-body text-navy-500 truncate mt-0.5">
                                        {brVidea > 0 && <>🎬 {brVidea} {brVidea === 1 ? 'video' : 'videa'}</>}
                                        {brVidea > 0 && brPdf > 0 && ' · '}
                                        {brPdf > 0 && <>📄 {brPdf} PDF</>}
                                      </p>
                                    );
                                  })()}
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
