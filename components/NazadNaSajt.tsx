import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Link nazad na sajt ispod kartica za prijavu i registraciju. Te strane
 * nemaju zaglavlje ni podnožje, pa bez ovoga sa njih nema izlaza osim
 * dugmeta „nazad" u pretraživaču.
 *
 * `<Link>` je ovde u redu: merenje se pokreće kad se uđe u layout javnih
 * strana. Obrnut smer (sa javne strane na /login) ide običnim <a>, da
 * skripte za merenje ne pređu na stranu naloga.
 */
const NazadNaSajt = () => (
  <Link
    href="/"
    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-navy-600 transition-colors"
  >
    <ArrowLeft size={15} aria-hidden="true" />
    Nazad na sajt
  </Link>
);

export default NazadNaSajt;
