import type { MetadataRoute } from 'next';
import portfolioData from '@/data/portfolio.json';

const BASE = `https://${portfolioData.profile.website
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/experience', '/skills', '/project', '/playground'];

  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
