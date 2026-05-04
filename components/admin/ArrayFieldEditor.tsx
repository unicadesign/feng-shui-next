'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface ArrayFieldEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  addItem: () => T;
  label: string;
}

function ArrayFieldEditor<T>({ items, onChange, renderItem, addItem, label }: ArrayFieldEditorProps<T>) {
  const handleAdd = () => {
    onChange([...items, addItem()]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updatedItem: T) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onChange(newItems);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-body font-semibold text-charcoal">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-navy-500 px-4 py-1.5 text-sm font-heading font-semibold text-navy-600 hover:bg-navy-50 active:bg-navy-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Dodaj
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm font-body text-charcoal-500/60 italic py-4 text-center">
          Nema stavki. Kliknite &quot;Dodaj&quot; da dodate novu.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-sand-200 bg-white p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy-500/10 text-xs font-heading font-semibold text-navy-600">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="inline-flex items-center gap-1 text-xs font-body text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Ukloni
              </button>
            </div>
            {renderItem(item, index, (updatedItem) => handleUpdate(index, updatedItem))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArrayFieldEditor;
