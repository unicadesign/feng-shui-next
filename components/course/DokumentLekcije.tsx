'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, ExternalLink, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Props {
  /** Putanja PDF-a u `course-videos` (iz `lesson_videos.video_path`). */
  path?: string;
  title?: string;
  fileName?: string;
}

/** Isto trajanje kao potpisani link za video u `VideoPlayer`. */
const TRAJANJE_LINKA_S = 21600; // 6 sati

/**
 * PDF dokument u lekciji (od 13.10.2026.), na svom mestu u redosledu
 * sadržaja koji je admin složio.
 *
 * Fajl je u privatnom bucket-u, pa se pravi potpisani link, isto kao za
 * video: dobija ga samo polaznica kojoj je lekcija otključana. Dva linka:
 * „Otvori" prikazuje PDF u pretraživaču, „Preuzmi" ga čuva pod originalnim
 * imenom. Linkovi se prave odmah, a ne na klik: otvaranje nove kartice
 * posle čekanja na server pretraživači (Safari) blokiraju kao popup.
 */
const DokumentLekcije: React.FC<Props> = ({ path, title, fileName }) => {
  const [linkovi, setLinkovi] = useState<{ otvori: string; preuzmi: string } | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let otkazano = false;
    const ime = fileName || 'dokument.pdf';
    const bucket = supabase.storage.from('course-videos');
    Promise.all([
      bucket.createSignedUrl(path, TRAJANJE_LINKA_S),
      bucket.createSignedUrl(path, TRAJANJE_LINKA_S, { download: ime }),
    ]).then(([o, p]) => {
      if (otkazano) return;
      if (o.error || p.error || !o.data?.signedUrl || !p.data?.signedUrl) {
        setGreska('Nemate pristup ovom dokumentu.');
      } else {
        setLinkovi({ otvori: o.data.signedUrl, preuzmi: p.data.signedUrl });
      }
    });
    return () => {
      otkazano = true;
    };
  }, [path, fileName]);

  const naslov = title || fileName?.replace(/\.pdf$/i, '') || 'PDF dokument';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white border border-sand-200 p-5 shadow-card">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-navy-50 text-navy-500 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-base text-charcoal leading-snug">{naslov}</p>
          <p className="text-xs text-charcoal-500 truncate">PDF dokument{fileName && title ? ` · ${fileName}` : ''}</p>
        </div>
      </div>

      {greska ? (
        <p className="flex items-center gap-1.5 text-sm text-charcoal-500">
          <Lock className="w-4 h-4" /> {greska}
        </p>
      ) : !linkovi ? (
        <Loader2 className="w-5 h-5 animate-spin text-charcoal-400" aria-label="Učitavanje" />
      ) : (
        <div className="flex items-center gap-2">
          <a
            href={linkovi.otvori}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-500 text-white px-4 py-2 text-sm font-heading font-semibold hover:bg-navy-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Otvori
          </a>
          <a
            href={linkovi.preuzmi}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-navy-500 text-navy-600 px-4 py-1.5 text-sm font-heading font-semibold hover:bg-navy-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Preuzmi
          </a>
        </div>
      )}
    </div>
  );
};

export default DokumentLekcije;
