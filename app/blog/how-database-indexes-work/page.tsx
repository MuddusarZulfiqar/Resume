import type { Metadata } from 'next';
import DatabaseIndexContent from '@/components/blog/posts/DatabaseIndexContent';
import { blogPostingJsonLd, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How Database Indexes Work — Table Scans vs. B-Trees Explained';
const DESCRIPTION =
  'How do database indexes actually work? A beginner-friendly, animated walkthrough of a full table scan vs. an indexed B-tree lookup, the write-cost tradeoff, and when to actually add one.';
const SLUG = 'how-database-indexes-work';
const PUBLISHED = '2026-10-12';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how database indexes work',
    'what is a database index',
    'b-tree index explained',
    'table scan vs index',
    'sql index for beginners',
    'why is my query slow',
    'database indexing tutorial',
    'explain analyze sql',
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

export default function DatabaseIndexPage() {
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
      <DatabaseIndexContent />
    </>
  );
}
