import { getContent } from '@/lib/content';

export default async function HomePage() {
  const home = await getContent('home');

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-heading uppercase tracking-[0.2em] text-navy-500 mb-4">
          {home.hero.badge}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
          ptPLAN — Next.js migration in progress
        </h1>
        <p className="text-charcoal-500 text-lg leading-relaxed">
          Header and footer are wired up to the live <code>site_content</code> table.
          The real homepage lands in Phase 6.
        </p>
      </div>
    </main>
  );
}
