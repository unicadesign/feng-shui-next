'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon, Upload, Loader2, CheckCircle, AlertCircle, Move, RotateCcw } from 'lucide-react';
import { compressAndUploadImage, formatBytes } from '@/lib/imageUpload';
import { parseImageUrl, parseFocalPoint, withFocalPoint, type FocalPoint } from '@/lib/imagePosition';

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface UploadStats {
  originalSize: number;
  compressedSize: number;
}

const ImageUrlField: React.FC<ImageUrlFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://example.com/slika.jpg',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragPoint, setDragPoint] = useState<FocalPoint | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const parsed = parseImageUrl(value);
  const storedPoint = parseFocalPoint(value);
  const currentPoint = dragPoint ?? storedPoint;
  const hasImage = parsed.src.trim().length > 0;

  useEffect(() => {
    setNaturalSize(null);
  }, [parsed.src]);

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  const handleFile = async (file: File) => {
    setError(null);
    setStats(null);
    setUploading(true);
    try {
      const result = await compressAndUploadImage(file);
      onChange(result.url);
      setStats({ originalSize: result.originalSize, compressedSize: result.compressedSize });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const getOverflow = () => {
    if (!previewRef.current || !naturalSize) return { x: 0, y: 0 };
    const { width: cw, height: ch } = previewRef.current.getBoundingClientRect();
    if (!cw || !ch) return { x: 0, y: 0 };
    const scale = Math.max(cw / naturalSize.w, ch / naturalSize.h);
    return {
      x: Math.max(0, naturalSize.w * scale - cw),
      y: Math.max(0, naturalSize.h * scale - ch),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasImage || !naturalSize) return;
    e.preventDefault();
    const overflow = getOverflow();
    if (overflow.x === 0 && overflow.y === 0) return;
    const start = { x: e.clientX, y: e.clientY, point: currentPoint };

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      const nx = overflow.x > 0 ? clamp(start.point.x - (dx / overflow.x) * 100, 0, 100) : 50;
      const ny = overflow.y > 0 ? clamp(start.point.y - (dy / overflow.y) * 100, 0, 100) : 50;
      setDragPoint({ x: nx, y: ny });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      setDragPoint((latest) => {
        if (latest) onChange(withFocalPoint(parsed.src, latest));
        return null;
      });
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const handleResetPosition = () => {
    setDragPoint(null);
    onChange(withFocalPoint(parsed.src, null));
  };

  const overflow = getOverflow();
  const draggable = hasImage && naturalSize && (overflow.x > 0 || overflow.y > 0);
  const positionChanged = currentPoint.x !== 50 || currentPoint.y !== 50;

  const savedPercent = stats
    ? Math.max(
        0,
        Math.round(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100),
      )
    : 0;

  return (
    <div>
      <label className="block text-sm font-body font-semibold text-charcoal mb-2">{label}</label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${dragActive ? 'border-navy-500 bg-navy-50' : 'border-sand-300 bg-sand-100/30 hover:border-sand-400 hover:bg-sand-100/60'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
          p-5 flex items-center justify-center gap-3
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-navy-500 animate-spin" />
            <span className="text-sm font-body text-charcoal-500">Kompresija i otpremanje...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-charcoal-500" />
            <span className="text-sm font-body text-charcoal">
              <span className="font-semibold text-navy-500">Otpremi sliku</span>
              <span className="text-charcoal-500"> ili prevuci ovde</span>
            </span>
          </>
        )}
      </div>

      {stats && !error && (
        <div className="mt-2 flex items-center gap-2 text-xs font-body text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>
            Otpremljeno: {formatBytes(stats.originalSize)} → {formatBytes(stats.compressedSize)}
            {savedPercent > 0 && <span className="font-semibold"> ({savedPercent}% manje)</span>}
          </span>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-2 text-xs font-body text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-xs font-body text-charcoal-500 mb-1">
          ili nalepite URL slike
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setStats(null);
            setError(null);
          }}
          className={inputClasses}
          placeholder={placeholder}
        />
      </div>

      <div className="mt-3">
        {hasImage ? (
          <>
            <div
              ref={previewRef}
              onPointerDown={handlePointerDown}
              className={`relative h-[200px] w-full overflow-hidden rounded-xl border border-sand-200 select-none ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <img
                ref={imgRef}
                src={parsed.src}
                alt={label}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                draggable={false}
                className="h-full w-full object-cover pointer-events-none"
                style={{ objectPosition: `${currentPoint.x}% ${currentPoint.y}%` }}
              />
              {draggable && (
                <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-charcoal/70 px-2.5 py-1 text-xs font-body text-cream-50 backdrop-blur-sm">
                  <Move className="w-3 h-3" />
                  <span>Pomerite za izrez</span>
                </div>
              )}
            </div>
            {draggable && (
              <div className="mt-2 flex items-center justify-between text-xs font-body text-charcoal-500">
                <span>
                  Pozicija: {Math.round(currentPoint.x)}% × {Math.round(currentPoint.y)}%
                </span>
                {positionChanged && (
                  <button
                    type="button"
                    onClick={handleResetPosition}
                    className="flex items-center gap-1 text-navy-500 hover:text-navy-700"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Centriraj
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="h-[200px] w-full rounded-xl border-2 border-dashed border-sand-300 bg-sand-100/50 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-10 h-10 text-charcoal-500/30" />
            <span className="text-sm font-body text-charcoal-500/50">Pregled slike</span>
          </div>
        )}
      </div>
    </div>
  );
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default ImageUrlField;
