import imageCompression from 'browser-image-compression';
import { supabase } from './supabase/client';

export interface UploadResult {
  url: string;
  originalSize: number;
  compressedSize: number;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.85,
};

export async function compressAndUploadImage(file: File): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Fajl mora biti slika (JPG, PNG, WebP, itd.)');
  }

  const originalSize = file.size;

  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

  const baseSlug = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'image';

  const path = `${Date.now()}-${baseSlug}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, compressed, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Otpremanje nije uspelo: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('images').getPublicUrl(path);

  return {
    url: data.publicUrl,
    originalSize,
    compressedSize: compressed.size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
