import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-navy-50">
          <Compass size={40} className="text-navy-500" />
        </div>

        <h1 className="text-4xl font-heading font-semibold text-charcoal mb-4">
          Stranica nije pronađena
        </h1>

        <p className="text-lg text-charcoal-500 mb-8">
          Izgleda da se energija izgubila na putu. Vratimo vas na pravi put.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-navy-500 text-white rounded-full hover:bg-navy-600 transition-all duration-300 ease-out-expo font-heading font-semibold"
          >
            Nazad na početnu
          </Link>
          <Link
            href="/upitnik"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-navy-500 text-navy-600 rounded-full hover:bg-navy-50 transition-all duration-300 ease-out-expo font-heading font-semibold"
          >
            Kontaktirajte nas
          </Link>
        </div>
      </div>
    </div>
  );
}
