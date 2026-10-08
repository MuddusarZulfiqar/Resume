import type { MetadataRoute } from 'next';
import portfolioData from '@/data/portfolio.json';

const BASE = `https://${portfolioData.profile.website
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/experience', '/skills', '/project', '/playground'];
  const posts = [
    '/blog',
    '/blog/how-rag-works',
    '/blog/how-jwt-works',
    '/blog/how-sessions-work',
    '/blog/how-cicd-works',
    '/blog/how-redis-caching-works',
    '/blog/how-to-use-redis-in-nodejs',
  ];

  return [
    ...routes.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...posts.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '/blog' ? 0.8 : 0.9,
    })),
  ];
}
