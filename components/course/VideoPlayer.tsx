'use client';

import React, { useEffect, useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { normalizeStoragePath } from '@/lib/storagePath';

interface VideoPlayerProps {
  videoPath?: string;
  videoUrl?: string;
  title?: string;
}

const SIGNED_URL_TTL_SECONDS = 21600; // 6 hours

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoPath, videoUrl, title }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanedPath = normalizeStoragePath(videoPath);
    if (!cleanedPath) {
      setSignedUrl(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.storage
      .from('course-videos')
      .createSignedUrl(cleanedPath, SIGNED_URL_TTL_SECONDS)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err || !data?.signedUrl) {
          setError(err?.message || 'Nemate pristup ovom video sadržaju.');
          setSignedUrl(null);
        } else {
          setSignedUrl(data.signedUrl);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoPath]);

  if (videoPath) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-warm bg-charcoal">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-sand-300">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          {!loading && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sand-300 px-6 text-center">
              <Lock className="w-8 h-8 mb-3" />
              <p className="text-sm font-body">{error}</p>
            </div>
          )}
          {!loading && !error && signedUrl && (
            <video
              key={signedUrl}
              src={signedUrl}
              title={title}
              controls
              controlsList="nodownload"
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-warm">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={videoUrl}
            title={title || 'Video lekcija'}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            frameBorder="0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-warm bg-sand-100">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center text-charcoal-400 text-sm font-body">
          Video još nije dostupan.
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
