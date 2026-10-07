import type { Metadata } from 'next';
import CicdContent from '@/components/blog/posts/CicdContent';
import { blogPostingJsonLd, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How CI/CD Works — From Git Push to Production, Explained for Beginners';
const DESCRIPTION =
  'How does a CI/CD pipeline actually work? A beginner-friendly, animated walkthrough: what runs on every push, what ships after merge, and why automation beats manual deploys.';
const SLUG = 'how-cicd-works';
const PUBLISHED = '2026-10-07';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how CI/CD works',
    'what is CI/CD',
    'continuous integration explained',
    'continuous deployment explained',
    'CI/CD pipeline tutorial',
    'CI/CD for beginners',
    'GitHub Actions pipeline',
    'DevOps pipeline explained',
  ],
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    type: 'article',
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    publishedTime: PUBLISHED,
  },
};

export default function CicdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingJsonLd({ slug: SLUG, headline: TITLE, description: DESCRIPTION, datePublished: PUBLISHED })
          ),
        }}
      />
      <CicdContent />
    </>
  );
}
