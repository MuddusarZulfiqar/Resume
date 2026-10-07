import type { Metadata } from 'next';
import RagContent from '@/components/blog/posts/RagContent';
import { blogPostingJsonLd, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How RAG Works — Retrieval-Augmented Generation Explained for Beginners';
const DESCRIPTION =
  'How does RAG actually work? A beginner-friendly, animated walkthrough of Retrieval-Augmented Generation: how documents get indexed, how a question gets answered, and why RAG stops LLMs from making things up.';
const SLUG = 'how-rag-works';
const PUBLISHED = '2026-10-07';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how RAG works',
    'what is RAG',
    'Retrieval-Augmented Generation explained',
    'RAG for beginners',
    'RAG pipeline',
    'vector database embeddings',
    'RAG vs fine-tuning',
    'LLM retrieval tutorial',
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

export default function RagPage() {
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
      <RagContent />
    </>
  );
}
