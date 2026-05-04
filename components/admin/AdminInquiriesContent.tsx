'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  MailOpen,
  Phone,
  Clock,
  Briefcase,
  Target,
  MessageSquare,
} from 'lucide-react';
import { useInquiries } from '@/hooks/useInquiries';
import type { Inquiry } from '@/types/inquiry';

const serviceLabels: Record<string, string> = {
  homeConsultation: 'Konsultacija za dom',
  spaceDesign: 'Dizajn prostora',
  realEstate: 'Procena nekretnina',
  fengShuiSchool: 'Feng Shui škola',
  vazaIzobilja: 'Vaza Izobilja',
};

const goalLabels: Record<string, string> = {
  betterSleep: 'Bolji san',
  improvedRelationships: 'Bolji odnosi',
  increasedProsperity: 'Prosperitet',
  careerAdvancement: 'Karijera',
  betterHealth: 'Zdravlje',
  reducedStress: 'Manje stresa',
  improvedFocus: 'Fokus',
  familyHarmony: 'Porodična harmonija',
  spiritualGrowth: 'Duhovni rast',
  betterWorkLifeBalance: 'Balans',
};

const heardFromLabels: Record<string, string> = {
  friend: 'Preporuka prijatelja',
  search: 'Internet pretraga',
  social: 'Društvene mreže',
  event: 'Predavanje ili događaj',
  article: 'Članak ili publikacija',
  other: 'Drugo',
};

const homeTypeLabels: Record<string, string> = {
  apartment: 'Stan',
  house: 'Kuća',
  office: 'Poslovni prostor',
  newConstruction: 'Novogradnja',
  other: 'Drugo',
};

type StatusFilter = 'all' | 'new' | 'read';

const AdminInquiriesContent: React.FC = () => {
  const { inquiries, loading, markAsRead, markAsUnread, refreshInquiries } = useInquiries();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    refreshInquiries();
  }, [refreshInquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        inq.full_name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email.toLowerCase().includes(search.toLowerCase()) ||
        (serviceLabels[inq.service_type] || inq.service_type)
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, search, statusFilter]);

  const toggleExpand = (id: string, status: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (status === 'new') {
        markAsRead(id);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusBadge = (status: Inquiry['status']) => {
    const styles =
      status === 'new'
        ? 'bg-gold-50 text-gold-600'
        : 'bg-sand-100 text-charcoal-500';
    const label = status === 'new' ? 'Novo' : 'Pročitano';
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
        {label}
      </span>
    );
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-4 py-3 pl-10 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl md:text-3xl text-charcoal mb-8">Upiti</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Pretraži po imenu, emailu ili usluzi..."
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
          <option value="all">Svi upiti</option>
          <option value="new">Novi</option>
          <option value="read">Pročitani</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-cream-50 border border-sand-200 p-4">
          <p className="text-2xl font-heading font-bold text-charcoal">{inquiries.length}</p>
          <p className="text-sm text-charcoal-500">Ukupno upita</p>
        </div>
        <div className="rounded-xl bg-gold-50 border border-gold-200 p-4">
          <p className="text-2xl font-heading font-bold text-gold-600">
            {inquiries.filter((i) => i.status === 'new').length}
          </p>
          <p className="text-sm text-gold-600">Novih</p>
        </div>
        <div className="rounded-xl bg-cream-50 border border-sand-200 p-4">
          <p className="text-2xl font-heading font-bold text-charcoal">
            {inquiries.filter((i) => i.status === 'read').length}
          </p>
          <p className="text-sm text-charcoal-500">Pročitanih</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-500">Učitavanje...</div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-12 text-charcoal-500 bg-cream-50 rounded-xl border border-sand-200">
          {search || statusFilter !== 'all' ? 'Nema rezultata za zadatu pretragu.' : 'Nema upita.'}
        </div>
      ) : (
        <div className="rounded-xl border border-sand-200 overflow-hidden bg-cream-50">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-cream-100 border-b border-sand-200 text-xs font-heading font-semibold text-charcoal-500 uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-3">Ime</div>
            <div className="col-span-3">Usluga</div>
            <div className="col-span-2">Datum</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className={`border-b border-sand-200 last:border-b-0 transition-colors ${
                inq.status === 'new' ? 'bg-gold-50/30' : ''
              }`}
            >
              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 cursor-pointer hover:bg-cream-100/50 transition-colors"
                onClick={() => toggleExpand(inq.id, inq.status)}
              >
                <div className="hidden md:flex col-span-1 items-center">
                  {expandedId === inq.id ? (
                    <ChevronDown size={16} className="text-charcoal-500" />
                  ) : (
                    <ChevronRight size={16} className="text-charcoal-500" />
                  )}
                </div>
                <div className="col-span-3">
                  <p
                    className={`font-heading text-sm ${
                      inq.status === 'new'
                        ? 'font-semibold text-charcoal'
                        : 'font-medium text-charcoal'
                    }`}
                  >
                    {inq.full_name}
                  </p>
                  <p className="text-xs text-charcoal-500">{inq.email}</p>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-charcoal-500">
                    {serviceLabels[inq.service_type] || inq.service_type}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-charcoal-500">{formatDate(inq.created_at)}</span>
                </div>
                <div className="col-span-2 flex items-center">{statusBadge(inq.status)}</div>
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inq.status === 'new') markAsRead(inq.id);
                      else markAsUnread(inq.id);
                    }}
                    className="p-2 rounded-lg hover:bg-sand-100 transition-colors"
                    title={inq.status === 'new' ? 'Označi kao pročitano' : 'Označi kao novo'}
                  >
                    {inq.status === 'new' ? (
                      <MailOpen size={16} className="text-charcoal-500" />
                    ) : (
                      <Mail size={16} className="text-charcoal-500" />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === inq.id && (
                <div className="px-6 pb-6 pt-2 bg-cream-100/50 border-t border-sand-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-heading font-semibold text-charcoal flex items-center gap-2">
                        <Phone size={14} /> Kontakt informacije
                      </h4>
                      <div className="space-y-1 text-sm text-charcoal-500">
                        <p>
                          <span className="font-medium text-charcoal">Ime:</span> {inq.full_name}
                        </p>
                        <p>
                          <span className="font-medium text-charcoal">Email:</span> {inq.email}
                        </p>
                        {inq.phone && (
                          <p>
                            <span className="font-medium text-charcoal">Telefon:</span> {inq.phone}
                          </p>
                        )}
                        <p>
                          <span className="font-medium text-charcoal">Preferirani kontakt:</span>{' '}
                          {inq.preferred_contact === 'email' ? 'Email' : 'Telefon'}
                        </p>
                        {inq.preferred_time && (
                          <p>
                            <span className="font-medium text-charcoal">Preferirano vreme:</span>{' '}
                            {inq.preferred_time === 'morning'
                              ? 'Jutro'
                              : inq.preferred_time === 'afternoon'
                              ? 'Popodne'
                              : 'Veče'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-heading font-semibold text-charcoal flex items-center gap-2">
                        <Briefcase size={14} /> Usluga i prostor
                      </h4>
                      <div className="space-y-1 text-sm text-charcoal-500">
                        <p>
                          <span className="font-medium text-charcoal">Usluga:</span>{' '}
                          {serviceLabels[inq.service_type] || inq.service_type}
                        </p>
                        {inq.home_type && (
                          <p>
                            <span className="font-medium text-charcoal">Tip prostora:</span>{' '}
                            {homeTypeLabels[inq.home_type] || inq.home_type}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-heading font-semibold text-charcoal flex items-center gap-2">
                        <Target size={14} /> Ciljevi
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {inq.main_goals.map((goal) => (
                          <span
                            key={goal}
                            className="inline-block px-2.5 py-1 rounded-full bg-navy-50 text-navy-600 text-xs font-medium"
                          >
                            {goalLabels[goal] || goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-heading font-semibold text-charcoal flex items-center gap-2">
                        <MessageSquare size={14} /> Dodatne informacije
                      </h4>
                      <div className="space-y-1 text-sm text-charcoal-500">
                        {inq.heard_from && (
                          <p>
                            <span className="font-medium text-charcoal">Kako su čuli:</span>{' '}
                            {heardFromLabels[inq.heard_from] || inq.heard_from}
                          </p>
                        )}
                        {inq.challenges && (
                          <div>
                            <p className="font-medium text-charcoal">Izazovi:</p>
                            <p className="mt-1 p-3 rounded-lg bg-cream-50 border border-sand-200">
                              {inq.challenges}
                            </p>
                          </div>
                        )}
                        {inq.additional_info && (
                          <div>
                            <p className="font-medium text-charcoal">Dodatno:</p>
                            <p className="mt-1 p-3 rounded-lg bg-cream-50 border border-sand-200">
                              {inq.additional_info}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-sand-200 flex items-center gap-2 text-xs text-charcoal-500">
                    <Clock size={12} />
                    Primljeno: {formatDate(inq.created_at)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesContent;
