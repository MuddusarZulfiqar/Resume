import type { Metadata } from 'next';
import WebSocketsContent from '@/components/blog/posts/WebSocketsContent';
import { blogPostingJsonLd, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How WebSockets Work — Real-Time Connections Explained for Beginners';
const DESCRIPTION =
  'How do WebSockets actually work? A beginner-friendly, animated walkthrough of the HTTP-to-WebSocket handshake, bidirectional push messaging, heartbeats, and when to reach for WebSockets vs. Server-Sent Events.';
const SLUG = 'how-websockets-work';
const PUBLISHED = '2026-10-11';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how websockets work',
    'what is a websocket',
    'websocket handshake explained',
    'websocket vs server sent events',
    'websocket vs polling',
    'real-time web apps explained',
    'websocket for beginners',
    'socket.io explained',
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

export default function WebSocketsPage() {
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
      <WebSocketsContent />
    </>
  );
}
