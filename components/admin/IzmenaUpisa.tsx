'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { Enrollment, EnrollmentStatus, PaymentStatus, PaymentType, ZoomOption } from '@/types';
import type { IzmenaUpisaParams } from '@/context/EnrollmentContext';

interface NacrtRate {
  /** Nema ga dok se nova rata ne sačuva. */
  id?: string;
  month: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
}

interface Props {
  enrollment: Enrollment;
  onSave: (params: IzmenaUpisaParams) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

const poljeClasses =
  'rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm font-body text-charcoal focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';
const inputClasses = `w-full ${poljeClasses}`;

const labelClasses = 'block text-xs font-body font-semibold text-charcoal mb-1';

/**
 * Izmena postojećeg upisa (11.11.2026.). Do sada je upis mogao samo da se
 * napravi; ako je napravljen sa pogrešnim brojem rata, polaznica nije mogla
 * da dobije nedelju 5, jer rata 2 nije postojala.
 *
 * Sve izmene se prvo prave u nacrtu i idu u bazu tek na „Sačuvaj izmene";
 * „Otkaži" vraća sve kako je bilo.
 *
 * Rata `month` određuje koje nedelje otključava (pravilo u bazi i u
 * `LessonList.tsx`): rata 1 nedelje 1–4, rata 2 nedelje 5–8 itd. Nova rata
 * zato dobija prvi sledeći broj, a postojeće zadržavaju svoj.
 */
const IzmenaUpisa: React.FC<Props> = ({ enrollment, onSave, onClose }) => {
  const [startDate, setStartDate] = useState(enrollment.startDate.slice(0, 10));
  const [paymentType, setPaymentType] = useState<PaymentType>(enrollment.paymentType);
  const [zoomOption, setZoomOption] = useState<ZoomOption>(enrollment.zoomOption);
  const [status, setStatus] = useState<EnrollmentStatus>(enrollment.status);
  const [rate, setRate] = useState<NacrtRate[]>(() =>
    [...enrollment.payments]
      .sort((a, b) => a.month - b.month)
      .map((p) => ({ id: p.id, month: p.month, amount: p.amount, status: p.status, paidAt: p.paidAt })),
  );
  const [cuvanje, setCuvanje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);

  const naRate = paymentType === 'installment';

  const izmeniRatu = (month: number, izmena: Partial<NacrtRate>) =>
    setRate((r) => r.map((x) => (x.month === month ? { ...x, ...izmena } : x)));

  const dodajRatu = () =>
    setRate((r) => {
      const poslednja = r[r.length - 1];
      return [
        ...r,
        {
          month: (poslednja?.month ?? 0) + 1,
          amount: poslednja?.amount ?? 0,
          status: 'pending',
        },
      ];
    });

  const obrisiRatu = (month: number) => setRate((r) => r.filter((x) => x.month !== month));

  const sacuvaj = async () => {
    setGreska(null);
    if (!startDate) {
      setGreska('Unesite datum početka.');
      return;
    }
    if (rate.length === 0) {
      setGreska('Upis mora imati bar jednu uplatu.');
      return;
    }
    if (rate.some((r) => !(r.amount > 0))) {
      setGreska('Iznos svake rate mora biti veći od 0.');
      return;
    }

    const sada = new Date().toISOString();
    // Plaćena rata zadržava stari datum uplate; tek označena dobija današnji.
    const datumUplate = (r: NacrtRate, bilaPlacena: boolean) =>
      r.status !== 'paid' ? null : bilaPlacena && r.paidAt ? r.paidAt : sada;

    const izmenjeneRate: IzmenaUpisaParams['izmenjeneRate'] = [];
    const noveRate: IzmenaUpisaParams['noveRate'] = [];
    for (const r of rate) {
      if (!r.id) {
        noveRate.push({ month: r.month, amount: r.amount, status: r.status, paid_at: datumUplate(r, false) });
        continue;
      }
      const stara = enrollment.payments.find((p) => p.id === r.id);
      if (!stara || stara.amount !== r.amount || stara.status !== r.status) {
        izmenjeneRate.push({
          id: r.id,
          amount: r.amount,
          status: r.status,
          paid_at: datumUplate(r, stara?.status === 'paid'),
        });
      }
    }
    const obrisaneRate = enrollment.payments
      .filter((p) => !rate.some((r) => r.id === p.id))
      .map((p) => p.id);

    const upisSePromenio =
      startDate !== enrollment.startDate.slice(0, 10) ||
      paymentType !== enrollment.paymentType ||
      zoomOption !== enrollment.zoomOption ||
      status !== enrollment.status;

    if (!upisSePromenio && !izmenjeneRate.length && !noveRate.length && !obrisaneRate.length) {
      onClose();
      return;
    }

    setCuvanje(true);
    const rezultat = await onSave({
      upis: upisSePromenio
        ? { start_date: startDate, payment_type: paymentType, zoom_option: zoomOption, status }
        : null,
      izmenjeneRate,
      noveRate,
      obrisaneRate,
    });
    setCuvanje(false);
    if (!rezultat.success) {
      setGreska(`Izmene nisu sačuvane do kraja: ${rezultat.error || 'nepoznata greška'}. Proverite upis.`);
      return;
    }
    onClose();
  };

  return (
    <div className="rounded-xl bg-cream-50 border border-sand-200 p-4 space-y-4">
      <p className="text-xs font-body font-semibold text-charcoal-500 uppercase tracking-wider">Izmena upisa</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClasses}>Datum početka</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Tip plaćanja</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className={inputClasses}
          >
            <option value="full">Jednokratno</option>
            <option value="installment">Na rate</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Zoom opcija</label>
          <select
            value={zoomOption}
            onChange={(e) => setZoomOption(e.target.value as ZoomOption)}
            className={inputClasses}
          >
            <option value="none">Bez Zoom-a</option>
            <option value="single">Jedan poziv</option>
            <option value="weekly">Nedeljno</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Status upisa</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EnrollmentStatus)}
            className={inputClasses}
          >
            <option value="active">Aktivan</option>
            <option value="paused">Pauziran</option>
            <option value="completed">Završen</option>
          </select>
        </div>
      </div>

      <div>
        <p className={labelClasses}>{naRate ? 'Rate' : 'Uplata'}</p>
        <div className="space-y-2">
          {rate.map((r) => (
            <div key={r.month} className="flex items-center gap-2">
              <span className="w-16 flex-shrink-0 text-sm font-body text-charcoal">
                {naRate ? `Rata ${r.month}` : rate.length > 1 ? `Uplata ${r.month}` : 'Uplata'}
              </span>
              <input
                type="number"
                min={0}
                aria-label={`Iznos, rata ${r.month}`}
                value={r.amount}
                onChange={(e) => izmeniRatu(r.month, { amount: Number(e.target.value) })}
                className={`${poljeClasses} flex-1 min-w-0`}
              />
              <select
                aria-label={`Status, rata ${r.month}`}
                value={r.status}
                onChange={(e) => izmeniRatu(r.month, { status: e.target.value as PaymentStatus })}
                className={`${poljeClasses} w-36 flex-shrink-0`}
              >
                <option value="paid">Plaćeno</option>
                <option value="pending">Na čekanju</option>
                <option value="overdue">Kasni</option>
              </select>
              <button
                type="button"
                onClick={() => obrisiRatu(r.month)}
                disabled={rate.length <= 1}
                title="Obriši ratu"
                aria-label={`Obriši ratu ${r.month}`}
                className="flex-shrink-0 p-2 rounded-lg text-charcoal-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {naRate && (
          <>
            <button
              type="button"
              onClick={dodajRatu}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-500 text-navy-600 text-sm font-body hover:bg-navy-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj ratu
            </button>
            <p className="mt-2 text-xs font-body text-charcoal-500">
              Rata 1 otključava nedelje 1–4, rata 2 nedelje 5–8, rata 3 nedelje 9–12 i tako dalje. Nedelje
              se otvaraju tek kad je njihova rata označena kao plaćena.
            </p>
          </>
        )}
      </div>

      {greska && <p className="text-sm text-red-600">{greska}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={sacuvaj}
          disabled={cuvanje}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-500 text-white text-sm font-body hover:bg-navy-600 transition-colors disabled:opacity-60"
        >
          {cuvanje && <Loader2 className="w-4 h-4 animate-spin" />}
          Sačuvaj izmene
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={cuvanje}
          className="px-4 py-2 rounded-xl bg-sand-200 text-charcoal text-sm font-body hover:bg-sand-300 transition-colors disabled:opacity-60"
        >
          Otkaži
        </button>
      </div>
    </div>
  );
};

export default IzmenaUpisa;
