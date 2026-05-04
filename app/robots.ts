import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ptplan.rs';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/dashboard', '/dashboard/', '/course', '/course/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
