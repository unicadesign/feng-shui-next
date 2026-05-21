import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://draganajovic.com';

const publicRoutes = [
  '',
  'about',
  'school',
  'vaza-izobilja',
  'upitnik',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((path) => ({
    url: `${BASE_URL}/${path}`.replace(/\/$/, '') || BASE_URL,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));
}
