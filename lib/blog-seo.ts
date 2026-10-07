import portfolioData from '@/data/portfolio.json';

const { profile } = portfolioData;

export const SITE_URL = `https://${profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

export function blogPostingJsonLd({
  slug,
  headline,
  description,
  datePublished,
}: {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline,
    description,
    url,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    publisher: { '@type': 'Person', name: profile.name, url: SITE_URL },
    image: `${SITE_URL}/opengraph-image`,
  };
}
