'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, Video, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import type { Enrollment } from '@/types';

type StatusFilter = 'all' | 'active' | 'completed';

const AdminEnrollmentsContent: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { courses } = useCourses();
  const {
    enrollments,
    addZoomLink: addZoomLinkCtx,
    addEnrollment,
    updatePaymentStatus,
  } = useEnrollments();

  const [zoomForms, setZoomForms] = useState<
    Record<string, { weekNumber: number; url: string; scheduledAt: string }>
  >({});

  const [allUsers, setAllUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .order('name', { ascending: true })
      .then(({ data }) => {
        if (data) {
          const list = data as Array<{ id: string; name: string }>;
          setAllUsers(list);
          const map: Record<string, string> = {};
          list.forEach((p) => {
            map[p.id] = p.name;
          });
          setUserNames(map);
        }
      });
  }, []);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const initialCreateForm = {
    userId: '',
    courseId: '',
    paymentType: 'full' as 'full' | 'installment',
    zoomOption: 'none' as 'none' | 'single' | 'weekly',
    startDate: today,
    amount: 0,
    installmentMonths: 4,
    markAsPaid: true,
  };
  const [createForm, setCreateForm] = useState(initialCreateForm);

  useEffect(() => {
    if (!createForm.courseId) return;
    const course = courses.find((c) => c.id === createForm.courseId);
    if (!course) return;
    if (createForm.paymentType === 'full') {
      setCreateForm((f) => ({ ...f, amount: course.price ?? 0 }));
    } else {
      setCreateForm((f) => ({
        ...f,
        amount: course.installmentPrice ?? 0,
        installmentMonths: course.installmentMonths ?? 4,
      }));
    }
  }, [createForm.courseId, createForm.paymentType, courses]);

  const submitCreateEnrollment = async () => {
    setCreateError(null);
    if (!createForm.userId || !createForm.courseId) {
      setCreateError('Izaberite korisnika i kurs.');
      return;
    }
    if (createForm.amount <= 0) {
      setCreateError('Iznos mora biti veći od 0.');
      return;
    }
    setCreating(true);
    const result = await addEnrollment({
      userId: createForm.userId,
      courseId: createForm.courseId,
      paymentType: createForm.paymentType,
      zoomOption: createForm.zoomOption,
      startDate: createForm.startDate,
      amount: createForm.amount,
      installmentMonths:
        createForm.paymentType === 'installment' ? createForm.installmentMonths : undefined,
      markAsPaid: createForm.markAsPaid,
    });
    setCreating(false);
    if (!result.success) {
      setCreateError(result.error || 'Greška pri kreiranju upisa.');
      return;
    }
    setShowCreateForm(false);
    setCreateForm(initialCreateForm);
  };

  const getUserName = (userId: string) => userNames[userId] || 'Nepoznat';
  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.title || 'Nepoznat';

  const filteredEnrollments = enrollments.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getOverallPaymentStatus = (enrollment: Enrollment) => {
    const statuses = enrollment.payments.map((p) => p.status);
    if (statuses.includes('overdue')) return 'overdue';
    if (statuses.includes('pending')) return 'pending';
    return 'paid';
  };

  const paymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-navy-50 text-navy-600',
      pending: 'bg-gold-50 text-gold-600',
      overdue: 'bg-red-50 text-red-600',
    };
    const labels: Record<string, string> = {
      paid: 'Plaćeno',
      pending: 'Na čekanju',
      overdue: 'Kasni',
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const enrollmentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-navy-50 text-navy-600',
      completed: 'bg-gold-50 text-gold-600',
      paused: 'bg-sand-200 text-charcoal-500',
    };
    const labels: Record<string, string> = {
      active: 'Aktivan',
      completed: 'Završen',
      paused: 'Pauziran',
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const zoomOptionLabel = (opt: string) => {
    const labels: Record<string, string> = {
      none: 'Bez Zoom-a',
      single: 'Jedan poziv',
      weekly: 'Nedeljno',
    };
    return labels[opt] || opt;
  };

  const paymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full: 'Jednokratno',
      installment: 'Na rate',
    };
    return labels[type] || type;
  };

  const initZoomForm = (enrollmentId: string) => {
    if (!zoomForms[enrollmentId]) {
      setZoomForms((prev) => ({
        ...prev,
        [enrollmentId]: { weekNumber: 1, url: '', scheduledAt: '' },
      }));
    }
  };

  const updateZoomForm = (enrollmentId: string, field: string, value: string | number) => {
    setZoomForms((prev) => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], [field]: value },
    }));
  };

  const addZoomLink = async (enrollmentId: string) => {
    const form = zoomForms[enrollmentId];
    if (!form || !form.url || !form.scheduledAt) return;

    await addZoomLinkCtx(enrollmentId, {
      week_number: form.weekNumber,
      url: form.url,
      scheduled_at: form.scheduledAt,
    });

    setZoomForms((prev) => ({
      ...prev,
      [enrollmentId]: { weekNumber: 1, url: '', scheduledAt: '' },
    }));
  };

  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl md:text-3xl text-charcoal">Upisi i plaćanja</h1>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? 'Otkaži' : 'Dodaj upis'}
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-2xl bg-cream-50 shadow-card p-6 mb-6 border border-sand-200">
          <h2 className="font-heading text-lg text-charcoal mb-4">Novi upis (ručno)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">Korisnik</label>
              <select
                value={createForm.userId}
                onChange={(e) => setCreateForm((f) => ({ ...f, userId: e.target.value }))}
                className={inputClasses}
              >
                <option value="">— Izaberite korisnika —</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">Kurs</label>
              <select
                value={createForm.courseId}
                onChange={(e) => setCreateForm((f) => ({ ...f, courseId: e.target.value }))}
                className={inputClasses}
              >
                <option value="">— Izaberite kurs —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">Tip plaćanja</label>
              <select
                value={createForm.paymentType}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, paymentType: e.target.value as 'full' | 'installment' }))
                }
                className={inputClasses}
              >
                <option value="full">Jednokratno</option>
                <option value="installment">Na rate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">Zoom opcija</label>
              <select
                value={createForm.zoomOption}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, zoomOption: e.target.value as 'none' | 'single' | 'weekly' }))
                }
                className={inputClasses}
              >
                <option value="none">Bez Zoom-a</option>
                <option value="single">Jedan poziv</option>
                <option value="weekly">Nedeljno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">Datum početka</label>
              <input
                type="date"
                value={createForm.startDate}
                onChange={(e) => setCreateForm((f) => ({ ...f, startDate: e.target.value }))}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-xs font-body font-semibold text-charcoal mb-1">
                {createForm.paymentType === 'full' ? 'Ukupan iznos (€)' : 'Iznos po mesecu (€)'}
              </label>
              <input
                type="number"
                min={0}
                value={createForm.amount}
                onChange={(e) => setCreateForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                className={inputClasses}
              />
            </div>

            {createForm.paymentType === 'installment' && (
              <div>
                <label className="block text-xs font-body font-semibold text-charcoal mb-1">Broj rata</label>
                <input
                  type="number"
                  min={1}
                  value={createForm.installmentMonths}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, installmentMonths: Number(e.target.value) }))
                  }
                  className={inputClasses}
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={createForm.markAsPaid}
              onChange={(e) => setCreateForm((f) => ({ ...f, markAsPaid: e.target.checked }))}
              className="w-4 h-4 rounded border-sand-300 text-navy-500 focus:ring-navy-500"
            />
            <span className="text-sm font-body text-charcoal">
              Označi {createForm.paymentType === 'installment' ? 'sve rate' : 'plaćanje'} kao plaćeno
              <span className="text-charcoal-500 ml-1">(za korisnike koji su platili van sajta)</span>
            </span>
          </label>

          {createError && <p className="text-sm text-red-600 mb-3">{createError}</p>}

          <div className="flex items-center gap-2">
            <button
              onClick={submitCreateEnrollment}
              disabled={creating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors disabled:opacity-60"
            >
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Sačuvaj upis
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setCreateForm(initialCreateForm);
                setCreateError(null);
              }}
              className="px-4 py-2 rounded-xl bg-sand-200 text-charcoal text-sm font-body hover:bg-sand-300 transition-colors"
            >
              Otkaži
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'completed'] as StatusFilter[]).map((status) => {
          const labels: Record<StatusFilter, string> = {
            all: 'Svi',
            active: 'Aktivni',
            completed: 'Završeni',
          };
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-body transition-all ${
                statusFilter === status
                  ? 'bg-navy-500 text-white'
                  : 'bg-sand-200 text-charcoal hover:bg-sand-300'
              }`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-cream-50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-charcoal-500 border-b border-sand-200">
                <th className="px-6 py-4 font-semibold w-8"></th>
                <th className="px-6 py-4 font-semibold">Korisnik</th>
                <th className="px-6 py-4 font-semibold">Kurs</th>
                <th className="px-6 py-4 font-semibold">Datum početka</th>
                <th className="px-6 py-4 font-semibold">Tip plaćanja</th>
                <th className="px-6 py-4 font-semibold">Zoom opcija</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment, i) => {
                const isExpanded = expandedId === enrollment.id;
                const overallStatus = getOverallPaymentStatus(enrollment);

                return (
                  <React.Fragment key={enrollment.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        toggleExpand(enrollment.id);
                        initZoomForm(enrollment.id);
                      }}
                      className="border-b border-sand-100 hover:bg-cream-100/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-charcoal-500">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-charcoal font-semibold">
                        {getUserName(enrollment.userId)}
                      </td>
                      <td className="px-6 py-4 text-charcoal">{getCourseName(enrollment.courseId)}</td>
                      <td className="px-6 py-4 text-charcoal-500">
                        {new Date(enrollment.startDate).toLocaleDateString('sr-RS')}
                      </td>
                      <td className="px-6 py-4 text-charcoal-500">
                        {paymentTypeLabel(enrollment.paymentType)}
                      </td>
                      <td className="px-6 py-4 text-charcoal-500">
                        {zoomOptionLabel(enrollment.zoomOption)}
                      </td>
                      <td className="px-6 py-4">{paymentStatusBadge(overallStatus)}</td>
                    </motion.tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-cream-100/30 px-6 py-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="w-4 h-4 text-charcoal-500" />
                                <h3 className="text-sm font-body font-semibold text-charcoal">Plaćanja</h3>
                              </div>
                              <div className="space-y-2">
                                {enrollment.payments.map((payment) => (
                                  <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-cream-50"
                                  >
                                    <div>
                                      <span className="text-sm font-body text-charcoal">
                                        Mesec {payment.month}
                                      </span>
                                      <span className="text-sm font-body text-charcoal-500 ml-2">
                                        — {payment.amount}€
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {payment.paidAt && (
                                        <span className="text-xs font-body text-charcoal-500">
                                          {new Date(payment.paidAt).toLocaleDateString('sr-RS')}
                                        </span>
                                      )}
                                      {paymentStatusBadge(payment.status)}
                                      {payment.status !== 'paid' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updatePaymentStatus(payment.id, 'paid');
                                          }}
                                          className="text-xs font-body px-2 py-1 rounded-lg bg-navy-500 text-white hover:bg-navy-600 transition-colors"
                                        >
                                          Označi plaćeno
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 pt-3 border-t border-sand-200">
                                <div className="flex justify-between text-sm font-body">
                                  <span className="text-charcoal-500">Status upisa:</span>
                                  {enrollmentStatusBadge(enrollment.status)}
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Video className="w-4 h-4 text-charcoal-500" />
                                <h3 className="text-sm font-body font-semibold text-charcoal">
                                  Zoom linkovi
                                </h3>
                              </div>

                              {enrollment.zoomLinks && enrollment.zoomLinks.length > 0 ? (
                                <div className="space-y-2 mb-4">
                                  {enrollment.zoomLinks.map((link, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 rounded-xl bg-cream-50"
                                    >
                                      <div>
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy-500 text-white text-xs font-bold mr-2">
                                          {link.weekNumber}
                                        </span>
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-body text-navy-500 hover:text-navy-600 underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {link.url.length > 30
                                            ? link.url.substring(0, 30) + '...'
                                            : link.url}
                                        </a>
                                      </div>
                                      <span className="text-xs font-body text-charcoal-500">
                                        {new Date(link.scheduledAt).toLocaleDateString('sr-RS')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm font-body text-charcoal-500 mb-4">
                                  Nema Zoom linkova.
                                </p>
                              )}

                              {enrollment.zoomOption !== 'none' && (
                                <div className="p-4 rounded-xl bg-cream-50 border border-sand-200 space-y-3">
                                  <p className="text-xs font-body font-semibold text-charcoal-500 uppercase tracking-wider">
                                    Novi Zoom link
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs font-body text-charcoal-500 mb-1">
                                        Nedelja
                                      </label>
                                      <input
                                        type="number"
                                        min={1}
                                        value={zoomForms[enrollment.id]?.weekNumber || 1}
                                        onChange={(e) =>
                                          updateZoomForm(enrollment.id, 'weekNumber', Number(e.target.value))
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className={inputClasses}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-xs font-body text-charcoal-500 mb-1">
                                        URL
                                      </label>
                                      <input
                                        type="text"
                                        value={zoomForms[enrollment.id]?.url || ''}
                                        onChange={(e) => updateZoomForm(enrollment.id, 'url', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="https://zoom.us/j/..."
                                        className={inputClasses}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-body text-charcoal-500 mb-1">
                                      Datum i vreme
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={zoomForms[enrollment.id]?.scheduledAt || ''}
                                      onChange={(e) =>
                                        updateZoomForm(enrollment.id, 'scheduledAt', e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className={inputClasses}
                                    />
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addZoomLink(enrollment.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Dodaj Zoom link
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-charcoal-500">Nema upisa koji odgovaraju filteru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollmentsContent;
