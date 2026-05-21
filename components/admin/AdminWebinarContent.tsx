'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  MailOpen,
  Phone,
  MapPin,
  Cake,
  MessageSquare,
  Trash2,
  Download,
} from 'lucide-react';
import { useWebinar } from '@/hooks/useWebinar';
import type { WebinarRegistration } from '@/types/webinar';

type StatusFilter = 'all' | 'new' | 'read';

const AdminWebinarContent: React.FC = () => {
  const { registrations, loading, refreshRegistrations, markAsRead, markAsUnread, deleteRegistration } = useWebinar();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    refreshRegistrations();
  }, [refreshRegistrations]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.city || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const toggleExpand = (id: string, status: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (status === 'new') markAsRead(id);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatBirth = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

  const statusBadge = (status: WebinarRegistration['status']) => {
    const styles = status === 'new' ? 'bg-gold-50 text-gold-600' : 'bg-sand-100 text-charcoal-500';
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
        {status === 'new' ? 'Novo' : 'Pročitano'}
      </span>
    );
  };

  const exportCsv = () => {
    const header = ['Ime i prezime', 'Email', 'Telefon', 'Mesto', 'Datum rođenja', 'Napomena', 'Status', 'Prijavljen'];
    const rows = [
      header,
      ...registrations.map((r) => [
        r.full_name, r.email, r.phone || '', r.city || '', formatBirth(r.birth_date), r.note || '', r.status, formatDate(r.created_at),
      ]),
    ];
    const csv = rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vebinar-prijave-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 pl-10 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">Vebinar prijave</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Pretraži po imenu, emailu ili mestu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors"
        >
          <option value="all">Sve prijave</option>
          <option value="new">Nove</option>
          <option value="read">Pročitane</option>
        </select>
        <button
          onClick={exportCsv}
          disabled={registrations.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-500 text-white px-5 py-3 text-sm font-heading font-semibold hover:bg-navy-600 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-cream-50 border border-sand-200 p-4">
          <p className="text-2xl font-heading font-bold text-charcoal">{registrations.length}</p>
          <p className="text-sm text-charcoal-500">Ukupno</p>
        </div>
        <div className="rounded-xl bg-gold-50 border border-gold-200 p-4">
          <p className="text-2xl font-heading font-bold text-gold-600">{registrations.filter((r) => r.status === 'new').length}</p>
          <p className="text-sm text-gold-600">Nove</p>
        </div>
        <div className="rounded-xl bg-cream-50 border border-sand-200 p-4">
          <p className="text-2xl font-heading font-bold text-charcoal">{registrations.filter((r) => r.status === 'read').length}</p>
          <p className="text-sm text-charcoal-500">Pročitane</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-500">Učitavanje...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-charcoal-500 bg-cream-50 rounded-xl border border-sand-200">
          {search || statusFilter !== 'all' ? 'Nema rezultata za zadatu pretragu.' : 'Još nema prijava za vebinar.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const expanded = expandedId === r.id;
            return (
              <div key={r.id} className="rounded-xl border border-sand-200 bg-white overflow-hidden">
                <button
                  onClick={() => toggleExpand(r.id, r.status)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cream-50 transition-colors"
                >
                  {expanded ? <ChevronDown className="w-4 h-4 text-charcoal-400" /> : <ChevronRight className="w-4 h-4 text-charcoal-400" />}
                  <span className="flex-1 font-body font-medium text-charcoal truncate">{r.full_name}</span>
                  <span className="text-xs text-charcoal-500 hidden md:block truncate max-w-[180px]">{r.email}</span>
                  <span className="text-xs text-charcoal-500 hidden lg:block">{formatDate(r.created_at)}</span>
                  {statusBadge(r.status)}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-sand-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body text-charcoal-600">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-navy-400" /> {r.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-navy-400" /> {r.phone || '—'}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-navy-400" /> {r.city || '—'}</p>
                    <p className="flex items-center gap-2"><Cake className="w-4 h-4 text-navy-400" /> {formatBirth(r.birth_date)}</p>
                    {r.note && <p className="flex items-start gap-2 sm:col-span-2"><MessageSquare className="w-4 h-4 text-navy-400 mt-0.5" /> {r.note}</p>}
                    <div className="sm:col-span-2 flex gap-2 pt-2">
                      <button
                        onClick={() => (r.status === 'new' ? markAsRead(r.id) : markAsUnread(r.id))}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 px-3 py-1.5 text-xs hover:bg-cream-50 transition-colors"
                      >
                        {r.status === 'new' ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                        {r.status === 'new' ? 'Označi pročitano' : 'Označi novo'}
                      </button>
                      <button
                        onClick={() => deleteRegistration(r.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-500 px-3 py-1.5 text-xs hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Obriši
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminWebinarContent;
