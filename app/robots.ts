import type { MetadataRoute } from 'next';
import portfolioData from '@/data/portfolio.json';

const BASE = `https://${portfolioData.profile.website
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
