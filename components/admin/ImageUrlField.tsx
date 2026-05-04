'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { compressAndUploadImage, formatBytes } from '@/lib/imageUpload';

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
        {value.trim() ? (
          <img
            src={value}
            alt={label}
            className="h-[200px] w-full rounded-xl object-cover border border-sand-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
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

export default ImageUrlField;
