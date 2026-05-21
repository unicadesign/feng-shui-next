'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trash2, Download, Mail } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';

const AdminNewsletterContent: React.FC = () => {
  const { subscribers, loading, refreshSubscribers, deleteSubscriber } = useNewsletter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    refreshSubscribers();
  }, [refreshSubscribers]);

  const filtered = useMemo(
    () => subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase())),
    [subscribers, search],
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const exportCsv = () => {
    const rows = [['Email', 'Datum prijave'], ...subscribers.map((s) => [s.email, formatDate(s.created_at)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 pl-10 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">Newsletter pretplate</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Pretraži po emailu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
          />
        </div>
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-500 text-white px-5 py-3 text-sm font-heading font-semibold hover:bg-navy-600 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Izvezi CSV
        </button>
      </div>

      <div className="rounded-xl bg-cream-50 border border-sand-200 p-4 mb-6 inline-block min-w-[200px]">
        <p className="text-2xl font-heading font-bold text-charcoal">{subscribers.length}</p>
        <p className="text-sm text-charcoal-500">Ukupno pretplatnika</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-500">Učitavanje...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-charcoal-500 bg-cream-50 rounded-xl border border-sand-200">
          {search ? 'Nema rezultata za zadatu pretragu.' : 'Još nema prijava na newsletter.'}
        </div>
      ) : (
        <div className="rounded-xl border border-sand-200 overflow-hidden">
          {filtered.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-cream-50' : 'bg-white'}`}
            >
              <Mail className="w-4 h-4 text-navy-400 flex-shrink-0" />
              <span className="flex-1 text-sm font-body text-charcoal truncate">{s.email}</span>
              <span className="text-xs text-charcoal-500 hidden sm:block">{formatDate(s.created_at)}</span>
              <button
                onClick={() => deleteSubscriber(s.id)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Obriši"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterContent;
