'use client';

import React from 'react';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

interface ContentEditorToolbarProps {
  onSave: () => void;
  onReset: () => void;
  saving?: boolean;
}

const ContentEditorToolbar: React.FC<ContentEditorToolbarProps> = ({
  onSave,
  onReset,
  saving = false,
}) => {
  const handleReset = () => {
    const confirmed = window.confirm(
      'Da li ste sigurni da zelite da vratite sadrzaj na podrazumevane vrednosti? Sve izmene ce biti izgubljene.',
    );
    if (confirmed) {
      onReset();
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between rounded-2xl bg-cream-50/95 backdrop-blur-sm border border-sand-200 shadow-warm px-6 py-4">
      <Button
        onClick={onSave}
        variant="primary"
        disabled={saving}
        icon={
          saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />
        }
      >
        {saving ? 'Cuvanje...' : 'Sacuvaj promene'}
      </Button>

      <button
        type="button"
        onClick={handleReset}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full border-2 border-red-400 px-5 py-2.5 text-sm font-heading font-semibold text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-4 h-4" />
        Vrati na podrazumevano
      </button>
    </div>
  );
};

export default ContentEditorToolbar;
