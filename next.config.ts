import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fnurxiqwysbribekrlnr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "fnurxiqwysbribekrlnr.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy alias from the Vite app — /payment was a placeholder that
      // pointed at the inquiry questionnaire. Preserve so old links don't 404.
      {
        source: '/payment',
        destination: '/upitnik',
        permanent: true,
      },
      // Adrese sa kojih je klijent pregledao redizajn („verzija C", 08.-09.2026.).
      // Produkcija ih nikad nije služila, a preview deploymenti su noindex,
      // pa ovo nije SEO nego ljubaznost: linkovi iz prepiske ne smeju u 404.
      { source: '/pocetna-c', destination: '/', permanent: true },
      { source: '/skola-c', destination: '/school', permanent: true },
      { source: '/o-meni-c', destination: '/about', permanent: true },
      { source: '/kontakt-c', destination: '/upitnik', permanent: true },
      { source: '/uplata-c', destination: '/uplata', permanent: true },
      { source: '/hvala-c', destination: '/hvala', permanent: true },
      // Strane starog sajta ugašene pri prelasku (PLAN-PRELAZAK.md, 0.5 i 0.6).
      // /vaza-izobilja je bila u sitemap-u; ostale tri su i ranije javno
      // vraćale na početnu, pa posetilac ne primećuje razliku.
      { source: '/vaza-izobilja', destination: '/', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/vodic', destination: '/', permanent: true },
      { source: '/galerija', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
